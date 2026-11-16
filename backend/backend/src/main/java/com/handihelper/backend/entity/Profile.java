package com.handihelper.backend.entity;

import com.handihelper.backend.enums.HandicapType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "handicap_type", nullable = false)
    private HandicapType handicapType;

    @Column(name = "date_naissance")
    private String dateNaissance;

    @Column(length = 10)
    private String langue = "fr";

    @Column(name = "mode_sombre")
    private Boolean modeSombre = false;

    @Column(name = "taille_police")
    private Integer taillePolice = 16;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @JsonIgnore
    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL)
    private List<Routine> routines;

    @JsonIgnore
    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL)
    private List<EmotionLog> emotionLogs;

    @JsonIgnore
    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL)
    private List<Medication> medications;

    @JsonIgnore
    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL)
    private List<Contact> contacts;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}