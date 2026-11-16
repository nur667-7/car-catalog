package com.example.carcatalog.controller;

import com.example.carcatalog.dto.ManufacturerDTO;
import com.example.carcatalog.dto.ManufacturerRequest;
import com.example.carcatalog.service.ManufacturerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manufacturers")
@CrossOrigin(origins = "*")
public class ManufacturerController {

    private final ManufacturerService manufacturerService;

    public ManufacturerController(ManufacturerService manufacturerService) {
        this.manufacturerService = manufacturerService;
    }

    @GetMapping
    public ResponseEntity<List<ManufacturerDTO>> getAll(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(manufacturerService.getAllManufacturers(search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ManufacturerDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(manufacturerService.getManufacturerById(id));
    }

    @PostMapping
    public ResponseEntity<ManufacturerDTO> create(@Valid @RequestBody ManufacturerRequest request) {
        ManufacturerDTO created = manufacturerService.createManufacturer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ManufacturerDTO> update(@PathVariable Long id, @Valid @RequestBody ManufacturerRequest request) {
        return ResponseEntity.ok(manufacturerService.updateManufacturer(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        manufacturerService.deleteManufacturer(id);
        return ResponseEntity.noContent().build();
    }
}
