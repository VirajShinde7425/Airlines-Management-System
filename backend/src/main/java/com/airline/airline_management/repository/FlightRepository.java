package com.airline.airline_management.repository;

import com.airline.airline_management.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FlightRepository extends JpaRepository<Flight, Long> {

    Optional<Flight> findByFlightNumber(String flightNumber);

    boolean existsByFlightNumber(String flightNumber);

    List<Flight> findBySourceIgnoreCaseAndDestinationIgnoreCase(
            String source,
            String destination
    );
}