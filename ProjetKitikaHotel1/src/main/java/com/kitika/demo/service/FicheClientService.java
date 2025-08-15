package com.kitika.demo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kitika.demo.model.Chambre;
import com.kitika.demo.model.FicheClient;
import com.kitika.demo.model.Reservation;
import com.kitika.demo.repository.ChambreRepository;
import com.kitika.demo.repository.FicheClientRepository;
import com.kitika.demo.repository.ReservationRepository;

@Service
public class FicheClientService implements IFicheClientService{

    @Autowired
    private FicheClientRepository ficheClientRepository;
    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ChambreRepository chambreRepository;

    @Override
    public List<FicheClient> getAllFiches() {
        return ficheClientRepository.findAll();
    }

    @Override
    public FicheClient getFicheById(int id) {
        return ficheClientRepository.findById(id).orElse(null);
    }
  
    @Override
    public FicheClient saveFiche(FicheClient ficheClient) {
        return ficheClientRepository.save(ficheClient);
    }

    @Override
    public FicheClient getFicheByReservationId(int reservationId) {
        return ficheClientRepository.findByReservationId(reservationId).orElse(null);
    }

    @Override
    public void deleteFiche(int id) {
        ficheClientRepository.deleteById(id);
    }
    @Override
    public void creerDepuisReservation(int reservationId) {
    Optional<FicheClient> existante = ficheClientRepository.findByReservationId(reservationId);
    if (existante.isPresent()) {
        throw new RuntimeException("Une fiche client existe déjà pour cette réservation !");
    }
    Reservation reservation = reservationRepository.findById(reservationId)
        .orElseThrow(() -> new RuntimeException("Réservation introuvable"));

        reservation.setStatut("Checked-in");
        reservationRepository.save(reservation);
    // Créer une fiche client liée à la réservation
    FicheClient fiche = new FicheClient();
    fiche.setReservation(reservation);
    fiche.setCheckin(LocalDate.now());
    fiche.setStatut("En cours");
    fiche.setNote("");
    
    ficheClientRepository.save(fiche);

    // Mettre la chambre en "Occupée"
    Chambre chambre = reservation.getChambre();
    chambre.setStatut("Occupée");
    chambreRepository.save(chambre);
}
@Override
public void effectuerCheckout(int reservationId) {
    Reservation reservation = reservationRepository.findById(reservationId)
        .orElseThrow(() -> new RuntimeException("Réservation introuvable"));

    FicheClient fiche = ficheClientRepository.findByReservationId(reservationId)
       .orElseThrow(() -> new RuntimeException("Aucune fiche client trouvée pour cette réservation"));


    if (fiche == null) {
        throw new RuntimeException("Aucune fiche client trouvée pour cette réservation");
    }         

    fiche.setCheckout(LocalDate.now());
    fiche.setStatut("Terminé");
    ficheClientRepository.save(fiche);

    reservation.setStatut("Check-out");
    reservation.getChambre().setStatut("libre");

    reservationRepository.save(reservation);
    chambreRepository.save(reservation.getChambre());
}


}
