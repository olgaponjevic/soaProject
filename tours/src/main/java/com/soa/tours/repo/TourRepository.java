package com.soa.tours.repo;

import java.util.List;

import com.soa.tours.domain.Tour;
import com.soa.tours.domain.TourStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TourRepository extends MongoRepository<Tour, String> {
    List<Tour> findByAuthorId(Long authorId);
    List<Tour> findByStatus(TourStatus status);
}
