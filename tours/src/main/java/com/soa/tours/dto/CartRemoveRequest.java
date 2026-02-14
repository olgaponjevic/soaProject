package com.soa.tours.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartRemoveRequest {
    @NotNull
    private Long touristId;

    @NotNull
    private String tourId;
}
