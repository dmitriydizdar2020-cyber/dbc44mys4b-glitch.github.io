/* MONTBLANC 12.0 — 60-day private life-growth module.
   Standalone presentation/logic layer. Existing vault, GH backup, tasks and daily logs
   are owned by app.js, not by this module. No external network requests. */
(function(global){
'use strict';
const AREAS=[
 {id:'focus',name:'Доход и фокус',emoji:'💼',color:'#356dde'},
 {id:'english',name:'Английский',emoji:'🗣️',color:'#9960d9'},
 {id:'sport',name:'Спорт и движение',emoji:'🏃',color:'#f27c4b'},
 {id:'learning',name:'Полезные знания',emoji:'📚',color:'#0f9991'},
 {id:'nutrition',name:'Питание',emoji:'🥗',color:'#34a366'},
 {id:'family',name:'Семья и харизма',emoji:'🤝',color:'#dc6597'},
 {id:'diary',name:'Дневник',emoji:'✍️',color:'#5289c9'}
];
const PHASES=[
 ['Начало пути','От рассеянности — к первому измеримому шагу.'],
 ['Новый ритм','Укрепляем внимание, голос и стабильность.'],
 ['Выход в реальность','Реальные контакты, практика и обратная связь.'],
 ['Фокус и результаты','Выбираем полезное, убираем шум, закрепляем привычки.'],
 ['Новая высота','Подводим итоги и строим следующий маршрут.']
];
const INCOME_STEPS=[
'Запиши реальную точку А: доход, обязательные расходы и долги.',
'Выбери одну B2B-услугу, которую можешь проверить без вложений.',
'Опиши одну проблему клиента, которую реально можешь решить.',
'Составь портрет клиента: должность, отрасль, страна, проблема.',
'Найди пять компаний, которым может быть полезна услуга.',
'Изучи два предложения конкурентов и выпиши слабые стороны.',
'Сформулируй ценность услуги в двух коротких предложениях.',
'Проверь одну гипотезу с реальным человеком, не продавая вслепую.',
'Создай список десяти потенциальных клиентов.',
'Подготовь одно персонализированное сообщение с понятной пользой.',
'Отправь первое обращение реальному потенциальному клиенту.',
'Проверь ответы. Если их нет, запиши факт, а не обвинение себя.',
'Изучи одно частое возражение и подготовь спокойный ответ.',
'Составь простое предложение с понятной ценой и объёмом работ.',
'Отправь предложение или согласуй короткий разговор.',
'Сделай 30 минут сфокусированной работы на одной услуге.',
'Найди ещё пять релевантных компаний без массовой рассылки.',
'Проверь качество своего сообщения на одном живом контакте.',
'Спроси потенциального клиента, какая задача у него болит.',
'Запиши три факта о спросе на твою услугу.',
'Составь мини-план получения первого оплаченного теста.',
'Сократи свой список идей до одной проверяемой гипотезы.',
'Проведи короткий звонок или отправь ценное предложение.',
'Проверь конверсию: обращения, ответы, разговоры, оплаты.',
'Опиши маленький платный пилот на 7 дней.',
'Выбери одного подходящего клиента для пилота.',
'Уточни, какие результаты нужно предоставить клиенту.',
'Отправь конкретное предложение пилота.',
'Сделай один нужный follow-up по предыдущему разговору.',
'Зафиксируй, какие действия в продажах были полезны.',
'Разбери одно «нет»: что можно улучшить, не споря с клиентом?',
'Сверь реальный доход и обещанные платежи — не смешивай их.',
'Проверь, сколько времени занимает выполнение услуги.',
'Рассчитай примерную прибыль после расходов.',
'Составь короткий список реальных повторяемых действий.',
'Заверши одно незакрытое клиентское обещание.',
'Создай одно качественное доказательство своей компетенции.',
'Сделай два персональных обращения за один рабочий блок.',
'Попроси обратную связь у заинтересованного клиента.',
'Сравни результат недели с прошлой по цифрам.',
'Отбрось один неработающий канал или предложение по фактам.',
'Проведи глубокую работу над лучшей гипотезой.',
'Обнови текст предложения по реальным ответам клиентов.',
'Обсуди с клиентом конкретную пользу и условия работы.',
'Подготовь следующий оплачиваемый шаг.',
'Запиши выручку, расходы и денежный остаток.',
'Выдели один главный коммерческий приоритет на неделю.',
'Сделай один реальный шаг к получению оплаты.',
'Сверь фактический доход с годовой финансовой целью.',
'Проверь, не тратишь ли время на проекты без проверки спроса.',
'Назови самую полезную привычку для заработка.',
'Повтори действие, которое действительно принесло ответ.',
'Откажись от одного бесполезного действия.',
'Продумай финансовый резерв и обязательные платежи.',
'Проверь статус своего лучшего коммерческого предложения.',
'Запиши уроки из реальных разговоров с клиентами.',
'Составь список из пяти действий, которые дают результат.',
'Сравни текущие деньги и долг со стартовыми цифрами.',
'Сформулируй один измеримый план на следующие 30 дней.',
'Запланируй завтра один конкретный коммерческий шаг.'
];
const ENGLISH_TOPICS=['О себе и своей семье','Мой обычный день','Работа и клиенты','Город, где я живу','Покупки и цены','Транспорт','Теннис и спорт','Планы на завтра','Еда и ресторан','Деньги и числа','Что было вчера','Мои путешествия','Вежливая просьба','Звонок по телефону','Моя бизнес-идея','Вопросы клиенту','Мой опыт','Договориться о встрече','Услуга и её польза','Объяснить проблему','Сравнить два варианта','Выразить предпочтение','Мои навыки','Что мне удалось сегодня','Короткое письмо','Аргумент «за»','Вывод из ошибки','Почему я учу английский','Планы на год','Мои успехи'];
const LEARNING_TOPICS=['Как формируются привычки','Прокрастинация без самокритики','Один главный приоритет','Активное слушание','Выяснение потребностей клиента','Выручка, прибыль и остаток','Простой домашний бюджет','Быстрая проверка гипотез','Цифровые продажи','Понятное предложение ценности','Как работают отвлечения','Письменная коммуникация','Обратная связь','Основа переговоров','Простой маркетинговый кейс','Сон и восстановление','Безопасная умеренная нагрузка','Повторение и закрепление знаний','Проверка источников информации','Финансовый план поездки'];
const FOOD_STEPS=['Добавь доступный продукт, который тебе подходит, для разнообразия питания.','Поешь один раз без телефона, замечая насыщение.','Обрати внимание на достаточное питьё воды.','Спланируй один удобный домашний приём пищи.','Включи подходящий источник белка в один приём пищи.','Постарайся есть в комфортном регулярном ритме.','Заметь, что тебе подходит и как ты себя чувствуешь.','Подготовь простой перекус, если предстоит насыщенный день.','Составь список продуктов на два дня.','Поешь спокойно, без спешки.','Выбери доступное разнообразие без строгих запретов.','Подумай, как удобно питаться в день движения.','Отметь связь еды и уровня энергии без диагнозов.','Сделай один осознанный комфортный выбор в питании.'];
const SOCIAL_STEPS=['Спроси близкого человека, как прошёл день, и внимательно выслушай.','Начни простой разговор без ожидания выгоды.','Поблагодари человека за конкретное хорошее действие.','Задай открытый вопрос и выслушай полный ответ.','Спокойно вырази своё мнение без длинных оправданий.','Побудь десять минут с близкими без телефона.','Расскажи семье об одном позитивном событии.','Запиши сильную сторону и факт, который её подтверждает.','Говори чуть медленнее, делая небольшие паузы.','Попроси конкретную обратную связь по разговору.','Поддержи другого человека без непрошеного совета.','Договорись о совместном времени с семьёй.','Спокойно попроси о помощи или информации.','Расскажи за минуту о своей идее, не торопясь.','Прояви доброжелательную инициативу в общении.'];
const MOVE_STEPS=['Комфортная прогулка','Мягкая разминка и мобильность','Прогулка или лёгкая пробежка по самочувствию','Небольшая силовая тренировка подходящего уровня','Разминка, растяжка без боли или прогулка','Теннис, зал или другая приятная активность','Восстановительная прогулка или отдых по самочувствию'];
const TRAVEL_STEPS=['Выбери новое место, которое хочешь посетить.','Оцени бюджет будущей короткой поездки.','Найди идею семейного путешествия.','Продумай время поездки и условия для семьи.','Запиши, какие впечатления для тебя важнее всего.','Проверь, какую сумму реально можно откладывать на поездку.','Сохрани одну конкретную идею для отдыха.'];
function create(ctx){
 const S=()=>ctx.state(),e=ctx.e,num=ctx.num,today=ctx.today,plus=ctx.plusDays,delta=ctx.deltaDays,ru=ctx.ruDate,money=ctx.money;
 const log=date=>S().data.daily_logs.find(x=>x.log_date===date)||{};
 function get(){
  const x=S().profile?.montblanc60;
  if(!x||x.version!==1||typeof x.started!=='string'||!(/^\d{4}-\d{2}-\d{2}$/.test(x.started)))return null;
  return {version:1,started:x.started,pace:x.pace==='gentle'?'gentle':'steady',days:x.days&&typeof x.days==='object'&&!Array.isArray(x.days)?x.days:{}};
 }
 const elapsed=(p=get())=>p?Math.max(0,Math.min(60,delta(p.started,today())+1)):0;
 const dateOf=(i,p=get())=>p?plus(p.started,Math.max(0,Math.min(59,i))):today();
 const index=(p=get())=>Math.max(0,Math.min(59,S().mission60DayIndex==null?elapsed(p)-1:S().mission60DayIndex));
 function tasks(i,p=get()){
  const phase=Math.floor(i/12),day=i%7,week=Math.floor(i/7),gentle=p?.pace==='gentle'||day===6;
  const english=gentle?15:Math.min(35,20+phase*3),sport=gentle?12:Math.min(35,18+phase*3),learn=gentle?10:15+phase*2,focus=gentle?15:20+phase*5;
  const speaking=i<20?'Составь 5 фраз и произнеси вслух':i<40?'Скажи краткий монолог и задай три вопроса':'Запиши минутный ответ и поправь две ошибки';
  const list=[
   {id:'focus',title:'Один шаг к заработку',detail:INCOME_STEPS[i]+' Выдели '+focus+' мин без переключений.',minutes:focus,core:true},
   {id:'english',title:'Английский · '+english+' минут',detail:'Тема: '+ENGLISH_TOPICS[i%ENGLISH_TOPICS.length]+'. '+speaking+'. Добавь пять минут аудирования.',minutes:english,core:true},
   {id:'sport',title:day===6?'Мягкое движение и восстановление':'Движение и форма',detail:MOVE_STEPS[day]+' — около '+sport+' мин. Не тренируйся через боль.',minutes:sport,core:true},
   {id:'learning',title:'Полезные знания · '+learn+' минут',detail:'Разбери тему «'+LEARNING_TOPICS[i%LEARNING_TOPICS.length]+'». Запиши одно практическое применение.',minutes:learn,core:true},
   {id:'nutrition',title:'Питание без крайностей',detail:FOOD_STEPS[i%FOOD_STEPS.length],minutes:5,core:false},
   {id:'family',title:'Семья и уверенность',detail:SOCIAL_STEPS[i%SOCIAL_STEPS.length],minutes:10,core:false},
   {id:'diary',title:'Вечерний дневник',detail:'Запиши ощущения, мысли, маленькую победу, препятствие и шаг на завтра.',minutes:5,core:true}
  ];
  if(day===6)list.push({id:'travel',title:'Идея для путешествия',detail:TRAVEL_STEPS[week%7],minutes:10,core:false});
  return list;
 }
 function auto(id,date){
  const x=log(date),doneTasks=S().data.tasks.filter(t=>t.task_date===date&&ctx.taskIsDone(t));
  if(id==='diary')return !!x.reflection_done;
  if(id==='english')return num(x.english_min)>=15;
  if(id==='sport')return num(x.exercise_min)>=10||doneTasks.some(t=>['sport','health'].includes(t.category));
  if(id==='learning')return num(x.learning_min)>=10;
  if(id==='focus')return num(x.focus_min)>=15||doneTasks.some(t=>['finance','focus'].includes(t.category));
  if(id==='family')return num(x.family_min)>=10;
  if(id==='nutrition')return x.m60_nutrition_done===true;
  return false;
 }
 function status(id,date,p=get()){const recorded=auto(id,date);return {done:recorded||!!p?.days?.[date]?.checked?.[id],recorded}}
 function stats(p=get()){
  if(!p)return null;
  const n=elapsed(p),all=Array.from({length:60},(_,i)=>tasks(i,p).length).reduce((a,b)=>a+b,0);
  let possible=0,done=0,active=0,core=0,corePossible=0,coreDone=0;
  const areas=Object.fromEntries([...AREAS.map(a=>a.id),'travel'].map(k=>[k,{done:0,possible:0}]));
  const weeks=Array.from({length:9},(_,i)=>({index:i,possible:0,done:0,active:0}));
  for(let i=0;i<n;i++){
   const d=dateOf(i,p),list=tasks(i,p),w=weeks[Math.floor(i/7)];let count=0;
   for(const a of list){
    const yes=status(a.id,d,p).done;possible++;w.possible++;areas[a.id].possible++;
    if(a.core)corePossible++;
    if(yes){done++;w.done++;areas[a.id].done++;count++;if(a.core)coreDone++}
   }
   if(count){active++;w.active++}
   if(list.filter(a=>a.core).every(a=>status(a.id,d,p).done))core++;
  }
  const privateTasks=S().data.tasks.filter(x=>x.task_date>=p.started&&x.task_date<=today()&&!['cancelled','skipped'].includes(x.status));
  const personalDone=privateTasks.filter(ctx.taskIsDone).length;
  return {elapsed:n,total:all,possible,done,active,core,corePossible,coreDone,areas,weeks,
    personalDone,personalTotal:privateTasks.length,combinedDone:done+personalDone,combinedTotal:possible+privateTasks.length,
    journey:all?Math.round(done/all*100):0,actual:possible?Math.round(done/possible*100):0};
 }

 function recommendations(p=get(),s=stats(p)){
  if(!p||!s)return ['Начни с одного конкретного шага. Реальные наблюдения начнут собираться после старта.'];
  const available=s.elapsed,dayCut=plus(today(),-6),logs=S().data.daily_logs.filter(x=>x.log_date>=dayCut&&x.log_date<=today());
  const energy=logs.map(x=>Number(x.evening_energy)).filter(x=>Number.isFinite(x)&&x>=1&&x<=10);
  const avgEnergy=energy.length?energy.reduce((a,b)=>a+b,0)/energy.length:null;
  const tips=[];
  if(avgEnergy!==null&&avgEnergy<=4)tips.push('Энергия в последних записях невысокая. Выбери бережный темп и больше восстановления, не пытаясь наверстать пропущенное.');
  if(available>=4&&s.active/available<0.5)tips.push('Пока менее половины дней были активными. Выбери один лёгкий шаг сегодня и вернись к ритму без самокритики.');
  if(available>=4&&s.areas.focus.done<=1&&s.personalDone>=3)tips.push('Обычные дела выполняются, но шагов в сторону дохода немного. Выдели короткий блок на проверку спроса.');
  if(available>=5&&s.areas.english.done/Math.max(1,s.areas.english.possible)<0.4)tips.push('Английский пока реже остальных практик. Начни с 15 минут устной речи и повторения.');
  if(available>=5&&s.areas.sport.done/Math.max(1,s.areas.sport.possible)<0.4)tips.push('Движения было немного. Можно начать с короткой прогулки или мягкой разминки, если это подходит по самочувствию.');
  if(available>=7&&s.active>=5)tips.push('Уже '+s.active+' активных дней — у тебя появляется повторяемый ритм. Сохраняй удобное время практики.');
  if(s.done>=20&&ctx.monthIncome()===0)tips.push('Практика идёт, но доход пока не подтверждён. Сверяй не только выполненные шаги, но и отклики, предложения и реальные оплаты.');
  if(!tips.length)tips.push('Прогресс начинается с подтверждённых действий. Держи один главный приоритет, а вечером фиксируй результат и препятствие.');
  return tips.slice(0,3);
 }
 function awards(s=stats()){
  if(!s)return [];
  return [
   ['🌱','Начало',s.done>=1],['⚡','10 выполненных практик',s.done>=10],['🏃','7 дней движения',s.areas.sport.done>=7],
   ['🗣️','10 практик английского',s.areas.english.done>=10],['📚','20 уроков знаний',s.areas.learning.done>=20],
   ['🥗','10 дней питания',s.areas.nutrition.done>=10],['🎯','20 задач к доходу',s.areas.focus.done>=20],
   ['🤝','20 шагов для близких',s.areas.family.done>=20],['🏕️','10 активных дней',s.active>=10],
   ['🏔️','30 активных дней',s.active>=30],['🧭','50 активных дней',s.active>=50],
   ['🏆','Финиш 60 дней',s.elapsed===60&&s.active>=40]
  ].map(([emoji,title,earned])=>({emoji,title,earned}));
 }
 async function start(){
  if(!S().local&&!S().demo)throw Error('Для личного сохранения открой защищённый режим MONTBLANC');
  if(get())return;
  await ctx.saveProfile({...S().profile,montblanc60:{version:1,started:today(),pace:'steady',days:{}}});
  S().mission60DayIndex=null;
 }
 async function pace(value){
  const p=get();if(!p||!['steady','gentle'].includes(value))return;
  await ctx.saveProfile({...S().profile,montblanc60:{...p,pace:value}});
 }
 async function toggle(id,date){
  const p=get();if(!p||date>today()||!/^\d{4}-\d{2}-\d{2}$/.test(date))return;
  const i=delta(p.started,date);
  if(i<0||i>=60||!tasks(i,p).some(t=>t.id===id))return;
  if(id==='diary'){S().reflectionDate=date;S().page='reflection';ctx.render();ctx.scrollTop();return}
  if(auto(id,date)){ctx.notify('Засчитано автоматически из дневника или плана');return}
  const old=p.days[date]||{},checked={...(old.checked||{})};
  checked[id]=!checked[id];
  await ctx.saveProfile({...S().profile,montblanc60:{...p,days:{...p.days,[date]:{...old,checked}}}});
 }
 function summaryRing(s){
  const p=s?.journey||0;
  return '<div class="m60-ring" role="img" aria-label="Выполнено '+p+' процентов программы" style="--p:'+p+'"><div><strong>'+p+'%</strong><small>к вершине</small></div></div>';
 }
 function section(k,title,link=''){return '<div class="m60-sectionhead"><div><span>'+k+'</span><h2>'+title+'</h2></div>'+link+'</div>'}
 function onboarding(){
  return '<section class="m60-card m60-start"><div class="m60-start-icon">🏔️</div><h2>Твой путь на 60 дней</h2><p>Английский, ежедневное движение, фокус на доходе, обучение, питание, семья и личный дневник. Пять основных практик и две дополнительные — без штрафов за пропуски.</p><div class="m60-tags"><b>60 дней</b><b>7 сфер</b><b>Свой темп</b></div>'+(S().local||S().demo?'<button class="m60-primary" data-action="m60-start">Начать экспедицию →</button>':'<p>Для сохранения открой приватный режим MONTBLANC на iPhone.</p>')+'</section>';
 }
 function checklist(i,p=get(),limit=12){
  const d=dateOf(i,p),future=d>today();
  return '<div class="m60-checklist">'+tasks(i,p).slice(0,limit).map(t=>{
   const flag=status(t.id,d,p),area=AREAS.find(a=>a.id===t.id),emoji=area?.emoji||'✈️';
   return '<div class="m60-check '+(flag.done?'is-done':'')+'"><button data-action="m60-toggle" data-id="'+t.id+'" data-date="'+d+'" '+(future?'disabled':'')+' aria-label="'+e(flag.done?'Отмечено: '+t.title:'Выполнить: '+t.title)+'" aria-pressed="'+flag.done+'">'+(flag.done?'✓':'')+'</button><div class="m60-checkcopy"><div><span>'+emoji+'</span><b>'+e(t.title)+'</b>'+(t.core?'':'<i>бонус</i>')+'</div><p>'+e(t.detail)+'</p><small>≈ '+t.minutes+' мин'+(flag.recorded?' · из дневника/плана':'')+'</small></div></div>'
  }).join('')+'</div>';
 }
 function home(){
  const p=get(),s=stats(p),date=today(),todayLog=log(date),elapsedDays=p?elapsed(p):0,current=p?Math.max(0,Math.min(59,elapsedDays-1)):0;
  const currentTasks=p?tasks(current,p):[],hits=p?currentTasks.filter(x=>status(x.id,date,p).done).length:0;
  const personal=S().data.tasks.filter(x=>x.task_date===date&&!['skipped','cancelled'].includes(x.status)),done=personal.filter(ctx.taskIsDone).length;
  const finances=ctx.monthIncome(),debt=ctx.currentDebt(),year=num(S().profile?.annual_income_goal)||15000;
  return '<div class="m60-page"><div class="m60-title"><span>'+e(ru(date))+' · MONTBLANC</span><h1>Сегодня</h1><p>Каждый маленький шаг имеет значение.</p></div>'+
   (p?'<section class="m60-card m60-highlight"><div class="m60-feature"><div><span>🏔️ ТВОЯ ЭКСПЕДИЦИЯ</span><h2>День '+(current+1)+' <small>из 60</small></h2><p>'+PHASES[Math.floor(current/12)][0]+' · '+hits+' из '+currentTasks.length+' практик сегодня</p></div>'+summaryRing(s)+'</div><div class="m60-track"><i style="width:'+Math.round(hits/currentTasks.length*100)+'%"></i></div><button class="m60-primary" data-page="mission60">Практики на сегодня →</button></section>':onboarding())+
   section('ПЛАН НА ДЕНЬ','Мои дела','<button data-page="tasks">Весь план ›</button>')+
   '<section class="m60-card"><div class="m60-planhead"><span>Задачи: '+done+'/'+personal.length+'</span><button data-action="new-task" data-date="'+date+'">+ Добавить</button></div>'+
   (personal.length?personal.slice(0,6).map(x=>planRow(x)).join(''):'<p class="m60-empty">Поставь один конкретный шаг на сегодня.</p>')+'<button data-page="tasks" class="m60-textbutton">План на неделю →</button></section>'+
   '<div class="m60-quickgrid"><button data-page="reflection" class="m60-quick lavender"><span>✍️</span><b>Дневник</b><small>'+(todayLog.reflection_done?'✓ Запись сохранена':'Мысли, энергия, достижения')+'</small></button><button data-page="progress" class="m60-quick green"><span>📊</span><b>Прогресс</b><small>'+(s?s.combinedDone:'0')+' выполненных действий</small></button></div>'+
   section('ПО ФАКТАМ','Мои показатели','<button data-page="progress">Подробнее ›</button>')+
   '<div class="m60-metrics"><button data-page="finance"><span>💶 Доход за месяц</span><strong>'+money(finances)+'</strong><small>Цель за год: '+money(year)+'</small></button><button data-page="finance"><span>💳 Долг</span><strong>'+money(debt)+'</strong><small>Фактический остаток</small></button><button data-page="reflection"><span>💙 Энергия</span><strong>'+(todayLog.evening_energy||'—')+'</strong><small>Оценка сегодня · /10</small></button><button data-page="mission60"><span>🏃 Практики</span><strong>'+(s?.done||0)+'</strong><small>За весь маршрут</small></button></div>'+
   section('ЕДИНАЯ СИСТЕМА','Важные направления')+'<div class="m60-linklist">'+
   [['goals','🎯','Цели и мечты','Финансы, тело, семья, путешествия'],['ideas-hub','💡','Идеи и проекты','Проверки, заметки, решения'],['route','🏔️','Маршрут А → Б','Большой жизненный путь'],['more','▦','Архив и инструменты','Всё сохранённое раньше']].map(([pg,emoji,title,sub])=>'<button data-page="'+pg+'"><span>'+emoji+'</span><div><b>'+title+'</b><small>'+sub+'</small></div><em>›</em></button>').join('')+'</div></div>';
 }
 function program(){
  const p=get();if(!p)return '<div class="m60-page"><div class="m60-title"><span>ТВОЙ ПУТЬ</span><h1>60 дней роста</h1><p>Действия вместо обещаний.</p></div>'+onboarding()+'<section class="m60-card"><h2>Пять этапов</h2>'+PHASES.map((x,i)=>'<div class="m60-phase-row"><strong>0'+(i+1)+'</strong><div><b>'+x[0]+'</b><p>'+x[1]+'</p></div><small>'+(i*12+1)+'–'+(i+1)*12+'</small></div>').join('')+'</section></div>';
  const s=stats(p),i=index(p),d=dateOf(i,p),ts=tasks(i,p),hits=ts.filter(t=>status(t.id,d,p).done).length,phase=Math.floor(i/12);
  const phaseSegments=PHASES.map((x,k)=>'<div class="'+(k===phase?'selected':'')+'"><b>'+(k+1)+'</b><small>'+x[0]+'</small></div>').join('');
  const calendar=Array.from({length:60},(_,k)=>{const date=dateOf(k,p),all=tasks(k,p),n=all.filter(t=>status(t.id,date,p).done).length;
   return '<button class="'+(k===i?'selected ':'')+(date>today()?'future ':'')+(n===all.length?'complete':'')+'" data-action="m60-day" data-index="'+k+'" aria-label="День '+(k+1)+': '+n+' из '+all.length+'"><b>'+(k+1)+'</b><span>'+(date>today()?'·':n===all.length?'✓':n||'·')+'</span></button>'}).join('');
  return '<div class="m60-page"><div class="m60-title"><span>🏔️ ТВОЯ ЭКСПЕДИЦИЯ</span><h1>60 дней роста</h1><p>Пять этапов к более собранной жизни.</p></div><section class="m60-card m60-highlight"><div class="m60-feature"><div><span>ЭТАП '+(phase+1)+' / 5</span><h2>'+PHASES[phase][0]+'</h2><p>'+PHASES[phase][1]+'</p></div>'+summaryRing(s)+'</div><div class="m60-track"><i style="width:'+s.journey+'%"></i></div><div class="m60-track-label"><span>'+s.done+' из '+s.total+' практик</span><b>'+s.journey+'% пути</b></div><div class="m60-phase-mini">'+phaseSegments+'</div></section>'+
  '<section class="m60-card"><div class="m60-dayhead"><div><span>ДЕНЬ '+(i+1)+' · '+e(ru(d))+'</span><h2>Мои практики</h2><p>'+(d>today()?'Будущий день: пока без отметок':ts.filter(x=>x.core&&status(x.id,d,p).done).length+' из 5 главных шагов')+'</p></div><strong>'+hits+'/'+ts.length+'</strong></div><div class="m60-daynav"><button data-action="m60-day" data-index="'+Math.max(0,i-1)+'" '+(i===0?'disabled':'')+' aria-label="Предыдущий день">‹</button><span>День '+(i+1)+'</span><button data-action="m60-day" data-index="'+Math.min(59,i+1)+'" '+(i===59?'disabled':'')+' aria-label="Следующий день">›</button><button data-action="m60-today">Сегодня</button></div>'+checklist(i,p)+
  '<div class="m60-pace"><div><b>Твой темп</b><small>Восстановление тоже часть развития</small></div><div><button data-action="m60-pace" data-value="gentle" class="'+(p.pace==='gentle'?'active':'')+'">Бережно</button><button data-action="m60-pace" data-value="steady" class="'+(p.pace==='steady'?'active':'')+'">Обычно</button></div></div><button data-action="m60-diary-day" data-date="'+d+'" class="m60-primary" '+(d>today()?'disabled':'')+'>Вечерний дневник этого дня →</button></section>'+
  section('НА КАЖДЫЙ ДЕНЬ','Карта 60 дней')+'<section class="m60-card"><div class="m60-daygrid">'+calendar+'</div></section>'+
  '<section class="m60-card"><h2>Факты программы</h2><div class="m60-summary"><div><b>'+s.done+'</b><small>Практик завершено</small></div><div><b>'+s.active+'</b><small>Активных дней</small></div><div><b>'+s.actual+'%</b><small>Выполнение на сегодня</small></div></div><button class="m60-textbutton" data-page="progress">Статистика и достижения →</button></section></div>';
 }
 function planRow(t){
  const done=ctx.taskIsDone(t),cat=ctx.taskLabel?.[t.category]||'Личное';
  return '<div class="m60-planrow"><button data-action="toggle-task" data-id="'+e(t.id)+'" aria-label="'+(done?'Вернуть задачу':'Отметить выполненной')+'" class="'+(done?'done':'')+'">'+(done?'✓':'')+'</button><div class="'+(done?'done':'')+'"><b>'+e(t.title)+'</b><small>'+e(cat)+(t.is_main?' · ★ главное':'')+(t.due_time?' · '+e(t.due_time):'')+'</small></div><button class="m60-ellipsis" data-action="edit-task" data-id="'+e(t.id)+'" aria-label="Изменить задачу">•••</button></div>';
 }
 function planner(){
  const scope=S().mission60Range||'week',now=today(),all=S().data.tasks.filter(t=>!['cancelled','skipped'].includes(t.status)),done=all.filter(ctx.taskIsDone).length;
  const overdue=all.filter(t=>t.task_date&&t.task_date<now&&!ctx.taskIsDone(t)).sort((a,b)=>String(a.task_date).localeCompare(String(b.task_date)));
  const dates=Array.from({length:scope==='month'?30:7},(_,i)=>plus(now,i));
  const groups=dates.map((date,i)=>{const list=all.filter(t=>t.task_date===date).sort((a,b)=>Number(ctx.taskIsDone(a))-Number(ctx.taskIsDone(b)));if(!list.length&&i>=7)return '';
    return '<section class="m60-card m60-plangroup"><div class="m60-planhead"><div><h2>'+(i===0?'Сегодня':i===1?'Завтра':e(ru(date)))+'</h2><small>'+list.filter(ctx.taskIsDone).length+' / '+list.length+' сделано</small></div><button data-action="new-task" data-date="'+date+'" aria-label="Добавить на '+date+'">+</button></div>'+(list.length?list.map(planRow).join(''):'<p class="m60-empty">Задач пока нет.</p>')+'</section>'}).join('');
  return '<div class="m60-page"><div class="m60-title"><span>ПЛАНИРОВЩИК</span><h1>Мой план</h1><p>Сегодня, завтра, неделя и месяц.</p></div><div class="m60-planbuttons"><button class="m60-primary" data-action="new-task" data-date="'+now+'">+ Добавить задачу</button><button data-page="mission60">Практики →</button></div><div class="m60-summary"><div><b>'+all.filter(t=>!ctx.taskIsDone(t)).length+'</b><small>Осталось</small></div><div><b>'+done+'</b><small>Выполнено</small></div><div><b>'+overdue.length+'</b><small>Нужны решения</small></div></div>'+
  '<div class="m60-segments"><button data-action="m60-scope" data-value="week" class="'+(scope==='week'?'active':'')+'">7 дней</button><button data-action="m60-scope" data-value="month" class="'+(scope==='month'?'active':'')+'">30 дней</button></div>'+
  (overdue.length?'<section class="m60-card"><h2>Ранее запланировано</h2>'+overdue.map(planRow).join('')+'</section>':'')+groups+
  '<section class="m60-card m60-tail"><button data-page="mission60">🏔️ Практики программы →</button><button data-page="ideas-hub">💡 Идеи и проекты →</button></section></div>';
 }
 function diaryRow(formData,old,finished){
  const text=(k,limit=2500)=>String(formData[k]||'').trim().slice(0,limit);
  const integer=(k,min,max)=>{const raw=formData[k];if(raw===undefined)return old[k]??null;if(String(raw).trim()==='')return null;const n=Number(raw);if(!Number.isFinite(n)||n<min||n>max)throw Error('Проверь поле: '+k);return n};
  return {...old,log_date:String(formData.log_date),thoughts:text('thoughts'),win_of_day:text('win_of_day'),blocked_why:text('blocked_why'),
   future_step:text('future_step'),today_learned:text('today_learned'),tomorrow_one:text('tomorrow_one'),
   m60_nutrition_note:text('m60_nutrition_note'),m60_family_note:text('m60_family_note'),m60_travel_note:text('m60_travel_note'),
   m60_nutrition_done:formData.m60_nutrition_done==='yes',
   evening_energy:integer('evening_energy',1,10),evening_mood:integer('evening_mood',1,5),
   english_min:integer('english_min',0,720),exercise_min:integer('exercise_min',0,720),focus_min:integer('focus_min',0,720),learning_min:integer('learning_min',0,720),
   family_min:integer('family_min',0,720),social_min:integer('social_min',0,720),sleep_hours:integer('sleep_hours',0,24),
   reflection_done:!!finished||!!old.reflection_done};
 }
 async function saveJournal(input,finished=false){
  const date=String(input.log_date||'');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||date>today())throw Error('Запись возможна только за сегодняшний или прошлый день');
  await ctx.saveRecord('daily_logs',diaryRow(input,log(date),finished));
 }
 async function saveDraft(force=false){
  const f=document.querySelector('form[data-form="mission-journal"]');
  if(!f||!f.isConnected||!S().local||!ctx.localKey())return;
  if(!force&&f.dataset.dirty!=='yes')return;
  const data=Object.fromEntries(new FormData(f).entries());
  await saveJournal(data,force);
  f.dataset.dirty='';
 }
 function field(k,label,value='',attr=''){
  return '<label class="m60-input"><span>'+label+'</span><input name="'+k+'" value="'+e(value??'')+'" '+attr+' /></label>'
 }
 function area(k,label,value='',placeholder=''){
  return '<label class="m60-input"><span>'+label+'</span><textarea name="'+k+'" rows="3" placeholder="'+e(placeholder)+'">'+e(value||'')+'</textarea></label>'
 }
 function diary(){
  const date=S().reflectionDate||today(),r=log(date),saved=!!r.reflection_done,all=S().data.daily_logs.filter(x=>x.reflection_done).length;
  const metrics=[['english_min','Английский, мин',r.english_min],['exercise_min','Движение, мин',r.exercise_min],['learning_min','Обучение, мин',r.learning_min],
   ['focus_min','Фокус, мин',r.focus_min],['family_min','Семья, мин',r.family_min],['social_min','Соцсети, мин',r.social_min],['sleep_hours','Сон, часы',r.sleep_hours]];
  return '<div class="m60-page"><div class="m60-title"><span>ЛИЧНЫЙ ДНЕВНИК · '+all+' ЗАПИСЕЙ</span><h1>Мой день</h1><p>Всё важное — в одной записи.</p></div>'+
   '<div class="m60-diarydate"><button data-action="reflection-date" data-value="'+plus(date,-1)+'" aria-label="Предыдущий день">‹</button><div><b>'+e(ru(date))+'</b><small>'+(saved?'✓ Итог сохранён':'Черновик или новая запись')+'</small></div><button data-action="reflection-date" data-value="'+plus(date,1)+'" '+(date>=today()?'disabled':'')+' aria-label="Следующий день">›</button><button data-action="reflection-date" data-value="'+today()+'">Сегодня</button></div>'+
   '<form data-form="mission-journal"><input type="hidden" name="log_date" value="'+date+'"/>'+
   '<section class="m60-card"><div class="m60-cardtitle"><span>💙</span><div><h2>Как я себя чувствовал?</h2><small>Наблюдение без оценки себя.</small></div></div><div class="m60-two">'+field('evening_energy','Энергия 1–10',r.evening_energy,'type="number" min="1" max="10" inputmode="numeric" placeholder="6"')+field('evening_mood','Настроение 1–5',r.evening_mood,'type="number" min="1" max="5" inputmode="numeric" placeholder="3"')+'</div>'+
   area('thoughts','Мысли и чувства',r.thoughts,'Что сейчас меня волнует?')+area('win_of_day','Маленькая победа',r.win_of_day,'Что сегодня удалось?')+area('blocked_why','Что не сделал и почему?',r.blocked_why,'Факты, а не обвинения.')+'</section>'+
   '<section class="m60-card"><div class="m60-cardtitle"><span>🎯</span><div><h2>Движение к моим целям</h2><small>Даже один реальный шаг.</small></div></div>'+area('future_step','Что сделал для своего будущего?',r.future_step,'Доход, развитие, спорт, семья…')+area('today_learned','Что нового узнал?',r.today_learned,'Одна полезная мысль.')+area('tomorrow_one','Одно важное дело на завтра',r.tomorrow_one,'Конкретный и посильный шаг.')+'</section>'+
   '<section class="m60-card"><div class="m60-cardtitle"><span>🥗</span><div><h2>Питание и жизнь</h2><small>Без жёстких ограничений и диет.</small></div></div><label class="m60-checklabel"><input type="checkbox" name="m60_nutrition_done" value="yes" '+(r.m60_nutrition_done?'checked':'')+'/><span>Сделал один подходящий осознанный выбор в питании</span></label>'+
   area('m60_nutrition_note','Питание и самочувствие',r.m60_nutrition_note,'Что подошло?')+area('m60_family_note','Семья и отношения',r.m60_family_note,'Тёплый момент или разговор.')+area('m60_travel_note','Путешествия и впечатления',r.m60_travel_note,'О какой поездке думаю?')+'</section>'+
   '<details class="m60-card m60-details" open><summary>📊 Время и привычки <small>Минуты и сон</small></summary><div class="m60-two">'+metrics.map(([key,label,value])=>field(key,label,value,'type="number" min="0" max="'+(key==='sleep_hours'?24:720)+'" '+(key==='sleep_hours'?'step=".25" inputmode="decimal"':'inputmode="numeric"')+' placeholder="0"')).join('')+'</div></details>'+
   '<button class="m60-primary m60-submit" type="submit">✓ Сохранить дневник за '+e(ru(date))+'</button><p class="m60-hint">При вводе данные сохраняются зашифрованным черновиком. Кнопка завершает итог дня.</p></form>'+
   '<div class="m60-linklist"><button data-page="feed"><span>📖</span><div><b>История моих дней</b><small>Все прошлые записи</small></div><em>›</em></button><button data-page="ideas-hub"><span>💡</span><div><b>Инкубатор идей</b><small>Записывай и проверяй гипотезы</small></div><em>›</em></button></div></div>';
 }
 function progress(){
  const p=get(),s=stats(p),range=p?p.started:plus(today(),-59),logs=S().data.daily_logs.filter(x=>x.log_date>=range&&x.log_date<=today());
  const sum=k=>logs.reduce((a,x)=>a+num(x[k]),0),sportDays=new Set(logs.filter(x=>num(x.exercise_min)>=10).map(x=>x.log_date));
  const m=ctx.monthIncome(),debt=ctx.currentDebt(),goal=num(S().profile?.annual_income_goal)||15000;
  const indicators=[
   ['✅','Личные выполненные задачи',S().data.tasks.filter(ctx.taskIsDone).length,'за всё время'],
   ['🗣️','Английский',Math.round(sum('english_min')/6)/10+' ч','в дневнике за маршрут'],
   ['🏃','Дни активности',sportDays.size,'по дневнику'],
   ['📚','Полезные знания',Math.round(sum('learning_min')/6)/10+' ч','за маршрут'],
   ['🎯','Работа в фокусе',Math.round(sum('focus_min')/6)/10+' ч','за маршрут'],
   ['❤️','Время с близкими',Math.round(sum('family_min')/6)/10+' ч','за маршрут'],
   ['✍️','Вечерние итоги',logs.filter(x=>x.reflection_done).length,'сохранено'],
   ['🥗','Питание',logs.filter(x=>x.m60_nutrition_done).length,'осознанных дней']
  ];
  const aw=awards(s),earned=aw.filter(x=>x.earned).length;
  return '<div class="m60-page"><div class="m60-title"><span>МОЙ РОСТ · ПО ФАКТАМ</span><h1>Прогресс</h1><p>Считаем действия отдельно от жизненных результатов.</p></div>'+
   '<section class="m60-card m60-highlight"><div class="m60-feature"><div><span>🏔️ ПУТЬ К ВЕРШИНЕ</span><h2>'+(s?s.combinedDone:S().data.tasks.filter(ctx.taskIsDone).length)+' выполненных действий</h2><p>'+(s?s.done+' практик и '+s.personalDone+' личных задач':'Здесь появятся выполненные шаги программы.')+'</p></div>'+summaryRing(s)+'</div>'+
   (s?'<div class="m60-track"><i style="width:'+s.journey+'%"></i></div><div class="m60-track-label"><span>'+s.done+' из '+s.total+' практик</span><b>'+s.journey+'%</b></div><p class="m60-hint">Из доступных за '+s.elapsed+' дней выполнено '+s.actual+'%. Будущие дни не считаются пропущенными.</p>':'<p>Начни программу на вкладке «60 дней».</p>')+'</section>'+
   section('НАПРАВЛЕНИЯ','По семи сферам')+'<section class="m60-card m60-domains">'+AREAS.map(a=>{const v=s?.areas[a.id]||{done:0,possible:0},pct=v.possible?Math.round(100*v.done/v.possible):0;
    return '<div><div><span>'+a.emoji+' '+a.name+'</span><b>'+v.done+'/'+v.possible+'</b></div><div class="m60-track"><i style="width:'+pct+'%;background:'+a.color+'"></i></div></div>'}).join('')+'</section>'+
   section('РЕАЛЬНЫЕ ЗАПИСИ','Твои показатели')+'<div class="m60-metrics">'+indicators.map(x=>'<div><span>'+x[0]+' '+x[1]+'</span><strong>'+x[2]+'</strong><small>'+x[3]+'</small></div>').join('')+'</div>'+
   section('ФИНАНСЫ','От нуля к устойчивости')+'<section class="m60-card m60-finances"><div><span>Доход за месяц</span><b>'+money(m)+'</b></div><div><span>Остаток долга</span><b>'+money(debt)+'</b></div><div><span>Годовая цель дохода</span><b>'+money(goal)+'</b></div><button data-page="finance" class="m60-textbutton">Доходы, расходы и резерв →</button><button data-page="goals" class="m60-textbutton">Мои измеримые цели →</button></section>'+
   (s?'<section class="m60-card"><h2>Путь по неделям</h2><div class="m60-weekbars">'+s.weeks.map((w,i)=>{const pct=w.possible?Math.round(w.done/w.possible*100):0;return '<div><div><i style="height:'+pct+'%"></i></div><b>'+(i+1)+'</b><small>'+(w.possible?pct+'%':'—')+'</small></div>'}).join('')+'</div></section>':'')+
   section('ПОДСКАЗКИ ПО ТВОИМ ЗАПИСЯМ','Что поможет двигаться дальше')+'<section class="m60-card m60-insights">'+recommendations(p,s).map(x=>'<div><span>✦</span><p>'+e(x)+'</p></div>').join('')+'<p class="m60-hint">Подсказки формируются локально по отметкам. Это не диагностика и не рекомендации врача.</p></section>'+
   section('НАГРАДЫ','Заслуженные достижения')+'<section class="m60-card"><div class="m60-awards"><div class="m60-award-count"><strong>'+earned+'</strong><small>из '+aw.length+' открыто</small></div>'+aw.map(x=>'<div class="'+(x.earned?'earned':'')+'"><span>'+x.emoji+'</span><b>'+x.title+'</b><small>'+(x.earned?'Открыто':'Впереди')+'</small></div>').join('')+'</div><p class="m60-hint">Пропущенный день не обнуляет ранее сделанное.</p></section>'+
   '<section class="m60-card m60-tail"><button data-page="review">🧠 Недельные выводы →</button><button data-page="route">🏔️ Мой маршрут А → Б →</button><button data-page="more">▦ Все инструменты и архив →</button></section></div>';
 }
 return {AREAS,PHASES,INCOME_STEPS,recommendations,get,elapsed,dateOf,index,tasks,auto,status,stats,awards,start,pace,toggle,
  journalRow:diaryRow,saveJournal,saveDraft,home,program,planner,diary,progress};
}
global.MONTBLANC60={create};
})(window);
