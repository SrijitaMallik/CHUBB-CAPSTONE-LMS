import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NotificationService } from '../services/notifications';

@Component({
  selector:'app-officer-layout',
  standalone:true,
  imports:[CommonModule, RouterModule],   // 🔥 THIS FIXES EVERYTHING
  templateUrl:'./officer-layout.html',
  styleUrls:['./officer-layout.css']
})
export class OfficerLayoutComponent implements OnInit {

  notifications:any[]=[];
  unreadCount=0;
  showNotif=false;

  constructor(private router:Router,
              private notify:NotificationService){}

  ngOnInit(){ this.loadNotif(); }

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

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
