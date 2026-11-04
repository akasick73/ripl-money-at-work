// V19: same-origin Cloudflare Worker email submission via Resend.
// Required bindings: RESEND_API_KEY (Secret), RIPL_EMAIL_FROM (verified sender).
// Email recipient remains adam@riplwealth.com. No quiz responses are logged or sent to ad analytics.
const EMAIL_API = 'https://api.resend.com/emails';
const RECIPIENT = 'adam@riplwealth.com';
const MAX_BYTES = 16000;
const json = (data, status = 200, extras = {}) => new Response(JSON.stringify(data), {
  status, headers: { 'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...extras }
});

async function submitQuiz(request, env) {
  if (request.method !== 'POST') return json({success:false, error:'Method not allowed'},405,{Allow:'POST'});
  const origin=request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return json({success:false,error:'Origin not allowed'},403);
  if (!(request.headers.get('content-type')||'').toLowerCase().includes('application/json')) {
    return json({success:false,error:'JSON request required'},415);
  }
  const declared=Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared>MAX_BYTES) return json({success:false,error:'Submission too large'},413);
  let payload;
  try {
    const text=await request.text();
    if (text.length>MAX_BYTES) return json({success:false,error:'Submission too large'},413);
    payload=JSON.parse(text);
  } catch {return json({success:false,error:'Invalid submission'},400)}
  if (!payload || typeof payload!=='object' || Array.isArray(payload)) return json({success:false,error:'Invalid submission'},400);
  const email=String(payload.email||'').trim();
  if (email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({success:false,error:'Enter a valid email address'},400);
  if (String(payload._honey||'').trim()) return json({success:false,error:'Submission rejected'},400);
  const keys=Object.keys(payload);
  if (keys.length>20 || keys.filter(k=>k.startsWith('Question ')).length!==9) return json({success:false,error:'Incomplete quiz'},400);
  // Only explicitly selected quiz fields and opt-in are emailed.
  const answers=[];
  for (let index=1; index<=9; index++){
    const matched=keys.filter(k => k.startsWith(`Question ${index}: `));
    if (matched.length!==1) return json({success:false,error:'Incomplete quiz'},400);
    answers.push([matched[0], String(payload[matched[0]]).slice(0,450)]);
  }
  if (!env.RESEND_API_KEY || !env.RIPL_EMAIL_FROM) {
    return json({success:false,error:'Email delivery is not configured. Please contact RIPL Wealth.'},503);
  }
  // Never include arbitrary HTML from the visitor. Message is text/plain.
  const marketing=payload['Educational marketing opt-in']==='YES — opted in' ? 'YES — opted in' : 'NO — not opted in';
  const lines=[
    'New RIPL Financial Freedom Quiz Lead',
    '',
    `Email: ${email}`,
    `Results category: ${String(payload['Results category']||'').slice(0,200)}`,
    `Educational marketing opt-in: ${marketing}`,
    `Source page: ${new URL(request.url).origin}/`,
    '',
    ...answers.flatMap(([question,answer])=>[question,answer,''])
  ];
  const apiPayload={
    from: env.RIPL_EMAIL_FROM,
    to: [RECIPIENT],
    reply_to: email,
    subject: 'New RIPL Financial Freedom Quiz Lead',
    text: lines.join('\n')
  };
  let response;
  try{
    response=await fetch(EMAIL_API,{
      method:'POST',
      headers:{'Authorization':`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify(apiPayload),
      signal:AbortSignal.timeout(10000)
    });
  }catch{
    return json({success:false,error:'Email submission service unavailable. Please try again.'},502);
  }
  let result=null;
  try{result=await response.json()}catch{}
  if (!response.ok || !result?.id){
    // Do not leak vendor error details, request contents, or credentials into the browser.
    return json({success:false,error:'Email service could not accept your request. Please try again.'},502);
  }
  // Resend accepted the email for processing; final inbox delivery must be checked separately.
  return json({success:true});
}

export default {
  async fetch(request,env){
    const path=new URL(request.url).pathname;
    if (path === '/api/quiz-lead' || path === '/api/quiz-lead/') return submitQuiz(request,env);
    if(env.ASSETS) return env.ASSETS.fetch(request);
    return new Response('Site asset binding is missing', {status:500});
  }
};
