import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DevAuthService {
  private devLoginVisible = false;

  constructor(private readonly http: HttpClient) {}

  getDevLoginStatus(): boolean {
    return this.devLoginVisible;
  }

  setDevLoginStatus(status: boolean): void {
    this.devLoginVisible = status;
  }

  encryptPassword(pwd: string): string {
    let chiper = '';
    for (let i = 0; i <= pwd.length - 1; i++) {
      const encryptedCode = pwd.charCodeAt(i);
      chiper = chiper + encryptedCode + '    ';
    }
    return encodeURI(chiper);
  }

  login(username: string, pwd: string): void {
    const loginUrl = 'Account/LoginUser';
    const baseUrl = environment.sdzBaseUrl.replace(/\/$/, '');
    const requestBody = {
      item: {
        Username: username,
        Password: this.encryptPassword(pwd),
        RememberMe: false,
        SelfRegistrationCode: null,
      },
    };

    this.http.post(`${baseUrl}/${loginUrl}`, requestBody).subscribe({
      next: () => {
        this.setDevLoginStatus(false);
        window.location.reload();
      },
      error: () => {
        if (window.confirm('Error while logging in. Do you want to try again?\n\n\nFor Development Purpose Only')) {
          window.location.reload();
        }
      },
    });
  }
}
