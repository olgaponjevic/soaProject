package com.soa.tours.dto;

import java.util.List;

import com.soa.tours.domain.Difficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateTourRequest {
    @NotNull
    private Long authorId;

    @NotBlank
    private String name;

    private String description;

    @NotNull
    private Difficulty difficulty;

    private List<String> tags;

    private Double price;
}
