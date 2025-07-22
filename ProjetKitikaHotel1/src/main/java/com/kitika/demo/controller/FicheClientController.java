package com.kitika.demo.controller;

import com.kitika.demo.model.FicheClient;
import com.kitika.demo.service.IFicheClientService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fiches-client")
public class FicheClientController {

    @Autowired
    private IFicheClientService ficheClientService;

    @GetMapping
    public List<FicheClient> getAllFiches() {
        return ficheClientService.getAllFiches();
    }

    @GetMapping("/{id}")
    public FicheClient getFicheById(@PathVariable int id) {
        return ficheClientService.getFicheById(id);
    }

    @GetMapping("/client/{clientId}")
    public FicheClient getFicheByClient(@PathVariable int clientId) {
        return ficheClientService.getFicheByClientId(clientId);
    }

    @PostMapping
    public FicheClient createFiche(@RequestBody FicheClient ficheClient) {
        return ficheClientService.saveFiche(ficheClient);
    }

    @PutMapping("/{id}")
    public FicheClient updateFiche(@PathVariable int id, @RequestBody FicheClient ficheClient) {
        ficheClient.setId(id);
        return ficheClientService.saveFiche(ficheClient);
    }

    @DeleteMapping("/{id}")
    public void deleteFiche(@PathVariable int id) {
        ficheClientService.deleteFiche(id);
    }
}
