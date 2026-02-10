package com.soa.social.repo;

import com.soa.social.domain.CommentNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

import java.util.List;

public interface CommentRepository extends Neo4jRepository<CommentNode, String> {

    @Query("""
    MATCH (c:Comment)-[:ON]->(b:Blog {id:$blogId})
    RETURN c
    ORDER BY c.createdAt ASC
  """)
    List<CommentNode> findByBlog(String blogId);

    @Query("""
    MATCH (author:User {id:$authorId}), (c:Comment {id:$commentId})
    MERGE (author)-[:WROTE]->(c)
  """)
    void linkAuthor(long authorId, String commentId);

    @Query("""
    MATCH (c:Comment {id:$commentId}), (b:Blog {id:$blogId})
    MERGE (c)-[:ON]->(b)
  """)
    void linkToBlog(String commentId, String blogId);
}
