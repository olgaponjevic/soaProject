package com.soa.social.service;

import com.soa.social.core.ForbiddenException;
import com.soa.social.core.NotFoundException;
import com.soa.social.domain.BlogNode;
import com.soa.social.domain.CommentNode;
import com.soa.social.repo.BlogRepository;
import com.soa.social.repo.CommentRepository;
import com.soa.social.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogs;
    private final CommentRepository comments;
    private final UserRepository users;
    private final UserGraphService userGraph;

    public BlogNode createBlog(long authorId, String authorUsername, String title, String description, List<String> images) {
        var author = userGraph.upsert(authorId, authorUsername);

        var blog = BlogNode.builder()
                .id(UUID.randomUUID().toString())
                .title(title)
                .description(description)
                .createdAt(Instant.now())
                .imageUrls(images == null ? List.of() : images)
                .author(author)
                .build();

        var saved = blogs.save(blog);
        blogs.linkAuthor(authorId, saved.getId());
        return saved;
    }

    public BlogNode get(String blogId) {
        return blogs.findById(blogId).orElseThrow(() -> new NotFoundException("Blog not found."));
    }

    public List<BlogNode> feed(long meId) {
        return blogs.feed(meId);
    }

    public List<BlogNode> byAuthor(long authorId) {
        return blogs.findByAuthor(authorId);
    }

    public List<CommentNode> commentsFor(String blogId) {
        // validate blog exists
        get(blogId);
        return comments.findByBlog(blogId);
    }

    public CommentNode addComment(long meId, String meUsername, String blogId, String text) {
        Long authorId = blogs.getAuthorId(blogId);
        if (authorId == null) throw new NotFoundException("Blog not found.");

        // Pravilo iz zahteva 9: moraš pratiti autora da bi komentarisao njegov blog (osim ako je tvoj blog)
        if (authorId != meId) {
            boolean follows = users.isFollowing(meId, authorId);
            if (!follows) throw new ForbiddenException("You must follow the author to comment on this blog.");
        }

        userGraph.upsert(meId, meUsername);

        var comment = CommentNode.builder()
                .id(UUID.randomUUID().toString())
                .text(text)
                .createdAt(Instant.now())
                .lastEditedAt(Instant.now())
                .build();

        var saved = comments.save(comment);
        comments.linkAuthor(meId, saved.getId());
        comments.linkToBlog(saved.getId(), blogId);
        return saved;
    }
}
