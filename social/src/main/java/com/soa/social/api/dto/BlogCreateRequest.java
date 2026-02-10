package com.soa.social.api.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record BlogCreateRequest(
        @NotBlank String title,
        @NotBlank String description,
        List<String> imageUrls
) {}
