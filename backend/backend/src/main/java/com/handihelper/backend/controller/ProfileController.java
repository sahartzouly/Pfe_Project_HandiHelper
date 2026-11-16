package com.handihelper.backend.controller;

import com.handihelper.backend.dto.response.ApiResponse;
import com.handihelper.backend.entity.Profile;
import com.handihelper.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Profile>> getProfileByUserId(@PathVariable Long userId) {
        Profile profile = profileService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(profile, "Profil recupere"));
    }

    @GetMapping("/{profileId}")
    public ResponseEntity<ApiResponse<Profile>> getProfile(@PathVariable Long profileId) {
        Profile profile = profileService.getProfileById(profileId);
        return ResponseEntity.ok(ApiResponse.success(profile, "Profil recupere"));
    }

    @PutMapping("/{profileId}")
    public ResponseEntity<ApiResponse<Profile>> updateProfile(
            @PathVariable Long profileId,
            @RequestBody Profile profile) {
        Profile updated = profileService.updateProfile(profileId, profile);
        return ResponseEntity.ok(ApiResponse.success(updated, "Profil mis a jour"));
    }
}