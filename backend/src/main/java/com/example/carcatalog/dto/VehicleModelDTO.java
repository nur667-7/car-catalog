package com.example.carcatalog.dto;

public record VehicleModelDTO(
        Long id,
        String name,
        Long manufacturerId,
        String manufacturerName,
        String bodyType,
        long carCount
) {}
