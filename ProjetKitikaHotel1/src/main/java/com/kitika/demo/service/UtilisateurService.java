package com.kitika.demo.service;


import com.kitika.demo.model.Utilisateur;
import com.kitika.demo.repository.UtilisateurRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


@Service
public class UtilisateurService implements IUtilisateurService{
    @Autowired
    private UtilisateurRepository utilisateurRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


     @Override
    public List<Utilisateur> findAll() {
        return utilisateurRepository.findAll();
    }

    

    @Override
    public Utilisateur save(Utilisateur utilisateur) {
        // Hash mot de passe
        utilisateur.setMotDePasse(passwordEncoder.encode(utilisateur.getMotDePasse()));
        return utilisateurRepository.save(utilisateur);
    }

     @Override
    public void deleteById(int id) {
        utilisateurRepository.deleteById(id);
    }

     @Override
    public Utilisateur findById(int id) {
        return utilisateurRepository.findById(id).orElse(null);
    }
}