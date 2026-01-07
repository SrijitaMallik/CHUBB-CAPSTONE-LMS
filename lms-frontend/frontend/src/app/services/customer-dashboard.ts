import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CustomerDashboardService {
  api = 'http://localhost:5209/api';

  constructor(private http: HttpClient) {}

  getMyLoans() {
    return this.http.get(`${this.api}/loans/my-applications`);
  }

  getMyEmis() {
    return this.http.get(`${this.api}/emis/my-emis`);
  }

  getOutstanding(loanId:number){
    return this.http.get(`${this.api}/emis/${loanId}/outstanding`);
  }

  payEmi(loanApplicationId:number){
    return this.http.put(`${this.api}/emis/${loanApplicationId}/pay`, {}, {
      responseType: 'text' // Handle non-JSON responses
    });
  }

  getReceipts(id:number){
    return this.http.get(`${this.api}/emis/${id}/receipts`);
  }
}
