package com.handihelper.backend.repository;

import com.handihelper.backend.entity.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicationRepository extends JpaRepository<Medication, Long> {
    List<Medication> findByProfileIdAndActiveTrue(Long profileId);
}