package tn.esprit.forumservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import tn.esprit.forumservice.entities.Comment;
import tn.esprit.forumservice.services.CommentService;

import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    // GET all comments for a post
    @GetMapping
    public ResponseEntity<List<Comment>> getCommentsByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPost(postId));
    }

    // GET single comment
    @GetMapping("/{commentId}")
    public ResponseEntity<Comment> getComment(@PathVariable Long postId,
                                              @PathVariable Long commentId) {
        return ResponseEntity.ok(commentService.getCommentById(commentId));
    }

    // ADD comment to post
    @PostMapping
    public ResponseEntity<Comment> addComment(@PathVariable Long postId,
                                              @RequestBody Comment comment,
                                              @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commentService.addComment(postId, comment, jwt));
    }

    // UPDATE comment
    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> updateComment(@PathVariable Long postId,
                                                 @PathVariable Long commentId,
                                                 @RequestBody Comment comment,
                                                 @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(commentService.updateComment(commentId, comment, jwt));
    }

    // DELETE comment
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long postId,
                                              @PathVariable Long commentId,
                                              @AuthenticationPrincipal Jwt jwt) {
        commentService.deleteComment(commentId, jwt);
        return ResponseEntity.noContent().build();
    }
}
