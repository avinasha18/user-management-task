import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  user: any = {};

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.userService.getProfile().subscribe({
      next: (user) => this.user = user,
      error: (error) => console.error('Error fetching profile', error)
    });
  }

  onSave(): void {
    this.userService.updateProfile(this.user).subscribe({
      next: () => {
        console.log('Profile updated successfully');
        this.router.navigate(['/profile']);
      },
      error: (error) => console.error('Error updating profile', error)
    });
  }
}
