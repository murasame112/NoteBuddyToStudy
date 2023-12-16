import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  username: string = '';

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.Observers();
    this.username = this.authService.showUsername();
  }

  Observers() {
    const navContainer: any = document.querySelector('#containerNav');
    let hamburger_nav_btns: any = document.querySelectorAll(
      '.hamburger-nav-btns'
    );
    const observer: any = new ResizeObserver((entires) => {
      if (entires[0].borderBoxSize[0].inlineSize > 650) {
        hamburger_nav_btns.forEach((e: any) => {
          e.style.display = 'none';
        });
        // console.log('window > 650 ');
      } else {
        // console.log('window < 650');
        hamburger_nav_btns.forEach((e: any) => {
          e.style.display = 'block';
        });
      }
    });

    observer.observe(navContainer);
  }

  menuBarOpen() {
    let hamburgerBar: any = document.querySelector('#hamburgerBar');
    let hamburger_menu: any = document.querySelector('#hamburger-menu');
    let hamburgerIcon: any = document.querySelector('#hamburgerIcon');
    let hamburgerIconClose: any = document.querySelector(
      '#hamburgerIcon-close'
    );
    let menuBtn: any = document.querySelectorAll('.menu-btn');
    let hamburger_nav_btns: any = document.querySelectorAll(
      '.hamburger-nav-btns'
    );

    hamburgerBar.style.display = 'block';
    hamburger_menu.style.display = 'flex';
    hamburgerIcon.style.visibility = 'hidden';
    hamburgerIconClose.style.display = 'block';

    menuBtn.forEach((e: HTMLElement) => {
      e.style.display = 'block';
    });

    if (window.innerWidth > 650) {
      hamburger_nav_btns.forEach((e: any) => {
        e.style.display = 'none';
      });
    } else {
      hamburger_nav_btns.forEach((e: any) => {
        e.style.display = 'block';
      });
    }
  }

  menuBarClose() {
    let hamburgerBar: any = document.querySelector('#hamburgerBar');
    let hamburger_menu: any = document.querySelector('#hamburger-menu');
    let hamburgerIcon: any = document.querySelector('#hamburgerIcon');
    let hamburgerIconClose: any = document.querySelector(
      '#hamburgerIcon-close'
    );
    let menuBtn: any = document.querySelectorAll('.menu-btn');

    hamburgerBar.style.display = 'none';
    hamburger_menu.style.display = 'none';
    hamburgerIcon.style.visibility = 'visible';
    hamburgerIconClose.style.display = 'none';

    menuBtn.forEach((e: any) => {
      e.style.display = 'none';
    });
  }

  logout() {
    console.log('wylogowano');
    this.authService.logout();
  }
}
