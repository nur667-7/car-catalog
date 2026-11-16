-- PostgreSQL Schema for Car Catalog Management System

CREATE TABLE IF NOT EXISTS manufacturers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    country VARCHAR(100) NOT NULL,
    logo_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS vehicle_models (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    manufacturer_id BIGINT NOT NULL,
    body_type VARCHAR(50) NOT NULL,
    CONSTRAINT fk_vehicle_model_manufacturer FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS cars (
    id BIGSERIAL PRIMARY KEY,
    model_id BIGINT NOT NULL,
    year INT NOT NULL,
    price NUMERIC(15, 2) NOT NULL,
    color VARCHAR(50) NOT NULL,
    description TEXT,
    photo_url VARCHAR(255),
    CONSTRAINT fk_car_model FOREIGN KEY (model_id) REFERENCES vehicle_models(id) ON DELETE RESTRICT
);
