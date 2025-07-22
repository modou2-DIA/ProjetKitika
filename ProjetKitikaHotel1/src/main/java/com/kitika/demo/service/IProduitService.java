package com.kitika.demo.service;

import java.util.List;

import com.kitika.demo.model.Produit;

public interface IProduitService { 
	public List<Produit> getAllProduits();
	public Produit getProduitById(int id);
	 public Produit saveProduit(Produit produit);
	 public void deleteProduit(int id);
	 public List<Produit> getProduitsSeuilCritique();

}
