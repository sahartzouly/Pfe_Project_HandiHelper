package com.handihelper.backend.controller;

import com.handihelper.backend.dto.response.ApiResponse;
import com.handihelper.backend.entity.SosAlert;
import com.handihelper.backend.service.SosService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sos")
@RequiredArgsConstructor
public class SosController {

    private final SosService sosService;

    @GetMapping("/history/{userId}")
    public ResponseEntity<ApiResponse<List<SosAlert>>> getHistory(@PathVariable Long userId) {
        List<SosAlert> alerts = sosService.getAlertsByUser(userId);
        return ResponseEntity.ok(ApiResponse.success(alerts, "Historique recupere"));
    }

    @PostMapping("/alert/{userId}")
    public ResponseEntity<ApiResponse<SosAlert>> sendAlert(
            @PathVariable Long userId,
            @RequestBody SosAlert alert) {
        SosAlert created = sosService.sendAlert(userId, alert);
        return ResponseEntity.ok(ApiResponse.success(created, "Alerte SOS envoyee"));
    }

    @PutMapping("/traiter/{alertId}")
    public ResponseEntity<ApiResponse<SosAlert>> markAsTraitee(@PathVariable Long alertId) {
        SosAlert updated = sosService.markAsTraitee(alertId);
        return ResponseEntity.ok(ApiResponse.success(updated, "Alerte traitee"));
    }
}