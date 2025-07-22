package com.kitika.demo.service;

import com.kitika.demo.model.Facture;
import com.kitika.demo.repository.FactureRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FactureService implements IFactureService{

    @Autowired
    private FactureRepository factureRepository;

    public List<Facture> getAllFactures() {
        return factureRepository.findAll();
    }

    public Facture getFactureById(int id) {
        return factureRepository.findById(id).orElse(null);
    }

    public Facture saveFacture(Facture facture) {
        return factureRepository.save(facture);
    }

    public void deleteFacture(int id) {
        factureRepository.deleteById(id);
    }

    public List<Facture> getFacturesByClient(int clientId) {
        return factureRepository.findByClientId(clientId);
    }

    public List<Facture> getFacturesNonPayees() {
        return factureRepository.findByPayee(false);
    }

    public List<Facture> getFacturesPayees() {
        return factureRepository.findByPayee(true);
    }
}
