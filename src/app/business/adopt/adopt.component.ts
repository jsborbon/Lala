import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-adopt',
  standalone: true,
  imports: [],
  templateUrl: './adopt.component.html',
  styleUrl: './adopt.component.css'
})
export default class AdoptComponent implements OnInit {
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  }
}
