package com.soa.tours.domain;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {
    private String tourId;
    private String tourName;
    private double price;
}
