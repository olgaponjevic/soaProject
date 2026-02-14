package com.soa.tours.domain;

import java.time.Instant;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompletedKeyPoint {
    private int keyPointIndex;
    private Instant reachedAt;
}
