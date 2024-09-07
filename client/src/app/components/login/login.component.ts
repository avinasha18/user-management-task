
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private userService: UserService, private authService : AuthService, private router: Router) {}

  onLogin(): void {
    this.userService.login({ username: this.username, password: this.password })
      .subscribe({
        next: (response) => {
          console.log('Login successful');
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
          this.authService.login(response.token);
          this.router.navigate(['/users']);
        },
        error: (error) => console.error('Login failed', error)
      });
  }
}