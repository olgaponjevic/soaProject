package com.soa.tours.controller;

import java.util.List;

import com.soa.tours.domain.Tour;
import com.soa.tours.domain.TourStatus;
import com.soa.tours.dto.CreateTourRequest;
import com.soa.tours.dto.SetTransportTimesRequest;
import com.soa.tours.dto.UpdateTourRequest;
import com.soa.tours.service.CartService;
import com.soa.tours.service.TourService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tours")
public class ToursController {
    private final TourService service;
    private final CartService cartService;

    public ToursController(TourService service, CartService cartService) {
        this.service = service;
        this.cartService = cartService;
    }

    @PostMapping
    public ResponseEntity<Tour> create(@Valid @RequestBody CreateTourRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    // ?authorId=1
    @GetMapping("/mine")
    public ResponseEntity<List<Tour>> mine(@RequestParam long authorId) {
        return ResponseEntity.ok(service.myTours(authorId));
    }

    @GetMapping("/published")
    public ResponseEntity<List<Tour>> published() {
        return ResponseEntity.ok(service.publishedTours());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tour> get(@PathVariable String id, @RequestParam(required = false) Long touristId) {
        var t = service.get(id);

        if (t.getStatus() == TourStatus.PUBLISHED) {
            boolean purchased = false;
            if (touristId != null) purchased = cartService.isPurchased(touristId, id);

            if (!purchased && t.getKeyPoints() != null && t.getKeyPoints().size() > 1) {
                t.setKeyPoints(java.util.List.of(t.getKeyPoints().get(0)));
            }
        }

        return ResponseEntity.ok(t);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tour> updateBasics(@PathVariable String id, @Valid @RequestBody UpdateTourRequest req) {
        return ResponseEntity.ok(service.updateBasics(id, req));
    }

    @PostMapping("/{id}/transport-times")
    public ResponseEntity<Tour> setTransportTimes(@PathVariable String id, @Valid @RequestBody SetTransportTimesRequest req) {
        return ResponseEntity.ok(service.setTransportTimes(id, req));
    }

    // publish/archive/reactivate: prosledi authorId kao query param
    @PostMapping("/{id}/publish")
    public ResponseEntity<Tour> publish(@PathVariable String id, @RequestParam long authorId) {
        return ResponseEntity.ok(service.publish(id, authorId));
    }

    @PostMapping("/{id}/archive")
    public ResponseEntity<Tour> archive(@PathVariable String id, @RequestParam long authorId) {
        return ResponseEntity.ok(service.archive(id, authorId));
    }

    @PostMapping("/{id}/reactivate")
    public ResponseEntity<Tour> reactivate(@PathVariable String id, @RequestParam long authorId) {
        return ResponseEntity.ok(service.reactivate(id, authorId));
    }
}
