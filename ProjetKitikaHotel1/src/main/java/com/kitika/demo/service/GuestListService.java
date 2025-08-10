package com.kitika.demo.service;

import com.kitika.demo.dto.GuestListResponse;

import java.time.LocalDate;

public interface GuestListService {
    GuestListResponse getGuestList(LocalDate date);
}
