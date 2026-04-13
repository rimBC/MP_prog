import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isOpen:boolean=false;
  isSmallScreen: boolean=false;
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  toggleMenu(){
    this.isOpen=!this.isOpen;
  }

  closeMenuOutsideClick(event: MouseEvent){
      const targetElement = event.target as HTMLElement
      if(targetElement.classList.contains("fixed")){
       this.toggleMenu();}
  }


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
      window.addEventListener('resize', () => this.checkScreenSize());
    }
  }
  checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isSmallScreen = window.innerWidth < 900;
    }
  }


}
