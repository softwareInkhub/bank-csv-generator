"use client";
import { useState } from "react";
import { FaDownload, FaFileCsv, FaRandom, FaBuilding } from "react-icons/fa";
import Papa from "papaparse";

// Helper to generate random data
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pad(n: number) {
  return n < 10 ? `0${n}` : n;
}

function formatAmount(amount: number) {
  return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(date: Date) {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function formatDateIDFC(date: Date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = date.getFullYear().toString().slice(-2);
  return `${pad(date.getDate())}-${months[date.getMonth()]}-${year}`;
}

function formatPostedDate(date: Date) {
  // Format: dd/MM/yyyy hh:mm:ss AM/PM
  const hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(hour12)}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${ampm}`;
}

function randomCRDR() {
  return Math.random() > 0.5 ? "CR" : "DR";
}

function randomDescICICI() {
  const descs = [
    // UPI Transactions
    "UPI/IN/1234567890/Paytm/ICICI Bank",
    "UPI/IN/9876543210/PhonePe/ICICI Bank",
    "UPI/IN/5556667778/Google Pay/ICICI Bank",
    "UPI/IN/1122334455/Amazon Pay/ICICI Bank",
    "UPI/IN/9988776655/BHIM/ICICI Bank",
    "UPI/IN/4433221100/CRED/ICICI Bank",
    "UPI/IN/7788990011/WhatsApp Pay/ICICI Bank",
    "UPI/IN/6677889900/Freecharge/ICICI Bank",
    
    // IMPS Transactions
    "IMPS/Ref/9876543210/ICICI Bank",
    "IMPS/Ref/1234567890/ICICI Bank",
    "IMPS/Ref/5556667778/ICICI Bank",
    "IMPS/Ref/9988776655/ICICI Bank",
    
    // NEFT Transactions
    "NEFT/Ref/1122334455/ICICI Bank",
    "NEFT/Ref/5566778899/ICICI Bank",
    "NEFT/Ref/9988776655/ICICI Bank",
    "NEFT/Ref/4433221100/ICICI Bank",
    
    // ATM Transactions
    "ATM Withdrawal/ICICI Bank",
    "ATM Cash Withdrawal/ICICI Bank",
    "ATM Mini Statement/ICICI Bank",
    "ATM Balance Enquiry/ICICI Bank",
    
    // POS Transactions
    "POS/Swiggy/ICICI Bank",
    "POS/Zomato/ICICI Bank",
    "POS/Amazon/ICICI Bank",
    "POS/Flipkart/ICICI Bank",
    "POS/Reliance Fresh/ICICI Bank",
    "POS/Dominos/ICICI Bank",
    "POS/Starbucks/ICICI Bank",
    "POS/McDonald's/ICICI Bank",
    "POS/Shell Petrol Pump/ICICI Bank",
    "POS/HP Petrol Pump/ICICI Bank",
    "POS/BP Petrol Pump/ICICI Bank",
    "POS/Indian Oil/ICICI Bank",
    
    // Online Shopping
    "Online Shopping/Amazon/ICICI Bank",
    "Online Shopping/Flipkart/ICICI Bank",
    "Online Shopping/Myntra/ICICI Bank",
    "Online Shopping/Nykaa/ICICI Bank",
    "Online Shopping/BookMyShow/ICICI Bank",
    "Online Shopping/IRCTC/ICICI Bank",
    "Online Shopping/Goibibo/ICICI Bank",
    "Online Shopping/MakeMyTrip/ICICI Bank",
    
    // Bill Payments
    "Bill Payment/Electricity/ICICI Bank",
    "Bill Payment/Gas/ICICI Bank",
    "Bill Payment/Water/ICICI Bank",
    "Bill Payment/Internet/ICICI Bank",
    "Bill Payment/Mobile/ICICI Bank",
    "Bill Payment/DTH/ICICI Bank",
    "Bill Payment/Insurance/ICICI Bank",
    "Bill Payment/Credit Card/ICICI Bank",
    
    // Salary and Credits
    "Salary Credit/ICICI Bank",
    "Interest Credit/ICICI Bank",
    "FD Maturity/ICICI Bank",
    "Dividend Credit/ICICI Bank",
    "Refund Credit/ICICI Bank",
    "Cashback Credit/ICICI Bank",
    "Reward Points Credit/ICICI Bank",
    
    // Mobile Recharges
    "Mobile Recharge/Airtel/ICICI Bank",
    "Mobile Recharge/Jio/ICICI Bank",
    "Mobile Recharge/Vi/ICICI Bank",
    "Mobile Recharge/BSNL/ICICI Bank",
    
    // Investment and Trading
    "Mutual Fund Investment/ICICI Bank",
    "Stock Trading/ICICI Bank",
    "SIP Investment/ICICI Bank",
    "Gold Investment/ICICI Bank",
    
    // International Transactions
    "International Transfer/ICICI Bank",
    "Foreign Exchange/ICICI Bank",
    "International Card Usage/ICICI Bank",
  ];
  return descs[randomInt(0, descs.length - 1)];
}

function randomDescIDFC() {
  const descs = [
    // UPI/MOB Transactions
    "UPI/MOB/202150132364/Test",
    "UPI/MOB/435101240322/PAY BY WHATSAPP",
    "UPI/MOB/100414001423/Mohit",
    "UPI/MOB/123456789012/Amazon",
    "UPI/MOB/987654321098/Zomato",
    "UPI/MOB/555666777888/PhonePe",
    "UPI/MOB/111222333444/Google Pay",
    "UPI/MOB/777888999000/Paytm",
    "UPI/MOB/444555666777/CRED",
    "UPI/MOB/888999000111/BHIM",
    "UPI/MOB/222333444555/Freecharge",
    "UPI/MOB/666777888999/Amazon Pay",
    "UPI/MOB/333444555666/WhatsApp Pay",
    "UPI/MOB/999000111222/Myntra",
    "UPI/MOB/555666777888/Nykaa",
    "UPI/MOB/111222333444/BookMyShow",
    "UPI/MOB/777888999000/IRCTC",
    "UPI/MOB/444555666777/Goibibo",
    "UPI/MOB/888999000111/MakeMyTrip",
    "UPI/MOB/222333444555/Swiggy",
    "UPI/MOB/666777888999/Dominos",
    "UPI/MOB/333444555666/Starbucks",
    "UPI/MOB/999000111222/McDonald's",
    "UPI/MOB/555666777888/Reliance Fresh",
    "UPI/MOB/111222333444/Flipkart",
    "UPI/MOB/777888999000/Myntra",
    "UPI/MOB/444555666777/Nykaa",
    "UPI/MOB/888999000111/BookMyShow",
    
    // NEFT Transactions
    "NEFT/N008253504045665/INKHUB/HDFC0000001",
    "NEFT/N123456789012/ICICI0000001",
    "NEFT/N987654321098/SBI0000001",
    "NEFT/N555666777888/AXIS0000001",
    "NEFT/N111222333444/KOTAK0000001",
    "NEFT/N777888999000/YES0000001",
    "NEFT/N444555666777/PNB0000001",
    "NEFT/N888999000111/BOB0000001",
    "NEFT/N222333444555/UNION0000001",
    "NEFT/N666777888999/CANARA0000001",
    
    // Cheque Deposits
    "BB/CHQ DEP/000003/IKAHDNJI/HDFC BANK LTD",
    "BB/CHQ DEP/000004/IKAHDNJI/HDFC BANK LTD",
    "BB/CHQ DEP/000005/IKAHDNJI/HDFC BANK LTD",
    "BB/CHQ DEP/000006/IKAHDNJI/HDFC BANK LTD",
    "BB/CHQ DEP/000007/IKAHDNJI/HDFC BANK LTD",
    "BB/CHQ DEP/000008/IKAHDNJI/HDFC BANK LTD",
    "BB/CHQ DEP/000009/IKAHDNJI/HDFC BANK LTD",
    "BB/CHQ DEP/000010/IKAHDNJI/HDFC BANK LTD",
    "BB/CHQ DEP/000011/IKAHDNJI/HDFC BANK LTD",
    "BB/CHQ DEP/000012/IKAHDNJI/HDFC BANK LTD",
    
    // IMPS Transactions
    "IMPS/Ref/123456789012/IDFC0000001",
    "IMPS/Ref/987654321098/IDFC0000001",
    "IMPS/Ref/555666777888/IDFC0000001",
    "IMPS/Ref/111222333444/IDFC0000001",
    "IMPS/Ref/777888999000/IDFC0000001",
    "IMPS/Ref/444555666777/IDFC0000001",
    "IMPS/Ref/888999000111/IDFC0000001",
    "IMPS/Ref/222333444555/IDFC0000001",
    
    // ATM Transactions
    "ATM Withdrawal/IDFC BANK",
    "ATM Cash Withdrawal/IDFC BANK",
    "ATM Mini Statement/IDFC BANK",
    "ATM Balance Enquiry/IDFC BANK",
    
    // POS Transactions
    "POS/Swiggy/IDFC BANK",
    "POS/Zomato/IDFC BANK",
    "POS/Amazon/IDFC BANK",
    "POS/Flipkart/IDFC BANK",
    "POS/Reliance Fresh/IDFC BANK",
    "POS/Dominos/IDFC BANK",
    "POS/Starbucks/IDFC BANK",
    "POS/McDonald's/IDFC BANK",
    "POS/Shell Petrol Pump/IDFC BANK",
    "POS/HP Petrol Pump/IDFC BANK",
    "POS/BP Petrol Pump/IDFC BANK",
    "POS/Indian Oil/IDFC BANK",
    
    // Bill Payments
    "Bill Payment/Electricity/IDFC BANK",
    "Bill Payment/Gas/IDFC BANK",
    "Bill Payment/Water/IDFC BANK",
    "Bill Payment/Internet/IDFC BANK",
    "Bill Payment/Mobile/IDFC BANK",
    "Bill Payment/DTH/IDFC BANK",
    "Bill Payment/Insurance/IDFC BANK",
    "Bill Payment/Credit Card/IDFC BANK",
    
    // Salary and Credits
    "Salary Credit/IDFC BANK",
    "Interest Credit/IDFC BANK",
    "FD Maturity/IDFC BANK",
    "Dividend Credit/IDFC BANK",
    "Refund Credit/IDFC BANK",
    "Cashback Credit/IDFC BANK",
    "Reward Points Credit/IDFC BANK",
    
    // Mobile Recharges
    "Mobile Recharge/Airtel/IDFC BANK",
    "Mobile Recharge/Jio/IDFC BANK",
    "Mobile Recharge/Vi/IDFC BANK",
    "Mobile Recharge/BSNL/IDFC BANK",
    
    // Investment and Trading
    "Mutual Fund Investment/IDFC BANK",
    "Stock Trading/IDFC BANK",
    "SIP Investment/IDFC BANK",
    "Gold Investment/IDFC BANK",
    
    // International Transactions
    "International Transfer/IDFC BANK",
    "Foreign Exchange/IDFC BANK",
    "International Card Usage/IDFC BANK",
  ];
  return descs[randomInt(0, descs.length - 1)];
}

function randomTxnId() {
  // Generate more varied transaction IDs
  const patterns = [
    () => randomInt(1000000000, 9999999999).toString(),
    () => `TXN${randomInt(100000, 999999)}${randomInt(100000, 999999)}`,
    () => `REF${randomInt(10000000, 99999999)}`,
    () => `ID${randomInt(100000000, 999999999)}`,
    () => `${randomInt(100000, 999999)}${randomInt(100000, 999999)}`,
  ];
  return patterns[randomInt(0, patterns.length - 1)]();
}

function randomChequeNo() {
  // More varied cheque number patterns
  const patterns = [
    () => randomInt(100000, 999999).toString(),
    () => randomInt(10000, 99999).toString(),
    () => randomInt(1000000, 9999999).toString(),
    () => `CHQ${randomInt(1000, 9999)}`,
    () => `REF${randomInt(10000, 99999)}`,
    () => "", // Empty for non-cheque transactions
  ];
  return patterns[randomInt(0, patterns.length - 1)]();
}

function generateICICIData(count: number) {
  let balance = randomInt(10000, 100000);
  const data = [];
  let lastDate = new Date();
  
  // Add more variety to amounts
  const amountRanges = [
    [100, 1000],    // Small transactions
    [1000, 5000],   // Medium transactions
    [5000, 20000],  // Large transactions
    [20000, 50000], // Very large transactions
  ];
  
  for (let i = 0; i < count; i++) {
    const txnDate = new Date(lastDate.getTime() - randomInt(1, 72) * 60 * 60 * 1000); // 1-72 hours earlier
    lastDate = txnDate;
    const valueDate = txnDate;
    const postedDate = txnDate;
    const crdr = randomCRDR();
    
    // Use different amount ranges for variety
    const amountRange = amountRanges[randomInt(0, amountRanges.length - 1)];
    const amount = randomInt(amountRange[0], amountRange[1]);
    
    balance = crdr === "CR" ? balance + amount : balance - amount;
    data.push({
      "No.": i + 1,
      "Transaction ID": randomTxnId(),
      "Value Date": formatDate(valueDate),
      "Txn Posted Date": formatPostedDate(postedDate),
      "Cheque/Ref. No.": randomChequeNo(),
      "Description": randomDescICICI(),
      "CR/DR": crdr,
      "Transaction Amount(₹)": formatAmount(amount),
      "Available Balance(₹)": formatAmount(balance),
    });
  }
  return data.sort((a, b) => {
    function parsePostedDate(str: string) {
      const [datePart, timePart, ampm] = str.split(/\s+/);
      const [d, m, y] = datePart.split("/").map(Number);
      let [h, min, s] = timePart.split(":").map(Number);
      if (ampm === "PM" && h !== 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
      return new Date(y, m - 1, d, h, min, s);
    }
    const da = parsePostedDate(a["Txn Posted Date"]);
    const db = parsePostedDate(b["Txn Posted Date"]);
    return db.getTime() - da.getTime();
  });
}

function generateIDFCData(count: number) {
  let balance = randomInt(10000, 100000);
  const data = [];
  let lastDate = new Date();
  
  // Add more variety to amounts
  const amountRanges = [
    [100, 1000],    // Small transactions
    [1000, 5000],   // Medium transactions
    [5000, 20000],  // Large transactions
    [20000, 50000], // Very large transactions
  ];
  
  for (let i = 0; i < count; i++) {
    const txnDate = new Date(lastDate.getTime() - randomInt(1, 72) * 60 * 60 * 1000); // 1-72 hours earlier
    lastDate = txnDate;
    const valueDate = txnDate;
    const crdr = randomCRDR();
    
    // Use different amount ranges for variety
    const amountRange = amountRanges[randomInt(0, amountRanges.length - 1)];
    const amount = randomInt(amountRange[0], amountRange[1]);
    
    balance = crdr === "CR" ? balance + amount : balance - amount;
    data.push({
      "Transaction Date": formatDateIDFC(txnDate),
      "Value Date": formatDateIDFC(valueDate),
      "Particulars": randomDescIDFC(),
      "Cheque No.": randomChequeNo(),
      "Debit": crdr === "DR" ? formatAmount(amount) : "",
      "Credit": crdr === "CR" ? formatAmount(amount) : "",
      "Balance": formatAmount(balance),
    });
  }
  return data.sort((a, b) => {
    function parseDate(str: string) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const [d, m, y] = str.split('-');
      const monthIndex = months.indexOf(m);
      const year = 2000 + parseInt(y);
      return new Date(year, monthIndex, parseInt(d));
    }
    const da = parseDate(a["Transaction Date"]);
    const db = parseDate(b["Transaction Date"]);
    return db.getTime() - da.getTime();
  });
}

function formatDateHDFC(date: Date) {
  // Format: d/M/yy (e.g., 7/5/24)
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear().toString().slice(-2);
  return `${d}/${m}/${y}`;
}
function formatValueDateHDFC(date: Date) {
  // Format: d/M/yyyy (e.g., 11/5/2024)
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}
function randomNarrationHDFC() {
  const narrs = [
    // UPI
    "UPI-XXXXXXXXXX-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953",
    "UPI-MYNTRA-XXXXXXXXXX-INHUB-AXISCN0582678953",
    "UPI-UMESH KEDIA-9953642992-ICIC0000399-1234567890-ICICI",
    "UPI-UMESH KEDIA-9953642992-ICIC0000399-1234567890-TEST",
    "UPI-UMESH KEDIA-9953642992-ICIC0000399-1234567890-PAYMENT",
    "UPI-DBAND-9001PLZ-UPI-EDAPY SOFTWARE PRIVATE LIMITED-UPI-AXISCN0582678956 SHIPPING BAG",
    // NEFT
    "NEFT-CHQ-UMOB1562-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953",
    "NEFT-CHQ-UMOB1562-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953-LOAN",
    "NEFT-CHQ-UMOB1562-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953-EMI",
    // IMPS
    "IMPS-4111111111-INHUB-ICIC0000399-XXXXXXXXXX-INTERNAL",
    "IMPS-4111111111-INHUB-ICIC0000399-XXXXXXXXXX-EXTERNAL",
    // RTGS
    "RTGS-CHQ-UMOB1562-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953",
    // ACH
    "ACH-UMOB1562-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953",
    // Facebook/Google/Other
    "UPI-WWW.FACEBOOK.COM-ACC:FACEBOOKMANAGER/PAID/UPI-ICIC0000399-XXXXXXXXXX-UPI TRANSACTION",
    "UPI-WWW.GOOGLE.COM-ACC:GOOGLEMANAGER/PAID/UPI-ICIC0000399-XXXXXXXXXX-UPI TRANSACTION",
    "UPI-WWW.AMAZON.COM-ACC:AMAZONMANAGER/PAID/UPI-ICIC0000399-XXXXXXXXXX-UPI TRANSACTION",
    // Misc
    "UPI-UMOB1562-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953-REFUND",
    "UPI-UMOB1562-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953-CASHBACK",
    "UPI-UMOB1562-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953-REWARD",
    "NEFT-CHQ-UMOB1562-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953-REFUND",
    "IMPS-4111111111-INHUB-ICIC0000399-XXXXXXXXXX-REFUND",
    "RTGS-CHQ-UMOB1562-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953-REFUND",
  ];
  return narrs[randomInt(0, narrs.length - 1)].replace(/X{6,}/g, () => randomInt(100000, 999999).toString());
}
function randomChqRefNoHDFC() {
  return Math.random() > 0.2 ? `AXISCN${randomInt(1000000000, 9999999999)}` : "";
}
function generateHDFCData(count: number) {
  let balance = randomInt(10000, 100000);
  const data = [];
  let lastDate = new Date();
  for (let i = 0; i < count; i++) {
    const txnDate = new Date(lastDate.getTime() - randomInt(1, 72) * 60 * 60 * 1000);
    lastDate = txnDate;
    const valueDate = new Date(txnDate.getTime() + randomInt(0, 3) * 24 * 60 * 60 * 1000); // value date = txn date or up to 3 days later
    const isDeposit = Math.random() > 0.5;
    const amount = randomInt(100, 50000);
    let withdrawal = "";
    let deposit = "";
    if (isDeposit) {
      deposit = amount.toString();
      balance += amount;
    } else {
      withdrawal = amount.toString();
      balance -= amount;
    }
    data.push({
      "Date": formatDateHDFC(txnDate),
      "Narration": randomNarrationHDFC(),
      "Chq./Ref.No.": randomChqRefNoHDFC(),
      "Value Dt": formatValueDateHDFC(valueDate),
      "Withdrawal Amt.": withdrawal,
      "Deposit Amt.": deposit,
      "Closing Balance": balance,
    });
  }
  // Sort by date descending
  return data.sort((a, b) => {
    const [da, ma, ya] = a["Date"].split("/").map(Number);
    const [db, mb, yb] = b["Date"].split("/").map(Number);
    const dateA = new Date(2000 + (ya < 100 ? ya : 0), ma - 1, da);
    const dateB = new Date(2000 + (yb < 100 ? yb : 0), mb - 1, db);
    return dateB.getTime() - dateA.getTime();
  });
}

export default function Home() {
  const [bank, setBank] = useState("ICICI");
  const [count, setCount] = useState(10);
  const [data, setData] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const handleGenerate = () => {
    if (bank === "ICICI") {
      setData(generateICICIData(count));
    } else if (bank === "IDFC") {
      setData(generateIDFCData(count));
    } else {
      setData(generateHDFCData(count));
    }
    setShowModal(false);
  };

  const handleDownload = () => {
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${bank.toLowerCase()}_statement_dummy.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTableHeaders = () => {
    if (bank === "ICICI") {
      return ["No.", "Transaction ID", "Value Date", "Txn Posted Date", "Cheque/Ref. No.", "Description", "CR/DR", "Transaction Amount(₹)", "Available Balance(₹)"];
    } else if (bank === "IDFC") {
      return ["Transaction Date", "Value Date", "Particulars", "Cheque No.", "Debit", "Credit", "Balance"];
    } else {
      return ["Date", "Narration", "Chq./Ref.No.", "Value Dt", "Withdrawal Amt.", "Deposit Amt.", "Closing Balance"];
    }
  };

  const renderTableRow = (row: any) => {
    if (bank === "ICICI") {
      return (
        <>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["No."]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Transaction ID"]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Value Date"]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Txn Posted Date"]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Cheque/Ref. No."]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Description"]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["CR/DR"]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Transaction Amount(INR)"]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Available Balance(INR)"]}</td>
        </>
      );
    } else if (bank === "IDFC") {
      return (
        <>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Transaction Date"]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Value Date"]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Particulars"]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Cheque No."]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Debit"]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Credit"]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Balance"]}</td>
        </>
      );
    } else {
      return (
        <>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Date"]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Narration"]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Chq./Ref.No."]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Value Dt"]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Withdrawal Amt."]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Deposit Amt."]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Closing Balance"]}</td>
        </>
      );
    }
  };

  // Filter data based on search query
  const filteredData = search.trim() === ""
    ? data
    : data.filter((row: any) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(search.trim().toLowerCase())
        )
      );

  return (
    <main className="h-screen w-screen flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white p-4 sm:p-6 lg:p-8 h-[95vh] w-[95vw] max-w-none flex flex-col gap-4 sm:gap-6 items-center overflow-hidden relative">
        {/* Header with Generate Button and Search Bar */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 text-center sm:text-left">
            <FaBuilding className="inline" /> 
            <span className="hidden sm:inline">Bank Statement Dummy CSV Generator</span>
            <span className="sm:hidden">Bank Statement Generator</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base bg-gray-50 text-gray-900 outline-none transition-colors focus:border-indigo-500 w-full sm:min-w-[200px] lg:min-w-[220px]"
            />
            <div className="flex gap-2 sm:gap-3">
              <button 
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center gap-1 sm:gap-2 bg-indigo-600 text-white border-none rounded-lg px-3 sm:px-4 lg:px-5 py-2 sm:py-3 text-sm sm:text-base font-semibold cursor-pointer shadow-lg transition-all hover:bg-indigo-700 hover:shadow-xl flex-1 sm:flex-none"
              >
                <FaRandom className="text-xs sm:text-sm" /> 
                <span className="hidden sm:inline">Generate</span>
                <span className="sm:hidden">Gen</span>
              </button>
              {filteredData.length > 0 && (
                <button 
                  onClick={handleDownload} 
                  title="Download CSV"
                  className="flex items-center justify-center gap-1 sm:gap-2 bg-green-600 text-white border-none rounded-lg px-3 sm:px-4 lg:px-5 py-2 sm:py-3 text-sm sm:text-base font-semibold cursor-pointer shadow-lg transition-all hover:bg-green-700 hover:shadow-xl flex-1 sm:flex-none"
                >
                  <FaDownload className="text-xs sm:text-sm" /> 
                  <span className="hidden sm:inline">Download CSV</span>
                  <span className="sm:hidden">Download</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Data Display */}
        {filteredData.length > 0 ? (
          <>
            <div className="w-full flex items-center mb-2">
              <span className="inline-block bg-indigo-100 text-indigo-700 font-semibold rounded px-3 sm:px-4 py-1 text-sm sm:text-base shadow-sm">
                {bank === "ICICI" ? "ICICI Bank" : bank === "IDFC" ? "IDFC Bank" : "HDFC Bank"}
              </span>
            </div>
            <div className="w-full h-full overflow-auto mt-2">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs sm:text-sm bg-white rounded-2xl overflow-hidden shadow-lg min-w-[800px]">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      {getTableHeaders().map((header) => (
                        <th key={header} className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left border-b border-gray-200 bg-gray-50 font-bold text-xs sm:text-sm">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row, i) => (
                      <tr key={i} className="last:border-b-0 hover:bg-gray-50">
                        {renderTableRow(row)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 text-xs sm:text-sm text-indigo-600 text-right">
                Showing {filteredData.length} of {data.length} rows
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-base sm:text-lg text-center px-4">
            Click "Generate" to create dummy bank statement data
          </div>
        )}

        {/* Generate Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 shadow-2xl">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Generate Bank Statement</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="modal-bank-select" className="block font-medium mb-2 text-sm sm:text-base">Select Bank:</label>
                  <select
                    id="modal-bank-select"
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base bg-gray-50 text-gray-900 outline-none transition-colors focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="ICICI">ICICI Bank</option>
                    <option value="IDFC">IDFC Bank</option>
                    <option value="HDFC">HDFC Bank</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="modal-txn-count" className="block font-medium mb-2 text-sm sm:text-base">Number of Transactions:</label>
                  <input
                    id="modal-txn-count"
                    type="number"
                    min={1}
                    max={2000}
                    value={count}
                    onChange={e => setCount(Math.max(1, Math.min(2000, Number(e.target.value))))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base bg-gray-50 text-gray-900 outline-none transition-colors focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleGenerate}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white border-none rounded-lg px-4 py-2 font-semibold cursor-pointer shadow-lg transition-all hover:bg-indigo-700 text-sm sm:text-base"
                  >
                    <FaRandom /> Generate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
