package com.soa.tours.controller;

import com.soa.tours.domain.Tour;
import com.soa.tours.dto.AddReviewRequest;
import com.soa.tours.service.TourService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tours/{tourId}/reviews")
public class ReviewsController {
    private final TourService service;

    public ReviewsController(TourService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Tour> add(@PathVariable String tourId, @Valid @RequestBody AddReviewRequest req) {
        return ResponseEntity.ok(service.addReview(tourId, req));
    }
}
