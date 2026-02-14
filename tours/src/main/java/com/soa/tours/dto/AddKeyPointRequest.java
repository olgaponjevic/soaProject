package com.soa.tours.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddKeyPointRequest {
    @NotNull
    private Long authorId;

    @NotBlank
    private String name;

    private String description;
    private String imageUrl;

    @NotNull
    private Double lat;

    @NotNull
    private Double lon;
}
