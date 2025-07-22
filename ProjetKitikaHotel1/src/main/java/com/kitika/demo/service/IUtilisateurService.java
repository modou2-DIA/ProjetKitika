package com.kitika.demo.service;

import java.util.List;

import com.kitika.demo.model.Utilisateur;

public interface IUtilisateurService { 
	public List<Utilisateur> findAll();
	public Utilisateur save(Utilisateur utilisateur);
	public void deleteById(int id);
	public Utilisateur findById(int id) ;

}
