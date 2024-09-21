import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root', // Selector para usar este componente en HTML
  standalone: true, // Indica que este componente es independiente
  imports: [RouterOutlet], // Importa RouterOutlet para manejar la navegación
  templateUrl: './app.component.html', // Ruta del archivo de plantilla HTML
  styleUrl: './app.component.css', // Ruta del archivo de estilos CSS
})
export class AppComponent {
  title = 'Lala'; // Propiedad para almacenar el título de la aplicación

  setup = () => {
    // Método que configura el estado inicial del componente
    return {
      loading: true, // Indicador de carga
      isSidebarOpen: false, // Estado inicial del menú lateral (cerrado)
      toggleSidbarMenu() {
        // Método para alternar el estado del menú lateral
        this.isSidebarOpen = !this.isSidebarOpen; // Cambia el estado de isSidebarOpen
      },
    };
  };
}
