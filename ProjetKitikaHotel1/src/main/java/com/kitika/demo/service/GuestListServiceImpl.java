package com.kitika.demo.service;

import com.kitika.demo.dto.GuestListResponse;
import com.kitika.demo.dto.ReservationGuestDTO;
import com.kitika.demo.model.Reservation;
import com.kitika.demo.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GuestListServiceImpl implements GuestListService {

    @Autowired
    private ReservationRepository reservationRepository;

    private ReservationGuestDTO map(Reservation r){
        ReservationGuestDTO dto = new ReservationGuestDTO();
        dto.setReservationId(r.getId());
        if (r.getClient() != null) {
            dto.setClientId(r.getClient().getId());
            dto.setClientNom(r.getClient().getNom());
            dto.setClientPrenom(r.getClient().getPrenom());
            dto.setClientTelephone(r.getClient().getTelephone());
        }
        if (r.getChambre() != null) {
            dto.setChambreNumero(r.getChambre().getNumero());
            dto.setChambreType(r.getChambre().getType());
        }
        dto.setDateDebut(r.getDateDebut());
        dto.setDateFin(r.getDateFin());
        dto.setStatut(r.getStatut());
        return dto;
    }

    @Override
    public GuestListResponse getGuestList(LocalDate date) {
        if (date == null) date = LocalDate.now();

        // réservations prévues pour la date (toutes celles couvrant la date)
        List<Reservation> prevues = reservationRepository.findReservationsForDate(date);

        // arrivées = dateDebut == date
        List<Reservation> arrivees = reservationRepository.findByDateDebut(date);

        // départs = dateFin == date
        List<Reservation> departs = reservationRepository.findByDateFin(date);

        // présents = statut Checked-in et période couvrant la date Checked-in
        List<Reservation> presents = reservationRepository.findPresentReservations("Checked-in", date);

        GuestListResponse resp = new GuestListResponse();
        resp.setReservationsPrevues(prevues.stream().map(this::map).collect(Collectors.toList()));
        resp.setArrivees(arrivees.stream().map(this::map).collect(Collectors.toList()));
        resp.setDeparts(departs.stream().map(this::map).collect(Collectors.toList()));
        resp.setPresents(presents.stream().map(this::map).collect(Collectors.toList()));

        return resp;
    }
}
