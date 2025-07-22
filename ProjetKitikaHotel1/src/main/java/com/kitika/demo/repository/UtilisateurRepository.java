package com.kitika.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kitika.demo.model.Utilisateur;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {}
