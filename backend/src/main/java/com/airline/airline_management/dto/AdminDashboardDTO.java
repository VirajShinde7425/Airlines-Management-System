
package com.airline.airline_management.dto;

import java.math.BigDecimal;

public class AdminDashboardDTO {

    private long totalFlights;
    private long totalBookings;
    private long totalPassengers;
    private BigDecimal totalRevenue;

    public AdminDashboardDTO(
            long totalFlights,
            long totalBookings,
            long totalPassengers,
            BigDecimal totalRevenue
    ) {
        this.totalFlights = totalFlights;
        this.totalBookings = totalBookings;
        this.totalPassengers = totalPassengers;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalFlights() {
        return totalFlights;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public long getTotalPassengers() {
        return totalPassengers;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }
}
