import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { OfficerService } from '../services/officer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-officer-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './officer-reports.html',
  styleUrls: ['./officer-reports.css']
})
export class OfficerReportsComponent implements OnInit {

  // ✅ SIGNALS
  allLoans = signal<any[]>([]);
  loans = signal<any[]>([]);
  
  page = signal(1);
  pageSize = signal(5);
  
  searchText = signal('');
  statusFilter = signal('');
  loading = signal(false);

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
    this.service.getLoanHistory().subscribe({
      next: (res) => {
        this.allLoans.set(res);
        this.applyFilter();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading history:', err);
        this.loading.set(false);
      }
    });
  }

  applyFilter() {
    const search = this.searchText().toLowerCase();
    const status = this.statusFilter();

    const filtered = this.allLoans().filter(l => {
      const matchName = !search || (l.customerName || '').toLowerCase().includes(search);
      const matchStatus = !status || l.status === status;
      return matchName && matchStatus;
    });

    this.loans.set(filtered);
    this.page.set(1);
  }

  clearFilter() {
    this.searchText.set('');
    this.statusFilter.set('');
    this.applyFilter();
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
}