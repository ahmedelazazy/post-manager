import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  loading = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onSubmit(form) {
    if (form.invalid) {
      return;
    }

    this.loading = true;
    this.authService.register(form.value);
  }
}
