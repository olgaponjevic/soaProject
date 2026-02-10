package com.soa.social.repo;

import com.soa.social.domain.BlogNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

import java.util.List;
import java.util.Optional;

public interface BlogRepository extends Neo4jRepository<BlogNode, String> {

    Optional<BlogNode> findById(String id);

    @Query("""
    MATCH (a:User {id:$authorId})-[:AUTHORED]->(b:Blog)
    RETURN b
    ORDER BY b.createdAt DESC
  """)
    List<BlogNode> findByAuthor(long authorId);

    @Query("""
    MATCH (me:User {id:$meId})-[:FOLLOWS]->(a:User)-[:AUTHORED]->(b:Blog)
    RETURN b
    ORDER BY b.createdAt DESC
  """)
    List<BlogNode> feed(long meId);

    @Query("""
    MATCH (a:User {id:$authorId}), (b:Blog {id:$blogId})
    MERGE (a)-[:AUTHORED]->(b)
  """)
    void linkAuthor(long authorId, String blogId);

    @Query("""
    MATCH (b:Blog {id:$blogId})<-[:AUTHORED]-(a:User)
    RETURN a.id
  """)
    Long getAuthorId(String blogId);
}
