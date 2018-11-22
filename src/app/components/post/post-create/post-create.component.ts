import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  post$;
  mode = 'create'; //create - edit
  id = null;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.mode = 'edit';
        this.post$ = this.postService.getById(params['id']);
      } else {
        this.mode = 'create';
      }
    });
  }

  onSave(form) {
    if (form.invalid) {
      return;
    }
    if (this.mode == 'create') {
      this.postService.addPost(form.value);
    } else {
      this.postService.editPost(this.id, form.value);
    }

    form.resetForm();
    this.router.navigate(['/']);
  }
}
