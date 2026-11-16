package com.example.carcatalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ManufacturerRequest(
        @NotBlank(message = "Название бренда обязательно")
        @Size(max = 100, message = "Название бренда не должно превышать 100 символов")
        String name,

        @NotBlank(message = "Страна обязательна")
        @Size(max = 100, message = "Название страны не должно превышать 100 символов")
        String country,

        String logoUrl
) {}
