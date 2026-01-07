import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayout {

  constructor(private router: Router) {}

  navigate(path: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([path]);
    });
  }

  logout(){
  localStorage.clear();       // token, role sab clear
  this.router.navigate(['/login']);
}

  forceNavigate(event: Event, path: string) {
    event.preventDefault();
    this.router.navigate([path]);
  }
}
