import { mergeApplicationConfig, ApplicationConfig } from '@angular/core'; // Importa funciones y tipos necesarios de Angular
import { provideServerRendering } from '@angular/platform-server'; // Importa la función para habilitar la renderización del lado del servidor
import { appConfig } from './app.config'; // Importa la configuración de la aplicación

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(), // Proporciona la capacidad de renderización del lado del servidor
  ],
};

// Combina la configuración de la aplicación con la configuración del servidor
export const config = mergeApplicationConfig(appConfig, serverConfig);
