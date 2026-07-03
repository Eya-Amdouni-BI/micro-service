package tn.esprit.forumservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import tn.esprit.forumservice.entities.Post;
import tn.esprit.forumservice.services.PostService;

import java.util.List;

@RestController
@RequestMapping("/api/posts")

public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // GET all posts
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    // GET post by ID
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    // GET posts by current user
    @GetMapping("/my-posts")
    public ResponseEntity<List<Post>> getMyPosts(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(postService.getPostsByUser(jwt.getSubject()));
    }

    // CREATE post
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.createPost(post, jwt));
    }

    // UPDATE post
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id,
                                           @RequestBody Post post,
                                           @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(postService.updatePost(id, post, jwt));
    }

    // DELETE post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        postService.deletePost(id, jwt);
        return ResponseEntity.noContent().build();
    }
}
