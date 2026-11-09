
package com.airline.airline_management.dto;

import com.airline.airline_management.entity.Booking;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BookingResponseDTO(
        Long id,
        String pnr,
        UserDTO user,
        FlightDTO flight,
        Integer numberOfSeats,
        BigDecimal totalAmount,
        String status,
        LocalDateTime bookingDate
) {

    public record UserDTO(
            Long id,
            String fullName,
            String email
    ) {}

    public record FlightDTO(
            Long id,
            String flightNumber,
            String airline,
            String source,
            String destination,
            LocalDateTime departureTime,
            LocalDateTime arrivalTime,
            Integer totalSeats,
            Integer availableSeats,
            BigDecimal price
    ) {}

    public static BookingResponseDTO from(Booking booking) {

        return new BookingResponseDTO(
                booking.getId(),
                booking.getPnr(),

                new UserDTO(
                        booking.getUser().getId(),
                        booking.getUser().getFullName(),
                        booking.getUser().getEmail()
                ),

                new FlightDTO(
                        booking.getFlight().getId(),
                        booking.getFlight().getFlightNumber(),
                        booking.getFlight().getAirline(),
                        booking.getFlight().getSource(),
                        booking.getFlight().getDestination(),
                        booking.getFlight().getDepartureTime(),
                        booking.getFlight().getArrivalTime(),
                        booking.getFlight().getTotalSeats(),
                        booking.getFlight().getAvailableSeats(),
                        booking.getFlight().getPrice()
                ),

                booking.getNumberOfSeats(),
                booking.getTotalAmount(),
                booking.getStatus().name(),
                booking.getBookingDate()
        );
    }
}
