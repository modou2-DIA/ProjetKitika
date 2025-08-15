package com.kitika.demo.service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.kitika.demo.model.Article;
import com.kitika.demo.repository.ArticleRepository;
import java.util.List;




@Service
public class ArticleService implements IArticleService{

    @Autowired
    private ArticleRepository articleRepository;

    @Override
    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }
    
    @Override
    public Article getArticleById(int id) {
        return articleRepository.findById(id).orElse(null);
    }
    @Override
    public Article saveArticle(Article article) {
        return articleRepository.save(article);
    }
    
    @Override
    public void deleteArticle(int id) {
        articleRepository.deleteById(id);
    }
   
   
}
