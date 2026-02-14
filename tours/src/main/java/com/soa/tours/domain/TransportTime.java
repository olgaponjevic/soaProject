package com.soa.tours.domain;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransportTime {
    @NotNull
    private TransportType type;

    @Min(1)
    private int minutes;
}
