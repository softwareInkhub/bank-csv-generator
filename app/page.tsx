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
  const businessTerms = [
    "SALARY", "RAW MATERIAL", "SALES", "PACKAGING EXP", "LOGISTIC EXP", "RENT", "UTILITIES", 
    "MARKETING", "ADVERTISING", "INSURANCE", "MAINTENANCE", "REPAIRS", "CONSULTING", 
    "LEGAL FEES", "ACCOUNTING", "TRAVEL EXP", "MEALS", "OFFICE SUPPLIES", "EQUIPMENT", 
    "SOFTWARE", "LICENSING", "COMMISSION", "BONUS", "REFUND", "CASHBACK", "REWARDS",
    "INVOICE", "PAYMENT", "SETTLEMENT", "ADVANCE", "LOAN", "EMI", "INTEREST", "DIVIDEND",
    "INVESTMENT", "MUTUAL FUND", "STOCK TRADING", "GOLD", "FOREIGN EXCHANGE"
  ];
  
  const descs = [
    // UPI Transactions with business messages
    `UPI/IN/${randomInt(1000000000, 9999999999)}/PAYTM/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/IN/${randomInt(1000000000, 9999999999)}/PHONEPE/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/IN/${randomInt(1000000000, 9999999999)}/GOOGLE PAY/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/IN/${randomInt(1000000000, 9999999999)}/AMAZON PAY/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/IN/${randomInt(1000000000, 9999999999)}/BHIM/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/IN/${randomInt(1000000000, 9999999999)}/CRED/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/IN/${randomInt(1000000000, 9999999999)}/WHATSAPP PAY/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/IN/${randomInt(1000000000, 9999999999)}/FREECHARGE/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // IMPS Transactions
    `IMPS/Ref/${randomInt(1000000000, 9999999999)}/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `IMPS/Ref/${randomInt(1000000000, 9999999999)}/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `IMPS/Ref/${randomInt(1000000000, 9999999999)}/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `IMPS/Ref/${randomInt(1000000000, 9999999999)}/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // NEFT Transactions
    `NEFT/Ref/${randomInt(1000000000, 9999999999)}/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `NEFT/Ref/${randomInt(1000000000, 9999999999)}/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `NEFT/Ref/${randomInt(1000000000, 9999999999)}/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `NEFT/Ref/${randomInt(1000000000, 9999999999)}/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // ATM Transactions
    "ATM Withdrawal/ICICI Bank",
    "ATM Cash Withdrawal/ICICI Bank",
    "ATM Mini Statement/ICICI Bank",
    "ATM Balance Enquiry/ICICI Bank",
    
    // POS Transactions with business context
    `POS/SWIGGY/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/ZOMATO/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/AMAZON/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/FLIPKART/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/RELIANCE FRESH/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/DOMINOS/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/STARBUCKS/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/MCDONALD'S/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/SHELL PETROL PUMP/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/HP PETROL PUMP/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/BP PETROL PUMP/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/INDIAN OIL/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // Online Shopping with business messages
    `Online Shopping/AMAZON/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Online Shopping/FLIPKART/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Online Shopping/MYNTRA/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Online Shopping/NYKAA/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Online Shopping/BOOKMYSHOW/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Online Shopping/IRCTC/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Online Shopping/GOIBIBO/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Online Shopping/MAKEMYTRIP/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // Bill Payments
    `Bill Payment/ELECTRICITY/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bill Payment/GAS/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bill Payment/WATER/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bill Payment/INTERNET/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bill Payment/MOBILE/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bill Payment/DTH/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bill Payment/INSURANCE/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bill Payment/CREDIT CARD/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // Salary and Credits with business context
    `Salary Credit/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Interest Credit/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `FD Maturity/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Dividend Credit/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Refund Credit/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Cashback Credit/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Reward Points Credit/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // Mobile Recharges
    `Mobile Recharge/AIRTEL/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Mobile Recharge/JIO/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Mobile Recharge/VI/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Mobile Recharge/BSNL/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // Investment and Trading
    `Mutual Fund Investment/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Stock Trading/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `SIP Investment/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Gold Investment/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // International Transactions
    `International Transfer/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Foreign Exchange/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `International Card Usage/ICICI Bank/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
  ];
  return descs[randomInt(0, descs.length - 1)];
}

function randomDescIDFC() {
  const businessTerms = [
    "SALARY", "RAW MATERIAL", "SALES", "PACKAGING EXP", "LOGISTIC EXP", "RENT", "UTILITIES", 
    "MARKETING", "ADVERTISING", "INSURANCE", "MAINTENANCE", "REPAIRS", "CONSULTING", 
    "LEGAL FEES", "ACCOUNTING", "TRAVEL EXP", "MEALS", "OFFICE SUPPLIES", "EQUIPMENT", 
    "SOFTWARE", "LICENSING", "COMMISSION", "BONUS", "REFUND", "CASHBACK", "REWARDS",
    "INVOICE", "PAYMENT", "SETTLEMENT", "ADVANCE", "LOAN", "EMI", "INTEREST", "DIVIDEND",
    "INVESTMENT", "MUTUAL FUND", "STOCK TRADING", "GOLD", "FOREIGN EXCHANGE"
  ];
  
  const descs = [
    // UPI/MOB Transactions with business messages
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/PAYTM/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/PHONEPE/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/GOOGLE PAY/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/AMAZON PAY/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/BHIM/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/CRED/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/WHATSAPP PAY/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/FREECHARGE/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/AMAZON/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/FLIPKART/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/MYNTRA/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/NYKAA/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/BOOKMYSHOW/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/IRCTC/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/GOIBIBO/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/MAKEMYTRIP/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/SWIGGY/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/ZOMATO/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/DOMINOS/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/STARBUCKS/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/MCDONALD'S/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MOB/${randomInt(100000000000, 999999999999)}/RELIANCE FRESH/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // NEFT Transactions with business messages
    `NEFT/N${randomInt(100000000000, 999999999999)}/ICICI0000001/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `NEFT/N${randomInt(100000000000, 999999999999)}/SBI0000001/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `NEFT/N${randomInt(100000000000, 999999999999)}/AXIS0000001/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `NEFT/N${randomInt(100000000000, 999999999999)}/KOTAK0000001/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `NEFT/N${randomInt(100000000000, 999999999999)}/YES0000001/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `NEFT/N${randomInt(100000000000, 999999999999)}/PNB0000001/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `NEFT/N${randomInt(100000000000, 999999999999)}/BOB0000001/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `NEFT/N${randomInt(100000000000, 999999999999)}/UNION0000001/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `NEFT/N${randomInt(100000000000, 999999999999)}/CANARA0000001/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // Cheque Deposits with business context
    `BB/CHQ DEP/${randomInt(100000, 999999)}/IKAHDNJI/HDFC BANK LTD/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `BB/CHQ DEP/${randomInt(100000, 999999)}/IKAHDNJI/ICICI BANK LTD/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `BB/CHQ DEP/${randomInt(100000, 999999)}/IKAHDNJI/SBI BANK LTD/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `BB/CHQ DEP/${randomInt(100000, 999999)}/IKAHDNJI/AXIS BANK LTD/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // IMPS Transactions
    `IMPS/Ref/${randomInt(100000000000, 999999999999)}/IDFC0000001/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `IMPS/Ref/${randomInt(100000000000, 999999999999)}/IDFC0000001/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `IMPS/Ref/${randomInt(100000000000, 999999999999)}/IDFC0000001/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `IMPS/Ref/${randomInt(100000000000, 999999999999)}/IDFC0000001/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // ATM Transactions
    "ATM Withdrawal/IDFC BANK",
    "ATM Cash Withdrawal/IDFC BANK",
    "ATM Mini Statement/IDFC BANK",
    "ATM Balance Enquiry/IDFC BANK",
    
    // POS Transactions with business messages
    `POS/SWIGGY/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/ZOMATO/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/AMAZON/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/FLIPKART/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/RELIANCE FRESH/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/DOMINOS/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/STARBUCKS/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/MCDONALD'S/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/SHELL PETROL PUMP/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/HP PETROL PUMP/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/BP PETROL PUMP/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `POS/INDIAN OIL/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // Bill Payments with business context
    `Bill Payment/ELECTRICITY/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bill Payment/GAS/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bill Payment/WATER/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bill Payment/INTERNET/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bill Payment/MOBILE/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bill Payment/DTH/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bill Payment/INSURANCE/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bill Payment/CREDIT CARD/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // Salary and Credits with business context
    `Salary Credit/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Interest Credit/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `FD Maturity/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Dividend Credit/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Refund Credit/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Cashback Credit/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Reward Points Credit/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // Mobile Recharges
    `Mobile Recharge/AIRTEL/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Mobile Recharge/JIO/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Mobile Recharge/VI/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Mobile Recharge/BSNL/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // Investment and Trading
    `Mutual Fund Investment/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Stock Trading/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `SIP Investment/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Gold Investment/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // International Transactions
    `International Transfer/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Foreign Exchange/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `International Card Usage/IDFC BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
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
  
  // Generate data in chronological order (oldest first) for correct balance calculation
  for (let i = 0; i < count; i++) {
    const txnDate = new Date(lastDate.getTime() - randomInt(1, 72) * 60 * 60 * 1000); // 1-72 hours earlier
    lastDate = txnDate;
    const valueDate = txnDate;
    const postedDate = txnDate;
    const crdr = randomCRDR();
    
    // Use different amount ranges for variety
    const amountRange = amountRanges[randomInt(0, amountRanges.length - 1)];
    const amount = randomInt(amountRange[0], amountRange[1]);
    
    // Calculate balance BEFORE adding the transaction
    const previousBalance = balance;
    
    // Update balance based on transaction type
    if (crdr === "CR") {
      balance += amount; // Credit increases balance
    } else {
      balance -= amount; // Debit decreases balance
    }
    
    data.push({
      "No.": i + 1,
      "Transaction ID": randomTxnId(),
      "Value Date": formatDate(valueDate),
      "Txn Posted Date": formatPostedDate(postedDate),
      "Cheque/Ref. No.": randomChequeNo(),
      "Description": randomDescICICI(),
      "CR/DR": crdr,
      "Transaction Amount(INR)": formatAmount(amount),
      "Available Balance(INR)": formatAmount(balance), // This is the balance AFTER the transaction
    });
  }
  
  // Sort by date in descending order (latest first) for display
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
  
  // Generate data in chronological order (oldest first) for correct balance calculation
  for (let i = 0; i < count; i++) {
    const txnDate = new Date(lastDate.getTime() - randomInt(1, 72) * 60 * 60 * 1000); // 1-72 hours earlier
    lastDate = txnDate;
    const valueDate = txnDate;
    const crdr = randomCRDR();
    
    // Use different amount ranges for variety
    const amountRange = amountRanges[randomInt(0, amountRanges.length - 1)];
    const amount = randomInt(amountRange[0], amountRange[1]);
    
    // Update balance based on transaction type
    if (crdr === "CR") {
      balance += amount; // Credit increases balance
    } else {
      balance -= amount; // Debit decreases balance
    }
    
    data.push({
      "Transaction Date": formatDateIDFC(txnDate),
      "Value Date": formatDateIDFC(valueDate),
      "Particulars": randomDescIDFC(),
      "Cheque No.": randomChequeNo(),
      "Debit": crdr === "DR" ? formatAmount(amount) : "",
      "Credit": crdr === "CR" ? formatAmount(amount) : "",
      "Balance": formatAmount(balance), // This is the balance AFTER the transaction
    });
  }
  
  // Sort by date in descending order (latest first) for display
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
  const businessTerms = [
    "SALARY", "RAW MATERIAL", "SALES", "PACKAGING EXP", "LOGISTIC EXP", "RENT", "UTILITIES", 
    "MARKETING", "ADVERTISING", "INSURANCE", "MAINTENANCE", "REPAIRS", "CONSULTING", 
    "LEGAL FEES", "ACCOUNTING", "TRAVEL EXP", "MEALS", "OFFICE SUPPLIES", "EQUIPMENT", 
    "SOFTWARE", "LICENSING", "COMMISSION", "BONUS", "REFUND", "CASHBACK", "REWARDS",
    "INVOICE", "PAYMENT", "SETTLEMENT", "ADVANCE", "LOAN", "EMI", "INTEREST", "DIVIDEND",
    "INVESTMENT", "MUTUAL FUND", "STOCK TRADING", "GOLD", "FOREIGN EXCHANGE"
  ];
  
  const narrs = [
    // UPI with business messages
    `UPI-XXXXXXXXXX-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI-MYNTRA-XXXXXXXXXX-INHUB-AXISCN0582678953-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI-UMESH KEDIA-9953642992-ICIC0000399-1234567890-ICICI-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI-UMESH KEDIA-9953642992-ICIC0000399-1234567890-TEST-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI-UMESH KEDIA-9953642992-ICIC0000399-1234567890-PAYMENT-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI-DBAND-9001PLZ-UPI-EDAPY SOFTWARE PRIVATE LIMITED-UPI-AXISCN0582678956 SHIPPING BAG-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // NEFT with business messages
    `NEFT-CHQ-UMOB1562-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `NEFT-CHQ-UMOB1562-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953-LOAN-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `NEFT-CHQ-UMOB1562-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953-EMI-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // IMPS with business messages
    `IMPS-4111111111-INHUB-ICIC0000399-XXXXXXXXXX-INTERNAL-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `IMPS-4111111111-INHUB-ICIC0000399-XXXXXXXXXX-EXTERNAL-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // RTGS with business messages
    `RTGS-CHQ-UMOB1562-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // ACH with business messages
    `ACH-UMOB1562-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // Facebook/Google/Other with business messages
    `UPI-WWW.FACEBOOK.COM-ACC:FACEBOOKMANAGER/PAID/UPI-ICIC0000399-XXXXXXXXXX-UPI TRANSACTION-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI-WWW.GOOGLE.COM-ACC:GOOGLEMANAGER/PAID/UPI-ICIC0000399-XXXXXXXXXX-UPI TRANSACTION-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI-WWW.AMAZON.COM-ACC:AMAZONMANAGER/PAID/UPI-ICIC0000399-XXXXXXXXXX-UPI TRANSACTION-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // Misc with business messages
    `UPI-UMOB1562-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953-REFUND-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI-UMOB1562-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953-CASHBACK-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI-UMOB1562-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953-REWARD-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `NEFT-CHQ-UMOB1562-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953-REFUND-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `IMPS-4111111111-INHUB-ICIC0000399-XXXXXXXXXX-REFUND-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `RTGS-CHQ-UMOB1562-RAZORPAY SOFTWARE PRIVATE LIMITED-INHUB-AXISCN0582678953-REFUND-MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
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
  
  // Generate data in chronological order (oldest first) for correct balance calculation
  for (let i = 0; i < count; i++) {
    const txnDate = new Date(lastDate.getTime() - randomInt(1, 72) * 60 * 60 * 1000);
    lastDate = txnDate;
    const valueDate = new Date(txnDate.getTime() + randomInt(0, 3) * 24 * 60 * 60 * 1000); // value date = txn date or up to 3 days later
    const isDeposit = Math.random() > 0.5;
    const amount = randomInt(100, 50000);
    let withdrawal = "";
    let deposit = "";
    
    // Update balance based on transaction type
    if (isDeposit) {
      deposit = amount.toString();
      balance += amount; // Deposit increases balance
    } else {
      withdrawal = amount.toString();
      balance -= amount; // Withdrawal decreases balance
    }
    
    data.push({
      "Date": formatDateHDFC(txnDate),
      "Narration": randomNarrationHDFC(),
      "Chq./Ref.No.": randomChqRefNoHDFC(),
      "Value Dt": formatValueDateHDFC(valueDate),
      "Withdrawal Amt.": withdrawal,
      "Deposit Amt.": deposit,
      "Closing Balance": balance, // This is the balance AFTER the transaction
    });
  }
  
  // Sort by date in descending order (latest first) for display
  return data.sort((a, b) => {
    const [da, ma, ya] = a["Date"].split("/").map(Number);
    const [db, mb, yb] = b["Date"].split("/").map(Number);
    const dateA = new Date(2000 + (ya < 100 ? ya : 0), ma - 1, da);
    const dateB = new Date(2000 + (yb < 100 ? yb : 0), mb - 1, db);
    return dateB.getTime() - dateA.getTime();
  });
}

function generateKotakData(count: number) {
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
  
  // Generate data in chronological order (oldest first) for correct balance calculation
  for (let i = 0; i < count; i++) {
    const txnDate = new Date(lastDate.getTime() - randomInt(1, 72) * 60 * 60 * 1000);
    lastDate = txnDate;
    const crdr = randomCRDR();
    
    // Use different amount ranges for variety
    const amountRange = amountRanges[randomInt(0, amountRanges.length - 1)];
    const amount = randomInt(amountRange[0], amountRange[1]);
    
    // Update balance based on transaction type
    if (crdr === "CR") {
      balance += amount; // Credit increases balance
    } else {
      balance -= amount; // Debit decreases balance
    }
    
    data.push({
      "Sl. No.": i + 1,
      "Date": formatDateKotak(txnDate),
      "Description": randomDescKotak(),
      "Chq/ Ref number": randomChqRefNoKotak(),
      "Amount": formatAmount(amount),
      "Dr/Cr": crdr,
      "Balance": formatAmount(balance),
      "Balance Dr/Cr": balance >= 0 ? "CR" : "DR"
    });
  }
  
  // Sort by date in descending order (latest first) for display
  return data.sort((a, b) => {
    function parseDate(str: string) {
      const [d, m, y] = str.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    const da = parseDate(a["Date"]);
    const db = parseDate(b["Date"]);
    return db.getTime() - da.getTime();
  });
}

function formatDateKotak(date: Date) {
  // Format: DD-MM-YYYY (e.g., 31-10-2024)
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}

function randomDescKotak() {
  const businessTerms = [
    "SALARY", "RAW MATERIAL", "SALES", "PACKAGING EXP", "LOGISTIC EXP", "RENT", "UTILITIES", 
    "MARKETING", "ADVERTISING", "INSURANCE", "MAINTENANCE", "REPAIRS", "CONSULTING", 
    "LEGAL FEES", "ACCOUNTING", "TRAVEL EXP", "MEALS", "OFFICE SUPPLIES", "EQUIPMENT", 
    "SOFTWARE", "LICENSING", "COMMISSION", "BONUS", "REFUND", "CASHBACK", "REWARDS",
    "INVOICE", "PAYMENT", "SETTLEMENT", "ADVANCE", "LOAN", "EMI", "INTEREST", "DIVIDEND",
    "INVESTMENT", "MUTUAL FUND", "STOCK TRADING", "GOLD", "FOREIGN EXCHANGE"
  ];
  
  const descs = [
    // UPI Transactions with business messages
    `UPI/FACEBOOK INDIA/${randomInt(100000000000, 999999999999)}/Upi Transaction/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/YASH SARAWGI/${randomInt(100000000000, 999999999999)}/Donation/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/AMAZON/${randomInt(100000000000, 999999999999)}/Online Shopping/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/FLIPKART/${randomInt(100000000000, 999999999999)}/Online Shopping/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/SWIGGY/${randomInt(100000000000, 999999999999)}/Food Delivery/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/ZOMATO/${randomInt(100000000000, 999999999999)}/Food Delivery/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/PAYTM/${randomInt(100000000000, 999999999999)}/Digital Payment/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/PHONEPE/${randomInt(100000000000, 999999999999)}/Digital Payment/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/GOOGLE PAY/${randomInt(100000000000, 999999999999)}/Digital Payment/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/AMAZON PAY/${randomInt(100000000000, 999999999999)}/Digital Payment/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/BHIM/${randomInt(100000000000, 999999999999)}/Digital Payment/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/CRED/${randomInt(100000000000, 999999999999)}/Bill Payment/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/WHATSAPP PAY/${randomInt(100000000000, 999999999999)}/Digital Payment/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/FREECHARGE/${randomInt(100000000000, 999999999999)}/Recharge/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MYNTRA/${randomInt(100000000000, 999999999999)}/Online Shopping/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/NYKAA/${randomInt(100000000000, 999999999999)}/Online Shopping/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/BOOKMYSHOW/${randomInt(100000000000, 999999999999)}/Entertainment/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/IRCTC/${randomInt(100000000000, 999999999999)}/Railway Booking/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/GOIBIBO/${randomInt(100000000000, 999999999999)}/Travel Booking/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MAKEMYTRIP/${randomInt(100000000000, 999999999999)}/Travel Booking/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/DOMINOS/${randomInt(100000000000, 999999999999)}/Food Delivery/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/STARBUCKS/${randomInt(100000000000, 999999999999)}/Food & Beverages/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/MCDONALD'S/${randomInt(100000000000, 999999999999)}/Food Delivery/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/RELIANCE FRESH/${randomInt(100000000000, 999999999999)}/Grocery/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/SHELL PETROL PUMP/${randomInt(100000000000, 999999999999)}/Fuel/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/HP PETROL PUMP/${randomInt(100000000000, 999999999999)}/Fuel/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/BP PETROL PUMP/${randomInt(100000000000, 999999999999)}/Fuel/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPI/INDIAN OIL/${randomInt(100000000000, 999999999999)}/Fuel/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // RTGS Transactions
    `RTGS HDFCR${randomInt(100000000000000, 999999999999999)} INKHUB HDFC0000240/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `RTGS ICICR${randomInt(100000000000000, 999999999999999)} INKHUB ICIC0000399/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `RTGS SBIR${randomInt(100000000000000, 999999999999999)} INKHUB SBIN0000001/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `RTGS AXISR${randomInt(100000000000000, 999999999999999)} INKHUB AXIS0000001/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // PCI Transactions
    `PCI/${randomInt(1000, 9999)}/Fiverr com/NICOSIA${randomInt(100000, 999999)}/${randomInt(10, 23)}:${randomInt(10, 59)}/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `PCI/${randomInt(1000, 9999)}/Upwork com/NICOSIA${randomInt(100000, 999999)}/${randomInt(10, 23)}:${randomInt(10, 59)}/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `PCI/${randomInt(1000, 9999)}/Freelancer com/NICOSIA${randomInt(100000, 999999)}/${randomInt(10, 23)}:${randomInt(10, 59)}/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // Other transaction types
    `PaidViaKotakApp/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bikerepair/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `UPILITEderegist/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Electric wire/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Setup of UPI Li/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Test/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Pay to Merchant/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Girlfit/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `MB UPI/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Devasalary/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Mombatti/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // NEFT Transactions
    `NEFT/${randomInt(100000000000, 999999999999)}/ICICI0000399/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `NEFT/${randomInt(100000000000, 999999999999)}/SBI0000001/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `NEFT/${randomInt(100000000000, 999999999999)}/HDFC0000240/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `NEFT/${randomInt(100000000000, 999999999999)}/AXIS0000001/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // IMPS Transactions
    `IMPS/${randomInt(100000000000, 999999999999)}/KOTAK0000001/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `IMPS/${randomInt(100000000000, 999999999999)}/KOTAK0000001/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // ATM Transactions
    "ATM Withdrawal/KOTAK BANK",
    "ATM Cash Withdrawal/KOTAK BANK",
    "ATM Mini Statement/KOTAK BANK",
    "ATM Balance Enquiry/KOTAK BANK",
    
    // Bill Payments
    `Bill Payment/ELECTRICITY/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bill Payment/GAS/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bill Payment/WATER/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bill Payment/INTERNET/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bill Payment/MOBILE/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bill Payment/DTH/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bill Payment/INSURANCE/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Bill Payment/CREDIT CARD/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // Salary and Credits
    `Salary Credit/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Interest Credit/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `FD Maturity/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Dividend Credit/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Refund Credit/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Cashback Credit/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Reward Points Credit/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // Mobile Recharges
    `Mobile Recharge/AIRTEL/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Mobile Recharge/JIO/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Mobile Recharge/VI/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Mobile Recharge/BSNL/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // Investment and Trading
    `Mutual Fund Investment/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Stock Trading/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `SIP Investment/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Gold Investment/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    
    // International Transactions
    `International Transfer/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `Foreign Exchange/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
    `International Card Usage/KOTAK BANK/MSG:${businessTerms[randomInt(0, businessTerms.length - 1)]}`,
  ];
  return descs[randomInt(0, descs.length - 1)];
}

function randomChqRefNoKotak() {
  const refTypes = [
    `UPI-${randomInt(100000000000000, 999999999999999)}`,
    `RTGSINW-${randomInt(100000000000000, 999999999999999)}`,
    `NEFTINW-${randomInt(100000000000000, 999999999999999)}`,
    `IMPSINW-${randomInt(100000000000000, 999999999999999)}`,
    `PCI-${randomInt(100000000000000, 999999999999999)}`,
    randomInt(100000000000, 999999999999).toString(),
    randomInt(10000000000, 99999999999).toString(),
    randomInt(1000000000, 9999999999).toString(),
  ];
  return refTypes[randomInt(0, refTypes.length - 1)];
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
    } else if (bank === "KOTAK") {
      setData(generateKotakData(count));
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
      return ["No.", "Transaction ID", "Value Date", "Txn Posted Date", "Cheque/Ref. No.", "Description", "CR/DR", "Transaction Amount(INR)", "Available Balance(INR)"];
    } else if (bank === "IDFC") {
      return ["Transaction Date", "Value Date", "Particulars", "Cheque No.", "Debit", "Credit", "Balance"];
    } else if (bank === "KOTAK") {
      return ["Sl. No.", "Date", "Description", "Chq/ Ref number", "Amount", "Dr/Cr", "Balance", "Dr/Cr"];
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
    } else if (bank === "KOTAK") {
      return (
        <>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Sl. No."]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Date"]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Description"]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Chq/ Ref number"]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Amount"]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Dr/Cr"]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Balance"]}</td>
          <td className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-sm border-b border-gray-200">{row["Balance Dr/Cr"]}</td>
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

        {/* Bank Name Display */}
        {data.length > 0 && (
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 bg-white rounded-lg shadow-sm px-6 py-3 inline-block">
              {bank} Bank Statement
            </h2>
          </div>
        )}

        {/* Data Display */}
        {filteredData.length > 0 ? (
          <>
            <div className="w-full flex items-center mb-2">
              <span className="text-sm text-gray-600">
                Showing {filteredData.length} of {data.length} rows
              </span>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full bg-white rounded-lg shadow-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    {getTableHeaders().map((header, index) => (
                      <th
                        key={index}
                        className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {renderTableRow(row)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : data.length > 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-base sm:text-lg text-center px-4">
            No transactions found matching your search
          </div>
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
                    <option value="KOTAK">Kotak Bank</option>
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
