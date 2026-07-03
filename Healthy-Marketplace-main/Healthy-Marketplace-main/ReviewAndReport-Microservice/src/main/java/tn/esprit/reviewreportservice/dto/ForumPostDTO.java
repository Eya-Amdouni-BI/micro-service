package tn.esprit.reviewreportservice.dto;

import lombok.Data;

@Data
public class ForumPostDTO {
    private Long id;
    private String title;
    private String content;
    private String authorId;
}
