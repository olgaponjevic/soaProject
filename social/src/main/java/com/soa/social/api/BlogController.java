package com.soa.social.api;

import com.soa.social.api.dto.*;
import com.soa.social.domain.BlogNode;
import com.soa.social.domain.CommentNode;
import com.soa.social.service.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    @PostMapping
    public BlogResponse create(@Valid @RequestBody BlogCreateRequest body) {
        var actor = body.actor();
        var blog = blogService.createBlog(
                actor.userId(),
                actor.username(),
                body.title(),
                body.description(),
                body.imageUrls()
        );
        return toBlogResponse(blog);
    }

    @GetMapping("/{blogId}")
    public BlogResponse get(@PathVariable String blogId) {
        return toBlogResponse(blogService.get(blogId));
    }

    @GetMapping("/feed")
    public List<BlogResponse> feed(@RequestParam long userId) {
        return blogService.feed(userId).stream().map(this::toBlogResponse).toList();
    }

    @GetMapping("/user/{userId}")
    public List<BlogResponse> byAuthor(@PathVariable long userId) {
        return blogService.byAuthor(userId).stream().map(this::toBlogResponse).toList();
    }

    @GetMapping("/{blogId}/comments")
    public List<CommentResponse> comments(@PathVariable String blogId) {
        return blogService.commentsFor(blogId).stream().map(this::toCommentResponse).toList();
    }

    @PostMapping("/{blogId}/comments")
    public CommentResponse addComment(@PathVariable String blogId,
                                      @Valid @RequestBody CommentCreateRequest body) {
        var actor = body.actor();
        var c = blogService.addComment(actor.userId(), actor.username(), blogId, body.text());
        return toCommentResponse(c);
    }

    private BlogResponse toBlogResponse(BlogNode b) {
        UserSummary author = null;
        if (b.getAuthor() != null) {
            author = new UserSummary(b.getAuthor().getId(), b.getAuthor().getUsername());
        }
        return new BlogResponse(b.getId(), b.getTitle(), b.getDescription(), b.getCreatedAt(), b.getImageUrls(), author);
    }

    private CommentResponse toCommentResponse(CommentNode c) {
        UserSummary author = null;
        if (c.getAuthor() != null) {
            author = new UserSummary(c.getAuthor().getId(), c.getAuthor().getUsername());
        }
        return new CommentResponse(c.getId(), c.getText(), c.getCreatedAt(), c.getLastEditedAt(), author);
    }
}