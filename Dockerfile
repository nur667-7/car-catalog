# Multi-stage Dockerfile for Railway & Cloud Deployment

# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Spring Boot Backend
FROM eclipse-temurin:21-jdk-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/.mvn .mvn
COPY backend/mvnw backend/pom.xml ./
RUN chmod +x mvnw
COPY backend/src src
COPY backend/uploads uploads
# Embed React frontend build into Spring Boot static resources
COPY --from=frontend-builder /app/frontend/dist src/main/resources/static
RUN ./mvnw clean package -DskipTests

# Stage 3: Lightweight Production Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend/target/*.jar app.jar
COPY --from=backend-builder /app/backend/uploads uploads
RUN mkdir -p uploads/logos uploads/cars data
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
