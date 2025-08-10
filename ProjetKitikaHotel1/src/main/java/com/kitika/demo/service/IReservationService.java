package com.kitika.demo.service;

import java.util.List;

import com.kitika.demo.dto.ReservationAvecClientDTO;
import com.kitika.demo.model.Reservation;

public interface IReservationService { 
	public List<Reservation> getAllReservations();
	public Reservation getReservationById(int id);
	public Reservation saveReservation(Reservation reservation);
	public void deleteReservation(int id);
	public Reservation creerReservationAvecClient(ReservationAvecClientDTO dto);
	public List<Reservation> searchGuestList(String nom,  String prenom, String entite);

}
