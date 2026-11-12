
package com.airline.airline_management.repository;

import com.airline.airline_management.entity.User;
import com.airline.airline_management.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRole(Role role);
}
