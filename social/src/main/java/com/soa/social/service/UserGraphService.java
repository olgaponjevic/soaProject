package com.soa.social.service;

import com.soa.social.domain.UserNode;
import com.soa.social.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserGraphService {
    private final UserRepository users;

    public UserNode upsert(long id, String username) {
        return users.upsertUser(id, username);
    }
}
