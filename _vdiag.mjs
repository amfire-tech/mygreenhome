import puppeteer from 'puppeteer-core';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const b = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox','--autoplay-policy=no-user-gesture-required'], defaultViewport: { width: 1440, height: 900 } });
const p = await b.newPage();
const reqs = {};
p.on('response', r => { const u=r.url(); if(u.includes('.mp4')) reqs[r.status()]=(reqs[r.status()]||0)+1; });
await p.goto('https://mygreenhome.pages.dev/', { waitUntil:'networkidle2', timeout:60000 });
await new Promise(r=>setTimeout(r,3500));
const info1 = await p.evaluate(()=>{
  const v=document.querySelector('video'); if(!v) return {novideo:true};
  return { src:v.currentSrc.split('/').pop(), readyState:v.readyState, networkState:v.networkState,
    duration:Math.round(v.duration*100)/100, ct0:v.currentTime, paused:v.paused,
    seekableLen:v.seekable.length, seekableEnd: v.seekable.length? Math.round(v.seekable.end(0)*100)/100:null,
    err: v.error? v.error.code: null, w:v.videoWidth, h:v.videoHeight };
});
// scroll into the tour stage
await p.evaluate(()=>{const el=document.getElementById('tour'); const top=window.scrollY+el.getBoundingClientRect().top; window.scrollTo(0, top + el.offsetHeight*0.45);});
await new Promise(r=>setTimeout(r,2500));
const info2 = await p.evaluate(()=>{ const v=document.querySelector('video'); return { ctAfterScroll: Math.round(v.currentTime*100)/100, readyState:v.readyState, seekableEnd: v.seekable.length? Math.round(v.seekable.end(0)*100)/100:null }; });
console.log('mp4 responses:', JSON.stringify(reqs));
console.log('initial:', JSON.stringify(info1));
console.log('after scroll:', JSON.stringify(info2));
console.log('=> currentTime moved?', info2.ctAfterScroll > 0.1 ? 'YES (scrubbing works)' : 'NO (stuck at '+info2.ctAfterScroll+')');
await b.close();
