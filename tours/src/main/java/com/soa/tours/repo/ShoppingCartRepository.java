package com.soa.tours.repo;

import java.util.Optional;

import com.soa.tours.domain.ShoppingCart;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ShoppingCartRepository extends MongoRepository<ShoppingCart, String> {
    Optional<ShoppingCart> findByTouristId(Long touristId);
}
