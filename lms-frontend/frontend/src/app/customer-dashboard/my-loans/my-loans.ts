import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CustomerDashboardService } from '../../services/customer-dashboard';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-loans',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './my-loans.html',
  styleUrls: ['./my-loans.css']
})
export class MyLoansComponent implements OnInit {
  loans: any[] = [];
  isLoading: boolean = true;
  error: string = '';

  page = 1;
  pageSize = 6;
  filterStatus: string = 'All';

  constructor(
    private service: CustomerDashboardService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('MyLoansComponent initialized');
    this.loadLoans();
  }

  loadLoans() {
  this.isLoading = true;
  this.error = '';
  this.service.getMyLoans().subscribe({
    next: (res:any) => {
      this.loans = res || [];
      this.page = 1;
      this.filterStatus = 'All';
      this.isLoading = false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.error = 'Failed to load your loans. Please try again.';
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  });
}


  goBack() {
    this.router.navigate(['/customer-dashboard']);
  }

  viewLoanDetails(loanId: number) {
    this.router.navigate(['/loan-details', loanId]);
  }

  get filteredLoans() {
    if (this.filterStatus === 'All') return this.loans;
    return this.loans.filter(l => l.status === this.filterStatus);
  }

  get pagedLoans() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredLoans.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.page * this.pageSize < this.filteredLoans.length) {
      this.page++;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  onFilterChange() {
    this.page = 1;
  }
}
