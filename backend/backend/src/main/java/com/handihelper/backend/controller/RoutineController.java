package com.handihelper.backend.controller;

import com.handihelper.backend.dto.response.ApiResponse;
import com.handihelper.backend.entity.Routine;
import com.handihelper.backend.service.RoutineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routines")
@RequiredArgsConstructor
public class RoutineController {

    private final RoutineService routineService;

    @GetMapping("/{profileId}")
    public ResponseEntity<ApiResponse<List<Routine>>> getRoutines(@PathVariable Long profileId) {
        List<Routine> routines = routineService.getRoutinesByProfile(profileId);
        return ResponseEntity.ok(ApiResponse.success(routines, "Routines recuperees"));
    }

    @PostMapping("/{profileId}")
    public ResponseEntity<ApiResponse<Routine>> createRoutine(
            @PathVariable Long profileId,
            @RequestBody Routine routine) {
        Routine created = routineService.createRoutine(profileId, routine);
        return ResponseEntity.ok(ApiResponse.success(created, "Routine creee"));
    }

    @PutMapping("/{routineId}")
    public ResponseEntity<ApiResponse<Routine>> updateRoutine(
            @PathVariable Long routineId,
            @RequestBody Routine routine) {
        Routine updated = routineService.updateRoutine(routineId, routine);
        return ResponseEntity.ok(ApiResponse.success(updated, "Routine mise a jour"));
    }

    @DeleteMapping("/{routineId}")
    public ResponseEntity<ApiResponse<Void>> deleteRoutine(@PathVariable Long routineId) {
        routineService.deleteRoutine(routineId);
        return ResponseEntity.ok(ApiResponse.success(null, "Routine supprimee"));
    }
}