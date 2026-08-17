package com.airline.airline_management.service;

import com.airline.airline_management.entity.Flight;
import com.airline.airline_management.repository.FlightRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightService {

    private final FlightRepository flightRepository;

    public FlightService(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    public Flight createFlight(Flight flight) {

        if (flightRepository.existsByFlightNumber(flight.getFlightNumber())) {
            throw new RuntimeException("Flight number already exists");
        }

        flight.setAvailableSeats(flight.getTotalSeats());

        return flightRepository.save(flight);
    }

    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    public Flight getFlightById(Long id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found"));
    }

    public Flight updateFlight(Long id, Flight updatedFlight) {

        Flight existingFlight = getFlightById(id);

        existingFlight.setFlightNumber(updatedFlight.getFlightNumber());
        existingFlight.setAirline(updatedFlight.getAirline());
        existingFlight.setSource(updatedFlight.getSource());
        existingFlight.setDestination(updatedFlight.getDestination());
        existingFlight.setDepartureTime(updatedFlight.getDepartureTime());
        existingFlight.setArrivalTime(updatedFlight.getArrivalTime());
        existingFlight.setTotalSeats(updatedFlight.getTotalSeats());
        existingFlight.setPrice(updatedFlight.getPrice());

        return flightRepository.save(existingFlight);
    }

    public void deleteFlight(Long id) {
        Flight flight = getFlightById(id);
        flightRepository.delete(flight);
    }

    public List<Flight> searchFlights(String source, String destination) {
        return flightRepository
                .findBySourceIgnoreCaseAndDestinationIgnoreCase(source, destination);
    }
}