import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin';
import { Chart } from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';

interface ActiveVsClosed {
  active: number;
  closed: number;
}

interface CustomerSummary {
  customerId: number;
  totalLoans: number;
  activeLoans: number;
  rejectedLoans: number;
  closedLoans: number;
  totalAmount: number;
}

interface LoanStatus {
  status: string;
  count: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  private loaded = false;   // 🔥 prevents duplicate calls

  totalCustomers = 0;
  activeLoans = 0;
  closedLoans = 0;
  customerSummary: CustomerSummary[] = [];
  loanStatus: LoanStatus[] = [];
  chart: any;
  customerChart: any;

  constructor(
    private admin: AdminService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.loaded) return;
    this.loaded = true;
    this.loadDashboard();
  }

  loadDashboard() {
    this.admin.getActiveVsClosed().subscribe(res => {
      this.activeLoans = res.active;
      this.closedLoans = res.closed;
      this.cdr.detectChanges();
    });

    this.admin.getCustomerSummary().subscribe(res => {
      this.customerSummary = res;
      this.totalCustomers = res.length;
      this.cdr.detectChanges();
      setTimeout(() => this.drawCustomerChart(), 0);
    });

    this.admin.getLoanStatus().subscribe(res => {
      this.loanStatus = res;
      setTimeout(() => this.drawChart(), 0);
    });
  }

  drawChart() {
    if (this.chart) this.chart.destroy();

    this.chart = new Chart('statusChart', {
      type: 'doughnut',
      data: {
        labels: this.loanStatus.map(x => x.status),
        datasets: [{
          data: this.loanStatus.map(x => x.count),
          backgroundColor: ['#22c55e', '#6366f1', '#facc15', '#ef4444']
        }]
      }
    });
  }

  drawCustomerChart() {
    if (this.customerChart) this.customerChart.destroy();

    const labels = this.customerSummary.map(c => `Customer ${c.customerId}`);

    this.customerChart = new Chart('customerChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Active Loans', data: this.customerSummary.map(c => c.activeLoans), backgroundColor: '#22c55e' },
          { label: 'Closed Loans', data: this.customerSummary.map(c => c.closedLoans), backgroundColor: '#6366f1' },
          { label: 'Rejected Loans', data: this.customerSummary.map(c => c.rejectedLoans), backgroundColor: '#ef4444' }
        ]
      },
      options: { responsive: true }
    });
  }

  goPending() {
    this.router.navigate(['/admin/pending-officers']);
  }

  logout() {
    localStorage.clear();
    location.href = '/';
  }
}
