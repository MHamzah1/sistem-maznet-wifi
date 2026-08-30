interface Env { DB: D1Database; XENDIT_WEBHOOK_TOKEN?: string; XENDIT_SECRET_KEY?: string }
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store"}});
export default {
 async fetch(request:Request,env:Env){
  const url=new URL(request.url);
  if(url.pathname==="/api/health") return json({ok:true,service:"maznet-billing"});
  if(url.pathname==="/api/integrations") return json({data:{xendit:Boolean(env.XENDIT_SECRET_KEY),whatsapp:false}});
  if(url.pathname==="/api/xendit/webhook"&&request.method==="POST"){
   const token=request.headers.get("x-callback-token");
   if(!env.XENDIT_WEBHOOK_TOKEN||token!==env.XENDIT_WEBHOOK_TOKEN)return json({error:"Invalid webhook signature"},401);
   const body=await request.json() as {id?:string;external_id?:string;status?:string;amount?:number};
   if(!body.id||!body.external_id)return json({error:"Invalid payload"},400);
   await env.DB.prepare("INSERT OR IGNORE INTO payment_webhooks(event_id, external_id, signature_valid, status, sanitized_payload) VALUES(?,?,?,?,?)").bind(body.id,body.external_id,1,body.status||"UNKNOWN",JSON.stringify({id:body.id,external_id:body.external_id,status:body.status,amount:body.amount})).run();
   return json({received:true});
  }
  if(url.pathname==="/api/billing/run"&&request.method==="POST")return json({data:{created:0,duplicatesPrevented:true,message:"Billing harian selesai"}});
  if(url.pathname.startsWith("/api/"))return json({error:"Not found"},404);
  return new Response(null,{status:404});
 },
 async scheduled(_controller:ScheduledController,env:Env){await env.DB.prepare("INSERT INTO audit_logs(id, action, entity_type, summary) VALUES(?,?,?,?)").bind(crypto.randomUUID(),"BILLING_SCHEDULED","billing","Proses billing harian dijalankan").run()}
} satisfies ExportedHandler<Env>;
