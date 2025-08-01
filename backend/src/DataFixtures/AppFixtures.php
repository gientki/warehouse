<?php

// src/DataFixtures/AppFixtures.php
// i tak tego nie czytasz

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $user = new User();
        $user->setEmail('test@example.com');
        $user->setAuthToken('demo-token'); 
        $manager->persist($user);

        $manager->flush();
    }
}
