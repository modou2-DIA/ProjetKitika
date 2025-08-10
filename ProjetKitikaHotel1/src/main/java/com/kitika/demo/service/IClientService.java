package com.kitika.demo.service;

import java.util.List;

import com.kitika.demo.model.Client;

public interface IClientService { 
	public List<Client> getAllClients();
	public Client getClientById(int id);
	public Client saveClient(Client client);
	public void deleteClient(int id);
	public List<Client> getSocietes();
	public List<Client> searchClients(String nom, String prenom, String entite);

}
