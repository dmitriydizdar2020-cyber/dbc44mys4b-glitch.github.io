/* MONTBLANC — real mobile-browser smoke test, without personal data. */
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');

const root=path.resolve(__dirname,'..','..');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
 const raw=decodeURIComponent((req.url||'/').split('?')[0]);
 const full=path.resolve(root,'.'+raw,raw.endsWith('/')?'index.html':'');
 if(!full.startsWith(root+path.sep)){res.writeHead(403).end('Denied');return}
 fs.readFile(full,(err,data)=>{if(err){res.writeHead(404).end('Not found');return}res.writeHead(200,{'Content-Type':types[path.extname(full)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data)});
});

(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url='http://127.0.0.1:'+server.address().port+'/life-os/';
 let browser, page;
 try {
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const failures=[];
  page.on('pageerror',e=>failures.push(String(e)));
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.locator('[data-action="demo"]').waitFor({timeout:20000});
  await page.locator('[data-action="demo"]').click();
  await page.locator('.m60-title h1').getByText('Сегодня').waitFor();
  await page.locator('[data-action="m60-start"]').click();
  await page.locator('.mb7-dock button[data-page="mission60"]').click();
  await page.locator('[data-action="m60-day-pace"][data-value="gentle"]').click();
  const shortText=await page.locator('.m60-pace').innerText();
  assert.ok(shortText.includes('30 мин'),'Gentle pace must fit 30 minutes: '+shortText);
  await page.locator('.mb7-dock button[data-page="reflection"]').click();
  await page.locator('input[name="m60_confidence"]').fill('7');
  await page.locator('textarea[name="m60_focus_evidence"]').fill('Проверочный результат по клиенту');
  const invalid=await page.locator('form[data-form="mission-journal"]').evaluate(form=>Array.from(form.elements).filter(x=>typeof x.checkValidity==='function'&&!x.checkValidity()).map(x=>({name:x.name,value:x.value,message:x.validationMessage})));
  assert.deepEqual(invalid,[],'Journal must permit plausible numeric input such as 7.1h sleep');
  await page.locator('.m60-submit').click();
  await page.locator('.mb7-dock button[data-page="progress"]').click();
  await page.locator('.m60-coach-button').waitFor();
  assert.ok((await page.locator('.m60-page').innerText()).includes('РЕАЛЬНЫЕ ИЗМЕНЕНИЯ'),'Progress must show weekly trend');
  await page.locator('.mb7-dock button[data-page="reflection"]').click();
  assert.equal(await page.locator('input[name="m60_confidence"]').inputValue(),'7','Saved diary must survive tab navigation');
  assert.equal(await page.locator('textarea[name="m60_focus_evidence"]').inputValue(),'Проверочный результат по клиенту');
  await page.locator('.mb7-dock button[data-page="dashboard"]').click();
  assert.ok((await page.locator('.m60-page').innerText()).includes('PRESENCE'),'Presence card must render');
  const size=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(size.scroll<=size.width+2,'Unexpected horizontal overflow on iPhone width: '+JSON.stringify(size));
  assert.equal(failures.length,0,'Uncaught browser errors: '+failures.join('\n'));
  console.log('PASS browser: demo, program, 30-min load, journal save, analytics, Presence, mobile width');
 } catch(e) {
  if(page)await page.screenshot({path:'/tmp/montblanc-browser-failure.png',fullPage:true}).catch(()=>{});
  throw e;
 } finally {
  if(browser)await browser.close();
  server.close();
 }
})().catch(err=>{console.error(err);process.exitCode=1});
