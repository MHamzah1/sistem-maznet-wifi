export type CustomerStatus = "Aktif" | "Menunggak" | "Terisolir" | "Berhenti";
export type InvoiceStatus = "Lunas" | "Belum Lunas" | "Jatuh Tempo";

export interface Customer { id:string; name:string; phone:string; address:string; packageName:string; price:number; dueDay:number; status:CustomerStatus; installed:string }
export interface Invoice { id:string; customerId:string; customer:string; period:string; dueDate:string; amount:number; status:InvoiceStatus }
export interface Payment { id:string; invoiceId:string; customer:string; amount:number; method:string; channel:"Xendit"|"Manual"; paidAt:string }

export const packages = [
  {id:"PKG-01",name:"Maznet Basic",speed:10,price:150000,active:true,customers:84,description:"Koneksi stabil untuk kebutuhan harian"},
  {id:"PKG-02",name:"Maznet Family",speed:20,price:220000,active:true,customers:142,description:"Nyaman untuk seluruh keluarga"},
  {id:"PKG-03",name:"Maznet Plus",speed:30,price:300000,active:true,customers:96,description:"Streaming dan kerja tanpa hambatan"},
  {id:"PKG-04",name:"Maznet Pro",speed:50,price:450000,active:true,customers:48,description:"Performa maksimal untuk bisnis"},
];

export const initialCustomers: Customer[] = [
 {id:"MZN-000128",name:"Ahmad Fauzi",phone:"0812 3456 7821",address:"Jl. Melati No. 18, Sukamaju",packageName:"Maznet Family",price:220000,dueDay:10,status:"Menunggak",installed:"2024-03-10"},
 {id:"MZN-000246",name:"Siti Nurhaliza",phone:"0857 8821 1090",address:"Kp. Cibiru RT 03/RW 06",packageName:"Maznet Basic",price:150000,dueDay:8,status:"Menunggak",installed:"2024-08-08"},
 {id:"MZN-000314",name:"Budi Santoso",phone:"0813 9912 4432",address:"Perum Griya Asri Blok C7",packageName:"Maznet Plus",price:300000,dueDay:15,status:"Aktif",installed:"2025-01-15"},
 {id:"MZN-000087",name:"Rina Marlina",phone:"0822 7710 4567",address:"Jl. Mawar Dalam No. 4",packageName:"Maznet Family",price:220000,dueDay:5,status:"Terisolir",installed:"2023-11-05"},
 {id:"MZN-000421",name:"Dedi Kurniawan",phone:"0819 5512 7890",address:"Desa Mekarsari RT 02/RW 01",packageName:"Maznet Pro",price:450000,dueDay:20,status:"Aktif",installed:"2025-05-20"},
 {id:"MZN-000399",name:"Nia Ramadhani",phone:"0878 3309 2211",address:"Jl. Anggrek Raya No. 9",packageName:"Maznet Basic",price:150000,dueDay:12,status:"Aktif",installed:"2025-04-12"},
];

export const initialInvoices: Invoice[] = [
 {id:"INV-MZN-202606-000128",customerId:"MZN-000128",customer:"Ahmad Fauzi",period:"Juni 2026",dueDate:"2026-06-10",amount:220000,status:"Jatuh Tempo"},
 {id:"INV-MZN-202606-000246",customerId:"MZN-000246",customer:"Siti Nurhaliza",period:"Juni 2026",dueDate:"2026-06-08",amount:150000,status:"Jatuh Tempo"},
 {id:"INV-MZN-202606-000314",customerId:"MZN-000314",customer:"Budi Santoso",period:"Juni 2026",dueDate:"2026-06-15",amount:300000,status:"Belum Lunas"},
 {id:"INV-MZN-202606-000421",customerId:"MZN-000421",customer:"Dedi Kurniawan",period:"Juni 2026",dueDate:"2026-06-20",amount:450000,status:"Belum Lunas"},
 {id:"INV-MZN-202605-000399",customerId:"MZN-000399",customer:"Nia Ramadhani",period:"Mei 2026",dueDate:"2026-05-12",amount:150000,status:"Lunas"},
];

export const initialPayments: Payment[] = [
 {id:"PAY-202606-00482",invoiceId:"INV-MZN-202606-000399",customer:"Nia Ramadhani",amount:150000,method:"QRIS",channel:"Xendit",paidAt:"12 Jun 2026, 09:42"},
 {id:"PAY-202606-00481",invoiceId:"INV-MZN-202606-000314",customer:"Budi Santoso",amount:300000,method:"Transfer Bank",channel:"Manual",paidAt:"11 Jun 2026, 16:18"},
 {id:"PAY-202606-00480",invoiceId:"INV-MZN-202606-000421",customer:"Dedi Kurniawan",amount:450000,method:"Virtual Account",channel:"Xendit",paidAt:"10 Jun 2026, 13:05"},
];

export const revenue = [32,38,35,47,44,58,53,62,57,69,64,76];
export const months = ["Jul","Agu","Sep","Okt","Nov","Des","Jan","Feb","Mar","Apr","Mei","Jun"];
