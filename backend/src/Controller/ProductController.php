<?php

namespace App\Controller;

use App\Entity\Product;
use App\Repository\StockMovementRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request; // <-- brakowało importu Request
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\StockMovement;

#[Route('/api/products')]
class ProductController extends AbstractController
{
    #[Route('', name: 'product_list', methods: ['GET'])]
    public function index(EntityManagerInterface $em, StockMovementRepository $stockRepo): JsonResponse
    {
        $products = $em->getRepository(Product::class)->findAll();

        $data = [];

        foreach ($products as $product) {
            $stockSum = $stockRepo->createQueryBuilder('s')
                ->select('SUM(s.quantity)')
                ->where('s.product = :product')
                ->setParameter('product', $product)
                ->getQuery()
                ->getSingleScalarResult();

            $data[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'stock' => (int) $stockSum,
            ];
        }

        return $this->json($data);
    }
    
    #[Route('', name: 'api_products_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!isset($data['name']) || empty($data['name'])) {
                return $this->json(['error' => 'Brak nazwy produktu.'], 400);
            }

            $product = new Product();
            $product->setName($data['name']);

            $em->persist($product);
            $em->flush();

            return $this->json([
                'id' => $product->getId(),
                'name' => $product->getName(),
                'createdAt' => $product->getCreatedAt()?->format('Y-m-d H:i:s'),
            ], 201);
        } catch (\Throwable $e) {
            return $this->json([
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => explode("\n", $e->getTraceAsString())
            ], 500);
        }
    }
    #[Route('/{id}', name: 'api_products_delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $em): JsonResponse
    {
        $product = $em->getRepository(Product::class)->find($id);

        if (!$product) {
            return $this->json(['error' => 'Produkt nie został znaleziony.'], 404);
        }

        $em->remove($product);
        $em->flush();

        return $this->json(['message' => 'Produkt został usunięty.']);
    }
    #[Route('/{id}/stock', name: 'api_products_add_stock', methods: ['POST'])]
    public function addStock(
        int $id,
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $product = $em->getRepository(Product::class)->find($id);

        if (!$product) {
            return $this->json(['error' => 'Produkt nie znaleziony'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['quantity']) || !is_numeric($data['quantity'])) {
            return $this->json(['error' => 'Nieprawidłowa ilość'], 400);
        }

        $stockMovement = new StockMovement();
        $stockMovement->setProduct($product);
        $stockMovement->setQuantity($data['quantity']);

        $em->persist($stockMovement);
        $em->flush();

        return $this->json([
            'id' => $stockMovement->getId(),
            'productId' => $product->getId(),
            'quantity' => $stockMovement->getQuantity(),
            'createdAt' => $stockMovement->getCreatedAt()->format('Y-m-d H:i:s'),
        ], 201);
    }

    #[Route('/{id}', name: 'api_product_show', methods: ['GET'])]
    public function show(
        int $id,
        EntityManagerInterface $em,
        StockMovementRepository $stockRepo
    ): JsonResponse {
        $product = $em->getRepository(Product::class)->find($id);

        if (!$product) {
            return $this->json(['error' => 'Produkt nie znaleziony'], 404);
        }

        $stockSum = $stockRepo->createQueryBuilder('s')
            ->select('SUM(s.quantity)')
            ->where('s.product = :product')
            ->setParameter('product', $product)
            ->getQuery()
            ->getSingleScalarResult();

        return $this->json([
            'id' => $product->getId(),
            'name' => $product->getName(),
            'createdAt' => $product->getCreatedAt()?->format('Y-m-d H:i:s'),
            'stock' => (int) $stockSum,
        ]);
    }
}
