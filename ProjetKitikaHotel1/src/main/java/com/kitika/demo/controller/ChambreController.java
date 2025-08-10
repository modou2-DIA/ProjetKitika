package com.kitika.demo.controller;

import com.kitika.demo.model.Chambre;
import com.kitika.demo.service.IChambreService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/chambres")
public class ChambreController {

    @Autowired
    private IChambreService chambreService;

    @GetMapping
    public List<Chambre> getAllChambres() {
        return chambreService.getAllChambres();
    }

    @GetMapping("/{id}")
    public Chambre getChambreById(@PathVariable("id") int id) {
        return chambreService.getChambreById(id);
    }

    @PostMapping
    public Chambre createChambre(@RequestBody Chambre chambre) {
        chambre.setStatut("libre"); // Par défaut libre
        return chambreService.saveChambre(chambre);
    }

    @PutMapping("/{id}")
    public Chambre updateChambre(@PathVariable("id") int id, @RequestBody Chambre chambre) {
        chambre.setId(id);
        return chambreService.saveChambre(chambre);
    }

    @DeleteMapping("/{id}")
    public void deleteChambre(@PathVariable("id") int id) {
        chambreService.deleteChambre(id);
    }

    // Chambres disponibles
    @GetMapping("/disponibles")
    public List<Chambre> getChambresDisponibles() {
        return chambreService.getChambresDisponibles();
    }

    // Vérification si une chambre est libre
    @GetMapping("/{id}/est-disponible")
    public boolean isDisponible(@PathVariable int id) {
        return chambreService.estChambreDisponible(id);
    }

    // Modifier le statut d'une chambre (ex: libre ou réservée)
    @PutMapping("/{id}/statut")
    public void changerStatut(@PathVariable int id, @RequestParam String statut) {
        chambreService.changerStatut(id, statut);
    } 
    @GetMapping("/libres")
    public List<Chambre> getChambresLibres() {
        return chambreService.getChambresLibres();
    }
}
