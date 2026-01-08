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
  selectedLoanType:any = null;

  maxTenure = 360;
  minAmount = 0;
  maxAmount = 999999999;

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
  this.http.get<any[]>('http://localhost:5209/api/loan-types')
    .subscribe({
      next: (res) => {
        this.loanTypes = res;
        console.log("ACTIVE LOAN TYPES:", res);   // verify
      },
      error: (err) => {
        console.error("LoanType API failed", err);
      }
    });
}

  // 🔥 STEP-3 FIX
  onLoanTypeChange(){
    this.selectedLoanType = this.loanTypes.find(x => x.loanTypeId == this.formData.loanType);

    if(this.selectedLoanType){
      this.maxTenure = this.selectedLoanType.maxTenureMonths;
      this.maxAmount = this.selectedLoanType.maxAmount;
      this.minAmount = this.selectedLoanType.minAmount;
    }
  }

  submitApplication(form: NgForm) {
    if (!form.valid) {
      this.notification = { type: 'error', message: 'Please fill all required fields' };
      return;
    }

    if (!this.formData.terms) {
      this.notification = { type: 'error', message: 'Please agree to terms and conditions' };
      return;
    }

    // 🛑 Smart UI validation
    if(this.selectedLoanType){
      if(+this.formData.loanTenure > this.maxTenure){
        this.notification = {type:'error', message:`Maximum tenure allowed is ${this.maxTenure} months`};
        return;
      }

      if(+this.formData.loanAmount < this.minAmount || +this.formData.loanAmount > this.maxAmount){
        this.notification = {type:'error', message:`Loan amount must be between ₹${this.minAmount} and ₹${this.maxAmount}`};
        return;
      }
    }

    this.isSubmitting = true;

    const applicationData = {
      loanTypeId: +this.formData.loanType,
      loanAmount: +this.formData.loanAmount,
      tenureMonths: +this.formData.loanTenure,
      monthlyIncome: +this.formData.monthlyIncome
    };

    this.http.post('http://localhost:5209/api/loans/apply', applicationData).subscribe({
      next: () => {
        this.notification = { type: 'success', message: 'Loan application submitted successfully! ✓' };
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['/customer-dashboard']), 2000);
      },
      error: (err:any) => {
        this.notification = { type: 'error', message: err.error || 'Failed to submit application.' };
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
