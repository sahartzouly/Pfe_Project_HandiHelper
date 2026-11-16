package com.handihelper.backend.service;

import com.handihelper.backend.entity.EmotionLog;
import com.handihelper.backend.entity.Profile;
import com.handihelper.backend.repository.EmotionLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmotionService {

    private final EmotionLogRepository emotionLogRepository;
    private final ProfileService profileService;

    public List<EmotionLog> getEmotionsByProfile(Long profileId) {
        return emotionLogRepository.findByProfileIdOrderByDateHeureDesc(profileId);
    }

    @Transactional
    public EmotionLog logEmotion(Long profileId, EmotionLog emotionLog) {
        Profile profile = profileService.getProfileById(profileId);
        emotionLog.setProfile(profile);
        return emotionLogRepository.save(emotionLog);
    }

    @Transactional
    public void deleteEmotion(Long emotionId) {
        emotionLogRepository.deleteById(emotionId);
    }
}