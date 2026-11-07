import * as KneeLearning from './learning.mjs';
(()=>{
let topic='bone';
const el=id=>document.getElementById(id);
function render(id){topic=id;const l=KneeLearning.lesson(id);el('eyebrow').textContent=l.eyebrow;el('lesson-title').textContent=l.title;el('lesson-text').textContent=l.text;el('lesson-note').textContent=l.note;el('question').textContent=l.question;el('feedback').textContent='选一个答案，即时检查理解。';document.querySelectorAll('[data-topic]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.topic===id));document.querySelectorAll('[data-shape]').forEach(g=>{g.style.opacity=l.visible.includes(g.dataset.shape)?'1':'0';g.setAttribute('aria-hidden',!l.visible.includes(g.dataset.shape));});document.querySelectorAll('[data-answer]').forEach(b=>delete b.dataset.result);}
document.querySelectorAll('[data-topic]').forEach(b=>b.addEventListener('click',()=>render(b.dataset.topic)));
document.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>{const r=KneeLearning.checkAnswer(topic,b.dataset.answer);document.querySelectorAll('[data-answer]').forEach(x=>delete x.dataset.result);b.dataset.result=r.correct?'correct':'wrong';el('feedback').textContent=(r.correct?'答对了。':'再想一想。')+r.explanation;}));
el('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(el('prompt').value);el('copy-status').textContent='指令已复制。请同时附上 scene.json。';}catch{el('prompt').focus();el('prompt').select();el('copy-status').textContent='请手动复制已选中的指令，并附上 scene.json。';}});
render('bone');
})();
