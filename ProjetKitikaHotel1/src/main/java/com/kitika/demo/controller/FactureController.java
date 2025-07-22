package com.kitika.demo.controller;

import com.kitika.demo.model.Facture;
import com.kitika.demo.service.IFactureService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/factures")
public class FactureController {

    @Autowired
    private IFactureService factureService;

    @GetMapping
    public List<Facture> getAllFactures() {
        return factureService.getAllFactures();
    }

    @GetMapping("/{id}")
    public Facture getFactureById(@PathVariable int id) {
        return factureService.getFactureById(id);
    }

    @PostMapping
    public Facture createFacture(@RequestBody Facture facture) {
        return factureService.saveFacture(facture);
    }

    @PutMapping("/{id}")
    public Facture updateFacture(@PathVariable int id, @RequestBody Facture facture) {
        facture.setId(id);
        return factureService.saveFacture(facture);
    }

    @DeleteMapping("/{id}")
    public void deleteFacture(@PathVariable int id) {
        factureService.deleteFacture(id);
    }

    @GetMapping("/client/{clientId}")
    public List<Facture> getFacturesByClient(@PathVariable int clientId) {
        return factureService.getFacturesByClient(clientId);
    }

    @GetMapping("/non-payees")
    public List<Facture> getFacturesNonPayees() {
        return factureService.getFacturesNonPayees();
    }

    @GetMapping("/payees")
    public List<Facture> getFacturesPayees() {
        return factureService.getFacturesPayees();
    }
}
