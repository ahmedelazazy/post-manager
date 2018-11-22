import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdates: Subject<Post[]> = new Subject();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<any>('http://localhost:3000/api/posts')
      .pipe(
        map(posts =>
          posts.map(post => {
            return { id: post._id, title: post.title, body: post.body };
          })
        )
      )
      .subscribe(p => {
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
        this.getPosts();
      });
  }

  deletePost(id) {
    this.http
      .delete('http://localhost:3000/api/posts/' + id)
      .subscribe(data => {
        this.getPosts();
      });
  }
}
