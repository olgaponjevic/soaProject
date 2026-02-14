package com.soa.social.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CommentCreateRequest(
        @Valid @NotNull ActorDto actor,
        @NotBlank String text
) {}