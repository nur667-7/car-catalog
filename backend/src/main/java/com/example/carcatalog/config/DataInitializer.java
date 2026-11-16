package com.example.carcatalog.config;

import com.example.carcatalog.entity.Car;
import com.example.carcatalog.entity.Manufacturer;
import com.example.carcatalog.entity.VehicleModel;
import com.example.carcatalog.repository.CarRepository;
import com.example.carcatalog.repository.ManufacturerRepository;
import com.example.carcatalog.repository.VehicleModelRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(
            ManufacturerRepository manufacturerRepository,
            VehicleModelRepository vehicleModelRepository,
            CarRepository carRepository) {

        return args -> {
            if (manufacturerRepository.count() > 0) {
                return;
            }

            // 1. Manufacturers (Brands)
            Manufacturer toyota = new Manufacturer(null, "Toyota", "Japan", "/uploads/logos/toyota.png");
            Manufacturer subaru = new Manufacturer(null, "Subaru", "Japanese", "/uploads/logos/subaru.png");
            Manufacturer kia = new Manufacturer(null, "Kia", "South Korea", "/uploads/logos/kia.png");

            toyota = manufacturerRepository.save(toyota);
            subaru = manufacturerRepository.save(subaru);
            kia = manufacturerRepository.save(kia);

            // 2. Vehicle Models
            VehicleModel camry = new VehicleModel(null, "Camry", toyota, "Sedan");
            VehicleModel forster = new VehicleModel(null, "Forster", subaru, "Coupe");
            VehicleModel k5 = new VehicleModel(null, "K5", kia, "Sedan");

            camry = vehicleModelRepository.save(camry);
            forster = vehicleModelRepository.save(forster);
            k5 = vehicleModelRepository.save(k5);

            // 3. Cars
            Car carSubaru = new Car(
                    null,
                    forster,
                    2026,
                    new BigDecimal("12000000"),
                    "Grey",
                    "Продам",
                    "/uploads/cars/subaru_forester.jpg"
            );

            Car carKia = new Car(
                    null,
                    k5,
                    2025,
                    new BigDecimal("12000000"),
                    "Gray",
                    "Лучшая модель специально для вас!!! Дорогие Студенты!!",
                    "/uploads/cars/kia_k5.jpg"
            );

            Car carToyota = new Car(
                    null,
                    camry,
                    2020,
                    new BigDecimal("13000000"),
                    "White",
                    "Продам свою машину за хорошую оценку!",
                    "/uploads/cars/toyota_camry.jpg"
            );

            carRepository.save(carSubaru);
            carRepository.save(carKia);
            carRepository.save(carToyota);
        };
    }
}
