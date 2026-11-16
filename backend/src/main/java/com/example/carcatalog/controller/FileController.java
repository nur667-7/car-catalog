package com.example.carcatalog.controller;

import com.example.carcatalog.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "type", defaultValue = "logos") String type) {

        String subfolder = "cars".equalsIgnoreCase(type) ? "cars" : "logos";
        String fileUrl = fileStorageService.storeFile(file, subfolder);

        return ResponseEntity.ok(Map.of("url", fileUrl));
    }
}
