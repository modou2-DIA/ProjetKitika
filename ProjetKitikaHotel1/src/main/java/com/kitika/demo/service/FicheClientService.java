package com.kitika.demo.service;

import com.kitika.demo.model.FicheClient;
import com.kitika.demo.repository.FicheClientRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FicheClientService implements IFicheClientService{

    @Autowired
    private FicheClientRepository ficheClientRepository;

    public List<FicheClient> getAllFiches() {
        return ficheClientRepository.findAll();
    }

    public FicheClient getFicheById(int id) {
        return ficheClientRepository.findById(id).orElse(null);
    }

    public FicheClient getFicheByClientId(int clientId) {
        return ficheClientRepository.findByClientId(clientId);
    }

    public FicheClient saveFiche(FicheClient ficheClient) {
        return ficheClientRepository.save(ficheClient);
    }

    public void deleteFiche(int id) {
        ficheClientRepository.deleteById(id);
    }
}
