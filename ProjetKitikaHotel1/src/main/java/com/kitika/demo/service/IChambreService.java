package com.kitika.demo.service;

import java.util.List;

import com.kitika.demo.model.Chambre;

public interface IChambreService { 
	public List<Chambre> getAllChambres();
	public Chambre getChambreById(int id);
	 public Chambre saveChambre(Chambre chambre);
	 public void deleteChambre(int id);
	 public List<Chambre> getChambresDisponibles();
	 public boolean estChambreDisponible(int id);
	 public void changerStatut(int id, String nouveauStatut);

}
