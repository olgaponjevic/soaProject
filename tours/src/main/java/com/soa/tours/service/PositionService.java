package com.soa.tours.service;


import com.soa.tours.domain.TouristPosition;
import com.soa.tours.dto.UpsertPositionRequest;
import com.soa.tours.repo.PositionRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class PositionService {
    private final PositionRepository repo;

    public PositionService(PositionRepository repo) {
        this.repo = repo;
    }

    public TouristPosition upsert(UpsertPositionRequest req) {
        var existing = repo.findByTouristId(req.getTouristId()).orElse(null);

        if (existing == null) {
            existing = TouristPosition.builder()
                    .touristId(req.getTouristId())
                    .lat(req.getLat())
                    .lon(req.getLon())
                    .updatedAt(Instant.now())
                    .build();
        } else {
            existing.setLat(req.getLat());
            existing.setLon(req.getLon());
            existing.setUpdatedAt(Instant.now());
        }

        return repo.save(existing);
    }

    public TouristPosition get(long touristId) {
        return repo.findByTouristId(touristId)
                .orElseThrow(() -> new IllegalArgumentException("Position not set."));
    }
}
