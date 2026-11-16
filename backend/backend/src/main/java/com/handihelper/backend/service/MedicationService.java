package com.handihelper.backend.service;

import com.handihelper.backend.entity.Medication;
import com.handihelper.backend.entity.Profile;
import com.handihelper.backend.repository.MedicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicationService {

    private final MedicationRepository medicationRepository;
    private final ProfileService profileService;

    public List<Medication> getMedicationsByProfile(Long profileId) {
        return medicationRepository.findByProfileIdAndActiveTrue(profileId);
    }

    @Transactional
    public Medication createMedication(Long profileId, Medication medication) {
        Profile profile = profileService.getProfileById(profileId);
        medication.setProfile(profile);
        return medicationRepository.save(medication);
    }

    @Transactional
    public Medication updateMedication(Long medicationId, Medication updatedMedication) {
        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new RuntimeException("Medicament non trouve"));
        if (updatedMedication.getNom() != null)
            medication.setNom(updatedMedication.getNom());
        if (updatedMedication.getDosage() != null)
            medication.setDosage(updatedMedication.getDosage());
        if (updatedMedication.getHoraires() != null)
            medication.setHoraires(updatedMedication.getHoraires());
        if (updatedMedication.getInstructions() != null)
            medication.setInstructions(updatedMedication.getInstructions());
        return medicationRepository.save(medication);
    }

    @Transactional
    public void deleteMedication(Long medicationId) {
        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new RuntimeException("Medicament non trouve"));
        medication.setActive(false);
        medicationRepository.save(medication);
    }
}