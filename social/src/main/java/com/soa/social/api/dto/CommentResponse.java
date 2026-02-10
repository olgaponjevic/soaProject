package com.soa.social.api.dto;

import java.time.Instant;

public record CommentResponse(
        String id,
        String text,
        Instant createdAt,
        Instant lastEditedAt,
        UserSummary author
) {}
