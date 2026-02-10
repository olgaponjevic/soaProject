package com.soa.social.api.dto;

import java.time.Instant;
import java.util.List;

public record BlogResponse(
        String id,
        String title,
        String description,
        Instant createdAt,
        List<String> imageUrls,
        UserSummary author
) {}
