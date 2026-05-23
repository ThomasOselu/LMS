/* ============================================================
   MicroLend LMS — Data Store & Core Utilities
   ============================================================ */

const DB = {
  settings: {
    institution: 'MicroLend Finance',
    branch: 'Nairobi CBD',
    currency: 'KES',
    manager: 'Jane Muthoni',
    mpesaParatill: 'MICROLEND01',
  },

  borrowers: [
    { id:'BRW001', name:'Grace Wanjiru', idNo:'23118892', phone:'0712345678', email:'grace.w@email.com', dob:'1988-04-12', gender:'Female', address:'Westlands, Nairobi', occupation:'Retail trader', monthlyIncome:35000, creditScore:740, status:'active', joined:'2024-01-15', guarantor:'Peter Njoroge', guarantorPhone:'0723456789', photo:null, loans:['LN2041','LN1800'] },
    { id:'BRW002', name:'Peter Ochieng', idNo:'31988012', phone:'0723456789', email:'peter.o@email.com', dob:'1985-09-22', gender:'Male', address:'Kasarani, Nairobi', occupation:'Boda boda operator', monthlyIncome:22000, creditScore:610, status:'active', joined:'2024-02-28', guarantor:'Mary Akinyi', guarantorPhone:'0734567890', photo:null, loans:['LN1988'] },
    { id:'BRW003', name:'Mary Kamau', idNo:'40228774', phone:'0734567890', email:'mary.k@email.com', dob:'1992-07-03', gender:'Female', address:'Embakasi, Nairobi', occupation:'Teacher', monthlyIncome:48000, creditScore:780, status:'active', joined:'2024-03-10', guarantor:'John Mwenda', guarantorPhone:'0745678901', photo:null, loans:['LN1877'] },
    { id:'BRW004', name:'Joseph Mutua', idNo:'55109934', phone:'0745678901', email:'joseph.m@email.com', dob:'1979-12-18', gender:'Male', address:'Umoja, Nairobi', occupation:'Hardware shop owner', monthlyIncome:60000, creditScore:520, status:'overdue', joined:'2023-11-05', guarantor:'Alice Mwangi', guarantorPhone:'0756789012', photo:null, loans:['LN1654'] },
    { id:'BRW005', name:'Faith Akinyi', idNo:'62349010', phone:'0756789012', email:'faith.a@email.com', dob:'1995-03-27', gender:'Female', address:'Ruaraka, Nairobi', occupation:'Salon owner', monthlyIncome:28000, creditScore:820, status:'active', joined:'2023-09-20', guarantor:'Michael Oduya', guarantorPhone:'0767890123', photo:null, loans:['LN1520'] },
    { id:'BRW006', name:'John Mwangi', idNo:'71234567', phone:'0767890123', email:'john.m@email.com', dob:'1982-06-14', gender:'Male', address:'Thika Road, Nairobi', occupation:'Farmer', monthlyIncome:18000, creditScore:670, status:'active', joined:'2024-04-01', guarantor:'Sarah Kamau', guarantorPhone:'0778901234', photo:null, loans:['LN2099'] },
    { id:'BRW007', name:'Esther Njoroge', idNo:'80234499', phone:'0778901234', email:'esther.n@email.com', dob:'1990-11-08', gender:'Female', address:'South B, Nairobi', occupation:'Nurse', monthlyIncome:55000, creditScore:760, status:'active', joined:'2024-05-15', guarantor:'David Mwiti', guarantorPhone:'0789012345', photo:null, loans:['LN2112'] },
    { id:'BRW008', name:'Moses Otieno', idNo:'91023456', phone:'0789012345', email:'moses.o@email.com', dob:'1976-02-19', gender:'Male', address:'Mathare, Nairobi', occupation:'Mechanic', monthlyIncome:30000, creditScore:490, status:'overdue', joined:'2023-07-12', guarantor:'Ruth Anyango', guarantorPhone:'0790123456', photo:null, loans:['LN1901'] },
  ],

  loans: [
    { id:'LN2041', borrowerId:'BRW001', product:'Business Loan', principal:50000, interestRate:18, tenure:12, tenureUnit:'months', disbursedDate:'2025-06-15', purpose:'Stock purchase', status:'active', repaymentSchedule:'monthly', balance:21300, totalPaid:28700, nextDueDate:'2026-06-15', officer:'Jane Muthoni', collateral:'Business assets', approved:'2025-06-10', approvedBy:'Samuel Kamau' },
    { id:'LN1988', borrowerId:'BRW002', product:'Salary Advance', principal:30000, interestRate:15, tenure:6, tenureUnit:'months', disbursedDate:'2025-09-01', purpose:'House rent', status:'active', repaymentSchedule:'monthly', balance:8200, totalPaid:21800, nextDueDate:'2026-06-01', officer:'Jane Muthoni', collateral:'Guarantor', approved:'2025-08-28', approvedBy:'Jane Muthoni' },
    { id:'LN1877', borrowerId:'BRW003', product:'Business Loan', principal:20000, interestRate:18, tenure:12, tenureUnit:'months', disbursedDate:'2025-10-20', purpose:'Expand inventory', status:'active', repaymentSchedule:'monthly', balance:5400, totalPaid:14600, nextDueDate:'2026-05-23', officer:'Samuel Kamau', collateral:'Guarantor', approved:'2025-10-15', approvedBy:'Jane Muthoni' },
    { id:'LN1654', borrowerId:'BRW004', product:'Business Loan', principal:60000, interestRate:20, tenure:18, tenureUnit:'months', disbursedDate:'2025-03-01', purpose:'Expand shop', status:'overdue', repaymentSchedule:'monthly', balance:42000, totalPaid:18000, nextDueDate:'2026-05-01', officer:'Jane Muthoni', collateral:'Title deed', approved:'2025-02-20', approvedBy:'Samuel Kamau' },
    { id:'LN1520', borrowerId:'BRW005', product:'Business Loan', principal:45000, interestRate:18, tenure:12, tenureUnit:'months', disbursedDate:'2024-04-10', purpose:'Salon equipment', status:'closed', repaymentSchedule:'monthly', balance:0, totalPaid:45000, nextDueDate:null, officer:'Samuel Kamau', collateral:'Guarantor', approved:'2024-04-05', approvedBy:'Jane Muthoni' },
    { id:'LN2099', borrowerId:'BRW006', product:'Agricultural Loan', principal:25000, interestRate:14, tenure:12, tenureUnit:'months', disbursedDate:'2025-08-15', purpose:'Seeds and fertilizer', status:'active', repaymentSchedule:'monthly', balance:14500, totalPaid:10500, nextDueDate:'2026-06-01', officer:'Samuel Kamau', collateral:'Farm produce', approved:'2025-08-10', approvedBy:'Jane Muthoni' },
    { id:'LN2112', borrowerId:'BRW007', product:'Emergency Loan', principal:15000, interestRate:12, tenure:6, tenureUnit:'months', disbursedDate:'2025-11-01', purpose:'Medical expenses', status:'active', repaymentSchedule:'monthly', balance:3000, totalPaid:12000, nextDueDate:'2026-05-30', officer:'Jane Muthoni', collateral:'Guarantor', approved:'2025-10-30', approvedBy:'Samuel Kamau' },
    { id:'LN1901', borrowerId:'BRW008', product:'Business Loan', principal:70000, interestRate:20, tenure:18, tenureUnit:'months', disbursedDate:'2025-04-05', purpose:'Workshop tools', status:'overdue', repaymentSchedule:'monthly', balance:18700, totalPaid:51300, nextDueDate:'2026-05-05', officer:'Samuel Kamau', collateral:'Equipment', approved:'2025-03-28', approvedBy:'Jane Muthoni' },
  ],

  applications: [
    { id:'APP001', borrowerId:'BRW001', name:'Alice Njeri', idNo:'23445891', product:'Business Loan', amount:50000, purpose:'Stock purchase', occupation:'Trader', income:40000, creditScore:740, appliedDate:'2026-05-22', status:'pending', officer:'Jane Muthoni' },
    { id:'APP002', borrowerId:null, name:'David Kariuki', idNo:'31102567', product:'Agricultural Loan', amount:30000, purpose:'Seeds & tools', occupation:'Farmer', income:15000, creditScore:610, appliedDate:'2026-05-22', status:'pending', officer:'Samuel Kamau' },
    { id:'APP003', borrowerId:null, name:'Rose Achieng', idNo:'40218834', product:'Emergency Loan', amount:15000, purpose:'Medical bill', occupation:'Nurse', income:52000, creditScore:580, appliedDate:'2026-05-21', status:'pending', officer:'Jane Muthoni' },
    { id:'APP004', borrowerId:null, name:'Samuel Otieno', idNo:'55678901', product:'Business Loan', amount:80000, purpose:'Retail expansion', occupation:'Shop owner', income:65000, creditScore:720, appliedDate:'2026-05-20', status:'approved', officer:'Samuel Kamau' },
  ],

  repayments: [
    { id:'RPY001', loanId:'LN2041', borrowerId:'BRW001', expected:4500, paid:4500, date:'2026-05-22', channel:'M-Pesa', mpesaRef:'QHJ4BXKL3T', status:'paid', recordedBy:'Jane Muthoni' },
    { id:'RPY002', loanId:'LN1988', borrowerId:'BRW002', expected:2200, paid:2200, date:'2026-05-22', channel:'M-Pesa', mpesaRef:'QHK9MNPL2R', status:'paid', recordedBy:'Jane Muthoni' },
    { id:'RPY003', loanId:'LN1877', borrowerId:'BRW003', expected:1800, paid:0, date:'2026-05-22', channel:null, mpesaRef:null, status:'pending', recordedBy:null },
    { id:'RPY004', loanId:'LN1654', borrowerId:'BRW004', expected:6000, paid:0, date:'2026-05-01', channel:null, mpesaRef:null, status:'overdue', recordedBy:null },
    { id:'RPY005', loanId:'LN2099', borrowerId:'BRW006', expected:3100, paid:3100, date:'2026-05-21', channel:'Cash', mpesaRef:'RCPT-4421', status:'paid', recordedBy:'Samuel Kamau' },
    { id:'RPY006', loanId:'LN2112', borrowerId:'BRW007', expected:1500, paid:1500, date:'2026-05-22', channel:'Bank Transfer', mpesaRef:'TRF-8812', status:'paid', recordedBy:'Jane Muthoni' },
    { id:'RPY007', loanId:'LN1901', borrowerId:'BRW008', expected:5800, paid:0, date:'2026-05-05', channel:null, mpesaRef:null, status:'overdue', recordedBy:null },
    { id:'RPY008', loanId:'LN2041', borrowerId:'BRW001', expected:4500, paid:4500, date:'2026-04-15', channel:'M-Pesa', mpesaRef:'QGZ7PQMN8S', status:'paid', recordedBy:'Jane Muthoni' },
    { id:'RPY009', loanId:'LN1988', borrowerId:'BRW002', expected:2200, paid:2200, date:'2026-04-01', channel:'M-Pesa', mpesaRef:'QGX3KLMN9T', status:'paid', recordedBy:'Jane Muthoni' },
    { id:'RPY010', loanId:'LN2099', borrowerId:'BRW006', expected:3100, paid:3100, date:'2026-04-20', channel:'Cash', mpesaRef:'RCPT-4380', status:'paid', recordedBy:'Samuel Kamau' },
  ],
};

/* ── Derived helpers ── */
const fmt = n => Number(n).toLocaleString('en-KE');
const fmtDate = d => d ? new Date(d).toLocaleDateString('en-KE', {day:'2-digit',month:'short',year:'numeric'}) : '—';
const today = () => new Date().toISOString().slice(0,10);

function getBorrower(id) { return DB.borrowers.find(b => b.id === id); }
function getLoan(id) { return DB.loans.find(l => l.id === id); }
function getBorrowerLoans(bId) { return DB.loans.filter(l => l.borrowerId === bId); }

function scoreColor(s) {
  if (s >= 720) return '#1a7a3c';
  if (s >= 600) return '#b45309';
  return '#b91c1c';
}
function scoreLabel(s) {
  if (s >= 720) return 'Excellent';
  if (s >= 660) return 'Good';
  if (s >= 580) return 'Fair';
  return 'Poor';
}

function repaymentRate(loanId) {
  const loan = getLoan(loanId);
  if (!loan || loan.principal === 0) return 0;
  return Math.round((loan.totalPaid / (loan.principal + loan.principal * loan.interestRate / 100)) * 100);
}

function progressColor(pct) {
  if (pct >= 70) return 'success';
  if (pct >= 40) return 'warning';
  return 'danger';
}

function calcEMI(principal, annualRate, months) {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  return principal * r * Math.pow(1+r, months) / (Math.pow(1+r, months) - 1);
}

function generateSchedule(principal, annualRate, months, startDate) {
  const emi = calcEMI(principal, annualRate, months);
  let balance = principal;
  const r = annualRate / 100 / 12;
  const rows = [];
  let d = new Date(startDate);
  for (let i = 1; i <= months; i++) {
    d.setMonth(d.getMonth() + 1);
    const interest = balance * r;
    const principalPart = emi - interest;
    balance = Math.max(0, balance - principalPart);
    rows.push({ no: i, date: d.toISOString().slice(0,10), emi: Math.round(emi), interest: Math.round(interest), principal: Math.round(principalPart), balance: Math.round(balance) });
  }
  return rows;
}

function nextLoanId() {
  const nums = DB.loans.map(l => parseInt(l.id.replace('LN',''))).sort((a,b)=>b-a);
  return 'LN' + (nums[0] + 1);
}
function nextBorrId() {
  const nums = DB.borrowers.map(b => parseInt(b.id.replace('BRW',''))).sort((a,b)=>b-a);
  return 'BRW' + String(nums[0] + 1).padStart(3,'0');
}
function nextRpyId() {
  const nums = DB.repayments.map(r => parseInt(r.id.replace('RPY',''))).sort((a,b)=>b-a);
  return 'RPY' + String(nums[0] + 1).padStart(3,'0');
}
function nextAppId() {
  const nums = DB.applications.map(a => parseInt(a.id.replace('APP',''))).sort((a,b)=>b-a);
  return 'APP' + String(nums[0] + 1).padStart(3,'0');
}

/* ── Portfolio stats ── */
function portfolioStats() {
  const active = DB.loans.filter(l => l.status === 'active' || l.status === 'overdue');
  const totalPortfolio = active.reduce((s,l) => s + l.balance, 0);
  const overdue = DB.loans.filter(l => l.status === 'overdue');
  const overdueBalance = overdue.reduce((s,l) => s + l.balance, 0);
  const par = totalPortfolio > 0 ? ((overdueBalance / totalPortfolio) * 100).toFixed(1) : 0;
  const activeLoanCount = active.length;
  const totalBorrowers = DB.borrowers.length;
  const todayRpy = DB.repayments.filter(r => r.status === 'paid' && r.date === today());
  const todayCollected = todayRpy.reduce((s,r) => s + r.paid, 0);
  return { totalPortfolio, par, activeLoanCount, totalBorrowers, todayCollected, overdueBalance, overdue: overdue.length };
}
