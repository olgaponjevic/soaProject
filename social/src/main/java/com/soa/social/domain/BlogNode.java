package com.soa.social.domain;

import lombok.*;
import org.springframework.data.neo4j.core.schema.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Node("Blog")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class BlogNode {

    @Id
    private String id;

    private String title;
    private String description;
    private Instant createdAt;

    @Property("images")
    @Builder.Default
    private List<String> imageUrls = new ArrayList<>();

    @Relationship(type = "AUTHORED", direction = Relationship.Direction.INCOMING)
    private UserNode author;
}
