package com.example.carcatalog.repository;

import com.example.carcatalog.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {

    @Query("SELECT c FROM Car c JOIN FETCH c.model m JOIN FETCH m.manufacturer ORDER BY c.id DESC")
    List<Car> findAllWithDetails();

    @Query("SELECT c FROM Car c JOIN FETCH c.model m JOIN FETCH m.manufacturer WHERE m.manufacturer.id = :manufacturerId ORDER BY c.id DESC")
    List<Car> findByManufacturerIdWithDetails(@Param("manufacturerId") Long manufacturerId);

    @Query("SELECT c FROM Car c JOIN FETCH c.model m JOIN FETCH m.manufacturer WHERE c.id = :id")
    Optional<Car> findByIdWithDetails(@Param("id") Long id);

    long countByModelId(Long modelId);
}
