package com.kitika.demo.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import  org.springframework.web.bind.annotation.RestController;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.kitika.demo.model.Consommation;
import com.kitika.demo.model.Facture;
import com.kitika.demo.repository.FactureRepository;
import com.kitika.demo.service.IFactureService;

import jakarta.servlet.http.HttpServletResponse;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/factures")
public class FactureController {

    @Autowired
    private IFactureService factureService;
    @Autowired
    private FactureRepository factureRepo;

    @GetMapping
    public List<Facture> getAllFactures() {
        return factureService.getAllFactures();
    }

    @GetMapping("/{id}")
    public Facture getFactureById(@PathVariable("id") int id) {
        return factureService.getFactureById(id);
    }

    @PostMapping
    public Facture createFacture(@RequestBody Facture facture) {
        return factureService.saveFacture(facture);
    }

    @PutMapping("/{id}")
    public Facture updateFacture(@PathVariable("id") int id, @RequestBody Facture facture) {
        facture.setId(id);
        return factureService.saveFacture(facture);
    }

    @DeleteMapping("/{id}")
    public void deleteFacture(@PathVariable("id") int id) {
        factureService.deleteFacture(id);
    }

    @GetMapping("/client/{clientId}")
    public List<Facture> getFacturesByClient(@PathVariable int clientId) {
        return factureService.getFacturesByClient(clientId);
    }

    @GetMapping("/non-payees")
    public List<Facture> getFacturesNonPayees() {
        return factureService.getFacturesNonPayees();
    }

    @GetMapping("/payees")
    public List<Facture> getFacturesPayees() {
        return factureService.getFacturesPayees();
    }
    @PostMapping("/generer/{ficheId}")
    public ResponseEntity<Facture> genererFacture(@PathVariable("ficheId") int ficheId) {
        Facture facture = factureService.genererFacture(ficheId);
        return ResponseEntity.ok(facture);
    }
    @PatchMapping("/{id}/payer")
    public ResponseEntity<?> reglerFacture(@PathVariable("id") int id) {
        Facture facture = factureRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Facture non trouvée"));
        facture.setPayee(true);
        factureRepo.save(facture);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/reservation/{id}")
    public Facture getFactureByReservationId(@PathVariable("id") int id) {
        return factureService.getFactureByReservationId(id);
    }
    @GetMapping("/{id}/pdf")
public void generateFacturePdf(@PathVariable("id") int id, HttpServletResponse response) throws IOException, DocumentException {
    Facture facture = factureRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("Facture non trouvée"));

    response.setContentType("application/pdf");
    response.setHeader("Content-Disposition", "attachment; filename=facture_" + id + ".pdf");

    Document document = new Document();
    PdfWriter.getInstance(document, response.getOutputStream());
    document.open();

    // --- Styles ---
    Font titleFont = new Font(Font.FontFamily.HELVETICA, 20, Font.BOLD);
    Font sectionTitleFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD);
    Font normalFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);
    Font boldFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);

    // --- En-tête facture ---
    document.add(new Paragraph("HÔTEL Kitika", titleFont));
    document.add(new Paragraph("Adresse : 123 Rue de l'Hospitalité, Tunis", normalFont));
    document.add(new Paragraph("Téléphone : +216 71 000 000", normalFont));
    document.add(new Paragraph("Email : contact@hotelKitika.com", normalFont));
    document.add(new Paragraph("------------------------------------------------------"));
    document.add(new Paragraph("FACTURE N° " + facture.getId(), sectionTitleFont));
    document.add(new Paragraph("Date émission : " + facture.getDateEmission(), normalFont));
    document.add(new Paragraph("------------------------------------------------------"));
    document.add(new Paragraph("Client : " + facture.getClient().getNom() + " " + facture.getClient().getPrenom(), normalFont));
    document.add(new Paragraph("Téléphone : " + facture.getClient().getTelephone(), normalFont));
    document.add(new Paragraph("Nationalité : " + facture.getClient().getNationalite(), normalFont));
    document.add(new Paragraph(" "));

    // --- Détail Séjour ---
    if (facture.getReservation() != null) {
        float prixNuitee = facture.getReservation().getChambre().getPrixParNuit();
        long nbNuits = java.time.temporal.ChronoUnit.DAYS.between(
                facture.getReservation().getDateDebut(),
                facture.getReservation().getDateFin()
        );

        document.add(new Paragraph("Détail du séjour :", sectionTitleFont));
        PdfPTable sejourTable = new PdfPTable(3);
        sejourTable.addCell("Prix/Nuitée");
        sejourTable.addCell("Nombre de nuits");
        sejourTable.addCell("Total séjour");

        sejourTable.addCell(prixNuitee + " DT");
        sejourTable.addCell(nbNuits + " nuits");
        sejourTable.addCell((prixNuitee * nbNuits) + " DT");

        document.add(sejourTable);
        document.add(new Paragraph(" "));
    }

    // --- Consommations ---
    document.add(new Paragraph("Détail des consommations :", sectionTitleFont));
    PdfPTable consoTable = new PdfPTable(3);
    consoTable.addCell("Produit");
    consoTable.addCell("Description");
    consoTable.addCell("Montant");

    if (facture.getConsommations() != null && !facture.getConsommations().isEmpty()) {
        for (Consommation conso : facture.getConsommations()) {
            consoTable.addCell(conso.getProduit().getNom());
            consoTable.addCell(conso.getDescription());
            consoTable.addCell(conso.getMontant() + " DT");
        }
    } else {
        consoTable.addCell("Aucune");
        consoTable.addCell("-");
        consoTable.addCell("0 DT");
    }

    document.add(consoTable);
    document.add(new Paragraph(" "));

    // --- Total ---
    document.add(new Paragraph("Montant total à payer : " + facture.getMontantTotal() + " DT", boldFont));
    document.add(new Paragraph("Statut : " + (facture.isPayee() ? "Payée ✅" : "Impayée ❌"), boldFont));
    document.add(new Paragraph("------------------------------------------------------"));
    document.add(new Paragraph("Merci pour votre séjour et à bientôt !", normalFont));

    document.close();
}



}
