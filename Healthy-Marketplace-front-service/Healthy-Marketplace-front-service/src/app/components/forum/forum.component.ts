import { Component, OnInit } from '@angular/core';
import { CreatePostRequest, ForumComment, Post } from '../../models/forum.model';
import { ForumService } from '../../services/forum.service';
import { ReviewReportService } from '../../services/review-report.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  posts: Post[] = [];
  loading = false;
  error = '';
  submitting = false;

  newPostTitle = '';
  newPostContent = '';

  expandedComments: { [postId: number]: ForumComment[] } = {};
  loadingComments: { [postId: number]: boolean } = {};
  newCommentText: { [postId: number]: string } = {};
  showCommentBox: { [postId: number]: boolean } = {};

  editingPost: Post | null = null;
  editTitle = '';
  editContent = '';

  // Report Modal Properties
  isReportModalOpen = false;
  reportingItem: { id: number, type: 'FORUM_POST' | 'COMMENT' } | null = null;
  reportReason = '';
  reportStep: 'INPUT' | 'SUBMITTING' | 'SUCCESS' | 'ERROR' = 'INPUT';

  constructor(
    private forumService: ForumService,
    private reviewReportService: ReviewReportService
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.error = '';
    this.forumService.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load posts. Please try again.';
        this.loading = false;
      }
    });
  }

  createPost(): void {
    if (!this.newPostTitle.trim() || !this.newPostContent.trim()) return;
    this.submitting = true;
    const req: CreatePostRequest = {
      title: this.newPostTitle.trim(),
      content: this.newPostContent.trim()
    };
    this.forumService.createPost(req).subscribe({
      next: (post) => {
        this.posts.unshift(post);
        this.newPostTitle = '';
        this.newPostContent = '';
        this.submitting = false;
      },
      error: () => {
        this.error = 'Failed to create post.';
        this.submitting = false;
      }
    });
  }

  startEdit(post: Post): void {
    this.editingPost = post;
    this.editTitle = post.title;
    this.editContent = post.content;
  }

  cancelEdit(): void {
    this.editingPost = null;
    this.editTitle = '';
    this.editContent = '';
  }

  saveEdit(): void {
    if (!this.editingPost || !this.editTitle.trim() || !this.editContent.trim()) return;
    this.forumService.updatePost(this.editingPost.id, {
      title: this.editTitle.trim(),
      content: this.editContent.trim()
    }).subscribe({
      next: (updated) => {
        const idx = this.posts.findIndex(p => p.id === updated.id);
        if (idx !== -1) this.posts[idx] = updated;
        this.cancelEdit();
      },
      error: () => { this.error = 'Failed to update post.'; }
    });
  }

  deletePost(postId: number): void {
    if (!confirm('Delete this post?')) return;
    this.forumService.deletePost(postId).subscribe({
      next: () => { this.posts = this.posts.filter(p => p.id !== postId); },
      error: () => { this.error = 'Failed to delete post.'; }
    });
  }

  toggleComments(postId: number): void {
    if (this.expandedComments[postId]) {
      delete this.expandedComments[postId];
      return;
    }
    this.loadingComments[postId] = true;
    this.forumService.getCommentsByPost(postId).subscribe({
      next: (comments) => {
        this.expandedComments[postId] = comments;
        this.loadingComments[postId] = false;
      },
      error: () => { this.loadingComments[postId] = false; }
    });
  }

  toggleCommentBox(postId: number): void {
    this.showCommentBox[postId] = !this.showCommentBox[postId];
    if (!this.newCommentText[postId]) this.newCommentText[postId] = '';
  }

  submitComment(postId: number): void {
    const text = (this.newCommentText[postId] || '').trim();
    if (!text) return;
    this.forumService.addComment(postId, { content: text }).subscribe({
      next: (comment) => {
        if (!this.expandedComments[postId]) this.expandedComments[postId] = [];
        this.expandedComments[postId].push(comment);
        this.newCommentText[postId] = '';

        const post = this.posts.find(p => p.id === postId);
        if (post) {
          if (!post.comments) post.comments = [];
          post.comments.push(comment);
        }
      },
      error: () => { this.error = 'Failed to add comment.'; }
    });
  }

  deleteComment(postId: number, commentId: number): void {
    this.forumService.deleteComment(postId, commentId).subscribe({
      next: () => {
        if (this.expandedComments[postId]) {
          this.expandedComments[postId] = this.expandedComments[postId].filter(c => c.id !== commentId);
        }
      },
      error: () => { this.error = 'Failed to delete comment.'; }
    });
  }

  getCommentCount(post: Post): number {
    return this.expandedComments[post.id]?.length ?? post.comments?.length ?? 0;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getInitials(username: string): string {
    if (!username) return '?';
    return username.slice(0, 2).toUpperCase();
  }

  // --- REPORT MODAL LOGIC ---
  openReportModal(id: number, type: 'FORUM_POST' | 'COMMENT'): void {
    this.reportingItem = { id, type };
    this.reportReason = '';
    this.reportStep = 'INPUT';
    this.isReportModalOpen = true;
  }

  closeReportModal(): void {
    if (this.reportStep === 'SUBMITTING') return;
    this.isReportModalOpen = false;
    this.reportingItem = null;
  }

  confirmReport(): void {
    if (!this.reportingItem || !this.reportReason.trim() || this.reportStep === 'SUBMITTING') return;

    this.reportStep = 'SUBMITTING';
    this.reviewReportService.reportContent({
      contentId: this.reportingItem.id,
      contentType: this.reportingItem.type,
      reason: this.reportReason.trim()
    }).subscribe({
      next: () => {
        this.reportStep = 'SUCCESS';
        setTimeout(() => this.closeReportModal(), 2000);
      },
      error: () => {
        this.reportStep = 'ERROR';
      }
    });
  }

  reportPost(post: Post): void {
    this.openReportModal(post.id, 'FORUM_POST');
  }

  reportComment(post: Post, comment: ForumComment): void {
    this.openReportModal(comment.id, 'COMMENT');
  }
}