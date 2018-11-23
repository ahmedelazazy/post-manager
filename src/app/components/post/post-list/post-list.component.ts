import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/post';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postsSubscription: Subscription;
  loading = false;
  pageSizeOptions = [1, 2, 5, 10];
  postsCount = 0;
  userId = null;

  pageSize = 2;
  pageIndex = 0;

  isAuthenticated = false;
  authSubscription;

  constructor(public postService: PostService, private authService: AuthService) {}

  ngOnInit() {
    this.loading = true;
    this.postService.getPosts(this.pageSize, this.pageIndex);

    this.postsSubscription = this.postService.getPostsUpdates().subscribe(p => {
      this.loading = false;
      this.posts = p.posts;
      this.postsCount = p.count;
    });

    this.isAuthenticated = this.authService.isAuthenticated;
    this.userId = this.authService.userId;
    this.authSubscription = this.authService.authUpdates.subscribe(auth => {
      this.isAuthenticated = auth;
      this.userId = this.authService.userId;
    });
  }

  onPageChange(event: PageEvent) {
    this.loading = true;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.postService.getPosts(this.pageSize, this.pageIndex);
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  deletePost(id) {
    this.postService.deletePost(id).subscribe(() => this.postService.getPosts(this.pageSize, this.pageIndex));
  }
}
