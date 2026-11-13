package com.airline.airline_management.repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.airline.airline_management.entity.Booking;
import com.airline.airline_management.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.math.BigDecimal;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByPnr(String pnr);

    List<Booking> findByUserEmailOrderByBookingDateDesc(String email);

    List<Booking> findByFlightId(Long flightId);

    List<Booking> findByUserEmailAndStatus(
            String email,
            BookingStatus status
    );
    @Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT b FROM Booking b WHERE b.id = :bookingId")
Optional<Booking> findByIdForUpdate(
        @Param("bookingId") Long bookingId
);
@Query("""
    SELECT COALESCE(SUM(b.totalAmount), 0)
    FROM Booking b
    WHERE b.status = :status
""")
BigDecimal calculateRevenueByStatus(
        @Param("status") BookingStatus status
);
// Check whether a flight has confirmed bookings
boolean existsByFlightIdAndStatus(
        Long flightId,
        BookingStatus status
);

// Delete cancelled bookings associated with a flight
@Modifying
@Query("""
    DELETE FROM Booking b
    WHERE b.flight.id = :flightId
    AND b.status = :status
""")
int deleteByFlightIdAndStatus(
        @Param("flightId") Long flightId,
        @Param("status") BookingStatus status
);
}