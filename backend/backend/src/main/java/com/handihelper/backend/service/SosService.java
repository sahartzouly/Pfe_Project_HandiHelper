package com.handihelper.backend.service;

import com.handihelper.backend.entity.SosAlert;
import com.handihelper.backend.entity.User;
import com.handihelper.backend.repository.SosAlertRepository;
import com.handihelper.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SosService {

    private final SosAlertRepository sosAlertRepository;
    private final UserRepository userRepository;

    public List<SosAlert> getAlertsByUser(Long userId) {
        return sosAlertRepository.findByUserIdOrderByDateHeureDesc(userId);
    }

    @Transactional
    public SosAlert sendAlert(Long userId, SosAlert alert) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouve"));
        alert.setUser(user);
        alert.setTraitee(false);
        return sosAlertRepository.save(alert);
    }

    @Transactional
    public SosAlert markAsTraitee(Long alertId) {
        SosAlert alert = sosAlertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alerte non trouvee"));
        alert.setTraitee(true);
        return sosAlertRepository.save(alert);
    }
}