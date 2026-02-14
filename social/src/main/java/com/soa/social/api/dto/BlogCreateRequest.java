package com.soa.social.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record BlogCreateRequest(
        @Valid @NotNull ActorDto actor,
        @NotBlank String title,
        @NotBlank String description,
        List<String> imageUrls
) {}