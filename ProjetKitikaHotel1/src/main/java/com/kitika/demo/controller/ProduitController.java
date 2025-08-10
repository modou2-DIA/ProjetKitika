package com.kitika.demo.controller;

import com.kitika.demo.model.Produit;
import com.kitika.demo.service.IProduitService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/produits")
public class ProduitController {

    @Autowired
    private IProduitService produitService;

    @GetMapping
    public List<Produit> getAllProduits() {
        return produitService.getAllProduits();
    }

    @GetMapping("/{id}")
    public Produit getProduitById(@PathVariable("id") int id) {
        return produitService.getProduitById(id);
    }

    @PostMapping
    public Produit createProduit(@RequestBody Produit produit) {
        return produitService.saveProduit(produit);
    }

    @PutMapping("/{id}")
    public Produit updateProduit(@PathVariable("id") int id, @RequestBody Produit produit) {
        produit.setId(id);
        return produitService.saveProduit(produit);
    }

    @DeleteMapping("/{id}")
    public void deleteProduit(@PathVariable("id") int id) {
        produitService.deleteProduit(id);
    }

    @GetMapping("/seuil-critique")
    public List<Produit> produitsEnSeuilCritique() {
        return produitService.getProduitsSeuilCritique();
    }
}
