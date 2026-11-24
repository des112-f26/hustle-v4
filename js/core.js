(function(g){
const C={DUR:120,BREAKS:[38,78],BRK_LEN:12,SEQ:8,KEYS:'ASDF',REST:14,SKIP_E:7,SKIP_W:8,SKIP_PTS:800};
const R=Math.random;
function newSeq(){const a=[];for(let i=0;i<C.SEQ;i++){let k;do{k=C.KEYS[Math.floor(R()*4)]}while(i&&k===a[i-1]&&R()<.7);a.push(k)}return a}
function init(){return{scr:'start',t:0,pts:0,energy:100,worth:100,combo:0,best:0,idle:0,seq:newSeq(),idx:0,presses:0,miss:0,tasks:0,taken:0,skipped:0,brk:null,nb:0,end:null}}
const age=s=>22+43*Math.min(1,s.t/C.DUR);
const level=s=>1+Math.floor((age(s)-22)/9);
function drain(s,e,w){s.energy=Math.max(0,s.energy-e);s.worth=Math.max(0,s.worth-w)}
function finish(s,why){s.scr='end';s.end=why;s.brk=null}
function press(s,k){
  if(s.scr!=='work')return null;
  s.presses++;s.idle=0;
  if(k===s.seq[s.idx]){
    s.combo++;s.best=Math.max(s.best,s.combo);
    const gain=Math.round(10*(1+Math.min(s.combo,40)*.15)*level(s));
    s.pts+=gain;drain(s,.1,.06);s.idx++;
    const ev={ok:1,gain};
    if(s.idx>=s.seq.length){const b=60*level(s);s.pts+=b;s.tasks++;s.idx=0;s.seq=newSeq();drain(s,0,.2);ev.task=b}
    if(s.energy<=0)finish(s,'burnout');
    return ev;
  }
  s.combo=0;s.miss++;drain(s,1.2,.8);
  if(s.energy<=0)finish(s,'burnout');
  return{ok:0};
}
function step(s,dt){
  if(s.scr==='work'){
    s.t+=dt;s.idle+=dt;if(s.idle>1.2)s.combo=0;drain(s,.35*dt,0);
    if(s.nb<C.BREAKS.length&&s.t>=C.BREAKS[s.nb]){s.scr='break';s.brk={left:C.BRK_LEN};s.nb++}
  }else if(s.scr==='break'){
    s.t+=dt;s.brk.left-=dt;
    if(s.brk.left<=0){s.energy=Math.min(100,s.energy+C.REST);s.taken++;s.scr='work';s.brk=null;s.idle=0}
  }else return;
  if(s.scr!=='end'){if(s.energy<=0)finish(s,'burnout');else if(s.t>=C.DUR)finish(s,'retired')}
}
function skip(s){
  if(s.scr!=='break')return;
  s.skipped++;drain(s,C.SKIP_E,C.SKIP_W);s.pts+=C.SKIP_PTS;s.scr='work';s.brk=null;s.idle=0;
  if(s.energy<=0)finish(s,'burnout');
}
g.Core={C,init,age,level,press,step,skip,newSeq,real:s=>Math.round(s.pts*s.worth/100)};
})(typeof window!=='undefined'?window:globalThis);
