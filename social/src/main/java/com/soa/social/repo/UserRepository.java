package com.soa.social.repo;

import com.soa.social.domain.UserNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends Neo4jRepository<UserNode, Long> {

    Optional<UserNode> findById(Long id);

    @Query("""
    MERGE (u:User {id: $id})
    SET u.username = coalesce($username, u.username)
    RETURN u
  """)
    UserNode upsertUser(long id, String username);

    @Query("""
    MATCH (me:User {id: $meId}), (target:User {id: $targetId})
    MERGE (me)-[:FOLLOWS]->(target)
  """)
    void follow(long meId, long targetId);

    @Query("""
    MATCH (me:User {id: $meId})-[r:FOLLOWS]->(target:User {id: $targetId})
    DELETE r
  """)
    void unfollow(long meId, long targetId);

    @Query("""
    MATCH (me:User {id:$meId})-[:FOLLOWS]->(u:User)
    RETURN u
    ORDER BY u.username
  """)
    List<UserNode> findFollowing(long meId);

    @Query("""
    MATCH (u:User)-[:FOLLOWS]->(me:User {id:$meId})
    RETURN u
    ORDER BY u.username
  """)
    List<UserNode> findFollowers(long meId);

    @Query("""
    MATCH (me:User {id: $meId})-[:FOLLOWS]->(:User)-[:FOLLOWS]->(rec:User)
    WHERE rec.id <> $meId
      AND NOT (me)-[:FOLLOWS]->(rec)
    RETURN DISTINCT rec
    LIMIT $limit
  """)
    List<UserNode> recommendFromFollows(long meId, int limit);

    @Query("""
    MATCH (u:User)
    WHERE u.id <> $meId
    RETURN u
    ORDER BY u.username
    LIMIT $limit
  """)
    List<UserNode> findAllUsersExcept(long meId, int limit);

    @Query("""
    MATCH (me:User {id:$meId})-[:FOLLOWS]->(author:User {id:$authorId})
    RETURN count(author) > 0
  """)
    boolean isFollowing(long meId, long authorId);
}
