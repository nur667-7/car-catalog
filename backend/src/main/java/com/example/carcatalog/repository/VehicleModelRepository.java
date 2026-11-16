package com.example.carcatalog.repository;

import com.example.carcatalog.entity.VehicleModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleModelRepository extends JpaRepository<VehicleModel, Long> {

    @Query("SELECT vm FROM VehicleModel vm JOIN FETCH vm.manufacturer ORDER BY vm.id DESC")
    List<VehicleModel> findAllWithManufacturer();

    @Query("SELECT vm FROM VehicleModel vm JOIN FETCH vm.manufacturer WHERE vm.manufacturer.id = :manufacturerId ORDER BY vm.name ASC")
    List<VehicleModel> findByManufacturerIdWithManufacturer(@Param("manufacturerId") Long manufacturerId);

    long countByManufacturerId(Long manufacturerId);
}
