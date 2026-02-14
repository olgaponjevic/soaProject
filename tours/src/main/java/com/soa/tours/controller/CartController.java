package com.soa.tours.controller;

import com.soa.tours.domain.ShoppingCart;
import com.soa.tours.domain.TourPurchaseToken;
import com.soa.tours.dto.CartAddRequest;
import com.soa.tours.dto.CartRemoveRequest;
import com.soa.tours.dto.CheckoutRequest;
import com.soa.tours.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService service;

    public CartController(CartService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ShoppingCart> view(@RequestParam long touristId) {
        return ResponseEntity.ok(service.view(touristId));
    }

    @PostMapping("/add")
    public ResponseEntity<ShoppingCart> add(@Valid @RequestBody CartAddRequest req) {
        return ResponseEntity.ok(service.add(req));
    }

    @PostMapping("/remove")
    public ResponseEntity<ShoppingCart> remove(@Valid @RequestBody CartRemoveRequest req) {
        return ResponseEntity.ok(service.remove(req));
    }

    @PostMapping("/checkout")
    public ResponseEntity<List<TourPurchaseToken>> checkout(@Valid @RequestBody CheckoutRequest req) {
        return ResponseEntity.ok(service.checkout(req));
    }
}
