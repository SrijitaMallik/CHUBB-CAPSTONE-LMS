import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin';
import { signal, effect } from '@angular/core';

@Component({
  selector: 'app-pending-officers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-officers.html',
  styleUrls: ['./pending-officers.css']
})
export class PendingOfficers implements OnInit {
  // ✅ SIGNALS ke saath
  officers = signal<any[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  private admin = inject(AdminService);

  constructor() {
    console.log('PendingOfficers constructor');
    
    // ✅ Effect - Jab data load ho to automatically UI update hoga
    effect(() => {
      if (this.officers().length > 0) {
        console.log('Officers updated in UI:', this.officers());
      }
    });
  }

  ngOnInit(): void {
    console.log('PendingOfficers ngOnInit');
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    
    this.admin.getPendingOfficers().subscribe({
      next: (res) => {
        console.log('Officers loaded:', res);
        this.officers.set(res); // ✅ Signal set karo
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading officers:', err);
        this.error.set('Failed to load officers');
        this.loading.set(false);
      }
    });
  }

  approve(id: number) {
    this.admin.approveOfficer(id).subscribe({
      next: () => {
        alert('Officer Approved');
        this.load(); // ✅ Reload data
      },
      error: (err) => {
        console.error('Approval error:', err);
        alert('Failed to approve officer');
      }
    });
  }

  reject(id: number) {
    this.admin.rejectOfficer(id).subscribe({
      next: () => {
        alert('Officer Rejected');
        this.load(); // ✅ Reload data
      },
      error: (err) => {
        console.error('Rejection error:', err);
        alert('Failed to reject officer');
      }
    });
  }
}