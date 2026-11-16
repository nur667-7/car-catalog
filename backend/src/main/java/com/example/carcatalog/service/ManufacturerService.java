package com.example.carcatalog.service;

import com.example.carcatalog.dto.ManufacturerDTO;
import com.example.carcatalog.dto.ManufacturerRequest;
import com.example.carcatalog.entity.Manufacturer;
import com.example.carcatalog.exception.EntityConflictException;
import com.example.carcatalog.exception.ResourceNotFoundException;
import com.example.carcatalog.repository.ManufacturerRepository;
import com.example.carcatalog.repository.VehicleModelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ManufacturerService {

    private final ManufacturerRepository manufacturerRepository;
    private final VehicleModelRepository vehicleModelRepository;

    public ManufacturerService(ManufacturerRepository manufacturerRepository, VehicleModelRepository vehicleModelRepository) {
        this.manufacturerRepository = manufacturerRepository;
        this.vehicleModelRepository = vehicleModelRepository;
    }

    public List<ManufacturerDTO> getAllManufacturers(String search) {
        List<Manufacturer> list;
        if (search != null && !search.trim().isEmpty()) {
            list = manufacturerRepository.searchByNameOrCountry(search.trim());
        } else {
            list = manufacturerRepository.findAllByOrderByIdDesc();
        }

        return list.stream()
                .map(this::toDTO)
                .toList();
    }

    public ManufacturerDTO getManufacturerById(Long id) {
        Manufacturer manufacturer = manufacturerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Бренд с ID " + id + " не найден"));
        return toDTO(manufacturer);
    }

    @Transactional
    public ManufacturerDTO createManufacturer(ManufacturerRequest request) {
        if (manufacturerRepository.existsByNameIgnoreCase(request.name())) {
            throw new EntityConflictException("Бренд с таким названием уже существует: " + request.name());
        }

        Manufacturer manufacturer = new Manufacturer();
        manufacturer.setName(request.name().trim());
        manufacturer.setCountry(request.country().trim());
        manufacturer.setLogoUrl(request.logoUrl());

        Manufacturer saved = manufacturerRepository.save(manufacturer);
        return toDTO(saved);
    }

    @Transactional
    public ManufacturerDTO updateManufacturer(Long id, ManufacturerRequest request) {
        Manufacturer manufacturer = manufacturerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Бренд с ID " + id + " не найден"));

        if (manufacturerRepository.existsByNameIgnoreCaseAndIdNot(request.name(), id)) {
            throw new EntityConflictException("Другой бренд с таким названием уже существует: " + request.name());
        }

        manufacturer.setName(request.name().trim());
        manufacturer.setCountry(request.country().trim());
        if (request.logoUrl() != null && !request.logoUrl().isBlank()) {
            manufacturer.setLogoUrl(request.logoUrl());
        }

        Manufacturer updated = manufacturerRepository.save(manufacturer);
        return toDTO(updated);
    }

    @Transactional
    public void deleteManufacturer(Long id) {
        if (!manufacturerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Бренд с ID " + id + " не найден");
        }

        long modelCount = vehicleModelRepository.countByManufacturerId(id);
        if (modelCount > 0) {
            throw new EntityConflictException("Невозможно удалить бренд, так как к нему привязаны модели автомобилей.");
        }

        manufacturerRepository.deleteById(id);
    }

    private ManufacturerDTO toDTO(Manufacturer m) {
        long modelCount = vehicleModelRepository.countByManufacturerId(m.getId());
        return new ManufacturerDTO(
                m.getId(),
                m.getName(),
                m.getCountry(),
                m.getLogoUrl(),
                modelCount
        );
    }
}
