# 🏦 Loan Management System

A secure, role-based **full-stack Loan Management System** that automates the complete loan lifecycle – from loan application to EMI payment and closure – ensuring transparency, security, and operational efficiency.

> Built using **ASP.NET Core Web API, Angular, and SQL Server**

---

## 📌 Project Objective

To create a digital platform that allows customers to apply for loans online, enables loan officers to verify and approve loans, and allows admins to manage loan schemes and users with complete transparency and security. 

---

## ⚙️ Tech Stack

| Layer          | Technology                                  |
| -------------- | ------------------------------------------- |
| Frontend       | Angular, TypeScript, Bootstrap/Material UI  |
| Backend        | ASP.NET Core Web API, Entity Framework Core |
| Authentication | JWT (Role-based Authorization)              |
| Database       | SQL Server                                  |
| Testing        | Swagger, Postman, Unit Testing              |

---

## 👥 User Roles

| Role         | Access                                   |
| ------------ | ---------------------------------------- |
| Admin        | System management & analytics            |
| Loan Officer | Loan verification & approvals            |
| Customer     | Loan application, EMI payment & receipts |

---

## 🔁 System Workflow

### 🧑 Customer

* Applies for loan
* Tracks loan status (Pending/Approved/Rejected)
* Views EMI schedule
* Pays EMI online
* Downloads payment receipts

### 🧑‍💼 Loan Officer

* Reviews loan applications
* Verifies customer details
* Approves or rejects loans
* Views loan history & repayment reports

### 👨‍💼 Admin

* Approves loan officer registrations
* Creates and manages loan types
* Monitors system analytics
* Oversees all loan operations

*(Workflow diagram & role flows are implemented as per project documentation)* 

---

## ✨ Key Features

### Admin

* Real-time analytics dashboard
* Manage loan types (interest, tenure, limits)
* Approve/reject loan officers
* View loan distribution charts
* System notifications & alerts 

### Loan Officer

* View & verify loan applications
* Approve / Reject loans
* Monitor EMI schedules & overdue payments
* Access loan reports & history 

### Customer

* View loan summary & EMI details
* Online EMI payments
* Download receipts
* Track loan status & transaction history 

---

## 🧪 Testing

* Swagger for API documentation
* Postman for API testing
* Unit testing for core business logic
* JWT based security testing 

---

## 🗄 Seeded Data

The system is preloaded with:

| Table            | Seeded Data                              |
| ---------------- | ---------------------------------------- |
| Roles            | Admin, LoanOfficer, Customer             |
| LoanTypes        | Home Loan, Education Loan, Business Loan |
| Admin User       | Default Admin Account                    |
| Sample Officers  | Pre-registered loan officers             |
| Sample Customers | Test customers for demo                  |

Seeded using **Entity Framework Core OnModelCreating()** for instant system readiness. 

---

## 🚀 Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/<your-username>/LoanManagementSystem
```

---

### 2️⃣ Backend Setup

```bash
cd LoanManagementSystem.API
```

* Update SQL Server connection string in `appsettings.json`
* Run migrations:

```bash
Add-Migration Initial
Update-Database
```

* Run API:

```bash
dotnet run
```

Swagger will open at:

```
http://localhost:5209/swagger
```

---

### 3️⃣ Frontend Setup

```bash
cd LoanManagementSystem.UI
npm install
ng serve
```

Open in browser:

```
http://localhost:4200
```

---

## 🔐 Default Seeded Login

| Role         | Email                                       | Password     |
| ------------ | ------------------------------------------- | ------------ |
| Admin        | [admin@lms.com](mailto:admin@lms.com)       | Admin@123    |
| Loan Officer | [officer@lms.com](mailto:officer@lms.com)   | Officer@123  |
| Customer     | [customer@lms.com](mailto:customer@lms.com) | Customer@123 |

---

## 📈 Result

A scalable and secure Loan Management System that:

* Digitizes loan processing
* Reduces manual errors
* Improves transparency
* Enhances customer experience

