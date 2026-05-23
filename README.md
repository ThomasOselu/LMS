# MicroLend LMS — Microfinance Loan Management System

A complete, mobile-friendly web application for managing individual microloans.

## Features

### 📊 Dashboard
- Live portfolio summary (total portfolio, active loans, PAR 30, borrower count)
- Monthly disbursements vs collections bar chart
- Recent repayments feed
- Pending applications quick-view

### 👥 Borrower Management
- Register new borrowers (personal info, income, guarantor)
- Search/filter by name, ID, phone, status
- Borrower profile view with credit score ring and loan history
- One-click new loan from borrower profile

### 📄 Loan Portfolio
- Full loan listing with search and status tabs (All / Active / Overdue / Closed)
- Loan detail view: full terms, payment history, amortisation schedule
- Repayment progress bar per loan
- Loan origination form with built-in EMI calculator

### 📋 Loan Applications
- Submit new applications (with auto credit scoring)
- Approve / Reject with one click
- One-click disburse (pre-fills new loan form)

### 💳 Repayments
- Full repayment register with tabs (All / Paid / Pending / Overdue)
- Today's collection summary (collected, due, overdue)

### 📲 Record Collection
- Manual payment entry for M-Pesa, Cash, Bank Transfer, Cheque
- Loan lookup by ID (shows balance and EMI)
- M-Pesa Paybill instructions displayed
- Instant confirmation with receipt reference

### 📈 Reports & Analytics
- PAR 30 trend chart
- Portfolio by product (donut chart)
- Repayment rate by product (progress bars)
- Monthly performance table (exportable)

---

## Setup Instructions

### Option 1: Open directly in browser (simplest)
1. Unzip the folder
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)
3. No server or installation required

### Option 2: Deploy to a web server
Upload the entire `microlend/` folder to any web host:
- **cPanel hosting**: Upload via File Manager, point domain to the folder
- **Netlify (free)**: Drag and drop the folder at netlify.com/drop
- **GitHub Pages**: Push to a repo, enable Pages from Settings
- **Local server**: `cd microlend && python3 -m http.server 8080`

---

## File Structure

```
microlend/
├── index.html          ← Main application (all pages)
├── css/
│   └── style.css       ← Mobile-first stylesheet
├── js/
│   ├── data.js         ← Data store, models, calculations
│   └── app.js          ← UI renderers, page logic, event handlers
└── README.md           ← This file
```

---

## Customisation

### Change institution name & settings
In `js/data.js`, edit the `DB.settings` object:
```js
settings: {
  institution: 'Your MFI Name',
  branch: 'Your Branch',
  currency: 'KES',
  manager: 'Manager Name',
  mpesaParatill: 'YOUR_PAYBILL',
},
```

### Add loan products
In `index.html`, find the `<select id="nl-product">` element and add `<option>` entries.

### Connect to a backend / database
Replace the `DB` object in `data.js` with `fetch()` API calls to your backend.
All functions use `async/await`-compatible patterns.

### Add M-Pesa Daraja API integration
Replace the manual payment form with a real-time C2B listener from
[Safaricom Daraja API](https://developer.safaricom.co.ke/) for automatic reconciliation.

---

## Browser Support
Chrome 90+, Firefox 88+, Safari 14+, Edge 90+  
Fully responsive: works on phones (375px+), tablets, and desktops.

---

*MicroLend LMS — Built for Kenyan Microfinance Institutions*
