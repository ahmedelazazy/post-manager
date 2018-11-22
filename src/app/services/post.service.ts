import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdates: Subject<Post[]> = new Subject();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<Post[]>('http://localhost:3000/api/posts').subscribe(p => {
      this.posts = p;
      this.postsUpdates.next(this.posts);
    });
  }

  getPostsUpdates() {
    return this.postsUpdates.asObservable();
  }

  addPost(post: Post) {
    this.http
      .post('http://localhost:3000/api/posts', { post })
      .subscribe(res => {
        console.log(res);
        this.posts.push(post);
        this.postsUpdates.next(this.posts.slice());
      });
  }
}
