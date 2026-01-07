import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  login(form: NgForm){
  this.auth.login(form.value).subscribe({
    next: (res) => {
      console.log('Login response:', res);
      
      if (res && res.token) {
        this.auth.saveLogin(res.token);
        const role = this.auth.getRole();
        
        if(role === 'Admin'){
          this.router.navigate(['/admin']);
        } else if(role === 'Customer'){
          this.router.navigate(['/customer-dashboard']);
        } else if(role === "LoanOfficer"){
   this.router.navigate(['/loan-officer/dashboard']);
        } else {
          this.router.navigate(['/customer']);
        }
      }
    },
    error: (err) => {
      console.error('Login error:', err);
      alert('Login failed. Please check credentials.');
    }
  });
}



  goRegister() {
    this.router.navigate(['/register']);
  }

}
