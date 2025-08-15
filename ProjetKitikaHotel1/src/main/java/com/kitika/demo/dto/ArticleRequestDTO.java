package com.kitika.demo.dto;

import lombok.Data;

@Data
public class ArticleRequestDTO {
    private String nom;
    private int quantite;
    private float prixUnitaire;
}
