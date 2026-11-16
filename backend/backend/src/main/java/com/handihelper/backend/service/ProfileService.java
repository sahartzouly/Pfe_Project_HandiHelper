package com.handihelper.backend.service;

import com.handihelper.backend.entity.Profile;
import com.handihelper.backend.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    public Profile getProfileByUserId(Long userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profil non trouve"));
    }

    public Profile getProfileById(Long profileId) {
        return profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Profil non trouve"));
    }

    @Transactional
    public Profile updateProfile(Long profileId, Profile updatedProfile) {
        Profile profile = getProfileById(profileId);
        if (updatedProfile.getDateNaissance() != null)
            profile.setDateNaissance(updatedProfile.getDateNaissance());
        if (updatedProfile.getLangue() != null)
            profile.setLangue(updatedProfile.getLangue());
        if (updatedProfile.getModeSombre() != null)
            profile.setModeSombre(updatedProfile.getModeSombre());
        if (updatedProfile.getTaillePolice() != null)
            profile.setTaillePolice(updatedProfile.getTaillePolice());
        if (updatedProfile.getHandicapType() != null)
            profile.setHandicapType(updatedProfile.getHandicapType());
        return profileRepository.save(profile);
    }
}