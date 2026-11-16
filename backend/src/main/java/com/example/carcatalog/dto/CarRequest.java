package com.example.carcatalog.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record CarRequest(
        @NotNull(message = "Выберите модель")
        Long modelId,

        @NotNull(message = "Укажите год выпуска")
        @Min(value = 1900, message = "Год выпуска должен быть не ранее 1900")
        @Max(value = 2100, message = "Год выпуска не может быть в далеком будущем")
        Integer year,

        @NotNull(message = "Укажите стоимость")
        @DecimalMin(value = "0.0", inclusive = false, message = "Стоимость должна быть больше 0")
        BigDecimal price,

        @NotBlank(message = "Укажите цвет автомобиля")
        String color,

        String description,

        String photoUrl
) {}
