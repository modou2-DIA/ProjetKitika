package com.kitika.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kitika.demo.model.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    // Recherches personnalisées possibles ici
}
