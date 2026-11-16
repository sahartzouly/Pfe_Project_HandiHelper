package com.handihelper.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "sos_alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SosAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Column
    private String message;

    @Column(name = "date_heure")
    private LocalDateTime dateHeure;

    @Column
    private Boolean traitee = false;

    @PrePersist
    protected void onCreate() {
        dateHeure = LocalDateTime.now();
    }
}