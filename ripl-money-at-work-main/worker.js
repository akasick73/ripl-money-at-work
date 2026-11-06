// RIPL Wealth — same-origin quiz lead submission handler.
// Requires RESEND_API_KEY and RIPL_EMAIL_FROM configured as Cloudflare secrets/variables.
// Do not log visitor emails or quiz responses.
const LEAD_TO='adam@riplwealth.com';
const MAX_BYTES=16000;
const json=(data,status=200,extra={})=>new Response(JSON.stringify(data),{
  status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',
    'x-content-type-options':'nosniff',...extra}
});
const safeText=value=>String(value).replace(/[\r\n\u0000-\u001f\u007f]/g,' ').trim();

async function submitQuiz(request,env){
  if(request.method!=='POST')return json({success:false,error:'Method not allowed'},405,{Allow:'POST'});
  const origin=request.headers.get('Origin');
  if(origin && origin!==new URL(request.url).origin)return json({success:false,error:'Origin not allowed'},403);
  if(!(request.headers.get('content-type')||'').toLowerCase().includes('application/json'))return json({success:false,error:'JSON required'},415);
  const length=Number(request.headers.get('content-length'));
  if(Number.isFinite(length)&&length>MAX_BYTES)return json({success:false,error:'Submission too large'},413);
  let data;
  try{const raw=await request.text();if(raw.length>MAX_BYTES)return json({success:false,error:'Submission too large'},413);data=JSON.parse(raw)}
  catch{return json({success:false,error:'Invalid submission'},400)}
  if(!data||typeof data!=='object'||Array.isArray(data))return json({success:false,error:'Invalid submission'},400);
  if(safeText(data._honey||''))return json({success:false,error:'Submission rejected'},400);
  const email=typeof data.email==='string'?data.email.trim():'';
  if(email.length>254||!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))return json({success:false,error:'Enter a valid email address'},400);
  const keys=Object.keys(data);
  const answerKeys=keys.filter(k=>/^Question [1-9]: .{1,180}$/.test(k));
  if(keys.length>20||answerKeys.length!==9||new Set(answerKeys.map(k=>Number(k.match(/^Question (\d):/)[1]))).size!==9)
    return json({success:false,error:'Incomplete quiz'},400);
  const consent=data['Educational marketing opt-in']==='YES — opted in'?'YES — opted in':'NO — not opted in';
  const category=safeText(data['Results category']||'').slice(0,200);
  const lines=[
    'New RIPL Financial Freedom Quiz Lead','',`Email: ${email}`,`Results category: ${category}`,
    `Educational marketing opt-in: ${consent}`,`Source page: ${safeText(data['Source page']||'').slice(0,240)}`,'',
    ...answerKeys.sort((a,b)=>Number(a.match(/^Question (\d):/)[1])-Number(b.match(/^Question (\d):/)[1]))
      .flatMap(k=>[safeText(k),safeText(data[k]||'').slice(0,450),'']),
    'Please do not send sensitive documents through ordinary email.'
  ];
  if(!env.RESEND_API_KEY||!env.RIPL_EMAIL_FROM)
    return json({success:false,error:'Submission temporarily unavailable'},503);
  // RIPL_EMAIL_FROM must be a verified sender configured in Resend.
  const message={from:env.RIPL_EMAIL_FROM,to:[LEAD_TO],reply_to:email,
    subject:'New RIPL Financial Freedom Quiz Lead',text:lines.join('\n')};
  try{
    const response=await fetch('https://api.resend.com/emails',{
      method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify(message),signal:AbortSignal.timeout(12000)
    });
    if (!response.ok) {
  console.error("RIPL email provider status", response.status, (await response.text()).slice(0, 500));
  return json({ success: false, error: "Submission temporarily unavailable" }, 502);
}
    const result=await response.json().catch(()=>null);
    if(!result?.id)return json({success:false,error:'Submission could not be confirmed'},502);
    // Provider accepted the email for processing; inbox delivery must be tested separately.
    return json({success:true});
  }catch(err){console.error('RIPL email provider connection failed');
    return json({success:false,error:'Submission temporarily unavailable'},502)}
}
export default {
  async fetch(request,env){
    const path=new URL(request.url).pathname;
    if(path==='/api/quiz-lead'||path==='/api/quiz-lead/')return submitQuiz(request,env);
    if(env.ASSETS)return env.ASSETS.fetch(request);
    return new Response('Site asset binding is missing',{status:500});
  }
};
