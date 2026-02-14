package com.soa.tours.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KeyPoint {
    @NotBlank
    private String name;

    private String description;
    private String imageUrl;

    @NotNull
    private Double lat;

    @NotNull
    private Double lon;
}
