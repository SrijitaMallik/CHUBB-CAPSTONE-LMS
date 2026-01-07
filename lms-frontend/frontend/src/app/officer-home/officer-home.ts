import { Component, OnInit, inject, signal } from '@angular/core';
import { OfficerService } from '../services/officer.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-officer-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './officer-home.html',
  styleUrls: ['./officer-home.css']
})
export class OfficerHomeComponent implements OnInit {

  // ✅ SIGNALS
  stats = signal({
    total: 0,
    pending: 0,
    active: 0,
    rejected: 0
  });
  loading = signal(false);
  error = signal<string | null>(null);

  private service = inject(OfficerService);

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading.set(true);
    this.error.set(null);

    this.service.getStats().subscribe({
      next: (res: any) => {
        console.log('Stats loaded:', res);
        this.stats.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.error.set('Failed to load statistics');
        this.loading.set(false);
      }
    });
  }

  // ✅ Optional: Refresh method
  refresh() {
    this.loadStats();
  }
}