import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { AuthApiError, User } from '@supabase/supabase-js';
import { Subscription } from 'rxjs';
import { GeneralUser } from '../../models/GeneralUser';
import { AuthService } from '../../services/auth.service';

interface UserResponse extends User, AuthApiError { }
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RouterModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export default class AuthComponent implements OnInit {
  isSignUpActive: boolean = false;
  signInForm!: FormGroup;
  signUpForm!: FormGroup;
  private readonly authService = inject(AuthService);
  private userSubscription!: Subscription;
  userData: any | null = null;

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.userData = user;
    });
    if (this.isAuthenticated()) {
      this.redirectUser();
    }
    this.readRouteFragment();
    this.initForms();
  }

  constructor(
    private readonly fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async onSubmit(form: String): Promise<void> {
    let actionCalled;
    if (form == 'signUpForm') {
      let user: GeneralUser = {
        first_name: this.signUpForm.value.first_name,
        last_name: this.signUpForm.value.last_name,
        email: this.signUpForm.value.email,
        password: this.signUpForm.value.password,
      };
      actionCalled = this.authService.signUp(user);
    } else {
      actionCalled = this.authService.signIn(this.signInForm.value);
    }

    try {
      const result = await actionCalled as unknown as UserResponse;

      if (result != undefined && result.email != null) {
        this.redirectUser();
      }

    } catch (error) {

    }
  }

  onChangeAction(): void {
    this.isSignUpActive = !this.isSignUpActive;
  }

  private initForms() {
    this.signInForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.signUpForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  private readRouteFragment(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment == "SignUp") {
        this.isSignUpActive = true;
      } else {
        this.isSignUpActive = false;
      }
    });
  }

  private redirectUser(): void {
    this.router.navigate(['/home']);
  }

  isAuthenticated(): boolean {
    if (this.userData == null) {
      return false; // Si userData es null, el usuario NO está autenticado
    } else {
      return true; // Si userData tiene un valor, el usuario está autenticado
    }
  }
}
