package com.kitika.demo.service;

import java.util.List;

import com.kitika.demo.model.Facture;

public interface IFactureService { 
	 public List<Facture> getAllFactures();
	 public Facture getFactureById(int id);
	 public Facture saveFacture(Facture facture);
	 public void deleteFacture(int id) ;
	 public List<Facture> getFacturesByClient(int clientId);
	 public List<Facture> getFacturesNonPayees();
	 public List<Facture> getFacturesPayees() ;
	 public Facture genererFacture(int ficheId);
	public Facture getFactureByReservationId(int id);







	 
}
