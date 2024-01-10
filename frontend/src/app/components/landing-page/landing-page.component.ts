import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  copyrightYear: number | null = null;

  ngOnInit(): void {
    this.getYear();
  }

  getYear() {
    this.copyrightYear = new Date().getFullYear();
  }
}
