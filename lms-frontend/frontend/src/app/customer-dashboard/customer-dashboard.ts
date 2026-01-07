import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerDashboardService } from '../services/customer-dashboard';
import { AuthService } from '../services/auth';
import { NotificationService } from '../services/notifications';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-dashboard.html',
  styleUrls: ['./customer-dashboard.css']
})
export class CustomerDashboardComponent implements OnInit {

  loans:any[]=[];
  emis:any[]=[];
  receipts:any[]=[];

  totalOutstanding=0;
  nextEmi=0;
  activeLoans=0;
  totalPaid=0;

  notification:any=null;
  payingId:number|null=null;

  showReceiptModal=false;
  selectedReceipt:any=null;

  showPaymentModal=false;
  selectedEmi:any=null;

  // 🔔 NOTIFICATION
  notifications:any[]=[];
  unreadCount=0;
  showNotif=false;

  constructor(
    private service:CustomerDashboardService,
    private auth:AuthService,
    public router:Router,
    private cdr:ChangeDetectorRef,
    private notify:NotificationService
  ){}

  ngOnInit(){
    this.loadDashboard();
    this.loadNotif();
  }

  loadNotif(){
    this.notify.getMyNotifications().subscribe(res=>{
      this.notifications=res;
      this.unreadCount = res.filter(x=>!x.isRead).length;
    });
  }

  toggleNotif(){ this.showNotif=!this.showNotif; }

  openNotif(n:any){
    if(!n.isRead){
      this.notify.markRead(n.notificationId).subscribe(()=>{
        n.isRead=true;
        this.unreadCount--;
      });
    }
  }

  // ---------------- DASHBOARD ----------------

  loadDashboard(){

    this.totalOutstanding=0;
    this.totalPaid=0;
    this.receipts=[];

    this.service.getMyLoans().subscribe((loanRes:any)=>{
      this.loans=loanRes || [];
      this.activeLoans=this.loans.filter(l=>l.status=="Approved").length;
      this.cdr.detectChanges();
    });

    this.service.getMyEmis().subscribe((emis:any)=>{
      this.emis=emis || [];
      this.nextEmi=this.emis.length?this.emis[0].emi:0;

      this.emis.forEach(e=>{
        this.service.getOutstanding(e.loanApplicationId).subscribe((o:any)=>{
          this.totalOutstanding += o?.outstanding || 0;
          this.cdr.detectChanges();
        });

        this.service.getReceipts(e.loanApplicationId).subscribe((r:any)=>{
          if(Array.isArray(r)){
            this.receipts.push(...r);
            r.forEach((x:any)=>this.totalPaid+=x.paidAmount);
          }
          this.cdr.detectChanges();
        });
      });

      this.cdr.detectChanges();
    });
  }

  // ---------------- PAYMENT ----------------

  openPaymentModal(emi:any){
    this.selectedEmi=emi;
    this.showPaymentModal=true;
  }

  closePaymentModal(){ this.showPaymentModal=false; }

  confirmPayment(){
    this.pay(this.selectedEmi.loanApplicationId);
    this.closePaymentModal();
  }

  pay(id:number){
    this.payingId=id;
    this.service.payEmi(id).subscribe({
      next:()=>{
        this.notification={type:'success',message:'EMI paid successfully ✓'};
        this.payingId=null;
        this.loadDashboard();
        this.loadNotif();          // 🔔 refresh bell
        this.autoHide();
      },
      error:()=>{
        this.notification={type:'error',message:'Payment failed'};
        this.payingId=null;
        this.autoHide();
      }
    });
  }

  autoHide(){
    setTimeout(()=>{this.notification=null;this.cdr.detectChanges();},4000);
  }

  // ---------------- RECEIPT ----------------

  openReceiptModal(r:any){
  this.selectedReceipt = r;
  this.showReceiptModal = true;
  document.body.classList.add('modal-open');
}

closeReceiptModal(){
  this.showReceiptModal = false;
  document.body.classList.remove('modal-open');
}


  downloadReceipt(){ alert("Receipt downloaded successfully!"); }

  scrollToReceipts(){
    document.querySelector('.transactions-section')?.scrollIntoView({behavior:'smooth'});
  }

  closeNotification(){
    this.notification=null;
    this.cdr.detectChanges();
  }

  logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
