import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-adopt',
  standalone: true,
  imports: [],
  templateUrl: './adopt.component.html',
  styleUrl: './adopt.component.css',
})
export default class AdoptComponent implements OnInit {
  constructor(private route: ActivatedRoute) {} // Inyección del ActivatedRoute para obtener datos de la ruta

  // Ciclo de vida de Angular: se ejecuta al inicializar el componente
  ngOnInit() {
    // Suscripción al fragmento de la ruta (el texto después del símbolo '#')
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        // Si hay un fragmento presente en la URL
        const element = document.getElementById(fragment); // Busca el elemento con el ID del fragmento
        if (element) {
          // Si el elemento existe en el DOM
          element.scrollIntoView({
            behavior: 'smooth', // Realiza un desplazamiento suave hacia el elemento
          });
        }
      }
    });
  }
}
