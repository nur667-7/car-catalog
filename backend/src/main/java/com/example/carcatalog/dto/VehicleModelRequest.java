package com.example.carcatalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record VehicleModelRequest(
        @NotNull(message = "Выберите бренд")
        Long manufacturerId,

        @NotBlank(message = "Название модели обязательно")
        @Size(max = 100, message = "Название модели не должно превышать 100 символов")
        String name,

        @NotBlank(message = "Выберите тип кузова")
        String bodyType
) {}
