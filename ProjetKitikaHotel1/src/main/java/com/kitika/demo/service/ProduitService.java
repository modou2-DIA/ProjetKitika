package com.kitika.demo.service;

import com.kitika.demo.model.Produit;
import com.kitika.demo.repository.ProduitRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProduitService implements IProduitService{

    @Autowired
    private ProduitRepository produitRepository;

    public List<Produit> getAllProduits() {
        return produitRepository.findAll();
    }

    public Produit getProduitById(int id) {
        return produitRepository.findById(id).orElse(null);
    }

    public Produit saveProduit(Produit produit) {
        return produitRepository.save(produit);
    }

    public void deleteProduit(int id) {
        produitRepository.deleteById(id);
    }

    public List<Produit> getProduitsSeuilCritique() {
        return produitRepository.findByStockLessThanEqual(10); // Valeur paramétrable
    }
}
