package com.kitika.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConsommationRequestDTO {
    private String type;
    private String description;
    private float montant;
    private int ficheId;
    private int produitId;
}
