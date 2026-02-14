package com.soa.tours.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document("executions")
public class TourExecution {
    @Id
    private String id;

    private Long touristId;
    private String tourId;

    private ExecutionStatus status;

    private Instant startedAt;
    private Instant completedAt;
    private Instant abandonedAt;

    private Instant lastActivityAt;

    private Double startLat;
    private Double startLon;

    @Builder.Default
    private List<CompletedKeyPoint> completedKeyPoints = new ArrayList<>();
}
