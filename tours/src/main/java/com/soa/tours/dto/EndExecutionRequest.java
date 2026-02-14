package com.soa.tours.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EndExecutionRequest {
    @NotNull
    private Long touristId;
}
