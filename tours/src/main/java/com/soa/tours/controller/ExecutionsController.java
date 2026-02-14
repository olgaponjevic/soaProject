package com.soa.tours.controller;

import com.soa.tours.domain.TourExecution;
import com.soa.tours.dto.CheckProximityRequest;
import com.soa.tours.dto.EndExecutionRequest;
import com.soa.tours.dto.StartExecutionRequest;
import com.soa.tours.service.ExecutionService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/executions")
public class ExecutionsController {
    private final ExecutionService service;

    public ExecutionsController(ExecutionService service) {
        this.service = service;
    }

    @PostMapping("/start")
    public ResponseEntity<TourExecution> start(@Valid @RequestBody StartExecutionRequest req) {
        return ResponseEntity.ok(service.start(req));
    }

    @PostMapping("/{executionId}/complete")
    public ResponseEntity<TourExecution> complete(@PathVariable String executionId, @Valid @RequestBody EndExecutionRequest req) {
        return ResponseEntity.ok(service.complete(executionId, req));
    }

    @PostMapping("/{executionId}/abandon")
    public ResponseEntity<TourExecution> abandon(@PathVariable String executionId, @Valid @RequestBody EndExecutionRequest req) {
        return ResponseEntity.ok(service.abandon(executionId, req));
    }

    @PostMapping("/{executionId}/check")
    public ResponseEntity<TourExecution> check(@PathVariable String executionId, @Valid @RequestBody CheckProximityRequest req) {
        return ResponseEntity.ok(service.checkProximity(executionId, req));
    }
}
