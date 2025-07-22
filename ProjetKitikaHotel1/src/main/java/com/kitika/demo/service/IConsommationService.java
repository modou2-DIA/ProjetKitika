package com.kitika.demo.service;

import java.time.LocalDate;
import java.util.List;

import com.kitika.demo.model.Consommation;

public interface IConsommationService { 
	public List<Consommation> getAllConsommations();
	public Consommation getConsommationById(int id);
	public Consommation saveConsommation(Consommation consommation);
	 public void deleteConsommation(int id);
	 public List<Consommation> getByClient(int clientId);
	 //public List<Consommation> getByChambre(int chambreId);
	 public List<Consommation> getByDateRange(LocalDate start, LocalDate end);

}
