# Laboratory Work 9: Car Catalog Management System

**Assignment Type:** Individual Project  
**Technologies:** Java 21, Spring Boot 3.3.5, React JS (Vite), PostgreSQL / Relational Database, Tailwind CSS, REST API

---

## 1. Project Overview

The **Car Catalog Management System** is a full-stack web application designed for comprehensive management of automobile manufacturers (brands), vehicle models, and automobile listings with multimedia uploads (brand logos and vehicle photographs).

The user interface and interaction flows reproduce the reference demonstration video:
- Emerald green navigation bar (`#0e7a5a`) with brand header and active navigation pills.
- Dedicated pages for **Автомобили** (Cars), **Бренды** (Brands), and **Модели** (Models).
- Modal forms with drag-and-drop / file-picker image upload areas and live previews.
- Relational database integrity enforcement (e.g., prevention of brand deletion when models are attached, returning HTTP 409 and user-friendly error banners).
- Filter controls by brand and real-time search by brand name or country.
- Automobile cards with floating brand badges, specifications chips, and formatted currency in Kazakhstani Tenge (`₸`).

---

## 2. System Architecture

The application adheres to clean layered architecture:

```
┌──────────────────────────────────────────────────────────────┐
│                    React JS Frontend (Vite)                  │
│       Pages: CarsPage, BrandsPage, ModelsPage                │
│       Components: Navbar, CarCard, Modals, Alert, EmptyState │
└──────────────────────────────┬───────────────────────────────┘
                               │ REST API (JSON / Multipart)
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                 Spring Boot 3.x Backend                      │
│                                                              │
│  [Controller Layer]                                          │
│   ├── ManufacturerController                                 │
│   ├── VehicleModelController                                 │
│   ├── CarController                                          │
│   └── FileController                                         │
│                                                              │
│  [Service Layer]                                             │
│   ├── ManufacturerService (@Transactional)                   │
│   ├── VehicleModelService (@Transactional)                   │
│   ├── CarService (@Transactional)                            │
│   └── FileStorageService                                     │
│                                                              │
│  [Repository Layer (Spring Data JPA)]                        │
│   ├── ManufacturerRepository                                 │
│   ├── VehicleModelRepository                                 │
│   └── CarRepository                                          │
│                                                              │
│  [Config Layer]                                              │
│   ├── CorsConfig (Cross-Origin Resource Sharing)             │
│   ├── WebMvcConfig (Static /uploads/** mapping)              │
│   └── DataInitializer (Seed Data from Demo Video)            │
└──────────────────────────────┬───────────────────────────────┘
                               │ JDBC / Hibernate ORM
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                     Relational Database                      │
│   Primary: PostgreSQL 18 (application-postgres.properties)  │
│   Embedded / Standalone fallback: Persistent SQL file DB     │
│   Tables: manufacturers, vehicle_models, cars                │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema & Relationships

### Relational Entities:
1. **`manufacturers`**:
   - `id` (BIGINT, PRIMARY KEY, Auto Increment)
   - `name` (VARCHAR(100), UNIQUE, NOT NULL)
   - `country` (VARCHAR(100), NOT NULL)
   - `logo_url` (VARCHAR(255))

2. **`vehicle_models`**:
   - `id` (BIGINT, PRIMARY KEY, Auto Increment)
   - `name` (VARCHAR(100), NOT NULL)
   - `manufacturer_id` (BIGINT, NOT NULL, FOREIGN KEY -> `manufacturers(id)` ON DELETE RESTRICT)
   - `body_type` (VARCHAR(50), NOT NULL)

3. **`cars`**:
   - `id` (BIGINT, PRIMARY KEY, Auto Increment)
   - `model_id` (BIGINT, NOT NULL, FOREIGN KEY -> `vehicle_models(id)` ON DELETE RESTRICT)
   - `release_year` (INT, NOT NULL)
   - `price` (NUMERIC(15, 2), NOT NULL)
   - `color` (VARCHAR(50), NOT NULL)
   - `description` (TEXT)
   - `photo_url` (VARCHAR(255))

---

## 4. Key Functional Features

1. **Manufacturer (Brand) Management:**
   - Full CRUD operations (Create, Read, Update, Delete).
   - Brand logo image uploads (PNG, JPG, WEBP up to 5 MB).
   - Search by brand name or country with live result counter (`Найдено: X`).
   - Cascade safety: preventing deletion if dependent models exist (returning HTTP 409).

2. **Vehicle Model Management:**
   - Full CRUD operations.
   - Relationship to parent manufacturer.
   - Body type selection: *Sedan*, *SUV*, *Hatchback*, *Coupe*, *Wagon*, *Pickup*.

3. **Car Catalog Management:**
   - Full CRUD operations.
   - Brand dropdown with cascaded dynamic model selection.
   - Year, formatted price in Tenge (`₸`), color chip, and description.
   - Vehicle photograph upload and instant preview.
   - Filter listings by manufacturer or show all.
   - Friendly empty state when no vehicles match the selected filter.

---

## 5. REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/manufacturers` | List all brands (optional `?search=...`) |
| `GET` | `/api/manufacturers/{id}` | Get brand details by ID |
| `POST` | `/api/manufacturers` | Create a new brand |
| `PUT` | `/api/manufacturers/{id}` | Update an existing brand |
| `DELETE` | `/api/manufacturers/{id}` | Delete brand (restricted if models exist) |
| `GET` | `/api/models` | List all models (optional `?manufacturerId=...`) |
| `GET` | `/api/models/{id}` | Get model by ID |
| `POST` | `/api/models` | Create a new vehicle model |
| `PUT` | `/api/models/{id}` | Update an existing vehicle model |
| `DELETE` | `/api/models/{id}` | Delete model |
| `GET` | `/api/cars` | List cars (optional `?manufacturerId=...`) |
| `GET` | `/api/cars/{id}` | Get car details by ID |
| `POST` | `/api/cars` | Add a new car listing |
| `PUT` | `/api/cars/{id}` | Update car listing |
| `DELETE` | `/api/cars/{id}` | Delete car listing |
| `POST` | `/api/files/upload` | Multipart file upload (`logos` or `cars`) |

---

## 6. How to Run the Project

### Prerequisites:
- **Java 21 LTS** installed (`java -version`).
- **Node.js 18+** & **npm** installed (`node -v`).
- (Optional for PostgreSQL profile) **PostgreSQL** database installed.

---

### Step 1: Start the Backend (Spring Boot)

Navigate to the `backend` folder:
```bash
cd backend
```

#### Option A: Run with default persistent SQL database (Zero Setup)
The project comes pre-configured with a persistent relational file database (`./data/car_catalog.mv.db`) operating in PostgreSQL compatibility mode:
```powershell
.\mvnw.cmd spring-boot:run
```
*(On Linux/macOS: `./mvnw spring-boot:run`)*

#### Option B: Run with PostgreSQL
1. Create a database in PostgreSQL:
   ```sql
   CREATE DATABASE car_catalog;
   ```
2. Run Spring Boot with the `postgres` profile:
   ```powershell
   .\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=postgres
   ```
   *(Ensure credentials in `src/main/resources/application-postgres.properties` match your PostgreSQL password).*

Backend starts on `http://localhost:8080`.

---

### Step 2: Start the Frontend (React JS)

In a new terminal window, navigate to the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```

Open your browser at:
```
http://localhost:5173
```

---

## 7. Evidence & Verification Screenshots

Screenshots of the application matching the demonstration video are stored in `screenshots/`:
- `screenshots/01_cars_page.png` — Vehicle catalog with car cards, badges, and filters.
- `screenshots/02_brands_page.png` — Automobile brands table with logos and search bar.
- `screenshots/03_add_brand_modal.png` — Modal for adding a new brand with logo upload dropzone.
- `screenshots/04_models_page.png` — Vehicle models table with body types.
- `screenshots/05_add_model_modal.png` — Modal for adding a new model.
- `screenshots/06_add_car_modal.png` — Modal for adding a car with cascading dropdowns and photo upload.
