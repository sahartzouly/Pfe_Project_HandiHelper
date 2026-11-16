package com.handihelper.backend.repository;

import com.handihelper.backend.entity.AccessiblePlace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AccessiblePlaceRepository extends JpaRepository<AccessiblePlace, Long> {
    List<AccessiblePlace> findByValideTrue();

    @Query("SELECT p FROM AccessiblePlace p WHERE p.valide = true AND " +
           "(6371 * acos(cos(radians(:lat)) * cos(radians(p.latitude)) * " +
           "cos(radians(p.longitude) - radians(:lng)) + " +
           "sin(radians(:lat)) * sin(radians(p.latitude)))) < :rayon")
    List<AccessiblePlace> findNearby(@Param("lat") Double lat,
                                     @Param("lng") Double lng,
                                     @Param("rayon") Double rayon);
}