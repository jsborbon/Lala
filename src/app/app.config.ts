import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'; // Importa la configuración de la aplicación y la función para detección de cambios en la zona
import { provideRouter } from '@angular/router'; // Importa la función para proporcionar enrutamiento
import { provideHttpClient } from '@angular/common/http'; // Importa la función para proporcionar el cliente HTTP
import { provideClientHydration } from '@angular/platform-browser'; // Importa la función para la hidratación del cliente
import { routes } from './app.routes'; // Importa las rutas definidas para la aplicación

// Configuración de la aplicación
export const appConfig: ApplicationConfig = {
  providers: [
    // Habilita la detección de cambios en la zona con coalescencia de eventos
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Proporciona el enrutador con las rutas definidas
    provideRouter(routes),
    // Proporciona la funcionalidad de hidratación del cliente para sincronizar el estado
    provideClientHydration(),
    // Proporciona un cliente HTTP para realizar solicitudes
    provideHttpClient(),
  ],
};
