import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onSubmit(form) {
    if (form.invalid) {
      return;
    }
    this.loading = true;
    this.authService.login(form.value);
  }
}
