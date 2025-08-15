package com.kitika.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kitika.demo.service.IArticleService;
import com.kitika.demo.model.Article;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {
    @Autowired
    private IArticleService articleService;

    @GetMapping
    List<Article> getAllArticles() {
        return articleService.getAllArticles();
    }

    @GetMapping("/{id}")
    Article getArticleById(@PathVariable("id") int id) {
        return articleService.getArticleById(id);
    }

    @PostMapping
    Article createArticle(@RequestBody Article article) {
        return articleService.saveArticle(article);
    }

    @PutMapping("/{id}")
    Article updateArticle(@PathVariable("id") int id, Article article) {
        article.setId(id);
        return articleService.saveArticle(article);
    }

    @DeleteMapping("/{id}")
    void deleteArticle(@PathVariable("id") int id) {
        articleService.deleteArticle(id);
    }

    
    
}