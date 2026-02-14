package com.soa.tours.repo;


import java.util.List;

import com.soa.tours.domain.ExecutionStatus;
import com.soa.tours.domain.TourExecution;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TourExecutionRepository extends MongoRepository<TourExecution, String> {
    List<TourExecution> findByTouristId(Long touristId);
    List<TourExecution> findByTouristIdAndStatus(Long touristId, ExecutionStatus status);
}
