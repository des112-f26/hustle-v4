const $=id=>document.getElementById(id);
const fnum=n=>Math.round(n).toLocaleString('en');
const MOODS=['Unstoppable','Crushing it','On fire','Nothing can stop you','Winning','This is the grind'];
const TPL={
start:()=>`<div class="ctr" style="top:170px"><h1 style="font:700 84px 'Space Grotesk',system-ui,sans-serif;margin:0;text-shadow:0 0 18px #4D8DFF">Hustle</h1>
<p style="color:var(--mut);font-size:20px">Type the circles. A S D F. Keep going.</p></div>
<div class="ctr" style="top:380px"><button class="pill" id="go">Clock in</button><p class="lab" style="margin-top:18px">OR PRESS ENTER</p></div>`,
work:()=>`<div class="tl"><div class="lab">POINTS</div><div class="pts"><span id="pts">0</span><span id="arrow">▲</span></div>
<div class="sub">Productivity <b id="prod">▲ 100%</b></div></div>
<div class="tr"><div id="age">Age 22</div><div class="bar"><i id="prog"></i></div><div class="lab">TO RETIREMENT</div></div>
<div class="l"><svg viewBox="0 0 70 190" width="90"><rect x="8" y="176" width="54" height="8" rx="3" fill="#2D2680"/>
<rect id="wax" x="20" y="60" width="30" height="110" rx="2" fill="#F2F4FF"/>
<g id="flame"><path d="M0 -34C12 -14 10 0 0 0C-10 0 -12 -14 0 -34Z" fill="#4D8DFF" style="filter:drop-shadow(0 0 8px #4D8DFF)"/></g></svg>
<div class="lab">FUEL</div><div id="pips">${'<i></i>'.repeat(20)}</div></div>
<div class="face"><svg viewBox="0 0 120 120" width="150"><circle cx="60" cy="60" r="52" fill="none" stroke="#F2F4FF" stroke-width="3"/>
<ellipse id="eL" cx="40" cy="48" rx="7" ry="9" fill="#F2F4FF"/><ellipse id="eR" cx="80" cy="48" rx="7" ry="9" fill="#F2F4FF"/>
<path id="mouth" d="M32 74Q60 90 88 74" fill="none" stroke="#4D8DFF" stroke-width="4" stroke-linecap="round"/></svg><div id="mood">Unstoppable</div></div>
<div class="r"><div class="lab">MOMENTUM ▲</div><div class="gauge"><i id="mom"></i></div><div class="worth" id="worth">Worth 100%</div></div>
<div id="keys"></div><div id="combo"></div><div id="fx"></div>`,
break:()=>`<div class="brk"><div class="lab">LOOK AWAY · STRETCH YOUR HANDS</div><div class="big" id="bleft">12</div>
<button class="pill" id="skip">Keep working  +800</button></div>`,
end:s=>{const ok=s.end==='retired',real=Core.real(s);
return `<div class="ctr" style="top:70px"><div class="lab">${ok?'RETIRED AT '+Math.round(Core.age(s)):'BURNOUT AT '+Math.round(Core.age(s))}</div>
<div class="endrow" style="animation-delay:.2s;font-size:56px;font-weight:700">${fnum(s.pts)} points</div>
<div class="endrow" style="animation-delay:1.6s;color:var(--cold)">what you kept: ${fnum(real)} (${Math.round(s.worth)}% worth)</div>
<div class="endrow" style="animation-delay:2.6s;color:var(--mut)">energy left ${Math.round(s.energy)}% · breaks taken ${s.taken} · skipped ${s.skipped}</div>
<div class="endrow" style="animation-delay:3.4s;color:var(--mut)">${fnum(s.presses)} key presses · best combo ${s.best}</div>
<div class="endrow" style="animation-delay:4.2s"><button class="pill" id="again">Again</button></div></div>`}
};
let disp=0,shown='',keyEls=[];
function buildKeys(s){const c=$('keys');if(!c)return;const n=s.seq.length,gap=84,x0=480-(n-1)*gap/2-32;
c.innerHTML=s.seq.map((k,i)=>`<div class="k" style="left:${x0+i*gap}px">${k}</div>`).join('');keyEls=[...c.children]}
function paintKeys(s){keyEls.forEach((e,i)=>{e.className='k'+(i<s.idx?' done':i===s.idx?' cur':'')})}
function show(name,s){$('ui').innerHTML=TPL[name](s);shown=name;disp=s.pts||0;
if(name==='work'){buildKeys(s);paintKeys(s)}}
function update(s,dt,combo){
if(s.scr==='break'&&$('bleft'))$('bleft').textContent=Math.ceil(s.brk.left);
if(s.scr!=='work'||!$('pts'))return;
disp+=(s.pts-disp)*Math.min(1,dt*12);$('pts').textContent=fnum(disp);
const e=s.energy,tv=Math.min(1,(100-e)/90),a=Core.age(s);
$('prod').textContent='▲ '+Math.round(100+s.combo*12+s.t*2)+'%';
$('age').textContent='Age '+Math.floor(a);$('prog').style.width=(s.t/Core.C.DUR*100)+'%';
const h=4+110*e/100;$('wax').setAttribute('y',176-h);$('wax').setAttribute('height',h);
$('flame').setAttribute('transform',`translate(35 ${176-h}) scale(${1+tv*.9})`);
[...$('pips').children].forEach((p,i)=>p.className=i<Math.ceil(e/5)?'':'off');
const sm=1+tv*.9;$('mouth').setAttribute('d',`M32 74Q60 ${74+16*sm} 88 74`);
const ry=Math.max(1.5,9*(e/100));$('eL').setAttribute('ry',ry);$('eR').setAttribute('ry',ry);
$('mom').style.width=(100-e)+'%';$('worth').textContent='Worth '+Math.round(s.worth)+'%';
$('worth').style.opacity=1-tv*.85;
$('combo').textContent=s.combo>1?'x'+s.combo+' combo':'';
$('mood').textContent=MOODS[Math.floor(s.t/7)%MOODS.length];
$('vig').style.setProperty('--r',(72-tv*52)+'%');
document.querySelectorAll('.tr,.l,.r').forEach(x=>x.style.opacity=1-tv*.7);
}
function floatFx(txt){const f=$('fx');if(!f)return;if(f.children.length>14)f.firstChild.remove();
const d=document.createElement('div');d.className='fx';d.textContent=txt;
d.style.left=(300+Math.random()*360)+'px';d.style.top=(300+Math.random()*60)+'px';f.appendChild(d);setTimeout(()=>d.remove(),800)}
