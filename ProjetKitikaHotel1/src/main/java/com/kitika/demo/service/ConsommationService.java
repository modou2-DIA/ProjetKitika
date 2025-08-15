package com.kitika.demo.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kitika.demo.dto.ArticleRequestDTO;
import com.kitika.demo.dto.ConsommationRequestDTO;
import com.kitika.demo.model.Article;
import com.kitika.demo.model.Consommation;
import com.kitika.demo.model.FicheClient;
import com.kitika.demo.repository.ConsommationRepository;
import com.kitika.demo.repository.FicheClientRepository;

@Service
public class ConsommationService implements IConsommationService{

    @Autowired
    private ConsommationRepository consommationRepository;
    @Autowired
    private FicheClientRepository ficheClientRepository;

    @Override
    public List<Consommation> getAllConsommations() {
        return consommationRepository.findAll();
    }

    @Override
    public Consommation getConsommationById(int id) {
        return consommationRepository.findById(id).orElse(null);
    }

    @Override
    public Consommation saveConsommation(Consommation consommation) {
        return consommationRepository.save(consommation);
    }
    @Override
    public void deleteConsommation(int id) {
        consommationRepository.deleteById(id);
    }

    @Override
    public List<Consommation> getByClient(int clientId) {
        return consommationRepository.findByClientId(clientId);
    }

   /* public List<Consommation> getByChambre(int chambreId) {
        return consommationRepository.findByChambreId(chambreId);
    }*/

    @Override
    public List<Consommation> getByDateRange(LocalDate start, LocalDate end) {
        return consommationRepository.findByDateBetween(start, end);
    }
   
@Override
public Consommation ajouter(ConsommationRequestDTO dto) {
        // 1. Trouver le client
        FicheClient client = ficheClientRepository.findById(dto.getFicheId())
                .orElseThrow(() -> new RuntimeException("Fiche client introuvable"));

        // 2. Créer l'objet Consommation
        Consommation consommation = new Consommation();
        consommation.setType(dto.getType());
        consommation.setDescription(dto.getDescription());
        consommation.setDate(LocalDate.now());
        consommation.setClient(client);

        // Initialiser une liste pour les articles
        List<Article> articles = new ArrayList<>();
        float montantTotal = 0.0f;

        // 3. Traiter chaque article de la requête
        for (ArticleRequestDTO articleDto : dto.getArticles()) {
            Article article = new Article();
            article.setNom(articleDto.getNom());
            article.setQuantite(articleDto.getQuantite());
            article.setPrixUnitaire(articleDto.getPrixUnitaire());
            
            // Calculer le prix total de l'article
            float prixTotalArticle = articleDto.getQuantite() * articleDto.getPrixUnitaire();
             // Lier l'article à la consommation
            
            article.setConsommation(consommation);

            articles.add(article);
            montantTotal += prixTotalArticle;
        }

        // 4. Mettre à jour le montant total de la consommation
        consommation.setMontantTotal(montantTotal);
        consommation.setArticles(articles);

        // 5. Sauvegarder la consommation, ce qui va sauvegarder les articles liés
        return consommationRepository.save(consommation);
    }


}
