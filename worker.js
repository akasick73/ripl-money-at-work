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
    'New RIPL Lazy Money Quiz Lead','',`Email: ${email}`,`Results category: ${category}`,
    `Educational marketing opt-in: ${consent}`,`Source page: ${safeText(data['Source page']||'').slice(0,240)}`,'',
    ...answerKeys.sort((a,b)=>Number(a.match(/^Question (\d):/)[1])-Number(b.match(/^Question (\d):/)[1]))
      .flatMap(k=>[safeText(k),safeText(data[k]||'').slice(0,450),'']),
    'Please do not send sensitive documents through ordinary email.'
  ];
  if(!env.RESEND_API_KEY||!env.RIPL_EMAIL_FROM)
    return json({success:false,error:'Submission temporarily unavailable'},503);
  // RIPL_EMAIL_FROM must be a verified sender configured in Resend.
  const accepted=await sendMail(env,{to:[LEAD_TO],reply_to:email,subject:'New RIPL Lazy Money Quiz Lead',text:lines.join('\n')});
  if(!accepted)return json({success:false,error:'Submission temporarily unavailable'},502);
  const reportLines=['Your Lazy Money Quiz Results | RIPL Wealth','',`Your result: ${category}`,'',...answerKeys.sort((a,b)=>Number(a.match(/^Question (\d):/)[1])-Number(b.match(/^Question (\d):/)[1])).map(k=>`${safeText(k)}\n${safeText(data[k]||'').slice(0,450)}`),'','Your complete personalized report is available on the page where you finished the quiz. You can also use Save as PDF there.','','Have a question about your results? Just reply to this email. Your reply goes directly to Adam at adam@riplwealth.com. We would be happy to hear what is on your mind.','Please do not send account numbers, tax returns, or other sensitive documents by email.','','Book a free 20-minute introduction: https://calendly.com/adam-riplwealth/20-minute-zoom-meeting','','Investment advisory services are provided through RIPL Wealth, LLC, a registered investment adviser.'];
  // Transactional report summary is separate from optional marketing consent.
  const visitorAccepted=await sendMail(env,{to:[email],reply_to:LEAD_TO,subject:'Your Lazy Money Quiz Summary | RIPL Wealth',text:reportLines.join('\n')});
  if(!visitorAccepted)return json({success:false,error:'We could not confirm the visitor email'},502);
  return json({success:true});
}

async function sendMail(env,message){
  if(!env.RESEND_API_KEY||!env.RIPL_EMAIL_FROM)return false;
  try{
    const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:env.RIPL_EMAIL_FROM,...message}),signal:AbortSignal.timeout(12000)});
    if(!response.ok){console.error('RIPL mail provider HTTP',response.status);return false}
    const result=await response.json().catch(()=>null);return Boolean(result?.id);
  }catch{console.error('RIPL mail provider request failed');return false}
}
async function questionSubmission(request,env){
  if(request.method!=='POST')return json({success:false,error:'Method not allowed'},405,{Allow:'POST'});
  const origin=request.headers.get('Origin');if(origin&&origin!==new URL(request.url).origin)return json({success:false},403);
  if(!(request.headers.get('content-type')||'').includes('application/json'))return json({success:false},415);
  const raw=await request.text();if(raw.length>6000)return json({success:false},413);
  let data;try{data=JSON.parse(raw)}catch{return json({success:false},400)}
  if(data.website)return json({success:true});
  const name=safeText(data.name||'').slice(0,120),email=safeText(data.email||'').slice(0,254),question=safeText(data.question||'').slice(0,2000);
  if(!name||!question||question.length<8||!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))return json({success:false,error:'Please complete all fields'},400);
  const notified=await sendMail(env,{to:[LEAD_TO],reply_to:email,subject:'RIPL Website Question',text:`New website question\nName: ${name}\nEmail: ${email}\n\n${question}\n\nNo marketing consent was requested.`});
  if(!notified)return json({success:false,error:'Delivery unavailable'},503);
  // The acknowledgment is best-effort; the user is never subscribed to marketing.
  await sendMail(env,{to:[email],reply_to:LEAD_TO,subject:'We received your question | RIPL Wealth',text:`Hi ${name},\n\nThanks for contacting RIPL Wealth. We've received your question and will follow up by email. You can also reply directly to this message with another question; your reply will reach Adam at adam@riplwealth.com.\n\nIf you prefer a conversation, you can book a free 20-minute Zoom introduction here:\nhttps://calendly.com/adam-riplwealth/20-minute-zoom-meeting\n\nPlease do not email account numbers, tax returns, or other sensitive information.\n\nRIPL Wealth, LLC`});
  return json({success:true});
}

export default {
  async fetch(request,env){
    const path=new URL(request.url).pathname;
    if(path==='/api/quiz-lead'||path==='/api/quiz-lead/')return submitQuiz(request,env);
    if(path==='/api/question'||path==='/api/question/')return questionSubmission(request,env);
    if(env.ASSETS)return env.ASSETS.fetch(request);
    return new Response('Site asset binding is missing',{status:500});
  }
};
