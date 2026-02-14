package com.soa.tours.service;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.List;

import com.soa.tours.domain.*;
import com.soa.tours.dto.*;
import com.soa.tours.util.*;
import com.soa.tours.repo.*;
import org.springframework.stereotype.Service;

@Service
public class TourService {
    private final TourRepository repo;

    public TourService(TourRepository repo) {
        this.repo = repo;
    }

    public Tour create(CreateTourRequest req) {
        var tour = Tour.builder()
                .authorId(req.getAuthorId())
                .authorUsername(req.getAuthorUsername())
                .name(req.getName())
                .description(req.getDescription())
                .difficulty(req.getDifficulty())
                .tags(req.getTags() == null ? List.of() : req.getTags())
                .price(0.0)
                .status(TourStatus.DRAFT)
                .lengthKm(0.0)
                .createdAt(Instant.now())
                .build();
        return repo.save(tour);
    }

    public List<Tour> myTours(long authorId) {
        return repo.findByAuthorId(authorId);
    }

    public List<Tour> publishedTours() {
        return repo.findByStatus(TourStatus.PUBLISHED);
    }

    public Tour get(String id) {
        return repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Tour not found."));
    }

    public Tour updateBasics(String id, UpdateTourRequest req) {
        var tour = get(id);
        requireAuthor(tour, req.getAuthorId());
        if (tour.getStatus() == TourStatus.ARCHIVED) {
            throw new IllegalStateException("Archived tour can't be edited.");
        }

        tour.setName(req.getName());
        tour.setDescription(req.getDescription());
        tour.setDifficulty(req.getDifficulty());
        tour.setTags(req.getTags() == null ? List.of() : req.getTags());
        if (req.getPrice() != null) tour.setPrice(req.getPrice());

        return repo.save(tour);
    }

    public Tour addKeyPoint(String id, AddKeyPointRequest req) {
        var tour = get(id);
        requireAuthor(tour, req.getAuthorId());
        if (tour.getStatus() == TourStatus.ARCHIVED) {
            throw new IllegalStateException("Archived tour can't be edited.");
        }

        var kp = KeyPoint.builder()
                .name(req.getName())
                .description(req.getDescription())
                .imageUrl(req.getImageUrl())
                .lat(req.getLat())
                .lon(req.getLon())
                .build();

        if (!tour.getKeyPoints().isEmpty()) {
            var prev = tour.getKeyPoints().get(tour.getKeyPoints().size() - 1);
            double addKm = GeoUtils.haversineKm(prev.getLat(), prev.getLon(), kp.getLat(), kp.getLon());
            tour.setLengthKm(round2(tour.getLengthKm() + addKm));
        }

        tour.getKeyPoints().add(kp);
        return repo.save(tour);
    }

    public Tour updateKeyPoint(String id, long authorId, int index, AddKeyPointRequest req) {
        var tour = get(id);
        requireAuthor(tour, authorId);
        if (index < 0 || index >= tour.getKeyPoints().size()) {
            throw new IllegalArgumentException("Invalid key point index.");
        }

        tour.getKeyPoints().set(index, KeyPoint.builder()
                .name(req.getName())
                .description(req.getDescription())
                .imageUrl(req.getImageUrl())
                .lat(req.getLat())
                .lon(req.getLon())
                .build());

        tour.setLengthKm(round2(recalculateLength(tour)));
        return repo.save(tour);
    }

    public Tour deleteKeyPoint(String id, long authorId, int index) {
        var tour = get(id);
        requireAuthor(tour, authorId);
        if (index < 0 || index >= tour.getKeyPoints().size()) {
            throw new IllegalArgumentException("Invalid key point index.");
        }

        tour.getKeyPoints().remove(index);
        tour.setLengthKm(round2(recalculateLength(tour)));
        return repo.save(tour);
    }

    public Tour setTransportTimes(String id, SetTransportTimesRequest req) {
        var tour = get(id);
        requireAuthor(tour, req.getAuthorId());
        tour.setTransportTimes(req.getItems());
        return repo.save(tour);
    }

    public Tour publish(String id, long authorId) {
        var tour = get(id);
        requireAuthor(tour, authorId);

        if (tour.getKeyPoints() == null || tour.getKeyPoints().size() < 2)
            throw new IllegalStateException("Need at least 2 key points.");

        if (tour.getTransportTimes() == null || tour.getTransportTimes().isEmpty())
            throw new IllegalStateException("Add at least 1 transport time.");

        tour.setStatus(TourStatus.PUBLISHED);
        tour.setPublishedAt(Instant.now());
        tour.setArchivedAt(null);
        return repo.save(tour);
    }

    public Tour archive(String id, long authorId) {
        var tour = get(id);
        requireAuthor(tour, authorId);
        if (tour.getStatus() != TourStatus.PUBLISHED)
            throw new IllegalStateException("Only published tours can be archived.");

        tour.setStatus(TourStatus.ARCHIVED);
        tour.setArchivedAt(Instant.now());
        return repo.save(tour);
    }

    public Tour reactivate(String id, long authorId) {
        var tour = get(id);
        requireAuthor(tour, authorId);
        if (tour.getStatus() != TourStatus.ARCHIVED)
            throw new IllegalStateException("Only archived tours can be reactivated.");

        tour.setStatus(TourStatus.PUBLISHED);
        tour.setArchivedAt(null);
        return repo.save(tour);
    }

    public Tour addReview(String id, AddReviewRequest req) {
        var tour = get(id);
        if (tour.getStatus() != TourStatus.PUBLISHED)
            throw new IllegalStateException("You can review only published tours.");

        var review = Review.builder()
                .touristId(req.getTouristId())
                .touristUsername(req.getTouristUsername())
                .rating(req.getRating())
                .comment(req.getComment())
                .visitedOn(req.getVisitedOn())
                .imageUrls(req.getImageUrls())
                .createdAt(Instant.now())
                .build();

        tour.getReviews().add(review);
        return repo.save(tour);
    }

    private void requireAuthor(Tour tour, long authorId) {
        if (tour.getAuthorId() == null || tour.getAuthorId() != authorId) {
            throw new IllegalArgumentException("Not your tour (authorId mismatch).");
        }
    }

    private double recalculateLength(Tour tour) {
        var pts = tour.getKeyPoints();
        if (pts == null || pts.size() < 2) return 0.0;

        double sum = 0.0;
        for (int i = 1; i < pts.size(); i++) {
            var a = pts.get(i - 1);
            var b = pts.get(i);
            sum += GeoUtils.haversineKm(a.getLat(), a.getLon(), b.getLat(), b.getLon());
        }
        return sum;
    }

    private double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}
