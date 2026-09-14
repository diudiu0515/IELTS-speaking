'use strict';
let storyIndex=0,topicIndex=0,outlineMode=false;
const $=id=>document.getElementById(id);
const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const h=escapeHtml;
function renderStory(){
 const s=stories[storyIndex];
 $('story-nav').innerHTML=stories.map((item,i)=>`<a class="nav-item ${i===storyIndex?'active':''}" href="#${item.id}" ${i===storyIndex?'aria-current="page"':''}><span class="nav-num">${String(i+1).padStart(2,'0')}</span><span><span class="nav-title">${h(item.name)}</span><span class="nav-subtitle">${h(item.subtitle)}</span></span></a>`).join('');
 $('story-header').innerHTML=`<div class="story-heading"><div class="big-num" aria-hidden="true">${String(storyIndex+1).padStart(2,'0')}</div><div><div class="story-category">${h(s.category)}</div><h2 lang="en">${h(s.title)}</h2><p>${h(s.summary)}</p></div></div>`;
 $('topic-list').innerHTML=s.topics.map((t,i)=>`<button class="topic-button" data-topic="${i}" aria-pressed="${i===topicIndex}">${h(t.label)}</button>`).join('');
 $('facts').innerHTML=s.facts.map(f=>`<li>${h(f)}</li>`).join('');
 $('phrases').innerHTML=s.phrases.map(p=>`<div class="phrase"><b lang="en">${h(p[0])}</b><span>${h(p[1])}</span></div>`).join('');
 $('part3').innerHTML=s.part3.map(p=>`<div class="p3-item"><h4 lang="en">${h(p.q)}</h4><p class="p3-guide">${h(p.guide)}</p><p lang="en">${h(p.a)}</p></div>`).join('');
 renderTopic();
}
function renderTopic(){
 const s=stories[storyIndex],t=s.topics[topicIndex],core=t.replaceCore||s.core;
 document.querySelectorAll('[data-topic]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.topic)===topicIndex)));
 $('cue-card').innerHTML=`<div class="cue-label">PART 2 · 练习题卡</div><h3 lang="en">${h(t.question)}</h3><ul lang="en">${t.cues.map(c=>`<li>${h(c)}</li>`).join('')}</ul>`;
 $('remix').innerHTML=`<div class="remix-step"><div class="step-label"><span class="step-number">1</span>换开头：直接点题</div><p class="mini-en" lang="en">${h(t.opening)}</p></div><div class="remix-step"><div class="step-label"><span class="step-number">2</span>调重点：回答题眼</div><p>${h(t.focus)}</p></div><div class="remix-step"><div class="step-label"><span class="step-number">3</span>改结尾：回到这道题</div><p class="mini-en" lang="en">${h(t.ending)}</p></div>`;
 $('full-mode').setAttribute('aria-pressed',String(!outlineMode));$('outline-mode').setAttribute('aria-pressed',String(outlineMode));
 if(outlineMode){
 const keys=t.replaceCore?['Rome · solo Italy trip · this summer','nervous on metro · excited to explore','Colosseum · stayed a long time','return more slowly · focus on ancient sites']:s.outline;
 $('answer').innerHTML=`<div class="answer-block"><p class="outline-note">看着关键词复述，不必还原原句。细节围绕当前题目取舍。</p><div class="outline-item"><b>题目切口</b><p lang="en">${h(t.key)}</p></div>${keys.map((k,i)=>`<div class="outline-item"><b>记忆锚点 ${i+1}</b><p lang="en">${h(k)}</p></div>`).join('')}<div class="outline-item"><b>这次要强调</b><p>${h(t.focus)}</p></div></div>`;
 }else{
 $('answer').innerHTML=`<article class="answer-block" lang="en"><p class="opening"><span class="para-label" lang="zh-CN">开头 · 随题目改变</span>${h(t.opening)}</p>${core.map(p=>`<p>${h(p)}</p>`).join('')}<p class="focus-para"><span class="para-label" lang="zh-CN">展开 · 当前题目的重点</span>${h(t.detail)}</p><p class="ending"><span class="para-label" lang="zh-CN">结尾 · 回答这道题</span>${h(t.ending)}</p></article>`;
 }
 const words=[t.opening,...core,t.detail,t.ending].join(' ').match(/\b[\w'-]+\b/g)?.length||0;
 $('word-count').textContent=`当前讲述约 ${words} 词 · 按语速取舍细节`;
}
$('topic-list').addEventListener('click',e=>{const b=e.target.closest('[data-topic]');if(!b)return;topicIndex=Number(b.dataset.topic);renderTopic();});
$('full-mode').addEventListener('click',()=>{outlineMode=false;renderTopic();});
$('outline-mode').addEventListener('click',()=>{outlineMode=true;renderTopic();});
function fromHash(){const id=location.hash.slice(1);const found=stories.findIndex(s=>s.id===id);storyIndex=found>=0?found:0;topicIndex=0;renderStory();}
window.addEventListener('hashchange',fromHash);fromHash();
