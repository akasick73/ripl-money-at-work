import {questions,motivations,observations} from './data.js';
const $=s=>document.querySelector(s);
const attributionKeys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
const source=new URLSearchParams(location.search);const saved=(()=>{try{return JSON.parse(sessionStorage.getItem('ripl_utm')||'{}')}catch{return {}}})();
const attribution={};for(const k of attributionKeys){const v=source.get(k)||saved[k];if(v)attribution[k]=String(v).slice(0,180)}
try{sessionStorage.setItem('ripl_utm',JSON.stringify(attribution))}catch{}

// Only book an introductory conversation; this public page never receives tax returns.
const BOOKING_URL='https://calendly.com/adam-riplwealth/20-minute-zoom-meeting';
// Submit through the same-origin Cloudflare Worker. Never navigate visitors away from RIPL.
const LEAD_API_ENDPOINT='/api/quiz-lead';


function linkWithUtm(url){const u=new URL(url);for(const [k,v] of Object.entries(attribution))u.searchParams.set(k,v);return u.href}
const BOOKING_BASE=linkWithUtm(BOOKING_URL);
const modal=$('#calendly-modal'),frameHost=$('#calendly-frame-container'),closeBtn=$('#calendly-close');
let lastFocus=null;
function openBooking(event){
  event?.preventDefault();lastFocus=document.activeElement;
  const u=new URL(BOOKING_BASE);
  const type=event?.currentTarget?.dataset?.bookType||'intro';
  if(!u.searchParams.has('utm_content'))u.searchParams.set('utm_content',type);
  u.searchParams.set('embed_domain',location.hostname);u.searchParams.set('embed_type','Inline');const frame=document.createElement('iframe');frame.title='Schedule a free 20-minute Zoom conversation';frame.src=u.href;frame.loading='eager';frame.setAttribute('allow','payment *');
  frameHost.replaceChildren(frame);$('#calendly-external').href=u.href;
  modal.hidden=false;document.body.classList.add('booking-open');closeBtn.focus();
  window.dataLayer?.push({event:'ripl_booking_click',placement:type});
}
function closeBooking(){modal.hidden=true;frameHost.replaceChildren();document.body.classList.remove('booking-open');lastFocus?.focus?.()}
for(const a of document.querySelectorAll('[data-book]')){a.href=BOOKING_BASE;a.addEventListener('click',openBooking)}
closeBtn.addEventListener('click',closeBooking);
modal.addEventListener('click',e=>{if(e.target===modal)closeBooking()});
document.addEventListener('keydown',e=>{if(!modal.hidden&&e.key==='Escape')closeBooking();if(!modal.hidden&&e.key==='Tab'){const focusables=[closeBtn,$('#calendly-external')];if(e.shiftKey&&document.activeElement===focusables[0]){e.preventDefault();focusables[1].focus()}else if(!e.shiftKey&&document.activeElement===focusables[1]){e.preventDefault();focusables[0].focus()}}});
// Calendly documents the event_scheduled postMessage event for its embedded widget.
window.addEventListener('message',e=>{if(e.origin!=='https://calendly.com'||!e.data||e.data.event!=='calendly.event_scheduled')return;
  window.dataLayer?.push({event:'ripl_booking_confirmed'});window.oaiq?.('measure','appointment_scheduled',{type:'customer_action'});if(typeof window.gtag==='function')window.gtag('event','calendly_booking_confirmed',{event_category:'calendly',event_label:'confirmed_booking'});
});
let step=0;let answers=[];let hasStarted=false;let complete=false;
// A fresh page load always starts the quiz from Question 1. Clear older builds' saved answers.
try{sessionStorage.removeItem('ripl_financial_freedom_progress_v1')}catch{}
function persist(){/* Quiz answers intentionally remain only in memory until page reload. */}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function quizAction(e){e?.preventDefault();document.querySelector('#quiz')?.scrollIntoView({behavior:'smooth',block:'start'});window.dataLayer?.push({event:'ripl_quiz_cta_click',placement:e?.currentTarget?.dataset?.placement||'unknown'});}
document.querySelectorAll('[data-quiz-link]:not(#adaptive-link)').forEach(el=>el.addEventListener('click',quizAction));
// After each answer, reveal feedback and advance automatically after a short reading window.
// Background tabs do not consume reading time. No manual navigation is shown.
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let advanceTimer=null;
function stopAutoAdvance(){
  if(advanceTimer?.frame)cancelAnimationFrame(advanceTimer.frame);
  advanceTimer=null;
}
function feedbackDuration(feedback){
  // Adaptive 2.5–4 seconds to read feedback before advancing.
  return Math.max(2500,Math.min(4000,1700+feedback.trim().split(/\s+/).length*110));
}
function render(){
  stopAutoAdvance();
  if(complete){finish(false);return}
  document.querySelector('#quiz .quiz-shell').hidden=false;
  const q=questions[step];
  $('#quiz-progress').hidden=false;
  $('#results').hidden=true;
  $('#step-label').textContent=`Question ${step+1} of ${questions.length}`;
  $('#progress-fill').style.width=`${(step+1)/questions.length*100}%`;
  const chosen=answers[step];
  $('#quiz-content').innerHTML=`<h3 class="question-title" tabindex="-1">${esc(q.title)}</h3><p class="hint">${esc(q.hint).replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}</p><div class="options">${q.options.map((o,i)=>`<div class="option-with-feedback"><button type="button" data-answer="${i}" class="${chosen===i?'selected':''}" aria-pressed="${chosen===i}">${esc(o)}</button>${chosen===i?`<div class="answer-feedback" role="status"><p class="answer-observation">${esc(q.feedback[i])}</p><div class="feedback-timer" aria-label="Automatically moving to the next question"><div class="feedback-timer-track" aria-hidden="true"><span id="feedback-timer-fill"></span></div></div></div>`:''}</div>`).join('')}</div>${step>0?'<button type="button" class="quiz-back" id="quiz-back">← Back</button>':''}`;
}
function advanceQuiz(){
  stopAutoAdvance();
  if(!Number.isInteger(answers[step]))return;
  if(step===questions.length-1){finish();return}
  step++;persist();render();
  // After a longer answer list, keep the new question in view on mobile.
  const heading=document.querySelector('#quiz-content .question-title');
  const top=heading?.getBoundingClientRect().top??0;
  if(top<85||top>window.innerHeight*.68){
    document.querySelector('#quiz')?.scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'start'});
  }
}
function startAutoAdvance(){
  stopAutoAdvance();
  if(!Number.isInteger(answers[step]))return;
  const duration=feedbackDuration(questions[step].feedback[answers[step]]);
  const timer={remaining:duration,startedAt:0,running:false,frame:null,step,answer:answers[step]};
  advanceTimer=timer;
  const fill=$('#feedback-timer-fill');
  if(!fill)return;
  const paint=()=>{fill.style.width=`${Math.max(0,Math.min(100,100*(1-timer.remaining/duration)))}%`};
  const tick=now=>{
    if(advanceTimer!==timer||!timer.running)return;
    const elapsed=now-timer.startedAt;
    timer.startedAt=now;
    timer.remaining=Math.max(0,timer.remaining-elapsed);
    paint();
    if(timer.remaining===0){
      if(step===timer.step&&answers[step]===timer.answer)advanceQuiz();
      return;
    }
    timer.frame=requestAnimationFrame(tick);
  };
  timer.pause=()=>{
    if(!timer.running)return;
    timer.running=false;
    if(timer.frame)cancelAnimationFrame(timer.frame);
    timer.frame=null;
  };
  timer.resume=()=>{
    if(timer.running||advanceTimer!==timer)return;
    timer.running=true;timer.startedAt=performance.now();
    timer.frame=requestAnimationFrame(tick);
  };
  paint();
  if(!document.hidden)timer.resume();
}
document.addEventListener('visibilitychange',()=>{
  if(!advanceTimer)return;
  if(document.hidden)advanceTimer.pause();
  else advanceTimer.resume();
});
function resultText(){const m=motivations[answers[0]],items=observations(answers);return `${m.heading}\n\n${m.opening}\n\n${m.bridge}\n\nWHERE I'D START\n\n${items.map((x,i)=>`${i+1}. ${x.title}\n${x.body}`).join('\n\n')}\n\n${m.closing}\n${m.invitation}\n\nTalk with Adam: ${BOOKING_URL}\n\nEducational discussion prompts based on self-reported answers. Not individualized financial, tax, or legal advice. Investing involves risk, including possible loss of principal.`}
// The results presentation is intentionally compact, grounded in quiz answers,
// and educational. No fake score, certainty, or financial recommendation.
const resultProfiles=[
  {title:'More Time for What Matters',focus:'Time with family and personal interests',summary:'You want your business success to create more room for the people and experiences that matter to you.'},
  {title:'Growth on Your Terms',focus:'More control over how you grow',summary:'You enjoy building, but you also want the freedom to choose how much of your time it takes.'},
  {title:'Your Next Chapter',focus:'Freedom to choose what comes next',summary:'You may be considering a transition, a sale, or simply more options beyond the business.'},
  {title:'Confidence for Your Family',focus:'Providing for the people you love',summary:'You want a clearer picture of how your financial decisions support the people who matter most.'}
];
function snapshotItems(){
  const timeline=questions[1].options[answers[1]];
  const cash=answers[5];
  const team=answers[6];
  return [
    {label:'WHAT MATTERS MOST',value:resultProfiles[answers[0]].focus,icon:'✦'},
    {label:'YOUR TIME HORIZON',value:timeline,icon:'◷'},
    {label:'A QUESTION TO EXPLORE',value:team===1?'Who coordinates your financial team?':team===2||team===3?'Who connects the financial pieces?':cash===2?'How much cash does the business need?':'How do your resources support your goals?',icon:'↗'}
  ];
}
function reportTop(){
  const p=resultProfiles[answers[0]];
  return `<div class="results-intro"><div class="results-intro-kicker"><span>YOUR PERSONALIZED EDUCATIONAL SUMMARY</span><span class="results-complete-mark" aria-label="Quiz complete">✓ Quiz complete</span></div><h2>${esc(p.title)}</h2><p>${esc(p.summary)}</p><div class="results-focus"><span class="results-focus-dot" aria-hidden="true"></span><span>Your focus: <strong>${esc(p.focus)}</strong></span></div></div>`;
}
function snapshotHtml(){
  return `<section class="results-snapshot" aria-label="What your answers suggest"><div class="results-section-heading"><span class="results-section-eyebrow">YOUR SNAPSHOT</span><h3>What your answers suggest</h3><p>Three educational starting points based on your answers—not a financial assessment.</p></div><div class="snapshot-grid">${snapshotItems().map(x=>`<article class="snapshot-tile"><span class="snapshot-icon" aria-hidden="true">${x.icon}</span><div><span class="snapshot-label">${esc(x.label)}</span><p>${esc(x.value)}</p></div></article>`).join('')}</div></section>`;
}
function priorityHtml(item,i){return `<article class="priority-card"><span class="priority-number">0${i+1}</span><div><h4>${esc(item.title)}</h4><p>${esc(item.body)}</p></div></article>`;}
function reportHtml(m,items){
  return `<div class="result-print polished-report">${reportTop()}${snapshotHtml()}<section class="results-priorities"><div class="results-section-heading"><span class="results-section-eyebrow">WHERE I'D START</span><h3>Three areas worth exploring</h3><p>You may already be on the right track. Or there may be opportunities worth exploring. Here’s where I’d start.</p></div><div class="priority-list">${items.map(priorityHtml).join('')}</div><div class="results-priority-cta"><h3>IS IT WORTH 20 MINUTES TO EXPLORE YOUR OPTIONS?</h3><p>You might be right on course—or there may be a few adjustments worth considering. Let’s talk about what matters to you, explore where to look first, and see whether working together makes sense.</p><a class="button primary" href="${BOOKING_BASE}" data-book data-book-type="quiz-priorities">Let’s Talk — Book a Free 20-Minute Call →</a><p class="fine">A conversation, not a sales pitch. No obligation to work together.</p></div></section><div class="results-adam-note"><span class="results-section-eyebrow">HOW I HELP</span><h3>Good ideas deserve follow-through.</h3><p>You've already proven you know how to build something successful. My job isn't to tell you how to run your business or replace the professionals you trust. It's to help connect the financial pieces, clarify decisions worth considering, and keep the next steps moving.</p><p><strong>The question is whether I can bring something valuable to the table—and whether we'd enjoy working together.</strong></p></div><div class="results-emotional-close"><h3>${esc(m.closing)}</h3><p>${esc(m.invitation)}</p><p class="fine">Educational discussion prompts based on self-reported answers. Not individualized financial, tax, or legal advice. Investing involves risk, including possible loss of principal. No outcome is guaranteed.</p></div></div>`;
}
function optionalEmailHtml(){return `<section class="report-unlock report-optional-email"><div class="unlock-head"><span class="unlock-symbol" aria-hidden="true">✉</span><div><span class="results-section-eyebrow">OPTIONAL FOLLOW-UP</span><h3>Send me a copy</h3></div></div><p>Your complete educational summary is already available above. If you'd like RIPL to email you a copy, enter your address below.</p><form id="report-email-form"><label for="report-email">Email address</label><input id="report-email" name="email" type="email" autocomplete="email" maxlength="254" placeholder="you@example.com" required/><div class="lead-honeypot" aria-hidden="true"><label for="report-company-site">Website (leave blank)</label><input id="report-company-site" name="website" tabindex="-1" autocomplete="off"/></div><label class="report-consent"><input type="checkbox" name="marketing" value="yes"/><span>I'd also like occasional educational emails from RIPL Wealth. Optional; not required to receive my results.</span></label><button class="button primary report-submit" type="submit">Email My Results →</button><p class="report-error" id="report-error" role="status" hidden></p><p class="fine">If submitted, your email address and quiz answers are sent to RIPL through our website's email service. Marketing opt-in is separate. Do not enter sensitive financial information. <a href="/money-at-work-privacy/">Privacy details</a>.</p></form></section>`;}
function reportActions(){return `<div class="result-actions"><div class="result-save"><button class="button outline" type="button" id="save-results">Save Results as PDF</button><a class="button outline" href="#ask-question">Ask Us a Question</a></div><p class="fine">PDF uses your browser's Print / Save as PDF feature. You can also ask our team a question.</p><button class="text-button" type="button" id="restart-quiz">Retake the Quiz</button></div>`;}
function bindResultActions(){
  document.querySelectorAll('#results [data-book]').forEach(el=>el.addEventListener('click',openBooking));
  $('#save-results')?.addEventListener('click',()=>window.print());
  
  $('#restart-quiz')?.addEventListener('click',()=>{stopAutoAdvance();answers=[];step=0;complete=false;hasStarted=false;document.querySelector('#hero')?.classList.remove('quiz-complete');persist();render();document.querySelector('#quiz')?.scrollIntoView({behavior:'smooth'});});
}
function finish(track=true){
  stopAutoAdvance();
  if(answers.length!==questions.length||questions.some((q,i)=>!Number.isInteger(answers[i])||answers[i]<0||answers[i]>=q.options.length))return;
  complete=true;persist();document.querySelector('#hero')?.classList.add('quiz-complete');document.querySelector('#quiz .quiz-shell').hidden=true;
  const m=motivations[answers[0]],items=observations(answers);
  $('#quiz-progress').hidden=true;$('#quiz-content').innerHTML='';$('#results').hidden=false;
  // Show all three educational discussion priorities immediately; email is optional.
  $('#results').innerHTML=reportHtml(m,items)+optionalEmailHtml()+reportActions();
  bindResultActions();
  $('#report-email-form')?.addEventListener('submit',async event=>{
    event.preventDefault();const form=event.currentTarget,button=form.querySelector('button[type="submit"]'),error=$('#report-error');
    error.hidden=true;button.disabled=true;button.textContent='Sending your request…';
    const email=form.elements.email.value.trim();const marketing=form.elements.marketing.checked;
    const payload={_subject:'RIPL Lazy Money Quiz — Optional Results Request',_template:'table',_captcha:'false',_honey:form.elements.website.value,email,
      'Results category':motivations[answers[0]].heading,
      'Educational marketing opt-in':marketing?'YES — opted in':'NO — not opted in',
      'Source page':location.origin+location.pathname,
      ...Object.fromEntries(questions.map((q,i)=>[`Question ${i+1}: ${q.title}`,q.options[answers[i]]]))};
    try{
      const response=await fetch(LEAD_API_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},credentials:'same-origin',cache:'no-store',body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
      let result=null;try{result=await response.json()}catch{}
      if(!response.ok||result?.success!==true)throw new Error('lead_submission_unconfirmed');
      window.dataLayer?.push({event:'ripl_quiz_lead_submitted'});
      if(typeof window.gtag==='function')window.gtag('event','generate_lead',{method:'quiz_optional_email'});
      window.oaiq?.('measure','lead_created',{type:'customer_action'});
      error.textContent='Your request was received. Please check your inbox for your summary.';error.hidden=false;
      button.textContent='Request received';
    }catch(err){error.textContent='We could not confirm delivery. Your results remain available above; please try again or save them as a PDF.';error.hidden=false;button.disabled=false;button.textContent='Email My Results →';}
  });
  if(track){window.dataLayer?.push({event:'ripl_quiz_complete'});window.oaiq?.('measure','custom',{type:'custom'},{custom_event_name:'ripl_quiz_completed'});requestAnimationFrame(()=>$('#results')?.scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'start'}));}updateSticky();

if (typeof window.gtag === 'function') {
  window.gtag('event', 'quiz_complete');
}
}
$('#quiz-content').addEventListener('click',e=>{
  if(e.target.closest('#quiz-back')){stopAutoAdvance();step=Math.max(0,step-1);render();return;}

  const b=e.target.closest('[data-answer]');
  if(b){
    if(!hasStarted){hasStarted=true;window.dataLayer?.push({event:'ripl_quiz_start'});}
    answers[step]=Number(b.dataset.answer);
    answers=answers.slice(0,step+1);
    persist();render();startAutoAdvance();
    const feedback=$('#quiz-content .answer-feedback');
    if(feedback&&feedback.getBoundingClientRect().bottom>window.innerHeight-16){
      feedback.scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'nearest'});
    }
    return;
  }
});
window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'ripl_landing_view',version:'ripl-v24',...attribution});
const sticky=document.querySelector('#adaptive-cta'),stickyLink=document.querySelector('#adaptive-link');
function updateSticky(){/* No sticky booking bar in V22. */}
window.addEventListener('scroll',updateSticky,{passive:true});window.addEventListener('resize',updateSticky);render();updateSticky();


// Keep the authentic hero image visible until the visitor explicitly opens the video.
const heroDialog=document.querySelector('#hero-video-dialog');
const heroPlayer=document.querySelector('#hero-dialog-player');
const heroClose=document.querySelector('.hero-dialog-close');
const heroPlay=document.querySelector('[data-hero-video]');
heroPlay?.addEventListener('click',()=>{
  const id=heroPlay.dataset.heroVideo;
  if(!/^[a-zA-Z0-9_-]{11}$/.test(id))return;
  const frame=document.createElement('iframe');
  frame.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`;
  frame.title='Meet Adam — introduction video';
  frame.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';
  frame.allowFullscreen=true;
  heroPlayer.replaceChildren(frame);
  heroDialog.showModal();
  heroClose.focus();
  window.dataLayer?.push({event:'ripl_video_start',video_id:id,placement:'hero'});
});
heroClose?.addEventListener('click',()=>heroDialog.close());
heroDialog?.addEventListener('click',event=>{if(event.target===heroDialog)heroDialog.close()});
heroDialog?.addEventListener('close',()=>heroPlayer.replaceChildren());

// Load the YouTube player only after a visitor chooses a video.
document.addEventListener('click',event=>{
  const trigger=event.target.closest('button[data-video-id]');
  if(!trigger)return;
  const id=trigger.dataset.videoId;
  if(!/^[a-zA-Z0-9_-]{11}$/.test(id))return;
  const container=trigger.closest('[data-video-container]');
  if(!container)return;
  const frame=document.createElement('iframe');
  frame.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`;
  frame.loading='eager';
  frame.title=trigger.getAttribute('aria-label')||'Video';
  frame.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';
  frame.allowFullscreen=true;
  container.replaceChildren(frame);
  window.dataLayer?.push({event:'ripl_video_start',video_id:id});
});

// Event names are anonymous and contain no answers or personal financial information.
document.addEventListener('click',event=>{
  const link=event.target.closest('a');if(!link)return;

  if(link.matches('[data-tax-email]'))window.dataLayer?.push({event:'ripl_tax_evaluation_interest'});
  if(link.getAttribute('href')==='#quiz')window.dataLayer?.push({event:'ripl_quiz_cta_click'});
});


// Separate, low-friction question form: no marketing enrollment.
const questionForm=$('#ask-question-form');
questionForm?.addEventListener('submit',async event=>{
  event.preventDefault();
  const form=event.currentTarget, status=$('#ask-question-status'), submit=form.querySelector('[type="submit"]');
  submit.disabled=true;status.textContent='Sending your question…';
  try{
    const response=await fetch('/api/question',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:form.elements.name.value.trim(),email:form.elements.email.value.trim(),question:form.elements.question.value.trim(),website:form.elements.website.value})});
    const data=await response.json();if(!response.ok||!data.success)throw Error('not_sent');
    form.reset();status.textContent='Thanks for reaching out. Your question has been received. We will reply by email.';
    window.dataLayer?.push({event:'ripl_question_sent'});
    if(typeof window.gtag==='function')window.gtag('event','question_sent');
  }catch{status.textContent='We could not confirm delivery. Please try again or book a conversation.'}
  finally{submit.disabled=false}
});
