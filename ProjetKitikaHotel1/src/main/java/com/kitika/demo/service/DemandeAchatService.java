package com.kitika.demo.service;

import com.kitika.demo.model.DemandeAchat;
import com.kitika.demo.repository.DemandeAchatRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DemandeAchatService implements IDemandeAchatService{

    @Autowired
    private DemandeAchatRepository demandeAchatRepository;

    public List<DemandeAchat> getAllDemandes() {
        return demandeAchatRepository.findAll();
    }

    public DemandeAchat getDemandeById(int id) {
        return demandeAchatRepository.findById(id).orElse(null);
    }

    public DemandeAchat saveDemande(DemandeAchat demandeAchat) {
        return demandeAchatRepository.save(demandeAchat);
    }

    public void deleteDemande(int id) {
        demandeAchatRepository.deleteById(id);
    }

    public List<DemandeAchat> getDemandesByStatut(String statut) {
        return demandeAchatRepository.findByStatut(statut);
    }

    public List<DemandeAchat> getDemandesByDemandeur(int userId) {
        return demandeAchatRepository.findByDemandeurId(userId);
    }
}
