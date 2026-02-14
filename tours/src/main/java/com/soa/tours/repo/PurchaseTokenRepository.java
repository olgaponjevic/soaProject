package com.soa.tours.repo;

import java.util.List;
import java.util.Optional;

import com.soa.tours.domain.TourPurchaseToken;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PurchaseTokenRepository extends MongoRepository<TourPurchaseToken, String> {
    Optional<TourPurchaseToken> findByTouristIdAndTourId(Long touristId, String tourId);
    List<TourPurchaseToken> findByTouristId(Long touristId);
}
