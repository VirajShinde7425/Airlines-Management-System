
package com.airline.airline_management.service;

import com.airline.airline_management.entity.Flight;
import com.airline.airline_management.repository.FlightRepository;
import com.airline.airline_management.repository.BookingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FlightService {

    private final FlightRepository flightRepository;
    private final BookingRepository bookingRepository;

    public FlightService(
            FlightRepository flightRepository,
            BookingRepository bookingRepository
    ) {
        this.flightRepository = flightRepository;
        this.bookingRepository = bookingRepository;
    }

    // ADMIN: Create a flight
    public Flight createFlight(Flight flight) {

        if (flightRepository.existsByFlightNumber(
                flight.getFlightNumber())) {
            throw new RuntimeException("Flight number already exists");
        }

        flight.setAvailableSeats(flight.getTotalSeats());

        return flightRepository.save(flight);
    }

    // ADMIN + PASSENGER: View all flights
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    // ADMIN + PASSENGER: View one flight
    public Flight getFlightById(Long id) {
        return flightRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Flight not found"));
    }

    // ADMIN: Update flight
    @Transactional
    public Flight updateFlight(Long id, Flight updatedFlight) {

        Flight existingFlight = flightRepository.findByIdForUpdate(id)
                .orElseThrow(() ->
                        new RuntimeException("Flight not found"));

        // Check duplicate flight number
        if (!existingFlight.getFlightNumber()
                .equalsIgnoreCase(updatedFlight.getFlightNumber())
                && flightRepository.existsByFlightNumber(
                        updatedFlight.getFlightNumber())) {
            throw new RuntimeException("Flight number already exists");
        }

        // Calculate seats already booked
        int bookedSeats = existingFlight.getTotalSeats()
                - existingFlight.getAvailableSeats();

        if (updatedFlight.getTotalSeats() == null
                || updatedFlight.getTotalSeats() < bookedSeats
                || updatedFlight.getTotalSeats() <= 0) {
            throw new RuntimeException(
                    "Total seats cannot be less than already booked seats");
        }

        existingFlight.setFlightNumber(updatedFlight.getFlightNumber());
        existingFlight.setAirline(updatedFlight.getAirline());
        existingFlight.setSource(updatedFlight.getSource());
        existingFlight.setDestination(updatedFlight.getDestination());
        existingFlight.setDepartureTime(updatedFlight.getDepartureTime());
        existingFlight.setArrivalTime(updatedFlight.getArrivalTime());
        existingFlight.setTotalSeats(updatedFlight.getTotalSeats());

        // Preserve existing bookings
        existingFlight.setAvailableSeats(
                updatedFlight.getTotalSeats() - bookedSeats);

        existingFlight.setPrice(updatedFlight.getPrice());

        return flightRepository.save(existingFlight);
    }

    // ADMIN: Delete flight only if no booking records exist
    @Transactional
public void deleteFlight(Long id) {

    Flight flight = flightRepository.findByIdForUpdate(id)
            .orElseThrow(() ->
                    new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Flight not found"
                    ));

    if (!bookingRepository.findByFlightId(id).isEmpty()) {
        throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Cannot delete this flight because booking records exist"
        );
    }

    flightRepository.delete(flight);
}

    // ADMIN + PASSENGER: Search flights
    public List<Flight> searchFlights(
            String source,
            String destination
    ) {
        return flightRepository
                .findBySourceIgnoreCaseAndDestinationIgnoreCase(
                        source, destination);
    }
}
