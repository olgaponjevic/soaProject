package com.soa.tours.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddReviewRequest {
    @NotNull
    private Long touristId;

    @NotBlank
    private String touristUsername;

    @Min(1) @Max(5)
    private int rating;

    private String comment;

    @NotNull
    private LocalDate visitedOn;

    private List<String> imageUrls;
}
