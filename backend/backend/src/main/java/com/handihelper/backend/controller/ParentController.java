package com.handihelper.backend.controller;

import com.handihelper.backend.dto.response.ApiResponse;
import com.handihelper.backend.entity.User;
import com.handihelper.backend.service.ParentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/parent")
@RequiredArgsConstructor
public class ParentController {

    private final ParentService parentService;

    // Lier un proche par email
    @PostMapping("/{parentId}/lier")
    public ResponseEntity<ApiResponse<User>> lierProche(
            @PathVariable Long parentId,
            @RequestParam String emailProche) {
        User proche = parentService.lierProche(parentId, emailProche);
        return ResponseEntity.ok(ApiResponse.success(proche, "Proche lié avec succès"));
    }

    // Récupérer la liste des proches
    @GetMapping("/{parentId}/proches")
    public ResponseEntity<ApiResponse<List<User>>> getProches(@PathVariable Long parentId) {
        List<User> proches = parentService.getProches(parentId);
        return ResponseEntity.ok(ApiResponse.success(proches, "Proches récupérés"));
    }
}