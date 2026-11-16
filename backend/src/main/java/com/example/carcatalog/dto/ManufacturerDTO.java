package com.example.carcatalog.dto;

public record ManufacturerDTO(
        Long id,
        String name,
        String country,
        String logoUrl,
        long modelCount
) {}
