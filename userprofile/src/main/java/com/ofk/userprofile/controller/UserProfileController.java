package com.ofk.userprofile.controller;

import com.ofk.userprofile.dto.UserProfileDto;
import com.ofk.userprofile.model.UserProfile;
import com.ofk.userprofile.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserProfileController {

    private final UserProfileService service;

    public UserProfileController(UserProfileService service) {
        this.service = service;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfile> getMyProfile(
            @RequestHeader("X-User-Sub") String sub) {

        return service.getBySub(sub)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/profile")
    public ResponseEntity<UserProfile> updateMyProfile(
            @RequestHeader("X-User-Sub") String sub,
            @RequestBody @Valid UserProfileDto dto) {
        System.out.println("heloo ofk: "+dto);
        System.out.println("heloo ofk2 : "+sub);


        return ResponseEntity.ok(service.createOrUpdate(sub, dto));
    }

    @DeleteMapping("/profile")
    public ResponseEntity<Void> deleteMyProfile(
            @RequestHeader("X-User-Sub") String sub) {

        service.deleteBySub(sub);
        return ResponseEntity.noContent().build();
    }
}



