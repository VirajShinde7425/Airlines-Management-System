
package com.airline.airline_management.service;

import com.airline.airline_management.dto.BookingResponseDTO;
import com.airline.airline_management.entity.Booking;
import com.airline.airline_management.entity.BookingStatus;
import com.airline.airline_management.entity.Flight;
import com.airline.airline_management.entity.User;
import com.airline.airline_management.repository.BookingRepository;
import com.airline.airline_management.repository.FlightRepository;
import com.airline.airline_management.repository.UserRepository;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;
    private final UserRepository userRepository;

    public BookingService(
            BookingRepository bookingRepository,
            FlightRepository flightRepository,
            UserRepository userRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.flightRepository = flightRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookingResponseDTO createBooking(
            String email,
            Long flightId,
            Integer numberOfSeats
    ) {

        if (numberOfSeats == null || numberOfSeats <= 0) {
            throw new RuntimeException(
                    "Number of seats must be greater than zero"
            );
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Flight flight = flightRepository.findByIdForUpdate(flightId)
                .orElseThrow(() ->
                        new RuntimeException("Flight not found")
                );

        // Check whether the flight departure time is in the future
        if (!flight.getDepartureTime().isAfter(LocalDateTime.now())) {
            throw new RuntimeException(
                "Cannot book a flight that has already departed"
             );
        }

        if (flight.getAvailableSeats() < numberOfSeats) {
            throw new RuntimeException(
                    "Not enough seats available"
            );
        }

        BigDecimal totalAmount = flight.getPrice()
                .multiply(BigDecimal.valueOf(numberOfSeats));

        flight.setAvailableSeats(
                flight.getAvailableSeats() - numberOfSeats
        );

        flightRepository.save(flight);

        Booking booking = Booking.builder()
                .pnr(generatePNR())
                .user(user)
                .flight(flight)
                .numberOfSeats(numberOfSeats)
                .totalAmount(totalAmount)
                .status(BookingStatus.CONFIRMED)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        return BookingResponseDTO.from(savedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getMyBookings(String email) {

        return bookingRepository
                .findByUserEmailOrderByBookingDateDesc(email)
                .stream()
                .map(BookingResponseDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingById(
            Long id,
            String email
    ) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found")
                );

        if (!booking.getUser().getEmail().equals(email)) {
            throw new RuntimeException(
                    "You are not authorized to view this booking"
            );
        }

        return BookingResponseDTO.from(booking);
    }

    @Transactional
    public BookingResponseDTO cancelBooking(
            Long id,
            String email
    ) {

        Booking booking = bookingRepository.findByIdForUpdate(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found")
                );

        if (!booking.getUser().getEmail().equals(email)) {
            throw new RuntimeException(
                    "You are not authorized to cancel this booking"
            );
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException(
                    "Booking is already cancelled"
            );
        }

        Flight flight = flightRepository.findByIdForUpdate(
                booking.getFlight().getId()
        ).orElseThrow(() ->
                new RuntimeException("Flight not found")
        );

        flight.setAvailableSeats(
                flight.getAvailableSeats()
                        + booking.getNumberOfSeats()
        );

        flightRepository.save(flight);

        booking.setStatus(BookingStatus.CANCELLED);

        Booking savedBooking = bookingRepository.save(booking);

        return BookingResponseDTO.from(savedBooking);
    }

    private String generatePNR() {

        return UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 8)
                .toUpperCase();
    }
}
