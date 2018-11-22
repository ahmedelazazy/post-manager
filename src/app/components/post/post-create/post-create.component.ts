import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  constructor(private postService: PostService) {}

  ngOnInit() {}

  onAddPost(form) {
    if (form.invalid) return;

    this.postService.addPost(form.value);

    form.resetForm();
  }
}
