import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-apply-loan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apply-loan.html',
  styleUrls: ['./apply-loan.css']
})
export class ApplyLoanComponent implements OnInit {

  loanTypes: any[] = [];
  isSubmitting = false;
  notification: { type: 'success' | 'error', message: string } | null = null;

  formData = {
    loanType: '',
    loanAmount: '',
    loanTenure: '',
    monthlyIncome: '',
    terms: false
  };

  constructor(private http: HttpClient, public router: Router) {}

  ngOnInit() {
    this.loadLoanTypes();
  }

  loadLoanTypes() {
    // Using predefined loan types from backend documentation
    this.loanTypes = [
      { loanTypeId: 1, loanTypeName: 'Personal Loan' },
      { loanTypeId: 2, loanTypeName: 'Educational Loan' },
      { loanTypeId: 3, loanTypeName: 'Home Loan' }
    ];
    console.log('Loan types loaded:', this.loanTypes);
  }

  submitApplication(form: NgForm) {
    if (!form.valid) {
      this.notification = { type: 'error', message: 'Please fill all required fields' };
      console.error('Form validation failed');
      return;
    }

    if (!this.formData.terms) {
      this.notification = { type: 'error', message: 'Please agree to terms and conditions' };
      return;
    }

    this.isSubmitting = true;

    const applicationData = {
      loanTypeId: parseInt(this.formData.loanType),
      loanAmount: parseFloat(this.formData.loanAmount),
      tenureMonths: parseInt(this.formData.loanTenure),
      monthlyIncome: parseFloat(this.formData.monthlyIncome)
    };

    console.log('Submitting application with data:', applicationData);

    this.http.post('http://localhost:5209/api/loans/apply', applicationData, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).subscribe({
      next: (res: any) => {
        console.log('Application submitted successfully:', res);
        this.notification = { type: 'success', message: 'Loan application submitted successfully! ✓' };
        this.isSubmitting = false;

        setTimeout(() => {
          this.router.navigate(['/customer-dashboard']);
        }, 2000);
      },
      error: (err: any) => {
        console.error('Application submission failed:', err);
        console.error('Error details:', err.error);
        
        let errorMessage = 'Failed to submit application. Please try again.';
        
        if (err.error && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if (err.error && err.error.message) {
          errorMessage = err.error.message;
        }
        
        this.notification = { type: 'error', message: errorMessage };
        this.isSubmitting = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/customer-dashboard']);
  }

  closeNotification() {
    this.notification = null;
  }
}
