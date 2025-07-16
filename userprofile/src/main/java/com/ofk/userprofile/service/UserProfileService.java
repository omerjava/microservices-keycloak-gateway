package com.ofk.userprofile.service;

import com.ofk.userprofile.dto.UserProfileDto;
import com.ofk.userprofile.model.UserProfile;
import com.ofk.userprofile.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserProfileService {

    private final UserProfileRepository repository;

    public UserProfileService(UserProfileRepository repository) {
        this.repository = repository;
    }

    public UserProfile createOrUpdate(String sub, UserProfileDto dto) {
        UserProfile profile = repository.findById(sub).orElse(new UserProfile());
        profile.setSub(sub);
        profile.setFullName(dto.getFullName());
        profile.setAddress(dto.getAddress());
        profile.setCountry(dto.getCountry());
        profile.setAge(dto.getAge());
        return repository.save(profile);
    }

    public Optional<UserProfile> getBySub(String sub) {
        return repository.findById(sub);
    }

    public void deleteBySub(String sub) {
        repository.deleteById(sub);
    }
}
