package com.kitika.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kitika.demo.model.Client;
import com.kitika.demo.repository.ClientRepository;

@Service
public class ClientService implements IClientService{

    @Autowired
    private ClientRepository clientRepository;

    @Override
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @Override
    public Client getClientById(int id) {
        return clientRepository.findById(id).orElse(null);
    }

    @Override
    public Client saveClient(Client client) {
        return clientRepository.save(client);
    }

    @Override
    public void deleteClient(int id) {
        clientRepository.deleteById(id);
    }
}
