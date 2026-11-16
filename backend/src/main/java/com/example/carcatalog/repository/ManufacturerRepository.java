package com.example.carcatalog.repository;

import com.example.carcatalog.entity.Manufacturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ManufacturerRepository extends JpaRepository<Manufacturer, Long> {

    @Query("SELECT m FROM Manufacturer m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(m.country) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY m.id DESC")
    List<Manufacturer> searchByNameOrCountry(@Param("query") String query);

    List<Manufacturer> findAllByOrderByIdDesc();

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
