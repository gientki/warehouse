import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');
  if (!token) {
    navigate('/');
    return null; // lub spinner, albo lepsza obsługa
  }

  // Helper do sprawdzania 401
  const handleUnauthorized = () => {
    localStorage.removeItem('authToken');
    alert('Twoja sesja wygasła. Zaloguj się ponownie.');
    navigate('/');
  };

  useEffect(() => {
    fetch('http://localhost:8000/api/products', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.status === 401) {
          handleUnauthorized();
          throw new Error('Unauthorized');
        }
        if (!res.ok) throw new Error('Błąd pobierania danych');
        return res.json();
      })
      .then(setProducts)
      .catch((err) => {
        if (err.message !== 'Unauthorized') {
          alert('Nie udało się pobrać produktów.');
        }
      });
  }, [token]);

  const handleAddProduct = async () => {
    const name = prompt('Nazwa produktu:');
    if (!name || name.trim() === '') return alert('Nieprawidłowa nazwa.');

    try {
      const res = await fetch('http://localhost:8000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        alert('Nie udało się dodać produktu.');
        return;
      }

      const newProduct = await res.json();
      setProducts(p => [...p, newProduct]);
    } catch (err) {
      alert('Błąd podczas dodawania produktu.');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        alert('Nie udało się usunąć produktu.');
        return;
      }

      setProducts(p => p.filter(prod => prod.id !== id));
    } catch {
      alert('Błąd podczas usuwania produktu.');
    }
  };

  const handleAddStock = async (productId) => {
    const quantityStr = prompt('Ilość sztuk do dodania (może być ujemna):');
    const quantity = parseInt(quantityStr, 10);
    if (isNaN(quantity)) return alert('Nieprawidłowa ilość.');

    try {
      const res = await fetch(`http://localhost:8000/api/products/${productId}/stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        alert('Nie udało się dodać stanu magazynowego.');
        return;
      }

      // Odśwież listę produktów
      const updatedProductsRes = await fetch('http://localhost:8000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (updatedProductsRes.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!updatedProductsRes.ok) {
        alert('Nie udało się odświeżyć listy produktów.');
        return;
      }

      const updatedProducts = await updatedProductsRes.json();
      setProducts(updatedProducts);
    } catch {
      alert('Błąd podczas dodawania stanu magazynowego.');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lista produktów</h1>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        onClick={handleAddProduct}
      >
        ➕ Dodaj produkt
      </button>

      {products.length === 0 ? (
        <p className="text-gray-600">Brak produktów.</p>
      ) : (
        <ul className="space-y-2">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex justify-between items-center bg-white border p-4 rounded shadow"
            >
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-gray-600">Stan: {p.stock}</p>
              </div>
              <div className="space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => handleAddStock(p.id)}
                >
                  ➕ Dodaj stan
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDeleteProduct(p.id)}
                >
                  🗑 Usuń
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
