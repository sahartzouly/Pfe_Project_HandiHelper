package com.handihelper.backend.repository;

import com.handihelper.backend.entity.Routine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoutineRepository extends JpaRepository<Routine, Long> {
    List<Routine> findByProfileIdOrderByOrdreAsc(Long profileId);
    List<Routine> findByProfileIdAndActiveTrue(Long profileId);
}