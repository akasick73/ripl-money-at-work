import {questions,score,startingPoints,videos} from './data.js';
const $=s=>document.querySelector(s);
const attributionKeys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
const source=new URLSearchParams(location.search);const saved=(()=>{try{return JSON.parse(sessionStorage.getItem('ripl_utm')||'{}')}catch{return {}}})();
const attribution={};for(const k of attributionKeys){const v=source.get(k)||saved[k];if(v)attribution[k]=String(v).slice(0,180)}
try{sessionStorage.setItem('ripl_utm',JSON.stringify(attribution))}catch{}

// Only book an introductory conversation; this public page never receives tax returns.
const BOOKING_URL='https://calendly.com/adam-riplwealth/30-minute-zoom-meeting';
const INTRO_YOUTUBE_ID='ONoWDcglifw';

function linkWithUtm(url){const u=new URL(url);for(const [k,v] of Object.entries(attribution))u.searchParams.set(k,v);return u.href}
for(const a of document.querySelectorAll('[data-book]')){
  const dest=new URL(linkWithUtm(BOOKING_URL));
  const type=a.dataset.bookType; if(type)dest.searchParams.set('utm_content',type==='tax'?'tax_evaluation_request':'intro_call');
  a.href=dest.href;
  a.target='_blank';
  a.rel='noopener noreferrer';
}
function videoEmbed(container,id,label){if(!id)return;const frame=document.createElement('iframe');frame.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`;frame.title=label;frame.loading='lazy';frame.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';frame.allowFullscreen=true;container.replaceChildren(frame);container.classList.add('has-video')}
videoEmbed($('#intro-video'),INTRO_YOUTUBE_ID,'Introduction to Adam and RIPL');
let step=0;const answers=[];
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function render(){const q=questions[step];$('#step-label').textContent=`Question ${step+1} of ${questions.length}`;$('#progress-fill').style.width=`${step/questions.length*100}%`;
$('#quiz-content').innerHTML=`<h3 class="question-title">${esc(q.title)}</h3><p class="hint">${esc(q.hint)}</p><div class="options">${q.options.map((o,i)=>`<button type="button" data-answer="${i}" class="${answers[step]===i?'selected':''}" aria-pressed="${answers[step]===i}">${esc(o)}</button>`).join('')}</div><div class="quiz-nav"><button type="button" id="back-step" ${step===0?'disabled':''}>← Back</button><button class="button primary" type="button" id="next-step" ${answers[step]===undefined?'disabled':''}>${step===questions.length-1?'See my starting point':'Continue →'}</button></div>`}
function finish(){const result=score(answers),p=startingPoints[result.priority];$('#quiz-progress').hidden=true;$('#quiz-content').innerHTML=`<h3>Your starting point: ${esc(p.title)}</h3><p>${esc(p.why)}</p><h4>One useful first step</h4><p>${esc(p.step)}</p><button type="button" id="restart-quiz">Retake the quiz</button>`;$('#results').hidden=false;$('#results').innerHTML=`<h3>Three questions to take into your next conversation</h3><ul>${p.questions.map(q=>`<li>${esc(q)}</li>`).join('')}</ul><a class="button outline" href="#booking">Talk through my starting point →</a><p class="fine">Your answers have not been sent to RIPL. This is an educational conversation guide, not an assessment of tax savings or a personalized recommendation.</p>`;window.dataLayer?.push({event:'ripl_quiz_complete'});}
$('#quiz-content').addEventListener('click',e=>{const b=e.target.closest('[data-answer]');if(b){answers[step]=Number(b.dataset.answer);render();return}if(e.target.closest('#back-step')&&step>0){step--;render()}if(e.target.closest('#next-step')&&answers[step]!==undefined){if(step===questions.length-1)finish();else{step++;render()}}if(e.target.closest('#restart-quiz')){step=0;answers.length=0;$('#results').hidden=true;$('#quiz-progress').hidden=false;render()}});
// Quiz navigation stays on-page; booking links receive the ad UTM parameters.
// Event instrumentation contains no financial information or personal data.
window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'ripl_landing_view',version:'gc-v7-5',...attribution});
render();
