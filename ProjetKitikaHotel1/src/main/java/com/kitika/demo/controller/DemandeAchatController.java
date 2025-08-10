package com.kitika.demo.controller;

import com.kitika.demo.model.DemandeAchat;
import com.kitika.demo.service.IDemandeAchatService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/demandes")
public class DemandeAchatController {

    @Autowired
    private IDemandeAchatService demandeAchatService;

    @GetMapping
    public List<DemandeAchat> getAllDemandes() {
        return demandeAchatService.getAllDemandes();
    }

    @GetMapping("/{id}")
    public DemandeAchat getDemandeById(@PathVariable("id") int id) {
        return demandeAchatService.getDemandeById(id);
    }

    @PostMapping
    public DemandeAchat createDemande(@RequestBody DemandeAchat demande) {
        return demandeAchatService.saveDemande(demande);
    }

    @PutMapping("/{id}")
    public DemandeAchat updateDemande(@PathVariable("id") int id, @RequestBody DemandeAchat demande) {
        demande.setId(id);
        return demandeAchatService.saveDemande(demande);
    }

    @DeleteMapping("/{id}")
    public void deleteDemande(@PathVariable("id") int id) {
        demandeAchatService.deleteDemande(id);
    }

    @GetMapping("/statut/{statut}")
    public List<DemandeAchat> getDemandesByStatut(@PathVariable String statut) {
        return demandeAchatService.getDemandesByStatut(statut);
    }

    @GetMapping("/demandeur/{userId}")
    public List<DemandeAchat> getDemandesByUser(@PathVariable int userId) {
        return demandeAchatService.getDemandesByDemandeur(userId);
    }
}
