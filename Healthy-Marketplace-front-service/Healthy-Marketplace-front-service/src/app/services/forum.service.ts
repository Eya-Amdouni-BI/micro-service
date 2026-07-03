import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, ForumComment, CreatePostRequest, CreateCommentRequest } from '../models/forum.model';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private apiUrl = 'http://localhost:8888/api/posts';

  constructor(private http: HttpClient) {}

  // ─── Posts ───────────────────────────────────────────────

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  getMyPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/my-posts`);
  }

  createPost(post: CreatePostRequest): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  updatePost(id: number, post: CreatePostRequest): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, post);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ─── Comments ────────────────────────────────────────────

  getCommentsByPost(postId: number): Observable<ForumComment[]> {
    return this.http.get<ForumComment[]>(`${this.apiUrl}/${postId}/comments`);
  }

  addComment(postId: number, comment: CreateCommentRequest): Observable<ForumComment> {
    return this.http.post<ForumComment>(`${this.apiUrl}/${postId}/comments`, comment);
  }

  updateComment(postId: number, commentId: number, comment: CreateCommentRequest): Observable<ForumComment> {
    return this.http.put<ForumComment>(`${this.apiUrl}/${postId}/comments/${commentId}`, comment);
  }

  deleteComment(postId: number, commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${postId}/comments/${commentId}`);
  }
}