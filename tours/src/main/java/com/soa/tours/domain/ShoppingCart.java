package com.soa.tours.domain;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document("shopping_carts")
public class ShoppingCart {
    @Id
    private String id; // Mongo id

    private Long touristId;

    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    private double total;
}
