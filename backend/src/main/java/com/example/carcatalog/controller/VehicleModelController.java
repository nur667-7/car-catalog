package com.example.carcatalog.controller;

import com.example.carcatalog.dto.VehicleModelDTO;
import com.example.carcatalog.dto.VehicleModelRequest;
import com.example.carcatalog.service.VehicleModelService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/models")
@CrossOrigin(origins = "*")
public class VehicleModelController {

    private final VehicleModelService vehicleModelService;

    public VehicleModelController(VehicleModelService vehicleModelService) {
        this.vehicleModelService = vehicleModelService;
    }

    @GetMapping
    public ResponseEntity<List<VehicleModelDTO>> getAll(@RequestParam(required = false) Long manufacturerId) {
        if (manufacturerId != null && manufacturerId > 0) {
            return ResponseEntity.ok(vehicleModelService.getModelsByManufacturer(manufacturerId));
        }
        return ResponseEntity.ok(vehicleModelService.getAllModels());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleModelDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleModelService.getModelById(id));
    }

    @PostMapping
    public ResponseEntity<VehicleModelDTO> create(@Valid @RequestBody VehicleModelRequest request) {
        VehicleModelDTO created = vehicleModelService.createModel(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleModelDTO> update(@PathVariable Long id, @Valid @RequestBody VehicleModelRequest request) {
        return ResponseEntity.ok(vehicleModelService.updateModel(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        vehicleModelService.deleteModel(id);
        return ResponseEntity.noContent().build();
    }
}
