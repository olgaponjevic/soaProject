package com.soa.social.service;

import com.soa.social.core.BadRequestException;
import com.soa.social.domain.UserNode;
import com.soa.social.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final UserRepository users;
    private final UserGraphService userGraph;

    public void follow(long meId, String meUsername, long targetId) {
        if (meId == targetId) throw new BadRequestException("You cannot follow yourself.");

        userGraph.upsert(meId, meUsername);
        users.upsertUser(targetId, null);

        users.follow(meId, targetId);
    }

    public void unfollow(long meId, long targetId) {
        users.unfollow(meId, targetId);
    }

    public List<UserNode> following(long meId) {
        return users.findFollowing(meId);
    }

    public List<UserNode> followers(long meId) {
        return users.findFollowers(meId);
    }

    public List<UserNode> recommend(long meId, int limit) {
        int boundedLimit = Math.max(1, Math.min(limit, 50));

        List<UserNode> recs = users.recommendFromFollows(meId, boundedLimit);

        if (recs.isEmpty()) {
            return users.findAllUsersExcept(meId, boundedLimit);
        }

        return recs;
    }
}
