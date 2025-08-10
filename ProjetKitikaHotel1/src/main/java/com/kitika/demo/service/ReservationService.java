package com.kitika.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kitika.demo.dto.ReservationAvecClientDTO;
import com.kitika.demo.model.Chambre;
import com.kitika.demo.model.Reservation;
import com.kitika.demo.repository.ChambreRepository;
import com.kitika.demo.repository.ReservationRepository;
import com.kitika.demo.repository.ClientRepository; 
import com.kitika.demo.model.Client;
@Service
public class ReservationService implements IReservationService {

    @Autowired
    private ReservationRepository reservationRepository; 

    @Autowired
    private ChambreRepository chambreRepository; 

    @Autowired
    private ClientRepository clientRepository;

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
    
    @Transactional
    @Override
    public Reservation creerReservationAvecClient(ReservationAvecClientDTO dto) {
    // 1. Vérifie si la chambre existe et est libre
    Chambre chambre = chambreRepository.findById(dto.getChambreId())
        .orElseThrow(() -> new RuntimeException("Chambre introuvable"));

    if (!"Libre".equalsIgnoreCase(chambre.getStatut())) {
        throw new RuntimeException("Chambre non disponible");
    }

    // 2. Création du client
    Client client = new Client();
    client.setNom(dto.getNom());
    client.setPrenom(dto.getPrenom());
    client.setTelephone(dto.getTelephone());
    client.setEmail(dto.getEmail());
    client.setNationalite(dto.getNationalite());
    client.setNumeroPieceIdentite(dto.getNumeroPieceIdentite());
    client = clientRepository.save(client);

    // 3. Création de la réservation
    Reservation reservation = new Reservation();
    reservation.setChambre(chambre);
    reservation.setClient(client);
    reservation.setDateDebut(dto.getDateDebut());
    reservation.setDateFin(dto.getDateFin());
    reservation.setStatut("Réservée");

    // 4. Marque la chambre comme occupée
    chambre.setStatut("Occupée");
    chambreRepository.save(chambre);

    return reservationRepository.save(reservation);
}

    @Override
    public List<Reservation> searchGuestList(String nom,  String prenom, String entite) {
        return reservationRepository.searchReservationsWithClient(nom, prenom, entite);
    }

}
