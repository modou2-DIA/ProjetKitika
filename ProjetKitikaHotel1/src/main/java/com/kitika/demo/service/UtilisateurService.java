package com.kitika.demo.service;


import com.kitika.demo.model.Utilisateur;
import com.kitika.demo.repository.UtilisateurRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UtilisateurService implements IUtilisateurService{
    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public List<Utilisateur> findAll() {
        return utilisateurRepository.findAll();
    }

    public Utilisateur save(Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }

    public void deleteById(int id) {
        utilisateurRepository.deleteById(id);
    }

    public Utilisateur findById(int id) {
        return utilisateurRepository.findById(id).orElse(null);
    }
}