package com.example.carcatalog.controller;

import com.example.carcatalog.dto.CarDTO;
import com.example.carcatalog.dto.CarRequest;
import com.example.carcatalog.service.CarService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "*")
public class CarController {

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping
    public ResponseEntity<List<CarDTO>> getAll(@RequestParam(required = false) Long manufacturerId) {
        return ResponseEntity.ok(carService.getAllCars(manufacturerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getCarById(id));
    }

    @PostMapping
    public ResponseEntity<CarDTO> create(@Valid @RequestBody CarRequest request) {
        CarDTO created = carService.createCar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarDTO> update(@PathVariable Long id, @Valid @RequestBody CarRequest request) {
        return ResponseEntity.ok(carService.updateCar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.noContent().build();
    }
}
