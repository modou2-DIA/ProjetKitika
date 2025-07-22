package com.kitika.demo.service;

import java.util.List;

import com.kitika.demo.model.Reservation;

public interface IReservationService { 
	public List<Reservation> getAllReservations();
	public Reservation getReservationById(int id);
	public Reservation saveReservation(Reservation reservation);
	public void deleteReservation(int id);

}
