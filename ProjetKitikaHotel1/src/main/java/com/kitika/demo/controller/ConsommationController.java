package com.kitika.demo.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kitika.demo.dto.ConsommationRequestDTO;
import com.kitika.demo.model.Consommation;
import com.kitika.demo.service.IConsommationService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/consommations")
public class ConsommationController {

    @Autowired
    private IConsommationService consommationService;

    @GetMapping
    public List<Consommation> getAllConsommations() {
        return consommationService.getAllConsommations();
    }

    @GetMapping("/{id}")
    public Consommation getConsommationById(@PathVariable("id") int id) {
        return consommationService.getConsommationById(id);
    }

    @PostMapping
    public Consommation createConsommation(@RequestBody Consommation consommation) {
        return consommationService.saveConsommation(consommation);
    }

    @PutMapping("/{id}")
    public Consommation updateConsommation(@PathVariable("id") int id, @RequestBody Consommation consommation) {
        consommation.setId(id);
        return consommationService.saveConsommation(consommation);
    }

    @DeleteMapping("/{id}")
    public void deleteConsommation(@PathVariable("id") int id) {
        consommationService.deleteConsommation(id);
    }

    @GetMapping("/fiche/{ficheId}")
    public List<Consommation> getByClient(@PathVariable("ficheId") int ficheId) {
        return consommationService.getByClient(ficheId);
    }

    /*@GetMapping("/chambre/{chambreId}")
    public List<Consommation> getByChambre(@PathVariable int chambreId) {
        return consommationService.getByChambre(chambreId);
    }*/

    @GetMapping("/periode")
    public List<Consommation> getByDates(@RequestParam String start, @RequestParam String end) {
        return consommationService.getByDateRange(LocalDate.parse(start), LocalDate.parse(end));
    }
    @PostMapping("/ajouter")
    public Consommation ajouter(@RequestBody ConsommationRequestDTO dto) {
        

        return consommationService.ajouter(dto);
    }

}
