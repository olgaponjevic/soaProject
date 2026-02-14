package com.soa.tours.dto;

import java.util.List;

import com.soa.tours.domain.TransportTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SetTransportTimesRequest {
    @NotNull
    private Long authorId;

    @Valid
    @NotEmpty
    private List<TransportTime> items;
}
