/* ============================================================
   MicroLend LMS — UI Renderers & Page Logic
   ============================================================ */

/* ── Navigation ── */
let currentPage = 'dashboard';

function nav(page) {
  currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + page));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === page));
  const titles = {
    dashboard: 'Dashboard', borrowers: 'Borrowers', 'new-borrower': 'Register Borrower',
    loans: 'Loan Portfolio', 'new-loan': 'New Loan', 'loan-detail': 'Loan Detail',
    applications: 'Loan Applications', repayments: 'Repayments',
    collections: 'Record Collection', reports: 'Reports & Analytics',
    'borrower-detail': 'Borrower Profile'
  };
  document.getElementById('page-title').textContent = titles[page] || page;
  closeSidebar();
  window.scrollTo(0,0);
  if (page === 'dashboard') renderDashboard();
  if (page === 'borrowers') renderBorrowers(DB.borrowers);
  if (page === 'loans') renderLoans('all');
  if (page === 'applications') renderApplications();
  if (page === 'repayments') renderRepayments('all');
  if (page === 'reports') renderReports();
  if (page === 'collections') renderCollectionsPage();
}

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-backdrop').classList.add('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-backdrop').classList.remove('show');
}

/* ── DASHBOARD ── */
function renderDashboard() {
  const s = portfolioStats();
  document.getElementById('stat-portfolio').textContent = 'KES ' + fmt(s.totalPortfolio);
  document.getElementById('stat-active').textContent = s.activeLoanCount;
  document.getElementById('stat-par').textContent = s.par + '%';
  document.getElementById('stat-borrowers').textContent = s.totalBorrowers;

  // Recent repayments
  const recent = [...DB.repayments].sort((a,b)=>b.id.localeCompare(a.id)).slice(0,5);
  document.getElementById('recent-repayments').innerHTML = recent.map(r => {
    const b = getBorrower(r.borrowerId);
    const ic = r.status==='paid'?'ic-green':'ic-red';
    const icon = r.status==='paid'?'✓':'!';
    return `<div class="list-item">
      <div class="list-icon ${ic}">${icon}</div>
      <div class="list-body">
        <div class="list-title">${b?b.name:r.borrowerId}</div>
        <div class="list-sub">${r.loanId} · ${r.channel||'Pending'}</div>
      </div>
      <div class="list-meta">
        <div class="list-amount">KES ${fmt(r.paid||r.expected)}</div>
        <div class="list-date">${fmtDate(r.date)}</div>
      </div>
    </div>`;
  }).join('');

  // Pending applications
  const pending = DB.applications.filter(a => a.status==='pending').slice(0,4);
  document.getElementById('pending-apps').innerHTML = pending.map(a => `
    <div class="list-item">
      <div class="list-icon ic-blue">📋</div>
      <div class="list-body">
        <div class="list-title">${a.name}</div>
        <div class="list-sub">${a.product} · KES ${fmt(a.amount)}</div>
      </div>
      <div class="list-meta">
        <span class="badge badge-pending">Pending</span>
        <div class="list-date">${fmtDate(a.appliedDate)}</div>
      </div>
    </div>`).join('') || '<div class="empty-state"><p>No pending applications</p></div>';

  renderDashboardChart();
}

function renderDashboardChart() {
  const ctx = document.getElementById('disbChart');
  if (!ctx) return;
  if (window._disbChart) { window._disbChart.destroy(); }
  window._disbChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
      datasets: [{
        label: 'Disbursed (KES M)',
        data: [3.2,4.1,3.8,5.2,4.8,6.1,5.5,6.4],
        backgroundColor: '#0D5EAF',
        borderRadius: 5,
        borderSkipped: false,
      },{
        label: 'Collected (KES M)',
        data: [2.9,3.8,3.6,4.9,4.5,5.8,5.2,6.1],
        backgroundColor: '#1a7a3c',
        borderRadius: 5,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { font:{size:10} }, grid:{display:false} },
        y: { ticks: { font:{size:10}, callback:v=>v+'M' }, grid:{color:'rgba(0,0,0,0.05)'} }
      }
    }
  });
}

/* ── BORROWERS ── */
function renderBorrowers(list) {
  const tbody = document.getElementById('borrowers-body');
  if (!list.length) { tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">👥</div><p>No borrowers found</p></div></td></tr>'; return; }
  tbody.innerHTML = list.map(b => {
    const activeLoans = getBorrowerLoans(b.id).filter(l=>l.status==='active'||l.status==='overdue').length;
    return `<tr onclick="openBorrowerDetail('${b.id}')" style="cursor:pointer;">
      <td>
        <div class="flex gap-8">
          <div style="width:32px;height:32px;border-radius:50%;background:var(--primary-light);display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:700;color:var(--primary);flex-shrink:0;">${b.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
          <div><div style="font-weight:600;font-size:0.85rem;">${b.name}</div><div class="text-muted text-small">${b.idNo}</div></div>
        </div>
      </td>
      <td class="text-small">${b.phone}</td>
      <td class="text-small">${b.occupation}</td>
      <td style="text-align:center;">${activeLoans}</td>
      <td><span style="color:${scoreColor(b.creditScore)};font-weight:700;">${b.creditScore}</span></td>
      <td><span class="badge badge-${b.status}">${b.status.charAt(0).toUpperCase()+b.status.slice(1)}</span></td>
      <td><button class="btn btn-outline btn-sm" onclick="event.stopPropagation();openBorrowerDetail('${b.id}')">View</button></td>
    </tr>`;
  }).join('');
}

function filterBorrowers() {
  const q = document.getElementById('borrower-search').value.toLowerCase();
  const status = document.getElementById('borrower-filter-status').value;
  let list = DB.borrowers;
  if (q) list = list.filter(b => b.name.toLowerCase().includes(q) || b.idNo.includes(q) || b.phone.includes(q));
  if (status) list = list.filter(b => b.status === status);
  renderBorrowers(list);
}

function openBorrowerDetail(id) {
  const b = getBorrower(id);
  if (!b) return;
  const loans = getBorrowerLoans(id);
  const el = document.getElementById('page-borrower-detail');
  el.innerHTML = `
    <div class="page-header flex-between">
      <div>
        <button class="btn btn-ghost btn-sm" onclick="nav('borrowers')">← Back</button>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-primary btn-sm" onclick="openNewLoanForBorrower('${id}')">+ New Loan</button>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
          <div style="width:60px;height:60px;border-radius:50%;background:var(--primary-light);display:flex;align-items:center;justify-content:center;font-size:1.3rem;font-weight:700;color:var(--primary);">${b.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
          <div>
            <div style="font-size:1.1rem;font-weight:700;">${b.name}</div>
            <div class="text-muted text-small">${b.occupation} · ${b.address}</div>
            <span class="badge badge-${b.status} mt-8">${b.status.charAt(0).toUpperCase()+b.status.slice(1)}</span>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.82rem;">
          ${[['ID Number',b.idNo],['Phone',b.phone],['Email',b.email],['Date of Birth',fmtDate(b.dob)],['Monthly Income','KES '+fmt(b.monthlyIncome)],['Member Since',fmtDate(b.joined)],['Guarantor',b.guarantor],['Guarantor Phone',b.guarantorPhone]].map(([k,v])=>`<div><div class="text-muted" style="font-size:0.72rem;">${k}</div><div style="font-weight:600;">${v}</div></div>`).join('')}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-body" style="display:flex;align-items:center;gap:20px;">
        <div class="score-ring">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="#e9ecef" stroke-width="8"/>
            <circle cx="40" cy="40" r="32" fill="none" stroke="${scoreColor(b.creditScore)}" stroke-width="8"
              stroke-dasharray="${Math.round(b.creditScore/1000*201)} 201" stroke-linecap="round"/>
          </svg>
          <div class="score-val">
            <span class="score-num" style="color:${scoreColor(b.creditScore)}">${b.creditScore}</span>
            <span class="score-lbl">/ 1000</span>
          </div>
        </div>
        <div>
          <div style="font-size:1rem;font-weight:700;color:${scoreColor(b.creditScore)};">${scoreLabel(b.creditScore)}</div>
          <div class="text-small text-muted">Credit Score</div>
          <div class="text-small mt-8">Based on payment history,<br>income, and loan utilisation</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title">Loan History (${loans.length})</div></div>
      <div style="overflow-x:auto;">
        <table class="tbl" style="min-width:500px;">
          <thead><tr><th>Loan ID</th><th>Product</th><th>Principal</th><th>Balance</th><th>Status</th></tr></thead>
          <tbody>${loans.map(l=>`<tr onclick="openLoanDetail('${l.id}')" style="cursor:pointer;">
            <td class="td-primary">${l.id}</td><td>${l.product}</td><td>KES ${fmt(l.principal)}</td><td>KES ${fmt(l.balance)}</td>
            <td><span class="badge badge-${l.status}">${l.status}</span></td>
          </tr>`).join('') || '<tr><td colspan="5"><div class="empty-state"><p>No loans yet</p></div></td></tr>'}</tbody>
        </table>
      </div>
    </div>`;
  nav('borrower-detail');
}

/* ── NEW BORROWER FORM ── */
function renderNewBorrowerForm() {
  nav('new-borrower');
}

function submitNewBorrower() {
  const f = id => document.getElementById(id).value.trim();
  const name = f('nb-name'), phone = f('nb-phone'), idNo = f('nb-id'), occupation = f('nb-occupation'), income = f('nb-income'), address = f('nb-address');
  if (!name || !phone || !idNo || !occupation || !income) { showAlert('danger','Please fill all required fields.'); return; }
  const newB = {
    id: nextBorrId(), name, idNo, phone, email: f('nb-email'), dob: f('nb-dob'),
    gender: f('nb-gender'), address, occupation, monthlyIncome: parseInt(income),
    creditScore: Math.floor(500 + Math.random()*300),
    status: 'active', joined: today(), guarantor: f('nb-guarantor'), guarantorPhone: f('nb-guarantor-phone'), photo: null, loans: []
  };
  DB.borrowers.push(newB);
  showToast('Borrower registered: ' + name + ' (' + newB.id + ')');
  nav('borrowers');
}

/* ── LOANS ── */
let loanTabFilter = 'all';
function renderLoans(filter) {
  loanTabFilter = filter;
  let list = filter === 'all' ? DB.loans : DB.loans.filter(l => l.status === filter);
  const tbody = document.getElementById('loans-body');
  if (!list.length) { tbody.innerHTML='<tr><td colspan="8"><div class="empty-state"><div class="empty-icon">📄</div><p>No loans in this category</p></div></td></tr>'; return; }
  tbody.innerHTML = list.map(l => {
    const b = getBorrower(l.borrowerId);
    const pct = Math.round(l.totalPaid / (l.principal + l.principal*l.interestRate/100) * 100);
    const pc = progressColor(pct);
    return `<tr onclick="openLoanDetail('${l.id}')" style="cursor:pointer;">
      <td class="td-primary">${l.id}</td>
      <td style="font-weight:600;">${b?b.name:'—'}</td>
      <td class="text-small">${l.product}</td>
      <td>KES ${fmt(l.principal)}</td>
      <td style="font-weight:600;">KES ${fmt(l.balance)}</td>
      <td style="min-width:100px;">
        <div style="display:flex;align-items:center;gap:6px;">
          <div class="progress" style="flex:1;"><div class="progress-bar ${pc}" style="width:${pct}%"></div></div>
          <span class="text-small">${pct}%</span>
        </div>
      </td>
      <td class="text-small">${fmtDate(l.nextDueDate)}</td>
      <td><span class="badge badge-${l.status}">${l.status}</span></td>
    </tr>`;
  }).join('');
}

function filterLoans() {
  const q = document.getElementById('loan-search').value.toLowerCase();
  let list = loanTabFilter==='all'?DB.loans:DB.loans.filter(l=>l.status===loanTabFilter);
  if (q) list = list.filter(l=>{
    const b = getBorrower(l.borrowerId);
    return l.id.toLowerCase().includes(q)||(b&&b.name.toLowerCase().includes(q))||l.product.toLowerCase().includes(q);
  });
  const tbody = document.getElementById('loans-body');
  if (!list.length){tbody.innerHTML='<tr><td colspan="8"><div class="empty-state"><p>No results</p></div></td></tr>';return;}
  renderLoansInBody(list, tbody);
}

function renderLoansInBody(list, tbody) {
  tbody.innerHTML = list.map(l => {
    const b = getBorrower(l.borrowerId);
    const pct = Math.round(l.totalPaid / (l.principal + l.principal*l.interestRate/100) * 100);
    const pc = progressColor(pct);
    return `<tr onclick="openLoanDetail('${l.id}')" style="cursor:pointer;">
      <td class="td-primary">${l.id}</td>
      <td style="font-weight:600;">${b?b.name:'—'}</td>
      <td class="text-small">${l.product}</td>
      <td>KES ${fmt(l.principal)}</td>
      <td style="font-weight:600;">KES ${fmt(l.balance)}</td>
      <td style="min-width:100px;">
        <div style="display:flex;align-items:center;gap:6px;">
          <div class="progress" style="flex:1;"><div class="progress-bar ${pc}" style="width:${pct}%"></div></div>
          <span class="text-small">${pct}%</span>
        </div>
      </td>
      <td class="text-small">${fmtDate(l.nextDueDate)}</td>
      <td><span class="badge badge-${l.status}">${l.status}</span></td>
    </tr>`;
  }).join('');
}

function openLoanDetail(id) {
  const l = getLoan(id);
  if (!l) return;
  const b = getBorrower(l.borrowerId);
  const schedule = generateSchedule(l.principal, l.interestRate, l.tenure, l.disbursedDate);
  const pct = Math.round(l.totalPaid / (l.principal + l.principal*l.interestRate/100) * 100);
  const payments = DB.repayments.filter(r => r.loanId === id);

  const el = document.getElementById('page-loan-detail');
  el.innerHTML = `
    <div class="page-header flex-between">
      <button class="btn btn-ghost btn-sm" onclick="nav('loans')">← Back</button>
      ${l.status==='active'?`<button class="btn btn-primary btn-sm" onclick="openRecordPayment('${id}')">Record Payment</button>`:''}
    </div>

    <div class="card">
      <div class="card-body">
        <div class="flex-between mb-12">
          <div>
            <div style="font-size:1rem;font-weight:700;color:var(--primary);">${l.id}</div>
            <div class="text-muted text-small">${l.product} · ${l.repaymentSchedule} repayment</div>
          </div>
          <span class="badge badge-${l.status}" style="font-size:0.8rem;">${l.status}</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:0.82rem;">
          ${[
            ['Borrower',b?b.name:'—'],
            ['Principal','KES '+fmt(l.principal)],
            ['Interest Rate',l.interestRate+'% p.a.'],
            ['Tenure',l.tenure+' '+l.tenureUnit],
            ['Monthly EMI','KES '+fmt(Math.round(calcEMI(l.principal,l.interestRate,l.tenure)))],
            ['Disbursed',fmtDate(l.disbursedDate)],
            ['Purpose',l.purpose],
            ['Collateral',l.collateral],
            ['Loan Officer',l.officer],
            ['Next Due',fmtDate(l.nextDueDate)],
          ].map(([k,v])=>`<div><div class="text-muted" style="font-size:0.7rem;">${k}</div><div style="font-weight:600;">${v}</div></div>`).join('')}
        </div>
        <div class="divider"></div>
        <div class="flex-between" style="font-size:0.82rem;margin-bottom:8px;">
          <span class="text-muted">Repayment progress</span><span style="font-weight:700;">${pct}%</span>
        </div>
        <div class="progress"><div class="progress-bar ${progressColor(pct)}" style="width:${pct}%"></div></div>
        <div class="flex-between mt-8 text-small">
          <span>Paid: <strong>KES ${fmt(l.totalPaid)}</strong></span>
          <span>Balance: <strong style="color:var(--danger);">KES ${fmt(l.balance)}</strong></span>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Payment History (${payments.length})</div>
      </div>
      <div class="card-body" style="padding:0;">
        <div style="overflow-x:auto;">
          <table class="tbl" style="min-width:420px;">
            <thead><tr><th>Date</th><th>Expected</th><th>Paid</th><th>Channel</th><th>Status</th></tr></thead>
            <tbody>${payments.map(r=>`<tr>
              <td class="text-small">${fmtDate(r.date)}</td>
              <td>KES ${fmt(r.expected)}</td>
              <td style="font-weight:600;">KES ${fmt(r.paid)}</td>
              <td class="text-small">${r.channel||'—'}</td>
              <td><span class="badge badge-${r.status==='paid'?'active':r.status}">${r.status}</span></td>
            </tr>`).join('') || '<tr><td colspan="5" class="text-muted" style="text-align:center;padding:12px;">No payments recorded</td></tr>'}</tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title">Repayment Schedule</div></div>
      <div class="card-body" style="padding:12px 16px;">
        <div class="schedule-grid head">
          <div>#</div><div>Due Date</div><div>EMI</div><div>Interest</div><div>Balance</div>
        </div>
        ${schedule.map((row,i) => `
          <div class="schedule-grid" style="${i<payments.filter(r=>r.status==='paid').length?'opacity:0.5;':''}">
            <div style="font-weight:700;color:var(--gray-500);">${row.no}</div>
            <div>${fmtDate(row.date)}</div>
            <div style="font-weight:600;">KES ${fmt(row.emi)}</div>
            <div class="text-muted">KES ${fmt(row.interest)}</div>
            <div>KES ${fmt(row.balance)}</div>
          </div>`).join('')}
      </div>
    </div>`;
  nav('loan-detail');
}

function openNewLoanForBorrower(borrowerId) {
  document.getElementById('nl-borrower').value = borrowerId;
  const b = getBorrower(borrowerId);
  if (b) document.getElementById('nl-borrower-name').textContent = b.name + ' (' + b.id + ')';
  nav('new-loan');
  updateLoanCalc();
}

/* ── NEW LOAN FORM ── */
function updateLoanCalc() {
  const p = parseFloat(document.getElementById('nl-amount').value)||0;
  const r = parseFloat(document.getElementById('nl-rate').value)||0;
  const t = parseInt(document.getElementById('nl-tenure').value)||0;
  if (!p||!r||!t) { document.getElementById('nl-emi-display').textContent='—'; return; }
  const emi = Math.round(calcEMI(p,r,t));
  const total = emi * t;
  const interest = total - p;
  document.getElementById('nl-emi-display').textContent = 'KES ' + fmt(emi) + ' / month';
  document.getElementById('nl-total-display').textContent = 'Total repayable: KES ' + fmt(total) + ' (Interest: KES ' + fmt(interest) + ')';
}

function submitNewLoan() {
  const f = id => document.getElementById(id).value.trim();
  const borrowerId = f('nl-borrower');
  const amount = parseFloat(f('nl-amount'));
  const rate = parseFloat(f('nl-rate'));
  const tenure = parseInt(f('nl-tenure'));
  const product = f('nl-product');
  const purpose = f('nl-purpose');
  if (!borrowerId||!amount||!rate||!tenure||!product||!purpose) { showAlert('danger','Fill all required fields.'); return; }
  const b = getBorrower(borrowerId);
  if (!b) { showAlert('danger','Borrower ID not found.'); return; }
  const newLoan = {
    id: nextLoanId(), borrowerId, product, principal: amount, interestRate: rate, tenure,
    tenureUnit: 'months', disbursedDate: f('nl-disburse-date')||today(),
    purpose, status: 'active', repaymentSchedule: 'monthly',
    balance: amount, totalPaid: 0,
    nextDueDate: new Date(new Date(f('nl-disburse-date')||today()).setMonth(new Date(f('nl-disburse-date')||today()).getMonth()+1)).toISOString().slice(0,10),
    officer: DB.settings.manager, collateral: f('nl-collateral')||'Guarantor', approved: today(), approvedBy: DB.settings.manager
  };
  DB.loans.push(newLoan);
  if (!b.loans) b.loans = [];
  b.loans.push(newLoan.id);
  showToast('Loan ' + newLoan.id + ' created and disbursed to ' + b.name);
  nav('loans');
}

/* ── APPLICATIONS ── */
function renderApplications() {
  const list = DB.applications;
  const pending = list.filter(a=>a.status==='pending').length;
  document.getElementById('app-pending-count').textContent = pending;
  document.getElementById('app-approved-count').textContent = list.filter(a=>a.status==='approved').length;
  document.getElementById('app-rejected-count').textContent = list.filter(a=>a.status==='rejected').length;
  const tbody = document.getElementById('apps-body');
  tbody.innerHTML = list.map(a => `<tr>
    <td>
      <div style="font-weight:600;">${a.name}</div>
      <div class="text-muted text-small">ID: ${a.idNo}</div>
    </td>
    <td class="text-small">${a.product}</td>
    <td style="font-weight:600;">KES ${fmt(a.amount)}</td>
    <td style="color:${scoreColor(a.creditScore)};font-weight:700;">${a.creditScore} <span class="text-muted text-small">${scoreLabel(a.creditScore)}</span></td>
    <td class="text-small">${a.purpose}</td>
    <td class="text-small">${fmtDate(a.appliedDate)}</td>
    <td><span class="badge badge-${a.status}">${a.status}</span></td>
    <td>
      ${a.status==='pending'
        ? `<button class="btn btn-success btn-sm" onclick="approveApp('${a.id}')">Approve</button>
           <button class="btn btn-ghost btn-sm" onclick="rejectApp('${a.id}')" style="margin-top:4px;">Reject</button>`
        : a.status==='approved'
          ? `<button class="btn btn-primary btn-sm" onclick="disburseApp('${a.id}')">Disburse</button>`
          : '<span class="text-muted text-small">—</span>'}
    </td>
  </tr>`).join('');
}

function approveApp(id) {
  const app = DB.applications.find(a=>a.id===id);
  if (app) { app.status='approved'; showToast('Application approved for ' + app.name); renderApplications(); }
}
function rejectApp(id) {
  const app = DB.applications.find(a=>a.id===id);
  if (app) { app.status='rejected'; showToast('Application rejected for ' + app.name); renderApplications(); }
}
function disburseApp(id) {
  const app = DB.applications.find(a=>a.id===id);
  if (!app) return;
  document.getElementById('nl-borrower-name').textContent = app.name + ' (New borrower)';
  document.getElementById('nl-amount').value = app.amount;
  document.getElementById('nl-product').value = app.product;
  document.getElementById('nl-purpose').value = app.purpose;
  document.getElementById('nl-rate').value = 18;
  document.getElementById('nl-tenure').value = 12;
  document.getElementById('nl-borrower').value = 'BRW_FROM_APP';
  updateLoanCalc();
  nav('new-loan');
}

/* ── REPAYMENTS ── */
let rpyTabFilter = 'all';
function renderRepayments(filter) {
  rpyTabFilter = filter;
  let list = filter==='all' ? DB.repayments : DB.repayments.filter(r=>r.status===filter);
  list = [...list].sort((a,b)=>b.id.localeCompare(a.id));
  const todayPaid = DB.repayments.filter(r=>r.status==='paid'&&r.date===today()).reduce((s,r)=>s+r.paid,0);
  const todayDue = DB.repayments.filter(r=>r.date===today()).reduce((s,r)=>s+r.expected,0);
  document.getElementById('rpy-collected').textContent = 'KES '+fmt(todayPaid);
  document.getElementById('rpy-due').textContent = 'KES '+fmt(todayDue);
  document.getElementById('rpy-overdue-amt').textContent = 'KES '+fmt(DB.repayments.filter(r=>r.status==='overdue').reduce((s,r)=>s+r.expected,0));
  const tbody = document.getElementById('rpy-body');
  tbody.innerHTML = list.map(r => {
    const b = getBorrower(r.borrowerId);
    return `<tr>
      <td style="font-weight:600;">${b?b.name:r.borrowerId}</td>
      <td class="td-primary text-small">${r.loanId}</td>
      <td>KES ${fmt(r.expected)}</td>
      <td style="font-weight:600;color:${r.paid>0?'var(--success)':'var(--gray-400)'}">KES ${fmt(r.paid)}</td>
      <td class="text-small">${fmtDate(r.date)}</td>
      <td class="text-small">${r.channel||'—'}</td>
      <td class="text-small text-muted">${r.mpesaRef||'—'}</td>
      <td><span class="badge badge-${r.status==='paid'?'active':r.status}">${r.status}</span></td>
    </tr>`;
  }).join('') || '<tr><td colspan="8"><div class="empty-state"><p>No records</p></div></td></tr>';
}

/* ── COLLECTIONS ── */
function renderCollectionsPage() {
  document.getElementById('col-date').value = today();
}

function lookupLoan() {
  const id = document.getElementById('col-loan-id').value.trim().toUpperCase();
  const loan = getLoan(id);
  if (!loan) { document.getElementById('col-loan-info').innerHTML='<div class="alert alert-danger">Loan not found</div>'; return; }
  const b = getBorrower(loan.borrowerId);
  const emi = Math.round(calcEMI(loan.principal,loan.interestRate,loan.tenure));
  document.getElementById('col-amount').value = emi;
  document.getElementById('col-loan-info').innerHTML = `
    <div class="alert alert-info" style="flex-direction:column;gap:4px;">
      <div style="font-weight:700;">${b?b.name:'Unknown'}</div>
      <div class="text-small">Balance: KES ${fmt(loan.balance)} · EMI: KES ${fmt(emi)}</div>
      <div class="text-small">Status: <span class="badge badge-${loan.status}">${loan.status}</span></div>
    </div>`;
}

function recordPayment() {
  const loanId = document.getElementById('col-loan-id').value.trim().toUpperCase();
  const amount = parseFloat(document.getElementById('col-amount').value);
  const channel = document.getElementById('col-channel').value;
  const ref = document.getElementById('col-ref').value.trim()||'REF-'+Math.random().toString(36).slice(2,8).toUpperCase();
  const date = document.getElementById('col-date').value||today();
  const loan = getLoan(loanId);
  if (!loan) { showAlert('danger','Invalid loan ID'); return; }
  if (!amount || amount<=0) { showAlert('danger','Enter a valid amount'); return; }
  const newRpy = {
    id: nextRpyId(), loanId, borrowerId: loan.borrowerId, expected: amount, paid: amount,
    date, channel, mpesaRef: ref, status:'paid', recordedBy: DB.settings.manager
  };
  DB.repayments.push(newRpy);
  loan.totalPaid += amount;
  loan.balance = Math.max(0, loan.balance - amount);
  if (loan.balance === 0) loan.status = 'closed';
  document.getElementById('col-success').style.display = 'block';
  document.getElementById('col-success').innerHTML = `
    <div class="alert alert-success">
      ✓ Payment of KES ${fmt(amount)} recorded for ${loanId} via ${channel}. Ref: ${ref}
    </div>`;
  document.getElementById('col-loan-id').value = '';
  document.getElementById('col-amount').value = '';
  document.getElementById('col-ref').value = '';
  document.getElementById('col-loan-info').innerHTML = '';
  showToast('Payment recorded: KES ' + fmt(amount) + ' — ' + ref);
}

function openRecordPayment(loanId) {
  document.getElementById('col-loan-id').value = loanId;
  nav('collections');
  lookupLoan();
}

/* ── REPORTS ── */
function renderReports() {
  const stats = portfolioStats();
  document.getElementById('rpt-portfolio').textContent = 'KES ' + fmt(stats.totalPortfolio);
  document.getElementById('rpt-par').textContent = stats.par + '%';
  document.getElementById('rpt-overdue').textContent = stats.overdue;
  document.getElementById('rpt-borrowers').textContent = stats.totalBorrowers;

  // PAR chart
  const parCtx = document.getElementById('parChart');
  if (parCtx) {
    if (window._parChart) window._parChart.destroy();
    window._parChart = new Chart(parCtx, {
      type:'line',
      data:{
        labels:['Dec','Jan','Feb','Mar','Apr','May'],
        datasets:[{label:'PAR 30 (%)',data:[2.1,2.4,2.0,2.8,3.1,parseFloat(stats.par)],borderColor:'#b91c1c',backgroundColor:'rgba(185,28,28,0.08)',fill:true,tension:0.4,pointRadius:4}]
      },
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{font:{size:10}},grid:{display:false}},y:{ticks:{font:{size:10},callback:v=>v+'%'},grid:{color:'rgba(0,0,0,0.05)'}}}}
    });
  }

  // Product breakdown donut
  const pdCtx = document.getElementById('productChart');
  if (pdCtx) {
    if (window._pdChart) window._pdChart.destroy();
    const products = {};
    DB.loans.filter(l=>l.status!=='closed').forEach(l => { products[l.product]=(products[l.product]||0)+l.balance; });
    window._pdChart = new Chart(pdCtx, {
      type:'doughnut',
      data:{
        labels:Object.keys(products),
        datasets:[{data:Object.values(products),backgroundColor:['#0D5EAF','#1a7a3c','#b45309','#0e6e8a'],borderWidth:0}]
      },
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:10},padding:8}}}}
    });
  }
}

/* ── NEW APPLICATION ── */
function submitNewApplication() {
  const f = id => document.getElementById(id).value.trim();
  const name=f('na-name'),idNo=f('na-id'),phone=f('na-phone'),product=f('na-product'),amount=f('na-amount'),purpose=f('na-purpose'),income=f('na-income');
  if(!name||!idNo||!phone||!product||!amount||!purpose||!income){showAlert('danger','Fill all required fields.');return;}
  const score = Math.floor(480+Math.random()*380);
  const newApp = {id:nextAppId(),borrowerId:null,name,idNo,product,amount:parseFloat(amount),purpose,occupation:f('na-occupation'),income:parseFloat(income),creditScore:score,appliedDate:today(),status:'pending',officer:DB.settings.manager};
  DB.applications.push(newApp);
  showToast('Application submitted for '+name+' — Credit score: '+score);
  closeModal('modal-new-app');
  if(currentPage==='applications') renderApplications();
}

/* ── MODALS ── */
function openModal(id) { document.getElementById(id).classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }

/* ── TOASTS & ALERTS ── */
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#212529;color:#fff;padding:10px 20px;border-radius:8px;font-size:0.83rem;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.2);max-width:90vw;text-align:center;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.display='block';
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>t.style.display='none',3500);
}

function showAlert(type, msg) {
  const el = document.getElementById('form-alert');
  if (!el) return;
  el.className = 'alert alert-'+type;
  el.textContent = msg;
  el.style.display = 'flex';
  setTimeout(()=>el.style.display='none',4000);
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => nav(l.dataset.page)));
  document.getElementById('menu-toggle').addEventListener('click', openSidebar);
  document.getElementById('sidebar-backdrop').addEventListener('click', closeSidebar);
  renderDashboard();
});
