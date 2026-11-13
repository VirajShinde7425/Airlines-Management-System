
package com.airline.airline_management.controller;

import com.airline.airline_management.dto.BookingResponseDTO;
import com.airline.airline_management.service.BookingService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Only passengers can create bookings
    @PreAuthorize("hasRole('PASSENGER')")
    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(
            @RequestBody Map<String, Object> request,
            Authentication authentication
    ) {

        Long flightId =
                Long.valueOf(request.get("flightId").toString());

        Integer numberOfSeats =
                Integer.valueOf(
                        request.get("numberOfSeats").toString()
                );

        BookingResponseDTO booking = bookingService.createBooking(
                authentication.getName(),
                flightId,
                numberOfSeats
        );

        return ResponseEntity.ok(booking);
    }

    // Only passengers can view their bookings
    @PreAuthorize("hasRole('PASSENGER')")
    @GetMapping("/my")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                bookingService.getMyBookings(
                        authentication.getName()
                )
        );
    }

    // Only passengers can view their individual bookings
    @PreAuthorize("hasRole('PASSENGER')")
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingById(
            @PathVariable Long id,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                bookingService.getBookingById(
                        id,
                        authentication.getName()
                )
        );
    }

    // Only passengers can cancel their own bookings
    @PreAuthorize("hasRole('PASSENGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable Long id,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                bookingService.cancelBooking(
                        id,
                        authentication.getName()
                )
        );
    }
}
