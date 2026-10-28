import {config,stages,questions,score,descriptions,reviewTopics,videos,topicsFor} from './data.js';
const $=s=>document.querySelector(s);
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const state={step:0,answers:[],result:null,intent:'question',filter:'All',topic:null};
const attribution={};
const params=new URLSearchParams(location.search);
for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) if(params.has(key)) attribution[key]=params.get(key).slice(0,200);
// Session storage holds campaign attribution only, never contact details or quiz answers.
try {const stored=JSON.parse(sessionStorage.getItem('ripl_campaign_attribution')||'{}');for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) if(!attribution[key]&&typeof stored[key]==='string') attribution[key]=stored[key].slice(0,200);sessionStorage.setItem('ripl_campaign_attribution',JSON.stringify(attribution));}catch{}
function tracking(event,details={}){window.dispatchEvent(new CustomEvent('ripl:campaign',{detail:{event,...details,...attribution}}));}
function renderQuestion(focus=false){
 const q=questions[state.step];const choice=state.answers[state.step];
 $('#quiz-content').innerHTML=`<p class="step-label">QUESTION ${state.step+1} OF ${questions.length}</p><h2 class="question-title" tabindex="-1">${escape(q.title)}</h2><p class="hint">${escape(q.hint)}</p><div class="options ${state.step>=4?'long':''}" role="group" aria-label="Answer choices">${q.options.map((a,i)=>`<button class="answer ${choice===i?'chosen':''}" aria-pressed="${choice===i}" data-answer="${i}" type="button">${escape(a)}<span aria-hidden="true">${choice===i?'✓':'↗'}</span></button>`).join('')}</div><div class="quiz-nav"><button class="back" type="button" ${state.step===0?'disabled':''}>← Back</button><button class="button next" type="button" ${choice===undefined?'disabled':''}>${state.step===6?'See my result':'Next question'} <span aria-hidden="true">→</span></button></div>`;
 $('.progress').setAttribute('aria-valuenow',String(state.step));$('.progress span').style.width=`${state.step/7*100}%`;
 document.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{state.answers[state.step]=Number(b.dataset.answer);renderQuestion();$(`[data-answer="${b.dataset.answer}"]`).focus();});
 $('.next').onclick=()=>{if(state.step===6){finishQuiz();return;}state.step++;renderQuestion(true);};
 $('.back').onclick=()=>{if(state.step>0){state.step--;renderQuestion(true);}};
 if(focus)$('.question-title').focus({preventScroll:true});
}
function finishQuiz(){
 state.result=score(state.answers);state.filter=state.result.stage;
 $('.progress').setAttribute('aria-valuenow','7');$('.progress span').style.width='100%';
 $('#quiz-content').innerHTML=`<div class="result-finish"><p class="eyebrow">YOUR STARTING POINT</p><h3>You’re ${state.result.stage==='Accumulator'?'an':'a'} ${state.result.stage}.</h3><p>${escape(descriptions[state.result.stage])}</p><a class="button" href="#results">Explore my result →</a><div><button class="restart" type="button">Review my answers</button></div></div>`;
 $('.restart').onclick=()=>{state.step=0;state.result=null;$('#results').hidden=true;renderQuestion(true);};
 $('#results').hidden=false;
 $('#results').innerHTML=`<div class="results-inner"><div><p class="eyebrow">YOUR MONEY PERFORMANCE REVIEW</p><h2 id="result-title" tabindex="-1">You’re ${state.result.stage==='Accumulator'?'an':'a'} <em>${state.result.stage}.</em></h2><span class="result-tag">Your tendency: ${state.result.tendency}</span><p>${escape(descriptions[state.result.stage])}</p><p>${state.result.tendency==='Safety'?'You value a clear reserve and knowing where your money is. We can begin with what needs to stay available.':'You like money moving toward new possibilities. We can begin by defining which opportunities fit your goals and timing.'}</p>${state.result.secondary?`<p class="small">Your next priority also overlaps with the ${state.result.secondary} stage. These stages are a starting point, not a label you have to keep.</p>`:''}</div><div><p class="eyebrow">THREE THINGS WORTH A CLOSER LOOK</p><ul class="review-topics">${topicsFor(state.answers,state.result.stage).map(t=>`<li>${escape(t)}</li>`).join('')}</ul><p class="small">These are conversation topics, not findings about your finances or proof that you are overpaying taxes.</p><div class="result-actions"><a class="button" href="#contact" data-result-book>Book 30 minutes with Adam ↗</a><a class="text-link" href="#videos">Explore your 2 video topics ↓</a></div></div><div class="calendar-slot" data-calendar><strong>Put your next question on the calendar.</strong><p>Share your result with Adam, then choose a 30-minute time below.</p><button type="button" class="button" data-result-share>Share result & choose a time →</button></div></div>`;
 $('[data-result-book]').onclick=()=>setIntent('meeting');
 $('[data-result-share]').onclick=()=>{setIntent('meeting');$('#contact').scrollIntoView();$('#contact-form input[name=name]').focus({preventScroll:true});};
 renderFilters();renderVideos();tracking('quiz_complete',{stage:state.result.stage,tendency:state.result.tendency});
 $('#results').scrollIntoView({behavior:'smooth'});$('#result-title').focus({preventScroll:true});
}
function renderFilters(){
 $('#filters').innerHTML=['All',...stages].map(s=>`<button type="button" data-stage="${s}" class="${state.filter===s?'active':''}" aria-pressed="${state.filter===s}">${s==='All'?'All questions':s}</button>`).join('');
 document.querySelectorAll('[data-stage]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.stage;renderFilters();renderVideos();$(`[data-stage="${state.filter}"]`).focus();});
}
function renderVideos(){
 const selected=videos.filter(v=>state.filter==='All'||v.stage===state.filter);
 $('#video-count').textContent=`${selected.length} ${selected.length===1?'topic':'topics'} · Short answers`;
 $('#video-grid').innerHTML=selected.map(v=>`<article class="video-card"><button type="button" data-video="${v.id}" aria-label="Explore topic: ${escape(v.title)}"><div class="video-art ${v.stage}"><span class="stage">${v.stage}</span><span class="chapter">${String(v.id).padStart(2,'0')}</span><span class="soon">${v.youtubeId||v.src?'WATCH VIDEO':'VIDEO COMING SOON'}</span><span class="play" aria-hidden="true">↗</span></div><div class="video-meta"><span>${v.stage}</span><span>${v.duration}</span></div><h3>${escape(v.title)}</h3></button><p class="answer-copy">${escape(v.shortTitle)}</p><p class="risk">${escape(v.risk)}</p></article>`).join('');
 document.querySelectorAll('[data-video]').forEach(b=>b.onclick=()=>openVideo(Number(b.dataset.video)));
}
function openVideo(id){
 const v=videos.find(v=>v.id===id);state.topic=v.title;
 $('#video-stage').textContent=v.stage+' · '+v.duration;$('#video-title').textContent=v.title;$('#video-answer').textContent=v.shortTitle+'. '+v.summary;$('#video-risk').textContent=v.risk;
 $('#video-dialog').classList.toggle('youtube-dialog',Boolean(v.youtubeId));
 $('#video-player').innerHTML=v.youtubeId?`<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.youtubeId)}?rel=0" title="${escape(v.shortTitle)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe><a class="youtube-fallback" href="https://youtu.be/${encodeURIComponent(v.youtubeId)}" target="_blank" rel="noopener">Open on YouTube ↗</a>`:v.src?`<video controls playsinline preload="metadata" src="${escape(v.src)}"></video>`:`<div><div class="placeholder-icon">RIPL</div><strong>A short answer is on its way.</strong><p>This video is coming soon. In the meantime, bring this question to Adam.</p></div>`;
 $('#video-dialog').showModal();tracking('topic_open',{topic_id:id});
}
$('.dialog-close').onclick=()=>$('#video-dialog').close();
$('#video-dialog').addEventListener('close',()=>{const v=$('#video-player video');if(v)v.pause();$('#video-player').replaceChildren();});
$('#video-dialog').addEventListener('click',e=>{if(e.target===$('#video-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
$('#video-cta').onclick=()=>{$('#video-dialog').close();setIntent('meeting');if(!$('#contact-form textarea').value)$('#contact-form textarea').value=state.topic;};
function setIntent(intent){state.intent=intent;document.querySelectorAll('[data-intent]').forEach(b=>{b.classList.toggle('selected',b.dataset.intent===intent);b.setAttribute('aria-pressed',String(b.dataset.intent===intent));});$('#form-title').textContent=intent==='meeting'?'Let’s make the time useful.':'What’s on your mind?';$('#form-intro').textContent=intent==='meeting'?'Send Adam your context, then pick a time on his calendar.':'Start with the short version. Adam will take it from there.';$('#send-button').innerHTML=intent==='meeting'?'Send context & choose a time ↗':'Send Adam my question ↗';}
for(const b of document.querySelectorAll('[data-intent]'))b.onclick=()=>setIntent(b.dataset.intent);
function calendarUrl(fields){const url=new URL(config.calendarUrl);for(const [k,v] of Object.entries(attribution))url.searchParams.set(k,v);if(fields){url.searchParams.set('name',fields.name);url.searchParams.set('email',fields.email);}return url.href;}
// Calendar is loaded only on request, avoiding an unnecessary third-party load.
const primaryCalendar=$('.booking-panel [data-calendar]');
primaryCalendar.innerHTML=`<span aria-hidden="true">▦</span><strong>Pick a 30-minute time with Adam</strong><p>Already know what you want to discuss?</p><button type="button" class="button" id="show-calendar">View available times ↗</button><p class="small">To send your quiz result ahead of the call, use “Request 30 minutes.”</p>`;
$('#show-calendar').onclick=()=>{const url=calendarUrl();const frame=document.createElement('iframe');frame.title='Schedule a 30-minute conversation with Adam';frame.src=url+(url.includes('?')?'&':'?')+'embed_type=Inline&hide_gdpr_banner=0';frame.style.cssText='width:100%;height:660px;border:0;background:white';primaryCalendar.replaceChildren(frame);const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener';link.className='text-link';link.textContent='Open calendar in a new tab ↗';primaryCalendar.append(link);tracking('calendar_open');};
let sending=false;
$('#contact-form').addEventListener('submit',async e=>{
 e.preventDefault();if(sending)return;
 const form=e.currentTarget,fields=new FormData(form);if(fields.get('website'))return;if(!form.reportValidity())return;
 const name=String(fields.get('name')||'').trim(),email=String(fields.get('email')||'').trim(),message=String(fields.get('message')||'').trim();
 if(!name||!message){$('#form-status').textContent='Please add your name and a short question.';return;}
 const payload={name,email,phone:String(fields.get('phone')||'').trim(),message,intent:state.intent==='meeting'?'30-minute conversation: context submitted before scheduling':'Email question',stage:state.result?.stage||'Quiz not completed',tendency:state.result?.tendency||'Quiz not completed',answers:state.result?questions.map((q,i)=>`${i+1}. ${q.title}\n${q.options[state.answers[i]]}`).join('\n\n'):'Quiz not completed',campaign_attribution:JSON.stringify(attribution),page:location.origin+location.pathname,consent:'Visitor requested a response and consented to sharing inquiry and completed quiz answers.',_subject:'RIPL Money Performance Review: '+(state.intent==='meeting'?'call context':'question'),_template:'table'};
 const submittedIntent=state.intent;sending=true;$('#send-button').disabled=true;$('#form-status').textContent='Sending your message…';const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),18000);
 try{const response=await fetch(config.endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),signal:controller.signal});const data=await response.json();if(!response.ok||!(data.success===true||data.success==='true'))throw new Error('Delivery not confirmed');
 $('#form-status').textContent=submittedIntent==='meeting'?'Your context was sent to Adam. Next, choose a time below. Your appointment is only booked after Calendly confirms it.':'Your message was sent to Adam. Thanks for starting the conversation.';
 tracking('inquiry_sent',{intent:submittedIntent,stage:state.result?.stage||'none'});
 if(submittedIntent==='meeting'){const link=document.createElement('a');link.href=calendarUrl({name,email});link.target='_blank';link.rel='noopener';link.className='button';link.style.marginTop='14px';link.textContent='Choose my 30-minute time ↗';$('#form-status').append(document.createElement('br'),link);link.addEventListener('click',()=>tracking('calendar_open'));}
 }catch{$('#form-status').textContent='We couldn’t confirm delivery. Your answers are still here. Please try again, or email adam@riplwealth.com directly.';}finally{clearTimeout(timer);sending=false;$('#send-button').disabled=false;}
});
renderQuestion();renderFilters();renderVideos();
