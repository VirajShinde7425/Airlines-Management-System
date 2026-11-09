    package com.airline.airline_management.controller;

    import com.airline.airline_management.entity.Booking;
    import com.airline.airline_management.service.BookingService;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.core.Authentication;
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

        @PostMapping
        public ResponseEntity<Booking> createBooking(
                @RequestBody Map<String, Object> request,
                Authentication authentication
        ) {

            Long flightId =
                    Long.valueOf(request.get("flightId").toString());

            Integer numberOfSeats =
                    Integer.valueOf(
                            request.get("numberOfSeats").toString()
                    );

            Booking booking = bookingService.createBooking(
                    authentication.getName(),
                    flightId,
                    numberOfSeats
            );

            return ResponseEntity.ok(booking);
        }

        @GetMapping("/my")
        public ResponseEntity<List<Booking>> getMyBookings(
                Authentication authentication
        ) {

            return ResponseEntity.ok(
                    bookingService.getMyBookings(
                            authentication.getName()
                    )
            );
        }

        @GetMapping("/{id}")
        public ResponseEntity<Booking> getBookingById(
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

        @DeleteMapping("/{id}")
        public ResponseEntity<Booking> cancelBooking(
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