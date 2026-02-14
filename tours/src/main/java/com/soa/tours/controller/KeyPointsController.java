package com.soa.tours.controller;

import com.soa.tours.domain.Tour;
import com.soa.tours.dto.AddKeyPointRequest;
import com.soa.tours.service.TourService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tours/{tourId}/keypoints")
public class KeyPointsController {
    private final TourService service;

    public KeyPointsController(TourService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Tour> add(@PathVariable String tourId, @Valid @RequestBody AddKeyPointRequest req) {
        return ResponseEntity.ok(service.addKeyPoint(tourId, req));
    }

    // authorId ide kao query param (pošto request već ima authorId, ali da bude jasno ko menja)
    @PutMapping("/{index}")
    public ResponseEntity<Tour> update(
            @PathVariable String tourId,
            @PathVariable int index,
            @RequestParam long authorId,
            @Valid @RequestBody AddKeyPointRequest req
    ) {
        return ResponseEntity.ok(service.updateKeyPoint(tourId, authorId, index, req));
    }

    @DeleteMapping("/{index}")
    public ResponseEntity<Tour> delete(
            @PathVariable String tourId,
            @PathVariable int index,
            @RequestParam long authorId
    ) {
        return ResponseEntity.ok(service.deleteKeyPoint(tourId, authorId, index));
    }
}
