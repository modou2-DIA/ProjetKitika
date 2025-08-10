package com.kitika.demo.service;

import com.kitika.demo.model.Chambre;
import com.kitika.demo.repository.ChambreRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChambreService implements IChambreService {

    @Autowired
    private ChambreRepository chambreRepository;

    @Override
    public List<Chambre> getAllChambres() {
        return chambreRepository.findAll();
    }

    @Override
    public Chambre getChambreById(int id) {
        return chambreRepository.findById(id).orElse(null);
    }

    @Override
    public Chambre saveChambre(Chambre chambre) {
        return chambreRepository.save(chambre);
    }


    @Override
    public void deleteChambre(int id) {
        chambreRepository.deleteById(id);
    }

    @Override
    public List<Chambre> getChambresDisponibles() {
        return chambreRepository.findByStatut("libre");
    }

    @Override
    public boolean estChambreDisponible(int id) {
        Chambre chambre = getChambreById(id);
        return chambre != null && "libre".equalsIgnoreCase(chambre.getStatut());
    } 
    @Override
    public List<Chambre> getChambresLibres() {
        return chambreRepository.findByStatutAndHorsServiceFalse("Libre");
    }

    @Override
    // Mettre à jour le statut
    public void changerStatut(int id, String nouveauStatut) {
        Chambre chambre = getChambreById(id);
        if (chambre != null) {
            chambre.setStatut(nouveauStatut);
            chambreRepository.save(chambre);
        }
    }
}
