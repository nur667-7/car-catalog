package com.example.carcatalog.service;

import com.example.carcatalog.dto.CarDTO;
import com.example.carcatalog.dto.CarRequest;
import com.example.carcatalog.entity.Car;
import com.example.carcatalog.entity.VehicleModel;
import com.example.carcatalog.exception.ResourceNotFoundException;
import com.example.carcatalog.repository.CarRepository;
import com.example.carcatalog.repository.VehicleModelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CarService {

    private final CarRepository carRepository;
    private final VehicleModelRepository vehicleModelRepository;

    public CarService(CarRepository carRepository, VehicleModelRepository vehicleModelRepository) {
        this.carRepository = carRepository;
        this.vehicleModelRepository = vehicleModelRepository;
    }

    public List<CarDTO> getAllCars(Long manufacturerId) {
        List<Car> cars;
        if (manufacturerId != null && manufacturerId > 0) {
            cars = carRepository.findByManufacturerIdWithDetails(manufacturerId);
        } else {
            cars = carRepository.findAllWithDetails();
        }

        return cars.stream()
                .map(this::toDTO)
                .toList();
    }

    public CarDTO getCarById(Long id) {
        Car car = carRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Автомобиль с ID " + id + " не найден"));
        return toDTO(car);
    }

    @Transactional
    public CarDTO createCar(CarRequest request) {
        VehicleModel model = vehicleModelRepository.findById(request.modelId())
                .orElseThrow(() -> new ResourceNotFoundException("Модель с ID " + request.modelId() + " не найдена"));

        Car car = new Car();
        car.setModel(model);
        car.setYear(request.year());
        car.setPrice(request.price());
        car.setColor(request.color().trim());
        car.setDescription(request.description() != null ? request.description().trim() : "");
        car.setPhotoUrl(request.photoUrl());

        Car saved = carRepository.save(car);
        return toDTO(saved);
    }

    @Transactional
    public CarDTO updateCar(Long id, CarRequest request) {
        Car car = carRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Автомобиль с ID " + id + " не найден"));

        VehicleModel model = vehicleModelRepository.findById(request.modelId())
                .orElseThrow(() -> new ResourceNotFoundException("Модель с ID " + request.modelId() + " не найдена"));

        car.setModel(model);
        car.setYear(request.year());
        car.setPrice(request.price());
        car.setColor(request.color().trim());
        car.setDescription(request.description() != null ? request.description().trim() : "");
        if (request.photoUrl() != null && !request.photoUrl().isBlank()) {
            car.setPhotoUrl(request.photoUrl());
        }

        Car updated = carRepository.save(car);
        return toDTO(updated);
    }

    @Transactional
    public void deleteCar(Long id) {
        if (!carRepository.existsById(id)) {
            throw new ResourceNotFoundException("Автомобиль с ID " + id + " не найден");
        }
        carRepository.deleteById(id);
    }

    private CarDTO toDTO(Car c) {
        VehicleModel vm = c.getModel();
        return new CarDTO(
                c.getId(),
                vm.getId(),
                vm.getName(),
                vm.getManufacturer().getId(),
                vm.getManufacturer().getName(),
                c.getYear(),
                c.getPrice(),
                c.getColor(),
                c.getDescription(),
                c.getPhotoUrl(),
                vm.getBodyType()
        );
    }
}
