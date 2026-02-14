package com.soa.social.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record FollowRequest(
        @Valid @NotNull ActorDto actor
) {}