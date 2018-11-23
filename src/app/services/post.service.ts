import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postsUpdates: Subject<any> = new Subject();

  // pageSize = 1;
  // pageIndex = 0;

  constructor(private http: HttpClient) {}

  getPosts(pageSize, pageIndex) {
    let queryString = `?pagesize=${pageSize}&pageindex=${pageIndex}`;
    this.http.get<any>('http://localhost:3000/api/posts' + queryString).subscribe(p => {
      this.postsUpdates.next(p);
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

    return this.http.post('http://localhost:3000/api/posts', postData);
  }

  editPost(id, post) {
    if (typeof post.attachment === 'string') {
      return this.http.patch('http://localhost:3000/api/posts/' + id, post);
    } else {
      const postData = new FormData();
      postData.append('title', post.title);
      postData.append('body', post.body);
      postData.append('image', post.attachment, post.title);
      return this.http.patch('http://localhost:3000/api/posts/' + id, postData);
    }
  }

  deletePost(id) {
    return this.http.delete('http://localhost:3000/api/posts/' + id);
  }
}
