package tn.esprit.forumservice.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import tn.esprit.forumservice.entities.Post;
import tn.esprit.forumservice.repository.PostRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
    }

    public List<Post> getPostsByUser(String userId) {
        return postRepository.findByUserId(userId);
    }

    public Post createPost(Post post, Jwt jwt) {
        post.setUserId(jwt.getSubject());
        post.setUsername(jwt.getClaimAsString("preferred_username"));
        return postRepository.save(post);
    }

    public Post updatePost(Long id, Post updatedPost, Jwt jwt) {
        Post existing = getPostById(id);

        String userId = jwt.getSubject();
        if (!existing.getUserId().equals(userId)) {
            throw new RuntimeException("You are not allowed to update this post");
        }

        existing.setTitle(updatedPost.getTitle());
        existing.setContent(updatedPost.getContent());
        return postRepository.save(existing);
    }

    public void deletePost(Long id, Jwt jwt) {
        Post existing = getPostById(id);

        String userId = jwt.getSubject();
        if (!existing.getUserId().equals(userId)) {
            throw new RuntimeException("You are not allowed to delete this post");
        }

        postRepository.delete(existing);
    }
}
