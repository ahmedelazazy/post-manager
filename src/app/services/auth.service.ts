import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = false;
  token = null;
  userId = null;
  authUpdates = new Subject<boolean>();
  expiryTimer: any;
  constructor(private http: HttpClient, private router: Router) {}

  register(authData) {
    this.http
      .post('http://localhost:3000/api/users/register', authData)
      .subscribe(data => this.router.navigate(['/login']));
  }

  login(authData) {
    this.http.post<any>('http://localhost:3000/api/users/login', authData).subscribe(data => {
      this.token = data.token;
      this.isAuthenticated = true;
      this.userId = data.userId;
      this.setAuthTimer(data.expiry);
      this.setAuthData(data.token, data.expiry, data.userId);
      this.authUpdates.next(true);
      this.router.navigate(['/']);
    });
  }

  autoLogin() {
    var authData = this.getAuthData();
    if (!authData) {
      return;
    }

    var timeDif = authData.expiryDate.getTime() - new Date().getTime();
    if (timeDif > 0) {
      this.setAuthTimer(timeDif / 1000);
      this.token = authData.token;
      this.userId = authData.userId;
      this.isAuthenticated = true;
      this.authUpdates.next(true);
    } else {
      this.clearAuthData();
    }
  }

  setAuthTimer(duration) {
    this.expiryTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  getToken() {
    return this.token;
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.isAuthenticated = false;
    this.authUpdates.next(false);
    clearTimeout(this.expiryTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthData(token, expiry, userId) {
    let expiryDate = new Date(new Date().getTime() + expiry * 1000).toISOString();
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expiryDate', expiryDate);
  }

  private getAuthData() {
    let savedToken = localStorage.getItem('token');
    let savedUserId = localStorage.getItem('userId');
    let expiryDate = localStorage.getItem('expiryDate');

    if (!savedToken || !expiryDate || !savedUserId) {
      return;
    }

    let date = new Date(expiryDate);
    return { token: savedToken, expiryDate: date, userId: savedUserId };
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiryDate');
  }
}
