package com.kitika.demo.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.kitika.demo.model.Reservation;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class ConfirmationPdfService {

    public byte[] generateReservationConfirmation(Reservation reservation) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.BLUE);
            Font labelFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
            Font normalFont = new Font(Font.FontFamily.HELVETICA, 12);

            // Titre
            Paragraph title = new Paragraph("Confirmation de Réservation", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            // Infos client
            document.add(new Paragraph("Nom du client : " + reservation.getClient().getNom() + " " + reservation.getClient().getPrenom(), normalFont));
            document.add(new Paragraph("Email : " + reservation.getClient().getEmail(), normalFont));
            document.add(new Paragraph("Téléphone : " + reservation.getClient().getTelephone(), normalFont));
            document.add(new Paragraph(" "));

            // Détails réservation
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);

            table.addCell(new PdfPCell(new Phrase("Date d'arrivée", labelFont)));
            table.addCell(new PdfPCell(new Phrase(reservation.getDateDebut().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), normalFont)));

            table.addCell(new PdfPCell(new Phrase("Date de départ", labelFont)));
            table.addCell(new PdfPCell(new Phrase(reservation.getDateFin().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), normalFont)));

            table.addCell(new PdfPCell(new Phrase("Type de chambre", labelFont)));
            table.addCell(new PdfPCell(new Phrase(reservation.getChambre().getType(), normalFont)));

            table.addCell(new PdfPCell(new Phrase("Tarif par nuit", labelFont)));
            table.addCell(new PdfPCell(new Phrase(reservation.getChambre().getPrixParNuit() + " DT", normalFont)));

            table.addCell(new PdfPCell(new Phrase("Montant total", labelFont)));
            table.addCell(new PdfPCell(new Phrase(reservation.getTotal() + " DT", normalFont)));

            document.add(table);

            document.add(new Paragraph(" "));
            document.add(new Paragraph("Nous vous remercions pour votre réservation et avons hâte de vous accueillir.", normalFont));

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Erreur génération PDF", e);
        }
    }
}
