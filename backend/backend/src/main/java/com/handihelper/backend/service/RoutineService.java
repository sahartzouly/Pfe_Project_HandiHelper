package com.handihelper.backend.service;

import com.handihelper.backend.entity.Profile;
import com.handihelper.backend.entity.Routine;
import com.handihelper.backend.repository.RoutineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoutineService {

    private final RoutineRepository routineRepository;
    private final ProfileService profileService;

    public List<Routine> getRoutinesByProfile(Long profileId) {
        return routineRepository.findByProfileIdOrderByOrdreAsc(profileId);
    }

    @Transactional
    public Routine createRoutine(Long profileId, Routine routine) {
        Profile profile = profileService.getProfileById(profileId);
        routine.setProfile(profile);
        return routineRepository.save(routine);
    }

    @Transactional
    public Routine updateRoutine(Long routineId, Routine updatedRoutine) {
        Routine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new RuntimeException("Routine non trouvee"));
        if (updatedRoutine.getTitre() != null)
            routine.setTitre(updatedRoutine.getTitre());
        if (updatedRoutine.getDescription() != null)
            routine.setDescription(updatedRoutine.getDescription());
        if (updatedRoutine.getIcone() != null)
            routine.setIcone(updatedRoutine.getIcone());
        if (updatedRoutine.getHeureDebut() != null)
            routine.setHeureDebut(updatedRoutine.getHeureDebut());
        if (updatedRoutine.getDureeMinutes() != null)
            routine.setDureeMinutes(updatedRoutine.getDureeMinutes());
        if (updatedRoutine.getOrdre() != null)
            routine.setOrdre(updatedRoutine.getOrdre());
        if (updatedRoutine.getActive() != null)
            routine.setActive(updatedRoutine.getActive());
        return routineRepository.save(routine);
    }

    @Transactional
    public void deleteRoutine(Long routineId) {
        routineRepository.deleteById(routineId);
    }
}