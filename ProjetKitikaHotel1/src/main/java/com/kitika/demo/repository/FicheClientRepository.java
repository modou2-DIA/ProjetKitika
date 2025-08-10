package com.kitika.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kitika.demo.model.FicheClient;
import com.kitika.demo.model.Reservation;

public interface FicheClientRepository extends JpaRepository<FicheClient, Integer> {
    

    FicheClient findByReservation(Reservation reservation);
    Optional<FicheClient> findByReservationId(int reservationId);
 
}
