package com.kitika.demo.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;


@Getter
@Setter
public class ConsommationRequestDTO {
      private int ficheId;
    private String type;
    private String description;
    private List<ArticleRequestDTO> articles;
}
