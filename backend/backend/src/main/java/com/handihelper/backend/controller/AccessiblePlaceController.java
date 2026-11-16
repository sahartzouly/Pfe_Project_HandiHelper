package com.handihelper.backend.controller;

import com.handihelper.backend.dto.response.ApiResponse;
import com.handihelper.backend.entity.AccessiblePlace;
import com.handihelper.backend.service.AccessiblePlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
public class AccessiblePlaceController {

    private final AccessiblePlaceService accessiblePlaceService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccessiblePlace>>> getAllPlaces() {
        List<AccessiblePlace> places = accessiblePlaceService.getAllPlaces();
        return ResponseEntity.ok(ApiResponse.success(places, "Lieux recuperes"));
    }

    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse<List<AccessiblePlace>>> getNearbyPlaces(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "5.0") Double rayon) {
        List<AccessiblePlace> places = accessiblePlaceService.getNearbyPlaces(lat, lng, rayon);
        return ResponseEntity.ok(ApiResponse.success(places, "Lieux proches recuperes"));
    }

    @PostMapping("/{userId}")
    public ResponseEntity<ApiResponse<AccessiblePlace>> createPlace(
            @PathVariable Long userId,
            @RequestBody AccessiblePlace place) {
        AccessiblePlace created = accessiblePlaceService.createPlace(userId, place);
        return ResponseEntity.ok(ApiResponse.success(created, "Lieu cree"));
    }

    @DeleteMapping("/{placeId}")
    public ResponseEntity<ApiResponse<Void>> deletePlace(@PathVariable Long placeId) {
        accessiblePlaceService.deletePlace(placeId);
        return ResponseEntity.ok(ApiResponse.success(null, "Lieu supprime"));
    }
}