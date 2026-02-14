package com.soa.social.api.dto;

import jakarta.validation.constraints.NotNull;

public record ActorDto(
        @NotNull Long userId,
        String username
) {}
