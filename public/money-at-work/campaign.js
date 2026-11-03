import {questions,score,startingPoints,videos} from './data.js';
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
let step=0;const answers=[];let hasStarted=false;
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function render(){const q=questions[step];$('#step-label').textContent=`Question ${step+1} of ${questions.length}`;$('#progress-fill').style.width=`${step/questions.length*100}%`;
$('#quiz-content').innerHTML=`<h3 class="question-title">${esc(q.title)}</h3><p class="hint">${esc(q.hint)}</p><div class="options">${q.options.map((o,i)=>`<button type="button" data-answer="${i}" class="${answers[step]===i?'selected':''}" aria-pressed="${answers[step]===i}">${esc(o)}</button>`).join('')}</div><div class="quiz-nav"><button type="button" id="back-step" ${step===0?'disabled':''}>← Back</button><button class="button primary" type="button" id="next-step" ${answers[step]===undefined?'disabled':''}>${step===questions.length-1?'See my starting point':'Continue →'}</button></div>`}
const cpaQuestions=[
  'Are my business and personal tax-planning decisions being reviewed together?',
  'What should we consider before moving excess cash out of the business?',
  'Are there tax implications to review before selling or transitioning my business?',
  'Are my investment gains, losses and charitable contributions being coordinated appropriately?',
  'What planning decisions should we revisit before year-end?'
];
function finish(){const result=score(answers),p=startingPoints[result.priority];$('#quiz-progress').hidden=true;
 $('#quiz-content').innerHTML=`<h3>Your starting point: ${esc(p.title)}</h3><p>${esc(p.why)}</p><h4>One useful first step</h4><p>${esc(p.step)}</p><button type="button" id="restart-quiz">Retake the quiz</button>`;
 $('#results').hidden=false;$('#results').innerHTML=`<h3>Three questions to take into your next conversation</h3><ul>${p.questions.map(q=>`<li>${esc(q)}</li>`).join('')}</ul><h4>Five questions worth discussing with your CPA</h4><ol>${cpaQuestions.map(q=>`<li>${esc(q)}</li>`).join('')}</ol><a class="button primary" href="${BOOKING_BASE}" data-book data-book-type="quiz-results">Let's Talk — Free 20-Minute Zoom →</a><div class="quiz-email-offer"><h4>Email me my results + five CPA questions</h4><p>We'll send your educational quiz summary and five CPA discussion questions, plus occasional RIPL insights about taxes, investing and wealth planning. Unsubscribe anytime.</p><label for="quiz-email-pending">Email address</label><input id="quiz-email-pending" type="email" autocomplete="email" placeholder="you@example.com" disabled aria-describedby="quiz-email-status"/><button type="button" disabled>Email Me My Results</button><p class="fine" id="quiz-email-status"><strong>Email delivery is being configured.</strong> This feature will be available after the secure email service and privacy review are complete.</p></div><p class="fine">Your answers have not been sent to RIPL. These are general educational questions, not personalized tax or investment advice or a prediction of tax savings.</p>`;
 $('#results [data-book]')?.addEventListener('click',openBooking);
 window.dataLayer?.push({event:'ripl_quiz_complete'});
}
$('#quiz-content').addEventListener('click',e=>{const b=e.target.closest('[data-answer]');if(b){if(!hasStarted){hasStarted=true;window.dataLayer?.push({event:'ripl_quiz_start'});}answers[step]=Number(b.dataset.answer);render();return}if(e.target.closest('#back-step')&&step>0){step--;render()}if(e.target.closest('#next-step')&&answers[step]!==undefined){if(step===questions.length-1)finish();else{step++;render()}}if(e.target.closest('#restart-quiz')){step=0;answers.length=0;$('#results').hidden=true;$('#quiz-progress').hidden=false;hasStarted=false;render()}});
// Quiz navigation stays on-page; booking links receive the ad UTM parameters.
// Event instrumentation contains no financial information or personal data.
window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'ripl_landing_view',version:'gc-v8-9',...attribution});
render();

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
