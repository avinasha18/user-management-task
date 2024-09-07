// src/app/components/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  showDeleteModal: boolean = false;

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

  onEdit(): void {
    this.router.navigate(['/edit']);
  }

  onDelete(): void {
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    this.userService.deleteProfile().subscribe({
      next: () => {
        console.log('Profile deleted successfully');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        this.router.navigate(['/login']);
      },
      error: (error) => console.error('Error deleting profile', error)
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
  }
}
