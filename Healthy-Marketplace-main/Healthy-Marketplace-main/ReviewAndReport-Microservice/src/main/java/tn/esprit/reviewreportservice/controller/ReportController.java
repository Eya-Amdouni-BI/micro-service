package tn.esprit.reviewreportservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.reviewreportservice.entity.Report;
import tn.esprit.reviewreportservice.entity.ReportStatus;
import tn.esprit.reviewreportservice.service.ReportService;
import tn.esprit.reviewreportservice.service.ServiceLogPublisher;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin("*")
@Tag(name = "Report Management", description = "Endpoints for managing content reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private ServiceLogPublisher logPublisher;

    @Autowired
    private tn.esprit.reviewreportservice.client.ForumRestClient forumRestClient;

    @PostMapping
    @Operation(summary = "Submit a report", description = "Allows users to report posts or reviews")
    public Report reportContent(@RequestBody Report report) {
        Report saved = reportService.reportContent(report);
        Map<String, Object> meta = new HashMap<>();
        meta.put("reportId", saved.getId());
        meta.put("contentId", saved.getContentId());
        meta.put("contentType", saved.getContentType());
        logPublisher.info("ReviewReportService", "Report submitted", meta);
        return saved;
    }

    @PostMapping("/forum-post/{postId}")
    @Operation(summary = "Report a Forum Post (Feign)", description = "Validates the existence of a forum post via Feign before submitting a report")
    public Object reportForumPost(
            @PathVariable Long postId,
            @RequestBody Report report) {
        
        try {
            tn.esprit.reviewreportservice.dto.ForumPostDTO post = forumRestClient.getPostById(postId);
            if (post != null) {
                // Post exists, save report
                return reportService.reportContent(report);
            }
        } catch (feign.FeignException.NotFound e) {
            return "Forum Post with ID " + postId + " does not exist!";
        }
        
        return "An error occurred while communicating with the ForumService.";
    }

    @GetMapping
    @Operation(summary = "Get all reports", description = "Retrieves all submitted reports")
    public List<Report> getAllReports() {
        return reportService.getAllReports();
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update report status", description = "Update the status of a given report (OPEN, IN_PROGRESS, RESOLVED)")
    public Report updateReportStatus(@PathVariable Long id, @RequestParam ReportStatus status) {
        return reportService.updateReportStatus(id, status);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete report", description = "Delete a report by its ID")
    public void deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
    }
}
