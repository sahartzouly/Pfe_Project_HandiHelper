package com.handihelper.backend.entity;

import com.handihelper.backend.enums.Emotion;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "emotions_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmotionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Emotion emotion;

    @Column
    private Integer intensite;

    @Column
    private String note;

    @Column(name = "date_heure")
    private LocalDateTime dateHeure;

    @PrePersist
    protected void onCreate() {
        dateHeure = LocalDateTime.now();
    }
}