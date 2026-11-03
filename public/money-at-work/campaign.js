import {questions,motivations,observations} from './data.js';
const $=s=>document.querySelector(s);
const attributionKeys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
const source=new URLSearchParams(location.search);const saved=(()=>{try{return JSON.parse(sessionStorage.getItem('ripl_utm')||'{}')}catch{return {}}})();
const attribution={};for(const k of attributionKeys){const v=source.get(k)||saved[k];if(v)attribution[k]=String(v).slice(0,180)}
try{sessionStorage.setItem('ripl_utm',JSON.stringify(attribution))}catch{}

// Only book an introductory conversation; this public page never receives tax returns.
const BOOKING_URL='https://calendly.com/adam-riplwealth/20-minute-zoom-meeting';


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
  window.dataLayer?.push({event:'ripl_booking_confirmed'});if(typeof window.gtag==='function')window.gtag('event','generate_lead',{event_category:'calendly',event_label:'confirmed_booking'});
});
let step=0;let answers=[];let hasStarted=false;let complete=false;
const STORE='ripl_financial_freedom_progress_v1';
try{const saved=JSON.parse(sessionStorage.getItem(STORE)||'null');if(saved&&Array.isArray(saved.answers)){answers=saved.answers.slice(0,questions.length);step=Math.min(Math.max(Number(saved.step)||0,0),questions.length-1);complete=!!saved.complete&&answers.length===questions.length;hasStarted=answers.some(x=>Number.isInteger(x));}}catch{}
function persist(){try{sessionStorage.setItem(STORE,JSON.stringify({answers,step,complete}))}catch{}}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function quizAction(e){e?.preventDefault();document.querySelector('#quiz')?.scrollIntoView({behavior:'smooth',block:'start'});window.dataLayer?.push({event:'ripl_quiz_cta_click',placement:e?.currentTarget?.dataset?.placement||'unknown'});}
document.querySelectorAll('[data-quiz-link]:not(#adaptive-link)').forEach(el=>el.addEventListener('click',quizAction));
function render(){if(complete){finish(false);return}document.querySelector('#quiz .quiz-shell').hidden=false;const q=questions[step];$('#quiz-progress').hidden=false;$('#results').hidden=true;$('#step-label').textContent=`Question ${step+1} of ${questions.length}`;$('#progress-fill').style.width=`${(step+1)/questions.length*100}%`;
const chosen=answers[step];$('#quiz-content').innerHTML=`<h3 class="question-title">${esc(q.title)}</h3><p class="hint">${esc(q.hint)}</p><div class="options">${q.options.map((o,i)=>`<button type="button" data-answer="${i}" class="${chosen===i?'selected':''}" aria-pressed="${chosen===i}">${esc(o)}</button>`).join('')}</div>${Number.isInteger(chosen)?`<p class="answer-observation" role="status">${esc(q.feedback[chosen])}</p>`:''}<div class="quiz-nav"><button type="button" id="back-step" ${step===0?'disabled':''}>← Back</button><button class="button primary" type="button" id="next-step" ${!Number.isInteger(chosen)?'disabled':''}>${step===questions.length-1?'See My Results →':'Next Question →'}</button></div>`;
}
function resultText(){const m=motivations[answers[0]],items=observations(answers);return `${m.heading}\n\n${m.opening}\n\n${m.bridge}\n\nWHERE I'D START\n\n${items.map((x,i)=>`${i+1}. ${x.title}\n${x.body}`).join('\n\n')}\n\n${m.closing}\n${m.invitation}\n\nTalk with Adam: ${BOOKING_URL}\n\nEducational discussion prompts based on self-reported answers. Not individualized financial, tax, or legal advice. Investing involves risk, including possible loss of principal.`}
function finish(track=true){if(answers.length!==questions.length||questions.some((q,i)=>!Number.isInteger(answers[i])||answers[i]<0||answers[i]>=q.options.length))return;complete=true;persist();document.querySelector('#quiz .quiz-shell').hidden=true;const m=motivations[answers[0]],items=observations(answers);$('#quiz-progress').hidden=true;$('#quiz-content').innerHTML='';$('#results').hidden=false;
$('#results').innerHTML=`<div class="result-print"><p class="eyebrow">YOUR PERSONALIZED RESULTS</p><h2>${esc(m.heading)}</h2><p>${esc(m.opening)}</p><p><strong>${esc(m.bridge)}</strong></p><h3>WHERE I'D START.</h3><p>Based on your answers, here are three questions I’d encourage you to think about.</p><div class="result-cards">${items.map((x,i)=>`<article><span>0${i+1}</span><div><h4>${esc(x.title)}</h4><p>${esc(x.body)}</p></div></article>`).join('')}</div><div class="result-bridge"><h3>YOU DON'T HAVE TO FIGURE ALL OF THIS OUT YOURSELF.</h3><p>You've already proven you know how to build something successful.</p><p>My job isn't to tell you how to run your business or replace the professionals you trust. It's to help you see how the financial pieces fit together, identify decisions worth considering, and help move good ideas toward action.</p><p>You may already have a lot of this figured out. Great. That's exactly the kind of conversation I enjoy.</p><p><strong>The question is whether I can bring something valuable to the table—and whether we'd enjoy working together.</strong></p></div><h3>${esc(m.closing)}</h3><p>${esc(m.invitation)}</p><p class="fine">Educational discussion prompts based on self-reported answers. Not individualized financial, tax, or legal advice. No investment outcome is guaranteed.</p></div><div class="result-actions"><a class="button primary" href="${BOOKING_BASE}" data-book data-book-type="quiz-results">Book a 20-Minute Call With Adam →</a><p class="fine">Free Zoom conversation · No obligation</p><div class="result-save"><button class="button outline" type="button" id="save-results">Save Results as PDF</button><button class="button outline" type="button" id="email-results">Email Myself My Results</button></div><p class="fine">PDF uses your browser’s Print / Save as PDF feature. Email opens your own email app with your results; nothing is sent automatically or stored by RIPL.</p><button class="text-button" type="button" id="restart-quiz">Retake the Quiz</button></div>`;
$('#results [data-book]')?.addEventListener('click',openBooking);document.querySelector('#save-results')?.addEventListener('click',()=>window.print());document.querySelector('#email-results')?.addEventListener('click',()=>{const body=resultText();const mail=`mailto:?subject=${encodeURIComponent('My Financial Freedom Quiz Results | RIPL Wealth')}&body=${encodeURIComponent(body)}`;if(mail.length>1900){navigator.clipboard?.writeText(body).then(()=>alert('Your results were copied. Paste them into an email to yourself.')).catch(()=>alert('Use Save Results as PDF to keep your results.'));}else location.href=mail;});
$('#restart-quiz')?.addEventListener('click',()=>{answers=[];step=0;complete=false;hasStarted=false;persist();render();document.querySelector('#quiz')?.scrollIntoView({behavior:'smooth'});});
if(track){window.dataLayer?.push({event:'ripl_quiz_complete'});$('#results').scrollIntoView({behavior:'smooth',block:'start'});}updateSticky();}
$('#quiz-content').addEventListener('click',e=>{const b=e.target.closest('[data-answer]');if(b){if(!hasStarted){hasStarted=true;window.dataLayer?.push({event:'ripl_quiz_start'});}answers[step]=Number(b.dataset.answer);answers=answers.slice(0,step+1);persist();render();return}if(e.target.closest('#back-step')&&step>0){step--;persist();render();return}if(e.target.closest('#next-step')&&Number.isInteger(answers[step])){if(step===questions.length-1)finish();else{step++;persist();render();}return;}});
window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'ripl_landing_view',version:'quiz-first-v1',...attribution});
const sticky=document.querySelector('#adaptive-cta'),stickyLink=document.querySelector('#adaptive-link');
function updateSticky(){const hero=document.querySelector('#hero'),quiz=document.querySelector('#quiz');if(!sticky||!hero||!quiz)return;const heroBottom=hero.getBoundingClientRect().bottom;const qrect=quiz.getBoundingClientRect();const quizVisible=qrect.top<window.innerHeight*.85&&qrect.bottom>100;sticky.hidden=heroBottom>0||quizVisible;if(complete){stickyLink.textContent='Book a 20-Minute Call →';stickyLink.href=BOOKING_BASE;stickyLink.removeAttribute('data-quiz-link');stickyLink.onclick=openBooking;}else{stickyLink.textContent='Take the Free Quiz →';stickyLink.href='#quiz';stickyLink.onclick=quizAction;}}
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
