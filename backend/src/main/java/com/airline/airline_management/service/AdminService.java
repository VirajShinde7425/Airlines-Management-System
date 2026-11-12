
package com.airline.airline_management.service;

import com.airline.airline_management.dto.AdminDashboardDTO;
import com.airline.airline_management.entity.BookingStatus;
import com.airline.airline_management.entity.Role;
import com.airline.airline_management.repository.BookingRepository;
import com.airline.airline_management.repository.FlightRepository;
import com.airline.airline_management.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AdminService {

    private final FlightRepository flightRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public AdminService(
            FlightRepository flightRepository,
            BookingRepository bookingRepository,
            UserRepository userRepository
    ) {
        this.flightRepository = flightRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    public AdminDashboardDTO getDashboardStats() {

        long totalFlights = flightRepository.count();

        long totalBookings = bookingRepository.count();

        long totalPassengers = userRepository.countByRole(Role.PASSENGER);

        BigDecimal totalRevenue =
                bookingRepository.calculateRevenueByStatus(
                        BookingStatus.CONFIRMED
                );

        return new AdminDashboardDTO(
                totalFlights,
                totalBookings,
                totalPassengers,
                totalRevenue
        );
    }
}
