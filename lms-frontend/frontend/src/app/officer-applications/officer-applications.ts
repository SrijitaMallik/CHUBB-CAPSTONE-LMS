import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { OfficerService } from '../services/officer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-officer-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './officer-applications.html',
  styleUrls: ['./officer-applications.css']
})
export class OfficerApplicationsComponent implements OnInit {

  // ✅ SIGNALS
  allLoans = signal<any[]>([]);
  loans = signal<any[]>([]);
  
  page = signal(1);
  pageSize = signal(5);
  
  searchText = signal('');
  statusFilter = signal('');
  loading = signal(false);
  approving = signal(false);

  private service = inject(OfficerService);

  // ✅ Computed for pagination
  totalPages = computed(() => 
    Math.ceil(this.loans().length / this.pageSize())
  );

  pagedLoans = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.loans().slice(start, start + this.pageSize());
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.service.getPendingLoans().subscribe({
      next: (res) => {
        this.allLoans.set(res);
        this.applyFilter();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading loans:', err);
        this.loading.set(false);
      }
    });
  }

  applyFilter() {
    const search = this.searchText().toLowerCase();
    const status = this.statusFilter();

    const filtered = this.allLoans().filter(l => {
      const matchStatus = !status || l.status === status;
      const matchSearch = !search || (l.customerName || '').toLowerCase().includes(search);
      return matchStatus && matchSearch;
    });

    this.loans.set(filtered);
    this.page.set(1);
  }

  changePage(p: number) {
    this.page.set(p);
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update(p => p - 1);
    }
  }

  approve(id: number) {
    if (this.approving()) return;
    this.approving.set(true);
    console.log('Approving loan:', id);

    this.service.approveLoan(id).subscribe({
      next: (res) => {
        console.log('Approval response:', res);
        alert('Loan Approved Successfully ✅');
        
        // Remove from current list immediately
        this.allLoans.set(this.allLoans().filter(l => l.loanApplicationId !== id));
        this.applyFilter();
        
        this.approving.set(false);
      },
      error: (err) => {
        console.error('Error approving:', err);
        alert('Failed to approve loan: ' + (err.error?.message || err.message));
        this.approving.set(false);
      }
    });
  }

  reject(id: number) {
    if (this.approving()) return;
    this.approving.set(true);
    console.log('Rejecting loan:', id);

    this.service.rejectLoan(id).subscribe({
      next: (res) => {
        console.log('Rejection response:', res);
        alert('Loan Rejected Successfully ❌');
        
        // Remove from current list immediately
        this.allLoans.set(this.allLoans().filter(l => l.loanApplicationId !== id));
        this.applyFilter();
        
        this.approving.set(false);
      },
      error: (err) => {
        console.error('Error rejecting:', err);
        alert('Failed to reject loan: ' + (err.error?.message || err.message));
        this.approving.set(false);
      }
    });
  }
}