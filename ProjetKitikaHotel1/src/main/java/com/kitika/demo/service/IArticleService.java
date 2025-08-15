package com.kitika.demo.service;
import java.util.List;

import com.kitika.demo.model.Article;


public interface IArticleService {
    List<Article> getAllArticles();
    Article getArticleById(int id);
    Article saveArticle(Article article);
    void deleteArticle(int id);
    
    
}