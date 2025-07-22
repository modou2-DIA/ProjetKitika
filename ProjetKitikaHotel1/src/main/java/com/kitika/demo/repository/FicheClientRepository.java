package com.kitika.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kitika.demo.model.FicheClient;

public interface FicheClientRepository extends JpaRepository<FicheClient, Integer> {
    FicheClient findByClientId(int clientId);
}
