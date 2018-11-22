import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  subscription: Subscription;
  constructor(private postService: PostService) {}

  ngOnInit() {
    this.postService.getPosts();

    this.subscription = this.postService
      .getPostsUpdates()
      .subscribe(p => (this.posts = p));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  deletePost(id) {
    this.postService.deletePost(id);
  }
}
