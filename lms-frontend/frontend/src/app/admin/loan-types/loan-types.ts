import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin';

@Component({
  selector: 'app-loan-types',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loan-types.html',
  styleUrls: ['./loan-types.css']
})
export class LoanTypes implements OnInit {

  // ✅ SIGNALS
  loanTypes = signal<any[]>([]);
  editData = signal<any>(null);
  showAdd = signal(false);
  saving = signal(false);
  creating = signal(false);
  loading = signal(false);

  newLoan = signal({
    loanTypeName: '',
    interestRate: 0,
    minAmount: 0,
    maxAmount: 0,
    maxTenureMonths: 0
  });

  private admin = inject(AdminService);

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.admin.getLoanTypes().subscribe({
      next: (res) => {
        this.loanTypes.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading loan types:', err);
        this.loading.set(false);
      }
    });
  }

  edit(l: any) {
    this.editData.set({ ...l });
  }

  openAdd() {
    this.showAdd.set(true);
  }

  save() {
    if (this.saving()) return;
    this.saving.set(true);

    const data = { ...this.editData() };
    this.editData.set(null);

    this.admin.updateLoanType(data.loanTypeId, data).subscribe({
      next: () => {
        setTimeout(() => {
          this.load();
          this.saving.set(false);
        }, 200);
      },
      error: (err) => {
        console.error('Error saving:', err);
        alert('Failed to save loan type');
        this.saving.set(false);
      }
    });
  }

  create() {
    if (this.creating()) return;

    const loan = this.newLoan();
    if (
      !loan.loanTypeName ||
      loan.interestRate <= 0 ||
      loan.minAmount <= 0 ||
      loan.maxAmount <= 0 ||
      loan.maxTenureMonths <= 0
    ) {
      alert('Fill all fields correctly');
      return;
    }

    const data = { ...loan };
    this.showAdd.set(false);
    this.creating.set(true);

    this.admin.addLoanType(data).subscribe({
      next: () => {
        setTimeout(() => {
          this.newLoan.set({
            loanTypeName: '',
            interestRate: 0,
            minAmount: 0,
            maxAmount: 0,
            maxTenureMonths: 0
          });
          this.load();
          this.creating.set(false);
        }, 200);
      },
      error: (err) => {
        console.error('Error creating:', err);
        alert('Failed to create loan type');
        this.creating.set(false);
        this.showAdd.set(true);
      }
    });
  }

  disable(id: number) {
    this.loanTypes.set(this.loanTypes().filter(x => x.loanTypeId !== id));
    this.admin.disableLoanType(id).subscribe({
      error: (err) => {
        console.error('Error disabling:', err);
        alert('Failed to disable loan type');
        this.load();
      }
    });
  }

  cancel() {
    this.editData.set(null);
    this.showAdd.set(false);
  }
}