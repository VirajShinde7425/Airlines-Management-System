
package com.airline.airline_management.service;

import com.airline.airline_management.entity.Booking;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class TicketPdfService {

    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern("dd MMM yyyy");

    private static final DateTimeFormatter TIME_FORMAT =
            DateTimeFormatter.ofPattern("hh:mm a");

    public byte[] generateTicket(Booking booking) {

        ByteArrayOutputStream outputStream =
                new ByteArrayOutputStream();

        Document document = new Document();

        try {

            PdfWriter.getInstance(document, outputStream);

            document.open();

            Font titleFont = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    22,
                    new Color(20, 45, 85)
            );

            Font headingFont = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    12,
                    new Color(20, 45, 85)
            );

            Font normalFont = FontFactory.getFont(
                    FontFactory.HELVETICA,
                    10,
                    Color.DARK_GRAY
            );

            Paragraph title = new Paragraph(
                    "SKYWINGS AIRLINES",
                    titleFont
            );

            title.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(title);

            Paragraph subtitle = new Paragraph(
                    "ELECTRONIC FLIGHT TICKET",
                    normalFont
            );

            subtitle.setAlignment(Paragraph.ALIGN_CENTER);
            subtitle.setSpacingAfter(20);

            document.add(subtitle);

            Paragraph pnr = new Paragraph(
                    "BOOKING REFERENCE: " + booking.getPnr(),
                    headingFont
            );

            pnr.setSpacingAfter(15);
            document.add(pnr);

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1, 2});
            table.setSpacingAfter(15);

            addRow(table, "Passenger Name",
                    booking.getUser().getFullName());

            addRow(table, "Email",
                    booking.getUser().getEmail());

            addRow(table, "Flight Number",
                    booking.getFlight().getFlightNumber());

            addRow(table, "Airline",
                    booking.getFlight().getAirline());

            addRow(table, "From",
                    booking.getFlight().getSource());

            addRow(table, "To",
                    booking.getFlight().getDestination());

            addRow(table, "Departure Date",
                    booking.getFlight().getDepartureTime()
                            .format(DATE_FORMAT));

            addRow(table, "Departure Time",
                    booking.getFlight().getDepartureTime()
                            .format(TIME_FORMAT));

            addRow(table, "Arrival Date",
                    booking.getFlight().getArrivalTime()
                            .format(DATE_FORMAT));

            addRow(table, "Arrival Time",
                    booking.getFlight().getArrivalTime()
                            .format(TIME_FORMAT));

            addRow(table, "Number of Seats",
                    booking.getNumberOfSeats().toString());

            addRow(table, "Total Fare",
                    "INR " + booking.getTotalAmount());

            addRow(table, "Booking Status",
                    booking.getStatus().name());

            document.add(table);

            Paragraph footer = new Paragraph(
                    "Thank you for choosing SkyWings Airlines.\n"
                    + "Please carry a valid government-issued photo ID "
                    + "during your journey.",
                    normalFont
            );

            footer.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(footer);

            document.close();

            return outputStream.toByteArray();

        } catch (Exception exception) {

            if (document.isOpen()) {
                document.close();
            }

            throw new RuntimeException(
                    "Failed to generate flight ticket PDF",
                    exception
            );
        }
    }

    private void addRow(
            PdfPTable table,
            String label,
            String value
    ) {

        PdfPCell labelCell = new PdfPCell(
                new Phrase(label)
        );

        labelCell.setBackgroundColor(
                new Color(235, 240, 248)
        );

        labelCell.setPadding(8);

        PdfPCell valueCell = new PdfPCell(
                new Phrase(value)
        );

        valueCell.setPadding(8);

        table.addCell(labelCell);
        table.addCell(valueCell);
    }
}
