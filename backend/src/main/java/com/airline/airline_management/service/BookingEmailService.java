
package com.airline.airline_management.service;

import com.airline.airline_management.entity.Booking;

import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class BookingEmailService {

    private static final Logger logger =
            LoggerFactory.getLogger(BookingEmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String senderEmail;

    @Value("${app.mail.sender-name}")
    private String senderName;

    public BookingEmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendTicketEmail(
            Booking booking,
            byte[] pdfTicket
    ) {

        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    true,
                    "UTF-8"
            );

            String passengerName =
                    booking.getUser().getFullName();

            String passengerEmail =
                    booking.getUser().getEmail();

                    logger.info(
              "Sending ticket for PNR {} to recipient: {}",
               booking.getPnr(),
               passengerEmail
            );

            String pnr = booking.getPnr();

            helper.setFrom(senderEmail, senderName);
            helper.setTo(passengerEmail);

            helper.setSubject(
                    "Your SkyWings Flight Ticket - PNR " + pnr
            );

            String emailBody =
                    "<html>"
                    + "<body style='font-family:Arial,sans-serif;'>"
                    + "<h2 style='color:#142d55;'>"
                    + "Thank you for choosing SkyWings Airlines!"
                    + "</h2>"
                    + "<p>Dear " + escapeHtml(passengerName) + ",</p>"
                    + "<p>Your flight booking has been confirmed.</p>"
                    + "<p><strong>PNR:</strong> "
                    + escapeHtml(pnr) + "</p>"
                    + "<p>Your electronic flight ticket is attached "
                    + "to this email as a PDF.</p>"
                    + "<p>Please carry a valid government-issued "
                    + "photo ID during your journey.</p>"
                    + "<p>Have a pleasant journey!</p>"
                    + "<p>Regards,<br>SkyWings Airlines</p>"
                    + "</body></html>";

            helper.setText(emailBody, true);

            helper.addAttachment(
                    "SkyWings-Ticket-" + pnr + ".pdf",
                    new ByteArrayResource(pdfTicket),
                    "application/pdf"
            );

            mailSender.send(message);

            logger.info(
                    "Flight ticket email sent successfully for PNR {}",
                    pnr
            );

        } catch (Exception exception) {

            logger.error(
                    "Could not send ticket email for PNR {}",
                    booking.getPnr(),
                    exception
            );
        }
    }

    private String escapeHtml(String value) {

        if (value == null) {
            return "";
        }

        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
