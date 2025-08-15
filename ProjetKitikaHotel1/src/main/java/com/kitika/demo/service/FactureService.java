package com.kitika.demo.service;

import com.kitika.demo.model.Consommation;
import com.kitika.demo.model.Facture;
import com.kitika.demo.model.FicheClient;
import com.kitika.demo.repository.FactureRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import com.kitika.demo.repository.FicheClientRepository;
import com.kitika.demo.repository.ConsommationRepository;

@Service
public class FactureService implements IFactureService {

    @Autowired
    private FactureRepository factureRepository;
    @Autowired
    private FicheClientRepository ficheClientRepo;
    @Autowired
    private ConsommationRepository consommationRepo;

    @Override
    public List<Facture> getAllFactures() {
        return factureRepository.findAll();
    }

    @Override
    public Facture getFactureById(int id) {
        return factureRepository.findById(id).orElse(null);
    }

    @Override
    public Facture saveFacture(Facture facture) {
        return factureRepository.save(facture);
    }

    @Override
    public Facture getFactureByReservationId(int id) {
        return factureRepository.findByReservationId(id).stream().findFirst().orElse(null);
    }

    @Override
    public void deleteFacture(int id) {
        factureRepository.deleteById(id);
    }

    @Override
    public List<Facture> getFacturesByClient(int clientId) {
        return factureRepository.findByClientId(clientId);
    }

    @Override
    public List<Facture> getFacturesNonPayees() {
        return factureRepository.findByPayee(false);
    }

    @Override
    public List<Facture> getFacturesPayees() {
        return factureRepository.findByPayee(true);
    }
    
    /**
     * Génère une facture pour une fiche client donnée.
     * Le montant total est la somme des frais d'hébergement et des consommations.
     * @param ficheId L'identifiant de la fiche client.
     * @return La facture générée et sauvegardée.
     */
    @Override
    public Facture genererFacture(int ficheId) {
        FicheClient fiche = ficheClientRepo.findById(ficheId)
                .orElseThrow(() -> new RuntimeException("Fiche non trouvée"));

        // Récupérer toutes les consommations de la fiche client
        List<Consommation> consoList = consommationRepo.findByClient(fiche);

        // Calculer le total des consommations en sommant les montants totaux de chaque consommation
        float totalConso = (float) consoList.stream()
                                            .mapToDouble(Consommation::getMontantTotal)
                                            .sum();

        // Calculer le total du séjour (frais d'hébergement)DateDebut
        long nbNuits = ChronoUnit.DAYS.between(fiche.getReservation().getDateDebut() , fiche.getReservation().getDateFin());

        float prixNuitee = fiche.getReservation().getChambre().getPrixParNuit();
        float totalSejour = nbNuits * prixNuitee;

        // Créer la nouvelle facture
        Facture facture = new Facture();
        facture.setClient(fiche.getReservation().getClient());
        facture.setConsommations(consoList);
        facture.setDateEmission(LocalDate.now());
        facture.setMontantTotal(totalConso + totalSejour); // Somme des consommations et du séjour
        facture.setPayee(false);
        facture.setReservation(fiche.getReservation()); // Lier la facture à la réservation

        // Sauvegarder la facture dans la base de données
        return factureRepository.save(facture);
    }
}
