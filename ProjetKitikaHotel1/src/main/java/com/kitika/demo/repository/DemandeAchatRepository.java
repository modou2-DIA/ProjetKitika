package com.kitika.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kitika.demo.model.DemandeAchat;

import java.util.List;

public interface DemandeAchatRepository extends JpaRepository<DemandeAchat, Integer> {
    List<DemandeAchat> findByStatut(String statut);
    List<DemandeAchat> findByDemandeurId(int userId);
}
