package com.example.carcatalog.service;

import com.example.carcatalog.dto.VehicleModelDTO;
import com.example.carcatalog.dto.VehicleModelRequest;
import com.example.carcatalog.entity.Manufacturer;
import com.example.carcatalog.entity.VehicleModel;
import com.example.carcatalog.exception.EntityConflictException;
import com.example.carcatalog.exception.ResourceNotFoundException;
import com.example.carcatalog.repository.CarRepository;
import com.example.carcatalog.repository.ManufacturerRepository;
import com.example.carcatalog.repository.VehicleModelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class VehicleModelService {

    private final VehicleModelRepository vehicleModelRepository;
    private final ManufacturerRepository manufacturerRepository;
    private final CarRepository carRepository;

    public VehicleModelService(VehicleModelRepository vehicleModelRepository,
                               ManufacturerRepository manufacturerRepository,
                               CarRepository carRepository) {
        this.vehicleModelRepository = vehicleModelRepository;
        this.manufacturerRepository = manufacturerRepository;
        this.carRepository = carRepository;
    }

    public List<VehicleModelDTO> getAllModels() {
        return vehicleModelRepository.findAllWithManufacturer()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public List<VehicleModelDTO> getModelsByManufacturer(Long manufacturerId) {
        return vehicleModelRepository.findByManufacturerIdWithManufacturer(manufacturerId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public VehicleModelDTO getModelById(Long id) {
        VehicleModel model = vehicleModelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Модель с ID " + id + " не найдена"));
        return toDTO(model);
    }

    @Transactional
    public VehicleModelDTO createModel(VehicleModelRequest request) {
        Manufacturer manufacturer = manufacturerRepository.findById(request.manufacturerId())
                .orElseThrow(() -> new ResourceNotFoundException("Бренд с ID " + request.manufacturerId() + " не найден"));

        VehicleModel model = new VehicleModel();
        model.setName(request.name().trim());
        model.setManufacturer(manufacturer);
        model.setBodyType(request.bodyType().trim());

        VehicleModel saved = vehicleModelRepository.save(model);
        return toDTO(saved);
    }

    @Transactional
    public VehicleModelDTO updateModel(Long id, VehicleModelRequest request) {
        VehicleModel model = vehicleModelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Модель с ID " + id + " не найдена"));

        Manufacturer manufacturer = manufacturerRepository.findById(request.manufacturerId())
                .orElseThrow(() -> new ResourceNotFoundException("Бренд с ID " + request.manufacturerId() + " не найден"));

        model.setName(request.name().trim());
        model.setManufacturer(manufacturer);
        model.setBodyType(request.bodyType().trim());

        VehicleModel updated = vehicleModelRepository.save(model);
        return toDTO(updated);
    }

    @Transactional
    public void deleteModel(Long id) {
        if (!vehicleModelRepository.existsById(id)) {
            throw new ResourceNotFoundException("Модель с ID " + id + " не найдена");
        }

        long carCount = carRepository.countByModelId(id);
        if (carCount > 0) {
            throw new EntityConflictException("Невозможно удалить модель, так как к ней привязаны автомобили в каталоге.");
        }

        vehicleModelRepository.deleteById(id);
    }

    private VehicleModelDTO toDTO(VehicleModel vm) {
        long carCount = carRepository.countByModelId(vm.getId());
        return new VehicleModelDTO(
                vm.getId(),
                vm.getName(),
                vm.getManufacturer().getId(),
                vm.getManufacturer().getName(),
                vm.getBodyType(),
                carCount
        );
    }
}
