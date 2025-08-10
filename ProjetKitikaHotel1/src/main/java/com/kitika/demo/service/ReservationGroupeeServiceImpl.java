package com.kitika.demo.service;

import java.util.List;

import com.kitika.demo.model.ReservationGroupee;
import com.kitika.demo.model.Reservation;
import com.kitika.demo.model.Client; // Import du client
import com.kitika.demo.repository.ReservationGroupeeRepository;
import com.kitika.demo.repository.ReservationRepository;
import com.kitika.demo.repository.ClientRepository; // Import du repository Client

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ReservationGroupeeServiceImpl implements ReservationGroupeeService {

    @Autowired
    private ReservationGroupeeRepository reservationGroupeeRepository;
    
    @Autowired
    private ReservationRepository reservationRepository;
    
    @Autowired
    private ClientRepository clientRepository; // Injection du repository Client
    
    @Override
    public List<ReservationGroupee> getAll() {
        return reservationGroupeeRepository.findAll();
    }

    @Override
    public ReservationGroupee getById(int id) {
        return reservationGroupeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReservationGroupee non trouvée avec ID : " + id));
    }

    @Transactional
    @Override
    public ReservationGroupee create(ReservationGroupee reservationGroupee) {
        // Logique de validation
        if (reservationGroupee.getNomGroupe() == null || reservationGroupee.getNomGroupe().isEmpty()) {
            throw new IllegalArgumentException("Le nom du groupe est obligatoire.");
        }
        
        // 1. Gérer l'entité société (client)
        Client societe = reservationGroupee.getSociete();
        if (societe != null) {
            // Vérifier si la société existe déjà (ID > 0)
            if (societe.getId() != 0) {
                // Si l'ID existe, on charge l'entité existante pour éviter un TransientObjectException
                Client societeExistante = clientRepository.findById(societe.getId()) // Nouvelle variable locale
                                         .orElseThrow(() -> new IllegalArgumentException("Société non trouvée avec l'ID: " + societe.getId()));
                reservationGroupee.setSociete(societeExistante);
            } else {
                // Si c'est une nouvelle société, on la sauvegarde d'abord
                Client nouvelleSociete = clientRepository.save(societe); // Nouvelle variable locale
                reservationGroupee.setSociete(nouvelleSociete);
            }
        }

        // 2. Assurer que les réservations sont persistantes (ou nulles au début)
        // La liste est vide à la création et sera peuplée plus tard
        if (reservationGroupee.getReservations() != null && !reservationGroupee.getReservations().isEmpty()) {
            throw new IllegalStateException("La liste de réservations doit être vide lors de la création d'un groupe.");
        }

        // 3. Sauvegarder la réservation groupée
        return reservationGroupeeRepository.save(reservationGroupee);
    }
    
    @Transactional
    @Override
    public ReservationGroupee addReservationToGroup(int reservationGroupeeId, int reservationId) {
        // Recherche de la réservation groupée
        Optional<ReservationGroupee> optionalGroupee = reservationGroupeeRepository.findById(reservationGroupeeId);
        if (optionalGroupee.isEmpty()) {
            throw new IllegalArgumentException("Reservation groupée non trouvée avec l'ID: " + reservationGroupeeId);
        }
        ReservationGroupee groupee = optionalGroupee.get();

        // Recherche de la réservation individuelle
        Optional<Reservation> optionalReservation = reservationRepository.findById(reservationId);
        if (optionalReservation.isEmpty()) {
            throw new IllegalArgumentException("Reservation non trouvée avec l'ID: " + reservationId);
        }
        Reservation reservation = optionalReservation.get();

        // Ajout de la réservation au groupe
        groupee.getReservations().add(reservation);

        // Sauvegarde de l'entité mise à jour
        return reservationGroupeeRepository.save(groupee);
    }
}





























    