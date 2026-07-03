package tn.esprit.reviewreportservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.reviewreportservice.entity.Report;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
}
