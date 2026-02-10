package com.soa.social.api;

import com.soa.social.api.dto.UserSummary;
import com.soa.social.core.IdentityResolver;
import com.soa.social.service.FollowService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowController {

    private final IdentityResolver identity;
    private final FollowService follows;

    @PostMapping("/{targetUserId}")
    public void follow(@PathVariable long targetUserId, HttpServletRequest req) {
        var me = identity.requireIdentity(req);
        follows.follow(me.userId(), me.username(), targetUserId);
    }

    @DeleteMapping("/{targetUserId}")
    public void unfollow(@PathVariable long targetUserId, HttpServletRequest req) {
        var me = identity.requireIdentity(req);
        follows.unfollow(me.userId(), targetUserId);
    }

    @GetMapping("/following")
    public List<UserSummary> following(HttpServletRequest req) {
        var me = identity.requireIdentity(req);
        return follows.following(me.userId()).stream()
                .map(u -> new UserSummary(u.getId(), u.getUsername()))
                .toList();
    }

    @GetMapping("/followers")
    public List<UserSummary> followers(HttpServletRequest req) {
        var me = identity.requireIdentity(req);
        return follows.followers(me.userId()).stream()
                .map(u -> new UserSummary(u.getId(), u.getUsername()))
                .toList();
    }

    @GetMapping("/recommendations")
    public List<UserSummary> recommendations(@RequestParam(defaultValue = "10") int limit, HttpServletRequest req) {
        var me = identity.requireIdentity(req);
        return follows.recommend(me.userId(), limit).stream()
                .map(u -> new UserSummary(u.getId(), u.getUsername()))
                .toList();
    }
}
