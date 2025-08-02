package com.kitika.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kitika.demo.model.Chambre;

import java.util.List;

public interface ChambreRepository extends JpaRepository<Chambre, Integer> {

    // Récupérer les chambres disponibles
    List<Chambre> findByStatut(String statut); 
    List<Chambre> findByStatutAndHorsServiceFalse(String statut);
}
