import { ApplicationRef, inject, Injectable, NgZone } from '@angular/core';
import {
  createClient,
  SignInWithPasswordCredentials,
  SupabaseClient,
} from '@supabase/supabase-js';
import { BehaviorSubject, first, from, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GeneralUser } from '../models/GeneralUser';

@Injectable({
  providedIn: 'root', // Indica que este servicio es singleton y está disponible en toda la aplicación
})
export class AuthService {
  private supabaseClient!: SupabaseClient; // Cliente de Supabase, se inicializa más adelante
  private userSubject = new BehaviorSubject<any>(null); // Crea un sujeto para gestionar el estado del usuario, inicia con null
  public user$: Observable<any> = this.userSubject.asObservable(); // Exponemos el estado del usuario como un observable

  constructor(private ngZone: NgZone) {
    // Inyecta NgZone para manejar el contexto de Angular
    inject(ApplicationRef)
      .isStable.pipe(first((isStable) => isStable)) // Espera a que la aplicación esté estable
      .subscribe(() => {
        // Crea el cliente de Supabase con la URL y la clave pública del entorno
        this.supabaseClient = createClient(
          environment.supabase.url,
          environment.supabase.publicKey
        );

        // Escucha los cambios en la sesión de Supabase
        this.supabaseClient.auth.onAuthStateChange((event, session) => {
          this.ngZone.run(() => {
            // Asegura que la actualización ocurra dentro de la zona de Angular
            this.userSubject.next(session); // Actualiza el estado del usuario
          });
        });

        // Recupera la sesión actual al iniciar la aplicación
        from(this.supabaseClient.auth.getSession()).subscribe(
          ({ data: { session } }) => {
            this.ngZone.run(() => {
              this.userSubject.next(session); // Actualiza el estado del usuario con la sesión recuperada
            });
          }
        );
      });
  }

  async signIn(credentials: SignInWithPasswordCredentials): Promise<any> {
    try {
      const { data, error, ...rest } =
        await this.supabaseClient.auth.signInWithPassword(credentials);
      return error ? error : data.user; // Devuelve el usuario o el error
    } catch (error) {
      return error; // Manejo de errores
    }
  }

  async signUp(userData: GeneralUser): Promise<any> {
    const credentials = {
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.first_name,
          last_name: userData.last_name,
        },
      },
    };
    try {
      const { data, error, ...rest } = await this.supabaseClient.auth.signUp(
        credentials
      );
      // this.setUser(); // Esta línea está comentada; podría usarse para establecer un usuario tras el registro
      return error ? error : data.user; // Devuelve el usuario o el error
    } catch (error) {
      console.log('Error de Api' + error); // Registro de errores
      return error; // Manejo de errores
    }
  }

  async signOut(): Promise<any> {
    try {
      console.log('por acá bien' + this.userSubject); // Log para depuración
      this.userSubject.next(null); // Restablece el estado del usuario al cerrar sesión
      console.log('por acá bien después' + this.userSubject); // Log para depuración
      const { error, ...rest } = await this.supabaseClient.auth.signOut();
      return error ? error : null; // Devuelve null si todo va bien, o el error
    } catch (error) {
      return error; // Manejo de errores
    }
  }
}
