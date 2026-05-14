import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-pm-console-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="login-screen" aria-label="Tasama sign in">
      <div class="login-column">
        <div class="login-stack">
          <div class="login-form-wrap">
            <button
              class="login-logo-button"
              type="button"
              aria-label="Start Tasama onboarding"
              (click)="startOnboarding.emit()"
            >
              <img class="login-logo" src="./assets/login-logo.png" alt="Tasama" />
            </button>
            <form class="login-form" (submit)="handleSubmit($event)">
              <div class="login-copy">
                <h1>Sign Into Your Account</h1>
                <p>Please type in your username and password to sign in</p>
              </div>
              <label class="login-field">
                <span>Username</span>
                <input type="text" autocomplete="username" placeholder="Enter your username" />
              </label>
              <label class="login-field">
                <span>Password</span>
                <input type="password" autocomplete="current-password" placeholder="Enter password" />
              </label>
              <div class="login-options">
                <label class="login-remember">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button class="login-link" type="button">Forgot Password?</button>
              </div>
              <button class="login-submit" type="submit">Sign In</button>
              <p class="login-learn">Don&rsquo;t have an Account? <button type="button">Learn More</button></p>
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
export class PmConsoleLoginComponent {
  @Output() readonly signIn = new EventEmitter<void>();
  @Output() readonly startOnboarding = new EventEmitter<void>();

  private readonly appPassword = '123';

  handleSubmit(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const passwordInput = form.querySelector<HTMLInputElement>('input[type="password"]');
    if (passwordInput?.value !== this.appPassword) {
      passwordInput?.focus();
      return;
    }
    this.signIn.emit();
  }
}
