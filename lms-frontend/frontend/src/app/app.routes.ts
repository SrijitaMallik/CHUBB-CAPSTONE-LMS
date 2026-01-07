import { NotificationsComponent } from './admin/notifications/notifications';
import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Dashboard } from './admin/dashboard/dashboard';
import { PendingOfficers } from './admin/pending-officers/pending-officers';
import { AdminLayout } from './admin/layout/admin-layout/admin-layout'
import { LoanTypes } from './admin/loan-types/loan-types';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard';
import { ApplyLoanComponent } from './customer-dashboard/apply-loan/apply-loan';
import { MyLoansComponent } from './customer-dashboard/my-loans/my-loans';
import { OfficerHomeComponent } from './officer-home/officer-home';
import { OfficerApplicationsComponent } from './officer-applications/officer-applications';
import { OfficerLayoutComponent } from './officer-layout/officer-layout';
import { OfficerReportsComponent } from './officer-reports/officer-reports';
import {AllLoansComponent} from'./admin/all-loans/all-loans';
//import {CustomersComponent} from'./admin/customer/customer';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

 {
 path:'admin',
 component:AdminLayout,
 children:[
  {path:'',component:Dashboard},
  {path:'officers',component:PendingOfficers},
  {path:'loans',component:ApplyLoanComponent},
  //{path:'reports',component:AdminReportsComponent},
  {path:'loan-types',component:LoanTypes},
  {path:'all-loans',component:AllLoansComponent},
//{path:'customers',component:CustomersComponent},
{path:'notifications',component:NotificationsComponent}
 ]
},
  { path: 'customer-dashboard', component: CustomerDashboardComponent },
  { path: 'apply-loan', component: ApplyLoanComponent },
  { path: 'my-loans', component: MyLoansComponent },
   {path:'loan-officer',
    component: OfficerLayoutComponent,
    children:[
      { path:'dashboard', component: OfficerHomeComponent },
      { path:'applications', component: OfficerApplicationsComponent },
      { path:'reports', component: OfficerReportsComponent } // (create later)
    ]
  }
];
