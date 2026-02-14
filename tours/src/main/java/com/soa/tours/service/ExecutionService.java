package com.soa.tours.service;

import java.time.Instant;

import com.soa.tours.domain.CompletedKeyPoint;
import com.soa.tours.domain.ExecutionStatus;
import com.soa.tours.domain.TourExecution;
import com.soa.tours.domain.TourStatus;
import com.soa.tours.dto.CheckProximityRequest;
import com.soa.tours.dto.EndExecutionRequest;
import com.soa.tours.dto.StartExecutionRequest;
import com.soa.tours.repo.PositionRepository;
import com.soa.tours.repo.TourExecutionRepository;
import com.soa.tours.repo.TourRepository;
import com.soa.tours.util.GeoUtils;
import org.springframework.stereotype.Service;

@Service
public class ExecutionService {
    private final TourRepository tourRepo;
    private final TourExecutionRepository execRepo;
    private final PositionRepository posRepo;
    private final CartService cartService;

    public ExecutionService(TourRepository tourRepo, TourExecutionRepository execRepo, PositionRepository posRepo, CartService cartService) {
        this.tourRepo = tourRepo;
        this.execRepo = execRepo;
        this.posRepo = posRepo;
        this.cartService = cartService;
    }

    public TourExecution start(StartExecutionRequest req) {
        var tour = tourRepo.findById(req.getTourId()).orElseThrow(() -> new IllegalArgumentException("Tour not found."));

        if (!cartService.isPurchased(req.getTouristId(), req.getTourId())) {
            throw new IllegalStateException("Tour must be purchased before starting.");
        }

        if (tour.getStatus() == TourStatus.DRAFT) throw new IllegalStateException("Draft tour can't be started.");

        var pos = posRepo.findByTouristId(req.getTouristId()).orElse(null);

        var exec = TourExecution.builder()
                .touristId(req.getTouristId())
                .tourId(req.getTourId())
                .status(ExecutionStatus.ACTIVE)
                .startedAt(Instant.now())
                .lastActivityAt(Instant.now())
                .startLat(pos == null ? null : pos.getLat())
                .startLon(pos == null ? null : pos.getLon())
                .build();

        return execRepo.save(exec);
    }

    public TourExecution complete(String executionId, EndExecutionRequest req) {
        var exec = getOwnedActive(executionId, req.getTouristId());
        exec.setStatus(ExecutionStatus.COMPLETED);
        exec.setCompletedAt(Instant.now());
        exec.setLastActivityAt(Instant.now());
        return execRepo.save(exec);
    }

    public TourExecution abandon(String executionId, EndExecutionRequest req) {
        var exec = getOwnedActive(executionId, req.getTouristId());
        exec.setStatus(ExecutionStatus.ABANDONED);
        exec.setAbandonedAt(Instant.now());
        exec.setLastActivityAt(Instant.now());
        return execRepo.save(exec);
    }

    public TourExecution checkProximity(String executionId, CheckProximityRequest req) {
        var exec = getOwnedActive(executionId, req.getTouristId());

        var tour = tourRepo.findById(exec.getTourId()).orElseThrow(() -> new IllegalArgumentException("Tour not found."));
        var pos = posRepo.findByTouristId(req.getTouristId()).orElseThrow(() -> new IllegalArgumentException("Position not set."));

        double radiusM = (req.getRadiusMeters() == null ? 50.0 : req.getRadiusMeters());
        double radiusKm = radiusM / 1000.0;

        for (int i = 0; i < tour.getKeyPoints().size(); i++) {
            final int idx = i;
            boolean already = exec.getCompletedKeyPoints().stream().anyMatch(k -> k.getKeyPointIndex() == idx);
            if (already) continue;

            var kp = tour.getKeyPoints().get(i);
            double distKm = GeoUtils.haversineKm(pos.getLat(), pos.getLon(), kp.getLat(), kp.getLon());
            if (distKm <= radiusKm) {
                exec.getCompletedKeyPoints().add(CompletedKeyPoint.builder()
                        .keyPointIndex(i)
                        .reachedAt(Instant.now())
                        .build());
            }
        }

        exec.setLastActivityAt(Instant.now());
        return execRepo.save(exec);
    }

    private TourExecution getOwnedActive(String id, long touristId) {
        var exec = execRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Execution not found."));
        if (!exec.getTouristId().equals(touristId)) throw new IllegalArgumentException("Not your execution.");
        if (exec.getStatus() != ExecutionStatus.ACTIVE) throw new IllegalStateException("Execution is not active.");
        return exec;
    }
}
