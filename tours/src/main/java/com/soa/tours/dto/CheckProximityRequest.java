package com.soa.tours.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckProximityRequest {
    @NotNull
    private Long touristId;

    private Double radiusMeters;
}
