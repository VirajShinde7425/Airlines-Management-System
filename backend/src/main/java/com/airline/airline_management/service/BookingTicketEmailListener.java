package com.airline.airline_management.service;

import com.airline.airline_management.entity.Booking;
import com.airline.airline_management.event.BookingCreatedEvent;
import com.airline.airline_management.repository.BookingRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class BookingTicketEmailListener {

    private static final Logger logger =
            LoggerFactory.getLogger(BookingTicketEmailListener.class);

    private final BookingRepository bookingRepository;
    private final TicketPdfService ticketPdfService;
    private final BookingEmailService bookingEmailService;

    public BookingTicketEmailListener(
            BookingRepository bookingRepository,
            TicketPdfService ticketPdfService,
            BookingEmailService bookingEmailService
    ) {
        this.bookingRepository = bookingRepository;
        this.ticketPdfService = ticketPdfService;
        this.bookingEmailService = bookingEmailService;
    }

    @TransactionalEventListener(
            phase = TransactionPhase.AFTER_COMMIT
    )
    @Transactional(
            propagation = Propagation.REQUIRES_NEW,
            readOnly = true
    )
    public void handleBookingCreated(BookingCreatedEvent event) {

        try {
            Booking booking = bookingRepository.findById(event.bookingId())
                    .orElseThrow(() ->
                            new RuntimeException("Booking not found")
                    );

            byte[] pdfTicket =
                    ticketPdfService.generateTicket(booking);

            bookingEmailService.sendTicketEmail(
                    booking,
                    pdfTicket
            );

            logger.info(
                    "Ticket processing completed for booking ID {}",
                    event.bookingId()
            );

        } catch (Exception exception) {

            logger.error(
                    "Ticket generation or email processing failed for booking ID {}",
                    event.bookingId(),
                    exception
            );
        }
    }
}