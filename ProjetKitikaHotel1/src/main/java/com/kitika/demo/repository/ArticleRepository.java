package com.kitika.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kitika.demo.model.Article;

public interface ArticleRepository extends JpaRepository<Article, Integer> {

    
     
}
