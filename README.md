# ✈ Airline Management System

A full-stack Airline Management System developed using **React, Spring Boot, and MySQL**. The application allows passengers to search flights, book tickets, view their booking history, and cancel reservations. It also provides role-based authentication for passengers and administrators.

## 📌 Project Overview

The Airline Management System is designed to simplify flight reservation operations through a web-based application.

Passengers can register, log in, search for available flights, book seats, and manage their reservations. Secure authentication and backend validation help protect booking operations and maintain seat availability.

## 🚀 Features

### Passenger Features
- User registration and login.
- JWT-based authentication.
- Search flights by source and destination.
- View flight details and seat availability.
- Book flights by selecting the number of seats.
- Automatic PNR generation.
- View personal booking history.
- Cancel confirmed bookings.
- View booking status and total amount.

### Admin and Security Features
- Role-based access control for passengers and administrators.
- Spring Security integration.
- Password hashing using BCrypt.
- Protected REST API endpoints.
- Ownership validation for booking operations.

### Booking Management
- Automatic booking confirmation.
- Unique PNR generation.
- Total fare calculation based on the number of seats.
- Seat availability validation before booking.
- Prevention of overbooking using database locking.
- Automatic seat restoration after cancellation.

## 🛠 Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| Icons | React Icons |
| HTTP Client | Axios |
| Backend | Java, Spring Boot |
| Security | Spring Security, JWT, BCrypt |
| ORM | Spring Data JPA, Hibernate |
| Database | MySQL |
| API Documentation | Swagger / OpenAPI |
| Build Tool | Maven |
| Version Control | Git and GitHub |

## 🏗 Project Architecture

The application follows a client-server architecture.

```text
          React Frontend
                |
                | HTTP / REST API
                |
          Spring Boot Backend
                |
        Spring Security + JWT
                |
          Service Layer
                |
        Spring Data JPA
                |
            MySQL DB
```

### Project Structure

```text
Airline-Management-System/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/airline/airline_management/
│   │   │   │       ├── config/
│   │   │   │       ├── controller/
│   │   │   │       ├── dto/
│   │   │   │       ├── entity/
│   │   │   │       ├── repository/
│   │   │   │       ├── security/
│   │   │   │       └── service/
│   │   │   └── resources/
│   │   │
│   │   └── test/
│   └── pom.xml
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   ├── Home/
│   │   │   └── Passenger/
│   │   ├── routes/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Install the following before running the application:

- Java 25
- Apache Maven 3.9+
- MySQL 8.0+
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/VirajShinde7425/Airlines-Management-System.git
```

Navigate to the project directory:

```bash
cd Airline-Management-System
```

### 2. Database Configuration

Start MySQL and create the database:

```sql
CREATE DATABASE airline_management;
```

Configure the database connection in the backend's `application.properties`.

The application uses the following configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/airline_management
spring.datasource.username=root
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Set your MySQL password as an environment variable.

**Windows CMD:**

```cmd
set "DB_PASSWORD=your_mysql_password"
```

Replace the example value with your actual MySQL password. Do not commit database passwords or other secrets to GitHub.

### 3. Run the Backend

Open a terminal:

```bash
cd backend
```

Set the database password if you haven't already:

```cmd
set "DB_PASSWORD=your_mysql_password"
```

Start Spring Boot:

```bash
mvn spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

Swagger API documentation:

```text
http://localhost:8080/swagger
```

### 4. Run the Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs at the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

## 🔗 API Endpoints

The backend exposes REST APIs under `/api`.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a passenger |
| POST | `/api/auth/login` | Authenticate a user |

### Flights

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/flights` | Retrieve flights |
| GET | `/api/flights/{id}` | Retrieve flight by ID |
| GET | `/api/flights/search` | Search flights |

Flight management operations are protected by administrator authorization.

### Bookings

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings/my` | Retrieve logged-in passenger's bookings |
| GET | `/api/bookings/{id}` | Retrieve booking by ID |
| DELETE | `/api/bookings/{id}` | Cancel a booking |

Protected endpoints require a valid JWT access token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

## 🔐 Security and Booking Reliability

- JWT is used to authenticate API requests.
- BCrypt is used for password hashing.
- Spring Security protects restricted endpoints.
- Booking ownership is validated before viewing or cancelling a reservation.
- Pessimistic database locking is used during booking and cancellation operations to protect seat availability from concurrent updates.
- Transactions help maintain consistency between booking records and available seats.

## 🗄 Database

The application uses MySQL with Spring Data JPA and Hibernate.

The main database entities include:

- User
- Flight
- Booking
- BookingStatus

Relationships between users, flights, and bookings support passenger-specific booking history and reservation management.

## 🔮 Future Enhancements

- Admin dashboard with booking and flight statistics.
- Complete flight management interface.
- Passenger management interface.
- Online payment gateway integration.
- Email notifications and booking confirmation.
- Ticket generation and PDF download.
- Advanced flight filters and sorting.
- Deployment to a production hosting environment.

## 👨‍💻 Author

**Viraj Shinde**

B.E. Electronics and Telecommunication Engineering

[GitHub Profile](https://github.com/VirajShinde7425)

---

⭐ If you find this project interesting, feel free to explore the repository and its implementation.
