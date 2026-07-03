package tn.esprit.forumservice.services;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import tn.esprit.forumservice.entities.Comment;
import tn.esprit.forumservice.entities.Post;
import tn.esprit.forumservice.repository.CommentRepository;
import tn.esprit.forumservice.repository.PostRepository;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }

    public List<Comment> getCommentsByPost(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }

    public Comment getCommentById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
    }

    public Comment addComment(Long postId, Comment comment, Jwt jwt) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

        comment.setPost(post);
        comment.setUserId(jwt.getSubject());
        comment.setUsername(jwt.getClaimAsString("preferred_username"));
        return commentRepository.save(comment);
    }

    public Comment updateComment(Long id, Comment updatedComment, Jwt jwt) {
        Comment existing = getCommentById(id);

        String userId = jwt.getSubject();
        if (!existing.getUserId().equals(userId)) {
            throw new RuntimeException("You are not allowed to update this comment");
        }

        existing.setContent(updatedComment.getContent());
        return commentRepository.save(existing);
    }

    public void deleteComment(Long id, Jwt jwt) {
        Comment existing = getCommentById(id);

        String userId = jwt.getSubject();
        if (!existing.getUserId().equals(userId)) {
            throw new RuntimeException("You are not allowed to delete this comment");
        }

        commentRepository.delete(existing);
    }
}
