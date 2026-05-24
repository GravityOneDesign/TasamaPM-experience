import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { DevAuthService } from '../../services/dev-auth.service';

@Component({
  selector: 'app-pm-console-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="login-screen" aria-label="Tasama sign in">
      <div class="login-column">
        <div class="login-stack">
          <div class="login-form-wrap">
            <div class="login-logo-button" aria-label="Tasama">
              <img class="login-logo" src="./assets/login-logo.png" alt="Tasama" />
            </div>
            <form class="login-form" [formGroup]="loginForm" (ngSubmit)="handleSubmit()">
              <div class="login-copy">
                <h1>Sign Into Your Account</h1>
                <p>Use your SDZ username and password to sign in</p>
              </div>
              <label class="login-field">
                <span>Username</span>
                <input
                  formControlName="username"
                  name="username"
                  type="text"
                  autocomplete="username"
                  placeholder="Enter username"
                />
              </label>
              <label class="login-field">
                <span>Password</span>
                <input
                  formControlName="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  placeholder="Enter password"
                />
              </label>
              @if (!isProduction) {
                <p class="login-learn">For Development Purpose Only</p>
              }
              <button class="login-submit" type="submit" [disabled]="loginForm.invalid">Sign In</button>
            </form>
          </div>
          <div class="login-powered">
            <span>Powered by</span>
            <img src="./assets/strategy-zero-logo.png" alt="Strategy Zero" />
          </div>
        </div>
      </div>
      <aside class="login-hero" aria-label="AI-Powered Strategy Execution">
        <div class="login-hero-carousel" aria-hidden="true">
          <img class="login-hero-slide" src="./assets/login-hero.jpg" alt="" />
          <img class="login-hero-slide" src="./assets/login-saudi-riyadh.jpg" alt="" />
          <img class="login-hero-slide" src="./assets/login-saudi-hegra.jpg" alt="" />
          <img class="login-hero-slide" src="./assets/login-saudi-alula.jpg" alt="" />
        </div>
        <div class="login-hero-shade"></div>
        <div class="login-hero-copy">
          <h2>AI-Powered Strategy Execution</h2>
          <p>Transform vision into action with intelligent automation, ensuring seamless execution and measurable results.</p>
          <div class="login-dots" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
        </div>
      </aside>
    </section>
  `,
})
export class PmConsoleLoginComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly loginService = inject(DevAuthService);
  private readonly router = inject(Router);

  readonly isProduction = environment.production;
  readonly loginForm = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      void this.router.navigate(['/pm']);
      return;
    }

    if (environment.production) {
      this.auth.callSDZLogin();
    }
  }

  handleSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    this.loginService.login(username, password);
  }
}

