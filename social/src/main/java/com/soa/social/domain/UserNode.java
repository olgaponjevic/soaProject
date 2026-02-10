package com.soa.social.domain;

import lombok.*;
import org.springframework.data.neo4j.core.schema.*;

import java.util.HashSet;
import java.util.Set;

@Node("User")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class UserNode {

    @Id
    private Long id;

    private String username;

    @Relationship(type = "FOLLOWS", direction = Relationship.Direction.OUTGOING)
    @Builder.Default
    private Set<UserNode> following = new HashSet<>();
}
