import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private userSubscription!: Subscription;
  userData: any | null = null;

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.userData = user;
    });
  }


  async onLogOut(): Promise<void> {
    try {
      await this.authService.signOut();
    } catch (error) {
      console.log("Error" + error);
    }
  }

  isAuthenticated(): boolean {
    if (this.userData == null) {
      return false; // Si userData es null, el usuario NO está autenticado
    } else {
      return true; // Si userData tiene un valor, el usuario está autenticado
    }
  }
}
