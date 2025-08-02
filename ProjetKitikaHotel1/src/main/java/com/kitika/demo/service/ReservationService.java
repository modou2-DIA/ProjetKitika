package com.kitika.demo.service;

import com.kitika.demo.model.Chambre;
import com.kitika.demo.model.Reservation;
import com.kitika.demo.repository.ReservationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.kitika.demo.repository.ChambreRepository;
import java.util.List;

@Service
public class ReservationService implements IReservationService {

    @Autowired
    private ReservationRepository reservationRepository; 

    @Autowired
    private ChambreRepository chambreRepository;

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public Reservation getReservationById(int id) {
        return reservationRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Reservation saveReservation(Reservation reservation) {
        Chambre chambre = reservation.getChambre();

        // Vérifie que la chambre est libre
        if (!"Libre".equalsIgnoreCase(chambre.getStatut())) {
            throw new IllegalStateException("La chambre n'est pas disponible pour la réservation.");
        }

        // Met à jour le statut
        chambre.setStatut("Reservée");
        chambreRepository.save(chambre); // sauvegarde de la chambre avec nouveau statut

        // Enregistre la réservation
        return reservationRepository.save(reservation);
    }
    @Override
    public void deleteReservation(int id) {
        reservationRepository.deleteById(id);
    }
}
