package com.airline.airline_management.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/passenger")
public class PassengerController {

    @GetMapping("/test")
    public String passengerTest() {
        return "Passenger access successful";
    }
}