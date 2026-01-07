import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin';

@Component({
 selector:'app-all-loans',
 standalone:true,
 imports:[CommonModule],
 templateUrl:'./all-loans.html',
 styleUrls:['./all-loans.css']
})
export class AllLoansComponent implements OnInit{
 loans:any[] = [];

 constructor(private admin:AdminService){}

 ngOnInit(){
  this.admin.getVerifiedLoans().subscribe(res=>{
    this.loans = res;
    console.log("Verified Loans:",res);
  });
 }

 approve(id:number){
  this.admin.approveLoan(id).subscribe(()=>{
    alert("Loan Approved");
    this.ngOnInit();
  });
 }

 reject(id:number){
  this.admin.rejectLoan(id).subscribe(()=>{
    alert("Loan Rejected");
    this.ngOnInit();
  });
 }
}
