package com.handihelper.backend.service;

import com.handihelper.backend.entity.AccessiblePlace;
import com.handihelper.backend.entity.User;
import com.handihelper.backend.repository.AccessiblePlaceRepository;
import com.handihelper.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccessiblePlaceService {

    private final AccessiblePlaceRepository accessiblePlaceRepository;
    private final UserRepository userRepository;

    public List<AccessiblePlace> getAllPlaces() {
        return accessiblePlaceRepository.findByValideTrue();
    }

    public List<AccessiblePlace> getNearbyPlaces(Double lat, Double lng, Double rayon) {
        return accessiblePlaceRepository.findNearby(lat, lng, rayon);
    }

    @Transactional
    public AccessiblePlace createPlace(Long userId, AccessiblePlace place) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouve"));
        place.setSignalePar(user);
        place.setValide(true);
        return accessiblePlaceRepository.save(place);
    }

    @Transactional
    public void deletePlace(Long placeId) {
        AccessiblePlace place = accessiblePlaceRepository.findById(placeId)
                .orElseThrow(() -> new RuntimeException("Lieu non trouve"));
        place.setValide(false);
        accessiblePlaceRepository.save(place);
    }
}
