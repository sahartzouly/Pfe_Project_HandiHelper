package com.handihelper.backend.repository;

import com.handihelper.backend.entity.EmotionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface EmotionLogRepository extends JpaRepository<EmotionLog, Long> {
    List<EmotionLog> findByProfileIdOrderByDateHeureDesc(Long profileId);
    List<EmotionLog> findByProfileIdAndDateHeureBetween(Long profileId, LocalDateTime debut, LocalDateTime fin);
}