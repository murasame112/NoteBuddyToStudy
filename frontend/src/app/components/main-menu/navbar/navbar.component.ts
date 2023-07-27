import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{

  navbarState:boolean = false;

  ngOnInit(): void {
    const navContainer:any = document.querySelector('#containerNav');
    let navBtn:any = document.querySelectorAll('.nav-btn');
    const observer:any = new ResizeObserver((entires)=>{
      if(entires[0].borderBoxSize[0].inlineSize>650)
      {
        navBtn.forEach((e:any)=> {
          e.style.display="block";
        });
        console.log('done');
      }else
      {
        if(this.navbarState ==false)
        {
          navBtn.forEach((e:any)=> {
            e.style.display="none";
          });
        }

      }
    });

    observer.observe(navContainer);
  }



  menuBarOpen()
  {
    this.navbarState = true;
    let hamburgerBar:any = document.querySelector('#hamburgerBar');
    let hamburgerIcon:any = document.querySelector('#hamburgerIcon');
    let hamburgerIconClose:any = document.querySelector('#hamburgerIcon-close');
    let navBtn:any = document.querySelectorAll('.nav-btn');
    let menuBtn:any = document.querySelectorAll('.menu-btn');

    hamburgerBar.style.display = "block";
    hamburgerIcon.style.display = "none";
    hamburgerIconClose.style.display = "block";


    menuBtn.forEach((e:any)=> {
      e.style.display="block";
      e.style.color = "red";
    });


    if(window.innerWidth<=650)
    {

    navBtn.forEach((e:any)=> {
      e.style.display="block";
    });

  }


  }

  menuBarClose()
  {
    this.navbarState= false;
    let hamburgerBar:any = document.querySelector('#hamburgerBar');
    let hamburgerIcon:any = document.querySelector('#hamburgerIcon');
    let hamburgerIconClose:any = document.querySelector('#hamburgerIcon-close');
    let navBtn:any = document.querySelectorAll('.nav-btn');
    let menuBtn:any = document.querySelectorAll('.menu-btn');

    hamburgerBar.style.display = "none";
    hamburgerIcon.style.display = "block";
    hamburgerIconClose.style.display = "none";

    menuBtn.forEach((e:any)=> {
      e.style.display="none";
    });

    if(window.innerWidth<=650)
    {

    navBtn.forEach((e:any)=> {
      e.style.display="none";
    });

  }
}

}
