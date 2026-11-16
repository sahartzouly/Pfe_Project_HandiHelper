package com.handihelper.backend.controller;

import com.handihelper.backend.dto.response.ApiResponse;
import com.handihelper.backend.entity.Medication;
import com.handihelper.backend.service.MedicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medications")
@RequiredArgsConstructor
public class MedicationController {

    private final MedicationService medicationService;

    @GetMapping("/{profileId}")
    public ResponseEntity<ApiResponse<List<Medication>>> getMedications(@PathVariable Long profileId) {
        List<Medication> medications = medicationService.getMedicationsByProfile(profileId);
        return ResponseEntity.ok(ApiResponse.success(medications, "Medicaments recuperes"));
    }

    @PostMapping("/{profileId}")
    public ResponseEntity<ApiResponse<Medication>> createMedication(
            @PathVariable Long profileId,
            @RequestBody Medication medication) {
        Medication created = medicationService.createMedication(profileId, medication);
        return ResponseEntity.ok(ApiResponse.success(created, "Medicament cree"));
    }

    @PutMapping("/{medicationId}")
    public ResponseEntity<ApiResponse<Medication>> updateMedication(
            @PathVariable Long medicationId,
            @RequestBody Medication medication) {
        Medication updated = medicationService.updateMedication(medicationId, medication);
        return ResponseEntity.ok(ApiResponse.success(updated, "Medicament mis a jour"));
    }

    @DeleteMapping("/{medicationId}")
    public ResponseEntity<ApiResponse<Void>> deleteMedication(@PathVariable Long medicationId) {
        medicationService.deleteMedication(medicationId);
        return ResponseEntity.ok(ApiResponse.success(null, "Medicament desactive"));
    }
}