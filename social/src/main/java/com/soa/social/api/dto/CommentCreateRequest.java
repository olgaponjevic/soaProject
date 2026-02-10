package com.soa.social.api.dto;

import jakarta.validation.constraints.NotBlank;

public record CommentCreateRequest(@NotBlank String text) {}
