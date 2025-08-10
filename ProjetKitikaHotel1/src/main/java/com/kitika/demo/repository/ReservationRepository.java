package com.kitika.demo.repository;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import com.kitika.demo.model.Reservation;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    // Recherches personnalisées possibles ici
    List<Reservation> findByDateDebut(LocalDate date);
    List<Reservation> findByDateFin(LocalDate date);

    @Query("select r from Reservation r where r.dateDebut <= :date and r.dateFin >= :date")
    List<Reservation> findReservationsForDate(@Param("date") LocalDate date);

    @Query("select r from Reservation r where r.statut = :statut and r.dateDebut <= :date and r.dateFin >= :date")
    List<Reservation> findPresentReservations(@Param("statut") String statut, @Param("date") LocalDate date);

    @Query("SELECT r FROM Reservation r " +
           "JOIN r.client c " +
           "WHERE (:nom IS NULL OR LOWER(c.nom) LIKE LOWER(CONCAT('%', :nom, '%'))) " +
           "AND (:prenom IS NULL OR LOWER(c.prenom) LIKE LOWER(CONCAT('%', :prenom, '%'))) " +
           "AND (:entite IS NULL OR LOWER(c.type) LIKE LOWER(CONCAT('%', :entite, '%')))")
    List<Reservation> searchReservationsWithClient(
            @Param("nom") String nom,
            @Param("prenom") String prenom,
            @Param("entite") String entite);

}
