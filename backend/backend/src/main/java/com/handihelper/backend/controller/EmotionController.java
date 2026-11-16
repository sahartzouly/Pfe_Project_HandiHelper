package com.handihelper.backend.controller;

import com.handihelper.backend.dto.response.ApiResponse;
import com.handihelper.backend.entity.EmotionLog;
import com.handihelper.backend.service.EmotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emotions")
@RequiredArgsConstructor
public class EmotionController {

    private final EmotionService emotionService;

    @GetMapping("/{profileId}")
    public ResponseEntity<ApiResponse<List<EmotionLog>>> getEmotions(@PathVariable Long profileId) {
        List<EmotionLog> emotions = emotionService.getEmotionsByProfile(profileId);
        return ResponseEntity.ok(ApiResponse.success(emotions, "Emotions recuperees"));
    }

    @PostMapping("/{profileId}")
    public ResponseEntity<ApiResponse<EmotionLog>> logEmotion(
            @PathVariable Long profileId,
            @RequestBody EmotionLog emotionLog) {
        EmotionLog created = emotionService.logEmotion(profileId, emotionLog);
        return ResponseEntity.ok(ApiResponse.success(created, "Emotion enregistree"));
    }

    @DeleteMapping("/{emotionId}")
    public ResponseEntity<ApiResponse<Void>> deleteEmotion(@PathVariable Long emotionId) {
        emotionService.deleteEmotion(emotionId);
        return ResponseEntity.ok(ApiResponse.success(null, "Emotion supprimee"));
    }
}