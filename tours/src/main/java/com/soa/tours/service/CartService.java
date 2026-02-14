package com.soa.tours.service;

import java.time.Instant;

import com.soa.tours.domain.*;
import com.soa.tours.dto.*;
import com.soa.tours.repo.*;
import org.springframework.stereotype.Service;

@Service
public class CartService {
    private final ShoppingCartRepository cartRepo;
    private final PurchaseTokenRepository tokenRepo;
    private final TourRepository tourRepo;

    public CartService(ShoppingCartRepository cartRepo, PurchaseTokenRepository tokenRepo, TourRepository tourRepo) {
        this.cartRepo = cartRepo;
        this.tokenRepo = tokenRepo;
        this.tourRepo = tourRepo;
    }

    public ShoppingCart getOrCreate(long touristId) {
        return cartRepo.findByTouristId(touristId).orElseGet(() -> cartRepo.save(
                ShoppingCart.builder().touristId(touristId).total(0).build()
        ));
    }

    public ShoppingCart add(CartAddRequest req) {
        var cart = getOrCreate(req.getTouristId());
        var tour = tourRepo.findById(req.getTourId())
                .orElseThrow(() -> new IllegalArgumentException("Tour not found."));

        if (tour.getStatus() != TourStatus.PUBLISHED) {
            // draft + archived can't be bought
            throw new IllegalStateException("Only published tours can be added to cart.");
        }

        boolean already = cart.getItems().stream().anyMatch(i -> i.getTourId().equals(req.getTourId()));
        if (!already) {
            cart.getItems().add(OrderItem.builder()
                    .tourId(tour.getId())
                    .tourName(tour.getName())
                    .price(tour.getPrice())
                    .build());
            recalc(cart);
            cart = cartRepo.save(cart);
        }
        return cart;
    }

    public ShoppingCart remove(CartRemoveRequest req) {
        var cart = getOrCreate(req.getTouristId());
        cart.getItems().removeIf(i -> i.getTourId().equals(req.getTourId()));
        recalc(cart);
        return cartRepo.save(cart);
    }

    public ShoppingCart view(long touristId) {
        return getOrCreate(touristId);
    }

    public java.util.List<TourPurchaseToken> checkout(CheckoutRequest req) {
        var cart = getOrCreate(req.getTouristId());
        if (cart.getItems().isEmpty()) throw new IllegalStateException("Cart is empty.");

        var tokens = new java.util.ArrayList<TourPurchaseToken>();
        for (var item : cart.getItems()) {
            // skip if already purchased
            var existing = tokenRepo.findByTouristIdAndTourId(req.getTouristId(), item.getTourId()).orElse(null);
            if (existing != null) {
                tokens.add(existing);
                continue;
            }

            // additional safety: can't buy archived if it changed after add
            var tour = tourRepo.findById(item.getTourId()).orElseThrow(() -> new IllegalArgumentException("Tour not found."));
            if (tour.getStatus() != TourStatus.PUBLISHED) throw new IllegalStateException("Some tour is not purchasable now.");

            tokens.add(tokenRepo.save(TourPurchaseToken.builder()
                    .touristId(req.getTouristId())
                    .tourId(item.getTourId())
                    .createdAt(Instant.now())
                    .build()));
        }

        cart.getItems().clear();
        cart.setTotal(0);
        cartRepo.save(cart);

        return tokens;
    }

    public boolean isPurchased(long touristId, String tourId) {
        return tokenRepo.findByTouristIdAndTourId(touristId, tourId).isPresent();
    }

    private void recalc(ShoppingCart cart) {
        double sum = 0;
        for (var i : cart.getItems()) sum += i.getPrice();
        cart.setTotal(Math.round(sum * 100.0) / 100.0);
    }
}
