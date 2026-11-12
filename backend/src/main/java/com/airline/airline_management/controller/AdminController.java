
package com.airline.airline_management.controller;

import com.airline.airline_management.dto.AdminDashboardDTO;
import com.airline.airline_management.service.AdminService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/test")
    public String adminTest() {
        return "Admin access successful";
    }

    @GetMapping("/dashboard/stats")
    public AdminDashboardDTO getDashboardStats() {
        return adminService.getDashboardStats();
    }
}
