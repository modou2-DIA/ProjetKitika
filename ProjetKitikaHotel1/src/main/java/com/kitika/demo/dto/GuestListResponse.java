package com.kitika.demo.dto;

import java.util.List;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GuestListResponse {
    private List<ReservationGuestDTO> reservationsPrevues;
    private List<ReservationGuestDTO> arrivees;
    private List<ReservationGuestDTO> presents;
    private List<ReservationGuestDTO> departs;

   

}
