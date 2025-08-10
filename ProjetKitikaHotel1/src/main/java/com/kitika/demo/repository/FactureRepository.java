package com.kitika.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kitika.demo.model.Facture;

import java.util.List;

public interface FactureRepository extends JpaRepository<Facture, Integer> {
    List<Facture> findByClientId(int clientId);
    List<Facture> findByPayee(boolean payee);
    List<Facture> findByReservationId(int reservationId);
}
