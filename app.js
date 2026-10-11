'use strict';
(() => {
  const $ = (selector) => document.querySelector(selector);
  const main = $('#main');
  const STORAGE_KEY = 'little-wins-collection-v1';
  const colors = {peach:['#F8DECA','#DA714D'],mint:['#DDEBD8','#64815B'],lilac:['#E4DCF7','#9075B0']};
  const paths = {
    star:'M32 8 39 23 56 25 44 37 47 54 32 46 17 54 20 37 8 25 25 23Z',
    heart:'M32 53C27 48 8 36 8 22 8 8 26 6 32 18 38 6 56 8 56 22 56 36 37 48 32 53Z',
    drop:'M32 7C27 18 14 29 14 40A18 18 0 0 0 50 40C50 29 37 18 32 7Z',
    moon:'M44 8A24 24 0 1 0 56 45 26 26 0 0 1 44 8Z',
    cloud:'M17 48A12 12 0 0 1 14 24 18 18 0 0 1 48 25 12 12 0 0 1 47 48Z',
    music:'M25 15V44A8 8 0 1 1 21 37V12L49 7V37A8 8 0 1 1 45 30V17Z',
    shield:'M32 7 52 16V32C52 43 40 53 32 57 24 53 12 43 12 32V16Z',
    bolt:'M36 5 13 36H29L25 59 51 25H34Z',
    spark:'M32 5 40 24 59 32 40 40 32 59 24 40 5 32 24 24Z',
    compass:'M49 15 38 39 15 50 26 26Z',
    sun:'M32 5V12M32 52V59M5 32H12M52 32H59M13 13 18 18M46 46 51 51M13 51 18 46M46 18 51 13M47 32A15 15 0 1 1 17 32 15 15 0 1 1 47 32Z',
    leaf:'M53 10C23 4 9 21 13 39 15 51 30 55 41 45 51 36 48 23 53 10ZM16 48 39 24'
  };
  function glyph(type, color='#675846') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true"><path d="${paths[type] || paths.star}" fill="${['sun','leaf','compass'].includes(type)?'none':color}" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  function badge(item, mystery=false) {
    const [tint, accent] = colors[item?.color || 'peach'];
    let points = '';
    for (let i=0;i<40;i++) { const a=i*Math.PI/20-Math.PI/2,r=i%2?66:74;points+=`${100+Math.cos(a)*r},${92+Math.sin(a)*r} `; }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 210" aria-hidden="true"><path d="M58 139 49 197 76 183 94 204 103 146M105 144 119 204 137 183 162 193 144 135" fill="${accent}" stroke="#6E503D" stroke-width="1.2"/><path d="M63 147 58 182M136 146 148 180" stroke="#ffffff70" stroke-width="3"/><polygon points="${points}" transform="translate(0 5)" fill="${accent}" stroke="#7C6246" stroke-width="1.2"/><polygon points="${points}" fill="#F7CE7D" stroke="#9F753E" stroke-width="1.2"/><circle cx="100" cy="92" r="58" fill="#FFEBB7" stroke="#C79850"/><circle cx="100" cy="92" r="50" fill="${tint}" stroke="#CCAA68" stroke-dasharray="2 4"/>${mystery?'<text x="100" y="115" text-anchor="middle" font-family="Georgia,serif" font-size="68" fill="#916B3F">?</text>':`<g transform="translate(69 60)"><path d="${paths[item.icon]}" fill="${['sun','leaf','compass'].includes(item.icon)?'none':accent}" stroke="${accent}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>`}<path d="M57 50 64 42M68 39 72 37" stroke="#FFFAE9" stroke-width="4" stroke-linecap="round"/></svg>`;
  }
  const localDate = () => {const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  const prettyDate = d => d.replaceAll('-','.');
  let collection={}, storageAvailable=true;
  try {
    const raw=localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed=JSON.parse(raw);
      if (!parsed || typeof parsed!=='object' || Array.isArray(parsed)) throw new Error('Invalid collection');
      for (const a of ACHIEVEMENTS) {
        if (typeof parsed[a.id]==='string' && /^\d{4}-\d{2}-\d{2}$/.test(parsed[a.id])) collection[a.id]=parsed[a.id];
      }
    }
    localStorage.setItem(STORAGE_KEY,JSON.stringify(collection));
  } catch {storageAvailable=false;}
  let screen='home', selected=new Set(), filter='全部', round=[], current=0, flipped=false, activeId=null, resultOrigin='round', roundDate=localDate();
  let toastTimer, shareItem=null, shareDate=null, shareRequest=0;
  const count = () => Object.keys(collection).length;
  function updateCount() {$('#header-count').textContent=String(count()).padStart(2,'0');}
  function toast(message) {const el=$('#toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3200);}
  function persist(a) {
    if (!collection[a.id]) {collection[a.id]=roundDate;if(storageAvailable){try {localStorage.setItem(STORAGE_KEY,JSON.stringify(collection));}catch{storageAvailable=false;toast('浏览器未能保存图鉴，本次体验仍可继续。');}}}
    updateCount();
  }
  const warning = () => storageAvailable?'':'<p class="storage-warning">当前浏览器无法保存图鉴，记录仅在本次页面中保留；你仍可保存成就图片。</p>';
  const top = (back, label) => `<div class="page-top"><button class="back" data-go="${back}">← 返回${back==='home'?'首页':back==='collection'?'图鉴':'选择'}</button><span class="step">${label}</span></div>`;
  function award(a, date) {return `<article class="award" style="--tint:${colors[a.color][0]}"><div class="award-meta"><span>NO. ${a.id} / LITTLE WINS</span><span class="rank">${a.rank}</span></div><div class="award-badge">${badge(a)}</div><small>一件小事 · 一枚奖章</small><h2>${a.name}</h2><p class="description">${a.description}</p><p class="skill">✧ ${a.skill}</p><p class="stamp">${prettyDate(date)} · 今日成就</p></article>`;}
  function home() {return `<section class="home"><div class="hero"><div class="hero-copy"><div class="eyebrow">A LITTLE WIN, EVERY DAY</div><h1>今天的小事，<br>也值得<em>一枚奖章。</em></h1><p class="intro">好好吃饭、勇敢说不，或只是安心休息。<br>那些没人注意的小事，我们想为你颁个奖。</p><button class="primary" data-start>发现今日成就 <span aria-hidden="true">↗</span></button><div class="under-cta"><span>约 30 秒，收获一点小骄傲</span><span>无需登录</span></div></div><div class="hero-art" aria-hidden="true"><div class="orbit"></div><div class="paper-behind"></div><div class="mystery-card"><div class="card-label"><span>YOUR DAILY ACHIEVEMENT</span><span>✧</span></div><div class="mystery-badge">${badge(null,true)}</div><h3>你的隐藏成就</h3><p>等一个平凡又特别的你，来揭晓。</p><div class="card-bottom">LITTLE THINGS. BIG FEELINGS.</div></div><span class="art-note">平凡的一天<br>也会闪闪发光 ↘</span><span class="art-spark">✦</span><span class="art-spark second">✧</span><div class="art-sticker">今日份的小骄傲<br>请亲自签收 ✓</div></div></div><div class="how"><div class="how-item"><span class="how-num">01</span><div><h3>回想一件小事</h3><p>今天，你为自己做了什么？</p></div></div><div class="how-item"><span class="how-num">02</span><div><h3>揭晓隐藏成就</h3><p>让小事拥有一个闪亮的名字。</p></div></div><div class="how-item"><span class="how-num">03</span><div><h3>收藏这份小骄傲</h3><p>留给自己，也可以分享出去。</p></div></div></div><div class="collection-teaser"><div class="mini-badge">${badge({color:'mint',icon:'star'})}</div><div><h3>你的生活，正在慢慢集章</h3><p>已发现 ${count()} / 16 枚 · 不必每天来，每次来都欢迎</p></div><button data-go="collection">打开图鉴 ↗</button></div>${warning()}</section>`;}
  function choose() {return `<section class="page">${top('home','01 / 回想今天')}<div class="eyebrow">SMALL THINGS COUNT</div><h1 style="margin-top:14px">今天，你做过哪些小事？</h1><p class="subtitle">选 1—3 件就好。没有标准答案，也不用很了不起。</p><div class="filter-row" aria-label="行为分类">${['全部','生活','自己','勇气','探索'].map(f=>`<button class="filter ${f===filter?'active':''}" data-filter="${f}" aria-pressed="${f===filter}">${f}</button>`).join('')}</div><div class="behavior-grid">${ACHIEVEMENTS.filter(a=>filter==='全部'||a.category===filter).map(a=>`<button class="behavior ${selected.has(a.id)?'selected':''}" data-select="${a.id}" aria-pressed="${selected.has(a.id)}"><div class="behavior-illustration" style="--tint:${colors[a.color][0]}">${glyph(a.icon,colors[a.color][1])}</div><div class="behavior-copy">${a.action}<small>${a.category}里的小小闪光</small></div><span class="check" aria-hidden="true">${selected.has(a.id)?'✓':''}</span></button>`).join('')}</div><div class="selection-bar"><div class="selection-inner"><div class="selected-summary" aria-live="polite">已选 <strong>${selected.size}</strong> / 3 件<small>每件小事，都有回应</small></div><button class="primary" id="begin-reveal" ${selected.size?'':'disabled'}>揭晓我的成就 <span aria-hidden="true">✧</span></button></div></div></section>`;}
  function revealPage() {const a=round[current];return `<section class="page reveal-page">${top('choose','02 / 领取小骄傲')}<div class="center"><h1 id="reveal-heading">${flipped?'这枚奖章，属于你。':'小事背后，藏着闪光的你。'}</h1><p class="subtitle">${flipped?'被看见的每一步，都算数。':'已经为你准备好一份小小的认可。'}</p><div class="dots" aria-label="第 ${current+1} 枚，共 ${round.length} 枚">${round.map((_,i)=>`<span class="dot ${i===current?'active':''}"></span>`).join('')}</div></div><div class="reveal-stage"><div class="flip-inner ${flipped?'flipped':''}"><div class="flip-face flip-front" aria-hidden="${flipped}"><div class="mystery-badge">${badge(null,true)}</div><p>一份属于你的隐藏成就</p><small>不是大事，也值得认真庆祝。</small></div><div class="flip-face flip-back" aria-hidden="${!flipped}">${award(a,roundDate)}</div></div></div><div class="reveal-controls center"><button class="primary" id="reveal-action">${flipped?(current<round.length-1?'下一枚小骄傲 →':'查看今日成就 →'):'揭晓这一枚 ✧'}</button>${flipped?'<p class="small-note">✓ 已收进我的图鉴</p>':'<button class="text-button" id="skip-animation">直接查看，跳过动画</button>'}<p class="rank-note">R / SR / SSR 只是趣味卡面等级，<br>每一种生活，都同样值得庆祝。</p></div></section>`;}
  function results() {const items=resultOrigin==='collection'?[ACHIEVEMENTS.find(a=>a.id===activeId)]:round;const a=items.find(a=>a.id===activeId)||items[0];activeId=a.id;const date=resultOrigin==='collection'?collection[a.id]:roundDate;return `<section class="page">${top(resultOrigin==='collection'?'collection':'home','03 / 收藏这一刻')}<h1>${resultOrigin==='collection'?'这份小骄傲，替你记得。':'原来，今天也有这么多闪光。'}</h1><p class="subtitle">${resultOrigin==='collection'?'首次发现于 '+prettyDate(date):`今天的 ${round.length} 枚成就，已收进你的图鉴。挑一枚，把它带走。`}</p><div class="result-layout">${award(a,date)}<div class="result-actions"><p class="result-heading">${resultOrigin==='collection'?'属于你的生活纪念':'想分享哪一份小骄傲？'}</p><div class="result-list" aria-label="选择分享的成就">${items.map(item=>`<button class="result-choice ${item.id===activeId?'active':''}" data-result="${item.id}" aria-pressed="${item.id===activeId}"><span class="mini-badge">${badge(item)}</span><span>${item.name}</span><span class="rank">${item.rank}</span></button>`).join('')}</div><button class="primary" id="open-share">生成分享卡 <span aria-hidden="true">↗</span></button><button class="secondary" data-go="collection">看看我的图鉴 · ${count()} / 16</button><button class="text-button" data-start>再发现一点小骄傲</button><p class="small-note">不必证明给谁看。<br>这张卡，留给自己也很好。</p><p class="rank-note">等级仅为趣味装饰，不代表生活价值高低。</p></div></div>${warning()}</section>`;}
  function collectionPage() {return `<section class="page">${top('home','MY LITTLE WINS')}<div class="collection-head"><div><h1>我的生活奖章馆</h1><p class="subtitle">慢慢收集，不用赶路。</p></div><div class="collection-total">${String(count()).padStart(2,'0')}<small> / 16</small></div></div><div class="progress-track" role="progressbar" aria-label="已发现成就" aria-valuenow="${count()}" aria-valuemin="0" aria-valuemax="16"><div class="progress-fill" style="width:${count()/16*100}%"></div></div>${count()?'':`<div class="empty-invite">第一枚奖章，还在等你发现。<br>从今天做过的一件小事开始就好。<br><button class="primary" data-start>发现我的第一枚 ↗</button></div>`}<div class="collection-grid">${ACHIEVEMENTS.map(a=>collection[a.id]?`<button class="collect-card" data-collected="${a.id}"><div class="mini-badge">${badge(a)}</div><h3>${a.name}</h3><small>${a.rank} · ${prettyDate(collection[a.id])}</small></button>`:`<div class="collect-card locked"><div class="locked-symbol" aria-hidden="true">?</div><h3>尚待发现</h3><small>NO. ${a.id} · 藏在某件小事里</small></div>`).join('')}</div><p class="small-note">图鉴仅保存在当前浏览器；清除浏览器数据会清空记录。<br>R / SR / SSR 只是趣味等级，每一种生活都值得庆祝。</p>${warning()}</section>`;}
  function render(reset=true) {main.innerHTML=({home,choose,reveal:revealPage,results,collection:collectionPage})[screen]();updateCount();if(reset){clearTimeout(toastTimer);$('#toast').classList.remove('visible');$('#toast').textContent='';window.scrollTo(0,0);main.focus({preventScroll:true});}}
  function navigate(next) {screen=next;render();}
  function start() {selected=new Set();filter='全部';navigate('choose');}
  function reveal(skip=false) {
    if(flipped)return;
    flipped=true;persist(round[current]);
    const inner=$('.flip-inner');
    if(skip)inner.style.transition='none';
    inner.classList.add('flipped');$('.flip-front').setAttribute('aria-hidden','true');$('.flip-back').setAttribute('aria-hidden','false');
    $('#reveal-heading').textContent='这枚奖章，属于你。';$('.reveal-page .subtitle').textContent='被看见的每一步，都算数。';
    $('#reveal-action').textContent=current<round.length-1?'下一枚小骄傲 →':'查看今日成就 →';
    const skipButton=$('#skip-animation');if(skipButton){const hadFocus=document.activeElement===skipButton;skipButton.outerHTML='<p class="small-note" role="status">✓ 已收进我的图鉴</p>';if(hadFocus)$('#reveal-action').focus();}
    if(!skip&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){const c=document.createElement('div');c.className='confetti';c.setAttribute('aria-hidden','true');c.innerHTML=Array.from({length:20},(_,i)=>`<i style="--x:${Math.cos(i*2.4)*170}px;--y:${Math.sin(i*2.4)*140+65}px;--r:${i*58}deg;--c:${['#ea6545','#9d87bd','#99af8c','#e0b55e'][i%4]}"></i>`).join('');$('.reveal-stage').append(c);setTimeout(()=>c.remove(),900);}
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.hasAttribute('data-start')){start();return;}
    if(b.dataset.go){navigate(b.dataset.go);return;}
    if(b.dataset.filter){filter=b.dataset.filter;render(false);$(`[data-filter="${filter}"]`).focus({preventScroll:true});return;}
    if(b.dataset.select){const id=b.dataset.select;if(selected.has(id))selected.delete(id);else if(selected.size<3)selected.add(id);else{toast('一次最多选 3 件，先取消一件就可以换选。');return;}render(false);$(`[data-select="${id}"]`).focus({preventScroll:true});return;}
    if(b.id==='begin-reveal'){if(!selected.size)return;round=[...selected].map(id=>ACHIEVEMENTS.find(a=>a.id===id));roundDate=localDate();current=0;flipped=false;resultOrigin='round';navigate('reveal');return;}
    if(b.id==='skip-animation'){reveal(true);return;}
    if(b.id==='reveal-action'){if(!flipped)reveal();else if(current<round.length-1){current++;flipped=false;render(false);$('#reveal-action').focus({preventScroll:true});}else{activeId=round[0].id;navigate('results');}return;}
    if(b.dataset.result){activeId=b.dataset.result;render(false);$(`[data-result="${activeId}"]`).focus({preventScroll:true});return;}
    if(b.dataset.collected){activeId=b.dataset.collected;resultOrigin='collection';navigate('results');return;}
    if(b.id==='open-share'){shareItem=ACHIEVEMENTS.find(a=>a.id===activeId);shareDate=resultOrigin==='collection'?collection[activeId]:roundDate;$('#share-dialog').showModal();generateShare();return;}
    if(b.id==='close-share'){$('#share-dialog').close();return;}
    if(b.id==='retry-share')generateShare();
  });
  $('#share-dialog').addEventListener('close',()=>{shareRequest++;$('#open-share')?.focus();});
  document.addEventListener('keydown',e=>{
    if(e.key!=='Tab'||!$('#share-dialog').open)return;
    const controls=[...$('#share-dialog').querySelectorAll('button:not(:disabled),a[href]')].filter(el=>!el.hidden&&el.getClientRects().length);
    const first=controls[0],last=controls[controls.length-1],active=document.activeElement;
    if(!controls.includes(active)){e.preventDefault();first.focus();}
    else if(e.shiftKey&&active===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&active===last){e.preventDefault();first.focus();}
  });
  function rounded(ctx,x,y,w,h,r,fill,stroke) {ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}}
  function wrap(ctx,text,x,y,maxWidth,lineHeight) {let line='';for(const c of text){if(ctx.measureText(line+c).width>maxWidth){ctx.fillText(line,x,y);line=c;y+=lineHeight;}else line+=c;}ctx.fillText(line,x,y);return y;}
  async function makeCard(a,date) {
    await document.fonts.ready;
    const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1440;
    const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas unavailable');
    const font='-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillStyle='#F8F5EF';ctx.fillRect(0,0,1080,1440);
    ctx.fillStyle='#EA6545';ctx.font=`bold 46px ${font}`;ctx.fillText('✳',66,102);
    ctx.fillStyle='#292821';ctx.font=`bold 33px ${font}`;ctx.fillText('今日成就',125,100);
    ctx.textAlign='right';ctx.font=`18px ${font}`;ctx.fillStyle='#756D63';ctx.fillText('LITTLE WINS CLUB',1010,97);
    rounded(ctx,65,145,950,1110,36,colors[a.color][0],'#CDBFA9');rounded(ctx,85,165,910,1070,26,'#FFFCF5','#D9CDB9');
    ctx.textAlign='left';ctx.font='21px monospace';ctx.fillStyle='#73695C';ctx.fillText(`NO. ${a.id} / DAILY ACHIEVEMENT`,126,220);
    rounded(ctx,852,190,99,49,10,colors[a.color][0],'#C5B599');ctx.textAlign='center';ctx.fillStyle='#66523E';ctx.font='bold 25px monospace';ctx.fillText(a.rank,902,224);
    const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(badge(a));});
    ctx.drawImage(img,330,270,420,441);
    ctx.textAlign='center';ctx.fillStyle='#85765F';ctx.font=`24px ${font}`;ctx.fillText('一件小事 · 一枚奖章',540,760);
    ctx.fillStyle='#292821';ctx.font=`bold 70px ${font}`;ctx.fillText(a.name,540,865);
    ctx.font=`32px ${font}`;ctx.fillStyle='#6C6051';wrap(ctx,a.description,540,943,720,51);
    rounded(ctx,350,1050,380,67,34,colors[a.color][0],'#D1C4B0');ctx.fillStyle='#5C5042';ctx.font=`25px ${font}`;ctx.fillText(`✧ ${a.skill}`,540,1093);
    ctx.beginPath();ctx.setLineDash([7,8]);ctx.moveTo(126,1154);ctx.lineTo(954,1154);ctx.strokeStyle='#C6BBA7';ctx.stroke();ctx.setLineDash([]);
    ctx.font=`21px ${font}`;ctx.fillStyle='#7C7264';ctx.fillText(`${prettyDate(date)}  ·  为平凡的一天，盖个闪亮的章`,540,1202);
    ctx.fillStyle='#474238';ctx.font=`26px ${font}`;ctx.fillText('小事，也值得被庆祝。',540,1320);
    ctx.font=`18px ${font}`;ctx.fillStyle='#857B6D';ctx.fillText('等级仅为趣味装饰，每一种生活都值得庆祝。',540,1370);
    return canvas.toDataURL('image/png');
  }
  async function generateShare() {
    const request=++shareRequest;const a=shareItem,date=shareDate;
    if(document.activeElement===$('#retry-share'))$('#close-share').focus();
    $('#share-status').textContent='正在制作你的成就卡…';$('#share-image').hidden=true;$('#download').hidden=true;$('#retry-share').hidden=true;
    try {const url=await makeCard(a,date);if(request!==shareRequest||!$('#share-dialog').open)return;$('#share-image').src=url;$('#share-image').alt=`${a.name}，${a.description}，${prettyDate(date)}，今日成就`;$('#share-image').hidden=false;$('#download').href=url;$('#download').download=`今日成就-${a.name}-${date}.png`;$('#download').hidden=false;$('#share-status').textContent='已生成 1080 × 1440 图片 · 只在你的设备上制作';}
    catch{if(request!==shareRequest)return;$('#share-status').textContent='图片暂时未能生成，请重试，或换一个浏览器打开。';$('#retry-share').hidden=false;}
  }
  render();
})();
