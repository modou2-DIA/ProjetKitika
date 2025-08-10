package com.kitika.demo.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kitika.demo.dto.ConsommationRequestDTO;
import com.kitika.demo.model.Consommation;
import com.kitika.demo.model.FicheClient;
import com.kitika.demo.model.Produit;
import com.kitika.demo.repository.ConsommationRepository;
import com.kitika.demo.repository.FicheClientRepository;
import com.kitika.demo.repository.ProduitRepository;

@Service
public class ConsommationService implements IConsommationService{

    @Autowired
    private ConsommationRepository consommationRepository;
    @Autowired
    private FicheClientRepository ficheClientRepository;
    @Autowired
    private ProduitRepository produitRepository;

    @Override
    public List<Consommation> getAllConsommations() {
        return consommationRepository.findAll();
    }

    @Override
    public Consommation getConsommationById(int id) {
        return consommationRepository.findById(id).orElse(null);
    }

    @Override
    public Consommation saveConsommation(Consommation consommation) {
        return consommationRepository.save(consommation);
    }

    @Override
    public void deleteConsommation(int id) {
        consommationRepository.deleteById(id);
    }

    @Override
    public List<Consommation> getByClient(int clientId) {
        return consommationRepository.findByClientId(clientId);
    }

   /* public List<Consommation> getByChambre(int chambreId) {
        return consommationRepository.findByChambreId(chambreId);
    }*/

    @Override
    public List<Consommation> getByDateRange(LocalDate start, LocalDate end) {
        return consommationRepository.findByDateBetween(start, end);
    }
   
@Override
public Consommation ajouter( ConsommationRequestDTO dto) {
    FicheClient fiche = ficheClientRepository.findById(dto.getFicheId())
        .orElseThrow(() -> new RuntimeException("Fiche client introuvable"));

    Produit produit = produitRepository.findById(dto.getProduitId())
        .orElseThrow(() -> new RuntimeException("Produit introuvable"));

    Consommation consommation = new Consommation();
    consommation.setType(dto.getType());
    consommation.setDescription(dto.getDescription());
    consommation.setMontant(dto.getMontant());
    consommation.setDate(LocalDate.now());
    consommation.setClient(fiche);
    consommation.setProduit(produit);

    return consommationRepository.save(consommation);
}

}
