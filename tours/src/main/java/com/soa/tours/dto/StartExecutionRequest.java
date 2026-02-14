package com.soa.tours.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StartExecutionRequest {
    @NotNull
    private Long touristId;

    @NotNull
    private String tourId;
}
