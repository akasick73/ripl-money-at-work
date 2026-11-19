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


// HTML email: table-based layout, inline styles, and text fallback for Outlook/Gmail/mobile.
const emailEscape=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const emailCell=(value,max=1200)=>emailEscape(String(value??'').slice(0,max));
function renderQuizEmail(data){
  const r=data.structured;
  const heading=emailCell(r.heading,180),opening=emailCell(r.opening),bridge=emailCell(r.bridge);
  const closing=emailCell(r.closing),invitation=emailCell(r.invitation);
  const items=r.priorities.map((item,i)=>`<tr><td style="padding:22px 0;border-bottom:1px solid #48413a;vertical-align:top;width:42px"><div style="background:#c99b42;color:#171717;border-radius:50%;width:30px;height:30px;line-height:30px;text-align:center;font-size:15px;font-weight:bold">${i+1}</div></td><td style="padding:22px 0 22px 12px;border-bottom:1px solid #48413a"><div style="color:#ffffff;font-size:16px;line-height:23px;font-weight:bold">${emailCell(item.title,180)}</div><div style="color:#d2d0cd;font-size:14px;line-height:23px;padding-top:8px">${emailCell(item.body,1500)}</div></td></tr>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><title>Your Lazy Money Quiz Results</title></head><body style="margin:0;padding:0;background:#efefed;font-family:Arial,Helvetica,sans-serif;color:#ffffff"><div style="display:none;max-height:0;overflow:hidden;opacity:0">Your personalized Lazy Money Quiz results and three areas worth a conversation.</div><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#efefed"><tr><td align="center" style="padding:28px 12px"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px;background:#1a1a1a;border-collapse:collapse"><tr><td align="center" style="padding:34px 26px 26px;border-bottom:2px solid #c99b42"><div style="font-family:Georgia,serif;font-size:38px;font-weight:bold;letter-spacing:5px;color:#c99b42">RIPL.</div><div style="color:#d1d1d1;font-size:11px;letter-spacing:2px;padding-top:9px">YOUR MONEY. YOUR NEXT CHAPTER.</div></td></tr><tr><td align="center" style="padding:34px 28px 28px"><div style="font-size:11px;font-weight:bold;letter-spacing:2px;color:#d5a84f">YOUR PERSONALIZED RESULTS</div><h1 style="font-family:Georgia,serif;font-size:29px;line-height:36px;margin:15px 0 20px;color:#ffffff;font-weight:normal">${heading}</h1><p style="font-size:17px;line-height:27px;color:#ffffff;margin:0 0 12px">${opening}</p><p style="font-size:15px;line-height:25px;color:#d0d0d0;margin:0">${bridge}</p></td></tr><tr><td style="padding:0 22px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#282828"><tr><td style="padding:25px 22px 4px"><div style="font-size:12px;letter-spacing:2px;font-weight:bold;color:#d5a84f">WHERE I'D START</div><div style="font-family:Georgia,serif;font-size:21px;line-height:29px;padding-top:10px;color:#fff">Three areas worth a conversation</div><p style="color:#c6c6c6;font-size:13px;line-height:21px;margin:9px 0 0">Educational starting points based on your answers, not a financial score or diagnosis.</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${items}</table></td></tr></table></td></tr><tr><td align="center" style="padding:32px 28px 12px"><h2 style="font-family:Georgia,serif;font-weight:normal;font-size:23px;line-height:31px;color:#ffffff;margin:0 0 13px">${closing}</h2><p style="font-size:15px;line-height:25px;color:#d1d1d1;margin:0">${invitation}</p></td></tr><tr><td align="center" style="padding:23px 25px 36px"><a href="https://calendly.com/adam-riplwealth/20-minute-zoom-meeting" style="display:inline-block;background:#c99b42;color:#151515;text-decoration:none;font-weight:bold;font-size:16px;padding:16px 26px;border-radius:30px">Let\'s Talk — 20 Minutes</a><br><a href="mailto:adam@riplwealth.com?subject=Question%20About%20My%20Lazy%20Money%20Quiz%20Results" style="display:inline-block;margin-top:14px;border:2px solid #c99b42;color:#e5b65c;text-decoration:none;font-weight:bold;font-size:16px;padding:14px 26px;border-radius:30px">Email Adam a Question</a><p style="color:#c4c4c4;font-size:12px;line-height:19px;margin:15px 0 0">A conversation, not a commitment. Choose whichever works best for you. You can also reply directly to this email.</p></td></tr><tr><td style="border-top:1px solid #48413a;padding:22px 28px 28px;text-align:center;color:#bdbdbd;font-size:11px;line-height:19px">Educational discussion prompts based on self-reported answers. Not individualized financial, tax, or legal advice. Investing involves risk, including possible loss of principal. No outcome is guaranteed.<br><br>Investment advisory services are provided through RIPL Wealth, LLC, a registered investment adviser.<br><br>Sent in response to your request for quiz results. This does not enroll you in marketing emails.</td></tr></table></td></tr></table></body></html>`;
}
// Transactional quiz summary delivery. Sends a visitor copy and an archived RIPL copy.
async function emailQuizResults(request,env){
  if(request.method!=='POST')return json({success:false},405,{Allow:'POST'});
  const origin=request.headers.get('Origin');
  if(origin&&origin!==new URL(request.url).origin)return json({success:false},403);
  if(!(request.headers.get('content-type')||'').includes('application/json'))return json({success:false},415);
  const raw=await request.text();if(raw.length>16000)return json({success:false},413);
  let data;try{data=JSON.parse(raw)}catch{return json({success:false},400)}
  const email=typeof data.email==='string'?data.email.trim():'';
  if(email.length>254||!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))return json({success:false},400);
  if(typeof data.report!=='string'||data.report.length<100||data.report.length>11000)return json({success:false},400);
  const report=data.report.replace(/[\u0000-\u001f]/g,c=>c==='\n'?'\n':' ').slice(0,11000);
  const category=safeText(data.category||'').slice(0,200);
  const r=data.structured;
  if(!r||typeof r!=='object'||!Array.isArray(r.priorities)||r.priorities.length!==3||
     !['heading','opening','bridge','closing','invitation'].every(k=>typeof r[k]==='string'&&r[k].length>0&&r[k].length<1600)||
     !r.priorities.every(x=>x&&typeof x.title==='string'&&x.title.length>0&&x.title.length<200&&typeof x.body==='string'&&x.body.length>0&&x.body.length<1600))
    return json({success:false,error:'Invalid report details'},400);
  const htmlBody=renderQuizEmail(data);
  const textBody=['Your Lazy Money Quiz Results | RIPL Wealth','','Your educational summary:',report,'',
    'This is an educational discussion starter, not individualized financial, tax, or legal advice.',
    'Have a question? Reply to this message or book a free introduction:',
    'https://calendly.com/adam-riplwealth/20-minute-zoom-meeting',
    '','Investment advisory services are provided through RIPL Wealth, LLC, a registered investment adviser.'].join('\n');
  // An archived RIPL copy is required for each outbound message.
  const delivered=await sendMail(env,{to:[email],bcc:[LEAD_TO],reply_to:LEAD_TO,
    subject:'Your Personalized Lazy Money Quiz Results | RIPL Wealth',text:textBody,html:htmlBody});
  if(!delivered)return json({success:false,error:'Email service unavailable'},503);
  return json({success:true});
}

export default {
  async fetch(request,env){
    const path=new URL(request.url).pathname;
    if(path==='/api/email-quiz-results'||path==='/api/email-quiz-results/')return emailQuizResults(request,env);
    if(path==='/api/quiz-lead'||path==='/api/quiz-lead/')return submitQuiz(request,env);
    if(path==='/api/question'||path==='/api/question/')return questionSubmission(request,env);
    if(env.ASSETS)return env.ASSETS.fetch(request);
    return new Response('Site asset binding is missing',{status:500});
  }
};
