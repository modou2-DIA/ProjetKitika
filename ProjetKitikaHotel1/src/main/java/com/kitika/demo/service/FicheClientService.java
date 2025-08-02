package com.kitika.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kitika.demo.model.FicheClient;
import com.kitika.demo.repository.FicheClientRepository;

@Service
public class FicheClientService implements IFicheClientService{

    @Autowired
    private FicheClientRepository ficheClientRepository;

    @Override
    public List<FicheClient> getAllFiches() {
        return ficheClientRepository.findAll();
    }

    @Override
    public FicheClient getFicheById(int id) {
        return ficheClientRepository.findById(id).orElse(null);
    }
    @Override
    public FicheClient getFicheByClientId(int clientId) {
        return ficheClientRepository.findByClientId(clientId);
    }
    @Override
    public FicheClient saveFiche(FicheClient ficheClient) {
        return ficheClientRepository.save(ficheClient);
    }

    @Override
    public void deleteFiche(int id) {
        ficheClientRepository.deleteById(id);
    }
}
