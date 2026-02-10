package com.soa.social.domain;

import lombok.*;
import org.springframework.data.neo4j.core.schema.*;

import java.time.Instant;

@Node("Comment")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CommentNode {

    @Id
    private String id; // UUID string

    private String text;
    private Instant createdAt;
    private Instant lastEditedAt;

    @Relationship(type = "WROTE", direction = Relationship.Direction.INCOMING)
    private UserNode author;

    @Relationship(type = "ON", direction = Relationship.Direction.OUTGOING)
    private BlogNode blog;
}
