import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  form: FormGroup;
  mode = 'create'; //create - edit
  id = null;
  loading = false;
  imagePreview = null;
  constructor(private postService: PostService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: Validators.required }),
      body: new FormControl(null, { validators: Validators.required }),
      attachment: new FormControl(null, { validators: Validators.required })
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loading = true;
        this.id = params['id'];
        this.mode = 'edit';
        this.postService.getById(params['id']).subscribe(post => {
          this.form.patchValue({ title: post.title, body: post.body, attachment: post.imagePath });
          this.imagePreview = post.imagePath;
          this.loading = false;
        });
      } else {
        this.mode = 'create';
      }
    });
  }

  onFileChange(event) {
    const file = event.target.files[0];
    this.form.patchValue({ attachment: file });
    this.form.get('attachment').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    if (this.mode == 'create') {
      this.postService.addPost(this.form.value);
    } else {
      this.postService.editPost(this.id, this.form.value);
    }

    this.form.reset();
    this.router.navigate(['/']);
  }
}
