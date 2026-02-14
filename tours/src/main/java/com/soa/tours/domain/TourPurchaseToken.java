package com.soa.tours.domain;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document("purchase_tokens")
public class TourPurchaseToken {
    @Id
    private String id;

    private Long touristId;
    private String tourId;

    private Instant createdAt;
}
