package com.example.carcatalog.dto;

import java.math.BigDecimal;

public record CarDTO(
        Long id,
        Long modelId,
        String modelName,
        Long manufacturerId,
        String manufacturerName,
        Integer year,
        BigDecimal price,
        String color,
        String description,
        String photoUrl,
        String bodyType
) {}
