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
            return {
              id: post._id,
              title: post.title,
              body: post.body,
              imagePath: post.imagePath
            };
          })
        )
      )
      .subscribe(p => {
        this.posts = p;
        this.postsUpdates.next(this.posts);
      });
  }

  getById(id) {
    return this.http.get<any>('http://localhost:3000/api/posts/' + id).pipe(
      map(post => {
        return {
          id: post._id,
          title: post.title,
          body: post.body,
          imagePath: post.imagePath
        };
      })
    );
  }

  getPostsUpdates() {
    return this.postsUpdates.asObservable();
  }

  addPost(post) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('body', post.body);
    postData.append('image', post.attachment, post.title);

    this.http.post('http://localhost:3000/api/posts', postData).subscribe(res => {
      this.getPosts();
    });
  }

  editPost(id, post) {
    if (typeof post.attachment === 'string') {
      this.http.patch('http://localhost:3000/api/posts/' + id, post).subscribe(res => {
        this.getPosts();
      });
    } else {
      const postData = new FormData();
      postData.append('title', post.title);
      postData.append('body', post.body);
      postData.append('image', post.attachment, post.title);
      this.http.patch('http://localhost:3000/api/posts/' + id, postData).subscribe(res => {
        this.getPosts();
      });
    }
  }

  deletePost(id) {
    this.http.delete('http://localhost:3000/api/posts/' + id).subscribe(data => {
      this.getPosts();
    });
  }
}
