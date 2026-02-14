package com.soa.social.api;

import com.soa.social.api.dto.FollowRequest;
import com.soa.social.api.dto.UserSummary;
import com.soa.social.service.FollowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService follows;

    @PostMapping("/{targetUserId}")
    public void follow(@PathVariable long targetUserId, @Valid @RequestBody FollowRequest body) {
        var actor = body.actor();
        follows.follow(actor.userId(), actor.username(), targetUserId);
    }

    @DeleteMapping("/{targetUserId}")
    public void unfollow(@PathVariable long targetUserId, @RequestParam long userId) {
        follows.unfollow(userId, targetUserId);
    }

    @GetMapping("/following")
    public List<UserSummary> following(@RequestParam long userId) {
        return follows.following(userId).stream()
                .map(u -> new UserSummary(u.getId(), u.getUsername()))
                .toList();
    }

    @GetMapping("/followers")
    public List<UserSummary> followers(@RequestParam long userId) {
        return follows.followers(userId).stream()
                .map(u -> new UserSummary(u.getId(), u.getUsername()))
                .toList();
    }

    @GetMapping("/recommendations")
    public List<UserSummary> recommendations(@RequestParam long userId,
                                             @RequestParam(defaultValue = "10") int limit) {
        return follows.recommend(userId, limit).stream()
                .map(u -> new UserSummary(u.getId(), u.getUsername()))
                .toList();
    }
}