package com.kitika.demo.service;

import java.util.List;

import com.kitika.demo.model.DemandeAchat;

public interface IDemandeAchatService { 
	public List<DemandeAchat> getAllDemandes();
	public DemandeAchat getDemandeById(int id) ;
	public DemandeAchat saveDemande(DemandeAchat demandeAchat);
	public void deleteDemande(int id);
	 public List<DemandeAchat> getDemandesByStatut(String statut);
	 public List<DemandeAchat> getDemandesByDemandeur(int userId);

}
