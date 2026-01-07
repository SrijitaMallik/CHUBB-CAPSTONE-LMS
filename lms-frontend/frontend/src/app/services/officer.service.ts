import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OfficerService {

  private api = 'http://localhost:5209/api/officer';

  constructor(private http: HttpClient) {}

  // ✅ Get pending loans for approval
  getPendingLoans(): Observable<any[]> {
    console.log('Fetching pending loans...');
    return this.http.get<any[]>(`${this.api}/pending`);
  }

  // ✅ APPROVE loan - POST request (changed from PUT)
 // ✅ APPROVE loan - PUT request
approveLoan(id: number): Observable<any> {
  console.log('Approving loan:', id);
  return this.http.put(
    `${this.api}/verify/${id}`,
    { IsApproved: true, Remarks: 'Approved by officer' },  // ✅ SAHI FORMAT
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// ✅ REJECT loan - PUT request
rejectLoan(id: number): Observable<any> {
  console.log('Rejecting loan:', id);
  return this.http.put(
    `${this.api}/verify/${id}`,
    { IsApproved: false, Remarks: 'Rejected by officer' },  // ✅ SAHI FORMAT
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

  // ✅ Get loan history
  getLoanHistory(): Observable<any[]> {
    console.log('Fetching loan history...');
    return this.http.get<any[]>(`${this.api}/loan-history`);
  }

  // ✅ Get statistics
  getStats(): Observable<any> {
    console.log('Fetching officer stats...');
    return this.http.get<any>(`${this.api}/stats`);
  }
}