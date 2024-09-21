import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { AuthApiError, User } from '@supabase/supabase-js';
import { Subscription } from 'rxjs';
import { GeneralUser } from '../../models/GeneralUser';
import { AuthService } from '../../services/auth.service';

interface UserResponse extends User, AuthApiError {}
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export default class AuthComponent implements OnInit {
  isSignUpActive: boolean = false; // Controla el estado de la vista de registro
  signInForm!: FormGroup; // Formulario de inicio de sesión
  signUpForm!: FormGroup; // Formulario de registro
  private readonly authService = inject(AuthService); // Inyecta el servicio de autenticación
  private userSubscription!: Subscription; // Suscripción al estado del usuario
  userData: any | null = null; // Datos del usuario autenticado

  // Método del ciclo de vida de Angular: se ejecuta al inicializar el componente

  ngOnInit() {
    // Nos suscribimos a los cambios en el estado del usuario

    this.userSubscription = this.authService.user$.subscribe((user) => {
      this.userData = user;
    });
    if (this.isAuthenticated()) {
      this.redirectUser();
    }
    // Leemos el fragmento de la ruta para ajustar la vista (sign-up/sign-in)

    this.readRouteFragment();
    this.initForms();
  }

  // Constructor para inyectar las dependencias necesarias

  constructor(
    private readonly fb: FormBuilder, // FormBuilder para crear formularios reactivos
    private route: ActivatedRoute, // ActivatedRoute para obtener datos de la URL
    private router: Router // Router para la navegación
  ) {}

  async onSubmit(form: String): Promise<void> {
    let actionCalled;

    // Revisa si el formulario es de registro o de inicio de sesión

    if (form == 'signUpForm') {
      let user: GeneralUser = {
        first_name: this.signUpForm.value.first_name,
        last_name: this.signUpForm.value.last_name,
        email: this.signUpForm.value.email,
        password: this.signUpForm.value.password,
      };
      actionCalled = this.authService.signUp(user); // Llamada al método de registro
    } else {
      actionCalled = this.authService.signIn(this.signInForm.value); // Llamada al método de inicio de sesión
    }

    try {
      const result = (await actionCalled) as unknown as UserResponse;
      // Si el resultado contiene un email válido, redirigimos al usuario

      if (result != undefined && result.email != null) {
        this.redirectUser();
      }
    } catch (error) {}
  }

  // Alterna entre el formulario de inicio de sesión y el de registro

  onChangeAction(): void {
    this.isSignUpActive = !this.isSignUpActive;
  }

  // Inicializa los formularios con sus campos y validaciones

  private initForms() {
    this.signInForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.signUpForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  // Lee el fragmento de la URL para decidir si mostrar la vista de registro o inicio de sesión
  private readRouteFragment(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment == 'SignUp') {
        this.isSignUpActive = true; // Activa la vista de registro
      } else {
        this.isSignUpActive = false; // Activa la vista de inicio de sesión
      }
    });
  }

  // Redirige al usuario autenticado a la página de inicio

  private redirectUser(): void {
    this.router.navigate(['/home']);
  }

  // Verifica si el usuario está autenticado

  isAuthenticated(): boolean {
    if (this.userData == null) {
      return false; // Si userData es null, el usuario NO está autenticado
    } else {
      return true; // Si userData tiene un valor, el usuario está autenticado
    }
  }
}
