package com.soa.tours.repo;

import java.util.Optional;

import com.soa.tours.domain.TouristPosition;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PositionRepository extends MongoRepository<TouristPosition, String> {
    Optional<TouristPosition> findByTouristId(Long touristId);
}
