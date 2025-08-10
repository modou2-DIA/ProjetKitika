package com.kitika.demo.service;

import java.util.List;

import com.kitika.demo.model.FicheClient;

public interface IFicheClientService { 
	 public List<FicheClient> getAllFiches();
	 public FicheClient getFicheById(int id);
	 
	 public FicheClient saveFiche(FicheClient ficheClient);
	 public void deleteFiche(int id) ;
	 public void creerDepuisReservation(int reservationId);
	 public void effectuerCheckout(int reservationId);
	 

}
