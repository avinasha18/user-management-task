import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();

  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => this.users = users,

      error: (error) => console.error('Error fetching users', error)
    });

  }
}
