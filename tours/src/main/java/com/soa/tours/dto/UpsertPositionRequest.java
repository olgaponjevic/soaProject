package com.soa.tours.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpsertPositionRequest {
    @NotNull
    private Long touristId;

    @NotNull
    private Double lat;

    @NotNull
    private Double lon;
}
