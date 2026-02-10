package com.soa.social.core;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class IdentityResolver {
    public HeaderIdentity requireIdentity(HttpServletRequest request) {
        var idHeader = request.getHeader("X-User-Id");
        if (idHeader == null || idHeader.isBlank()) {
            throw new BadRequestException("Missing header X-User-Id.");
        }
        try {
            long userId = Long.parseLong(idHeader);
            String username = request.getHeader("X-Username"); // optional
            return new HeaderIdentity(userId, username);
        } catch (NumberFormatException e) {
            throw new BadRequestException("Invalid X-User-Id.");
        }
    }
}
