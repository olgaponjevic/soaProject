package com.soa.tours.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document("tours")
public class Tour {
    @Id
    private String id;

    @NotNull
    private Long authorId;

    @NotBlank
    private String authorUsername;

    @NotBlank
    private String name;

    private String description;

    @NotNull
    private Difficulty difficulty;

    private List<String> tags = new ArrayList<>();

    private double price;

    private TourStatus status;

    private double lengthKm;

    @Valid
    private List<KeyPoint> keyPoints = new ArrayList<>();

    @Valid
    private List<TransportTime> transportTimes = new ArrayList<>();

    private Instant createdAt;
    private Instant publishedAt;
    private Instant archivedAt;

    @Valid
    private List<Review> reviews = new ArrayList<>();
}
