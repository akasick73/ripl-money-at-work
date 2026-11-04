// V18: same-origin quiz lead submission proxy, for Cloudflare Pages advanced mode
// or Cloudflare Workers static assets. No quiz responses are logged or included in analytics.
const UPSTREAM = 'https://formsubmit.co/ajax/adam@riplwealth.com';
const MAX_BYTES = 16000;
const json = (data, status = 200, extras = {}) => new Response(JSON.stringify(data), {
  status, headers: { 'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...extras }
});

async function submitQuiz(request) {
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
  // Do not forward arbitrary FormSubmit metadata or a user-provided destination.
  const safe={
    _subject:'New RIPL Financial Freedom Quiz Lead', _template:'table', _captcha:'false',
    email,
    'Results category':String(payload['Results category']||'').slice(0,200),
    'Educational marketing opt-in':payload['Educational marketing opt-in']==='YES — opted in'?'YES — opted in':'NO — not opted in',
    'Source page':new URL(request.url).origin+'/',
  };
  for(const key of keys) if(/^Question [1-9]: .{1,180}$/.test(key)) safe[key]=String(payload[key]).slice(0,450);
  let response;
  try{
    response=await fetch(UPSTREAM,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded;charset=UTF-8','accept':'application/json'},body:new URLSearchParams(safe).toString(),redirect:'manual',signal:AbortSignal.timeout(12000)});
  }catch{return json({success:false,error:'Submission service unavailable. Please try again.'},502)}
  let result=null;
  try{result=await response.json()}catch{}
  if(!response.ok || String(result?.success).toLowerCase()!=='true') {
    // Do not claim success for HTML, redirects, activation errors, or ambiguous responses.
    return json({success:false,error:'We could not confirm delivery. Please try again or contact RIPL Wealth.'},502);
  }
  return json({success:true});
}

export default {
  async fetch(request,env){
    const path=new URL(request.url).pathname;
    if (path === '/api/quiz-lead' || path === '/api/quiz-lead/') return submitQuiz(request);
    if(env.ASSETS) return env.ASSETS.fetch(request);
    return new Response('Site asset binding is missing', {status:500});
  }
};
