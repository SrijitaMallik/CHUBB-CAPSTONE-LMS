import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {

  private api = 'http://localhost:5209/api/admin';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  // ========================
  // 👮 OFFICER MANAGEMENT
  // ========================

  getPendingOfficers(): Observable<any[]> {
    console.log('Fetching pending officers...');
    return this.http.get<any[]>(`${this.api}/pending-officers`);
  }

  approveOfficer(id: number): Observable<any> {
    console.log('Approving officer:', id);
    return this.http.put(
      `${this.api}/approve-officer/${id}`,
      {},
      { headers: this.headers }
    );
  }

  rejectOfficer(id: number): Observable<any> {
    console.log('Rejecting officer:', id);
    return this.http.delete(
      `${this.api}/reject-officer/${id}`,
      { headers: this.headers }
    );
  }

  // ========================
  // 💰 LOAN VERIFICATION
  // ========================

  getVerifiedLoans(): Observable<any[]> {
    console.log('Fetching verified loans...');
    return this.http.get<any[]>(`${this.api}/verified-loans`);
  }

  approveLoan(id: number): Observable<any> {
    console.log('Approving loan:', id);
    return this.http.put(
      `${this.api}/approve-loan/${id}`,
      {},
      { headers: this.headers }
    );
  }

  rejectLoan(id: number): Observable<any> {
    console.log('Rejecting loan:', id);
    return this.http.put(
      `${this.api}/reject-loan/${id}`,
      {},
      { headers: this.headers }
    );
  }

  // ========================
  // 📊 REPORTS
  // ========================

  getLoanStatus(): Observable<any[]> {
    console.log('Fetching loans by status...');
    return this.http.get<any[]>(`${this.api}/reports/loans-by-status`);
  }

  getActiveVsClosed(): Observable<any> {
    console.log('Fetching active vs closed loans...');
    return this.http.get<any>(`${this.api}/reports/active-vs-closed`);
  }

  getCustomerSummary(): Observable<any[]> {
    console.log('Fetching customer summary...');
    return this.http.get<any[]>(`${this.api}/reports/customer-summary`);
  }

  // ========================
  // 🏦 LOAN TYPES MANAGEMENT
  // ========================

  getLoanTypes(): Observable<any[]> {
    console.log('Fetching loan types...');
    return this.http.get<any[]>(`${this.api}/loan-types`);
  }

  getLoanType(id: number): Observable<any> {
    console.log('Fetching loan type:', id);
    return this.http.get<any>(`${this.api}/loan-types/${id}`);
  }

  addLoanType(body: any): Observable<any> {
    console.log('Creating loan type:', body);
    return this.http.post(
      `${this.api}/loan-types`,
      body,
      { headers: this.headers }
    );
  }

  updateLoanType(id: number, body: any): Observable<any> {
    console.log('Updating loan type:', id, body);
    return this.http.put(
      `${this.api}/loan-types/${id}`,
      body,
      { headers: this.headers }
    );
  }

  disableLoanType(id: number): Observable<any> {
    console.log('Disabling loan type:', id);
    return this.http.delete(
      `${this.api}/loan-types/${id}`,
      { headers: this.headers }
    );
  }
}