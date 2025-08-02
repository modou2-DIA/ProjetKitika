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

    public List<Chambre> getAllChambres() {
        return chambreRepository.findAll();
    }

    public Chambre getChambreById(int id) {
        return chambreRepository.findById(id).orElse(null);
    }

    public Chambre saveChambre(Chambre chambre) {
        return chambreRepository.save(chambre);
    }

    public void deleteChambre(int id) {
        chambreRepository.deleteById(id);
    }

    // Récupérer les chambres libres
    public List<Chambre> getChambresDisponibles() {
        return chambreRepository.findByStatut("libre");
    }

    // Vérifier si une chambre est libre
    public boolean estChambreDisponible(int id) {
        Chambre chambre = getChambreById(id);
        return chambre != null && "libre".equalsIgnoreCase(chambre.getStatut());
    } 
    public List<Chambre> getChambresLibres() {
        return chambreRepository.findByStatutAndHorsServiceFalse("Libre");
    }

    // Mettre à jour le statut
    public void changerStatut(int id, String nouveauStatut) {
        Chambre chambre = getChambreById(id);
        if (chambre != null) {
            chambre.setStatut(nouveauStatut);
            chambreRepository.save(chambre);
        }
    }
}
