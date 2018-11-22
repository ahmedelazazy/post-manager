import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdates: Subject<Post[]> = new Subject();

  constructor() {}

  getPosts() {
    return this.posts.slice();
  }

  getPostsUpdates() {
    return this.postsUpdates.asObservable();
  }

  addPost(post: Post) {
    this.posts.push(post);
    this.postsUpdates.next(this.posts.slice());
  }
}
