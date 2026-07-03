package tn.esprit.reviewreportservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import tn.esprit.reviewreportservice.dto.ForumPostDTO;

@FeignClient(name = "ForumService")
public interface ForumRestClient {

    @GetMapping("/api/posts/{postId}")
    ForumPostDTO getPostById(@PathVariable("postId") Long postId);
}
