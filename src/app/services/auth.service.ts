import { ApplicationRef, inject, Injectable, NgZone } from '@angular/core';
import { createClient, SignInWithPasswordCredentials, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, first, from, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GeneralUser } from '../models/GeneralUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabaseClient!: SupabaseClient;
  private userSubject = new BehaviorSubject<any>(null); // Inicializa con null
  public user$: Observable<any> = this.userSubject.asObservable();

  constructor(private ngZone: NgZone) { // Inyecta NgZone
    inject(ApplicationRef)
      .isStable.pipe(first((isStable) => isStable))
      .subscribe(() => {
        this.supabaseClient = createClient(
          environment.supabase.url,
          environment.supabase.publicKey,
        );

        // Escucha los cambios en la sesión de Supabase
        this.supabaseClient.auth.onAuthStateChange((event, session) => {
          this.ngZone.run(() => { // Asegúrate de que la actualización se ejecute dentro de la zona de Angular
            this.userSubject.next(session);
          });
        });

        // Recupera la sesión actual al iniciar
        from(this.supabaseClient.auth.getSession())
          .subscribe(({ data: { session } }) => {
            this.ngZone.run(() => {
              this.userSubject.next(session);
            });
          });
      });
  }
  async signIn(credentials: SignInWithPasswordCredentials): Promise<any> {
    try {
      const {
        data, error, ...rest
      } = await this.supabaseClient.auth.signInWithPassword(credentials);
      return error ? error : data.user;
    } catch (error) {
      return error;
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
    }
    try {
      const {
        data, error, ...rest
      } = await this.supabaseClient.auth.signUp(credentials);
      // this.setUser();
      return error ? error : data.user;
    } catch (error) {
      console.log("Error de Api" + error);
      return error;
    }
  }

  async signOut(): Promise<any> {
    try {
      console.log("por acá bien" + this.userSubject);
      this.userSubject.next(null);
      console.log("por acá bien despues" + this.userSubject);
      const {
        error, ...rest
      } = await this.supabaseClient.auth.signOut();
      return error ? error : null;
    } catch (error) {
      return error;
    }
  }
}
