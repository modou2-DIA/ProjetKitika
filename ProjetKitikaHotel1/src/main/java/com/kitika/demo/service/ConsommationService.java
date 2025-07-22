package com.kitika.demo.service;

import com.kitika.demo.model.Consommation;
import com.kitika.demo.repository.ConsommationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ConsommationService implements IConsommationService{

    @Autowired
    private ConsommationRepository consommationRepository;

    public List<Consommation> getAllConsommations() {
        return consommationRepository.findAll();
    }

    public Consommation getConsommationById(int id) {
        return consommationRepository.findById(id).orElse(null);
    }

    public Consommation saveConsommation(Consommation consommation) {
        return consommationRepository.save(consommation);
    }

    public void deleteConsommation(int id) {
        consommationRepository.deleteById(id);
    }

    public List<Consommation> getByClient(int clientId) {
        return consommationRepository.findByClientId(clientId);
    }

   /* public List<Consommation> getByChambre(int chambreId) {
        return consommationRepository.findByChambreId(chambreId);
    }*/

    public List<Consommation> getByDateRange(LocalDate start, LocalDate end) {
        return consommationRepository.findByDateBetween(start, end);
    }
}
