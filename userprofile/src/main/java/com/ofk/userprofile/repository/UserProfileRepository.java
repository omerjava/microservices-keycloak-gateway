package com.ofk.userprofile.repository;

import com.ofk.userprofile.model.UserProfile;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface UserProfileRepository extends ElasticsearchRepository<UserProfile, String> {
}

