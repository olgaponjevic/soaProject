package com.soa.tours.domain;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.*;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document("positions")
public class TouristPosition {
    @Id
    private String id;

    private Long touristId;
    private double lat;
    private double lon;
    private Instant updatedAt;
}
