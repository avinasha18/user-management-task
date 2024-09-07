import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  username: string = '';
  password: string = '';
  address: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onRegister(): void {
    this.userService.register({ email: this.email, username: this.username, password: this.password, address: this.address })
      .subscribe({
        next: () => {
          console.log('Registration successful');
          this.router.navigate(['/']);
        },
        error: (error) => console.error('Registration failed', error)
      });
  }
}