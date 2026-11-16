package com.example.carcatalog.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path rootLocation;

    public FileStorageService(@Value("${file.upload-dir:uploads}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        init();
    }

    private void init() {
        try {
            Files.createDirectories(rootLocation.resolve("logos"));
            Files.createDirectories(rootLocation.resolve("cars"));
        } catch (IOException e) {
            throw new RuntimeException("Не удалось создать директории для загрузки файлов", e);
        }
    }

    public String storeFile(MultipartFile file, String subfolder) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Файл не может быть пустым");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        }

        if (!extension.matches("\\.(png|jpg|jpeg|webp|gif|svg)$")) {
            throw new IllegalArgumentException("Поддерживаются только форматы PNG, JPG, JPEG, WEBP");
        }

        String filename = UUID.randomUUID() + extension;
        Path targetFolder = rootLocation.resolve(subfolder);

        try {
            Files.createDirectories(targetFolder);
            Path destinationFile = targetFolder.resolve(filename).normalize().toAbsolutePath();

            if (!destinationFile.getParent().equals(targetFolder.toAbsolutePath())) {
                throw new SecurityException("Невозможно сохранить файл за пределами целевой директории");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            return "/uploads/" + subfolder + "/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Не удалось сохранить файл: " + originalFilename, e);
        }
    }

    public Path getRootLocation() {
        return rootLocation;
    }
}
