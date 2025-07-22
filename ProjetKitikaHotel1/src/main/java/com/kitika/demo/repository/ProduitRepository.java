package com.kitika.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kitika.demo.model.Produit;

import java.util.List;

public interface ProduitRepository extends JpaRepository<Produit, Integer> {

    List<Produit> findByStockLessThanEqual(int seuil); // Produits en seuil critique
}
