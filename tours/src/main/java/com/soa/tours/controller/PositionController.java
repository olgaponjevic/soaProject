package com.soa.tours.controller;

import com.soa.tours.domain.TouristPosition;
import com.soa.tours.dto.UpsertPositionRequest;
import com.soa.tours.service.PositionService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/position")
public class PositionController {
    private final PositionService service;

    public PositionController(PositionService service) {
        this.service = service;
    }

    @PutMapping
    public ResponseEntity<TouristPosition> upsert(@Valid @RequestBody UpsertPositionRequest req) {
        return ResponseEntity.ok(service.upsert(req));
    }

    @GetMapping
    public ResponseEntity<TouristPosition> get(@RequestParam long touristId) {
        return ResponseEntity.ok(service.get(touristId));
    }
}
