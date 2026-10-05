import {LectionaryCore as core} from './lectionary-core.js?v=83.4.3';
import {samePsalm, psalmNoun} from './modules/psalm-labels.js?v=83.4.3';
import {fasRows as rows, fasMatches as matches, findSharedReading} from './modules/reading-data.js?v=83.4.3';
const el = (tag, text, cls) => { const node = document.createElement(tag); if (text) node.textContent = text; if (cls) node.className = cls; return node; };
let panel, context, bibleNotice, dayNotes, dateOptions;
function install() {
  if(panel)return;
  bibleNotice=document.querySelector('.reading-link-notice');
  const parent=document.querySelector('.reading-panel');
  context=el('details',null,'easter-vigil');
  context.append(el('summary','Sunday and feast readings'));
  for(const node of [...parent.children])context.append(node);
  panel=el('section');panel.id='fas-panel';parent.append(panel,context);
  dayNotes=el('details',null,'easter-vigil');dayNotes.id='day-notes';
  dayNotes.append(el('summary','About this day — information available'),document.getElementById('notice'));
  // Keep date preferences reachable independently of the archived public notes.
  dateOptions=el('details',null,'calendar-card');dateOptions.id='date-options';
  dateOptions.append(el('summary','Date options'),document.getElementById('saint-date-choice'));
  document.querySelector('.date-panel').append(dateOptions);
  const legend=document.querySelector('.calendar-legend');legend.append(el('span',null,'legend-fas'),' Commemoration');
}
function addField(dl,label,value,linkReading,linkReference=value) {
  if(!value)return;
  const div=el('div'),dd=el('dd');if(linkReading){linkReading(dd,linkReference);if(linkReference!==value){if(dd.querySelector('.reading-text'))dd.querySelector('.reading-text').textContent=value;if(dd.querySelector('.primary-reading-link'))dd.querySelector('.primary-reading-link').textContent=value;}}else dd.textContent=value;div.append(el('dt',label),dd);dl.append(div);
}
// One order for weekday headings and every Sunday/multiple-commemoration card.
function appendCommemorationHeading(container, date, name, role, level) {
  container.append(el('div',core.formatLong(date),'resolved-date'),el(level,name));
  if(role)container.append(el('p',role,'sunday-subheading'));
}
function renderFeastPicker(date, preferences, selectDate) {
  const startYear=core.liturgicalStartYearForDate(date);
  const appointments=[...core.festivalSchedule(startYear,preferences),...core.festivalSchedule(startYear+1,preferences)]
    .filter(item=>item.liturgicalStartYear===startYear&&item.alternateDates.length>0&&item.active)
    .sort((a,b)=>a.name.localeCompare(b.name));
  let finder=document.getElementById('feast-date-finder');
  if(!finder){
    finder=el('details',null,'calendar-card');finder.id='feast-date-finder';
    finder.append(el('summary','Choose feast dates'));
    document.querySelector('.date-panel').append(finder);
  }
  finder.querySelector('.feast-date-options')?.remove();
  const content=el('div',null,'feast-date-options');
  content.append(el('p',`Lectionary year ${startYear}–${startYear+1} (Advent to Advent)`));
  const select=el('select');select.id='feast-date-jump';select.setAttribute('aria-label','Choose feast dates');
  select.append(new Option('Select a feast…',''));
  for(const item of appointments){
    const status=item.choice==='official'?'Official selected':item.choice==='alternative'?'Alternative selected':'Not confirmed';
    select.append(new Option(`${item.name} — ${status}`,item.choiceKey));
  }
  select.addEventListener('change',()=>{
    const item=appointments.find(item=>item.choiceKey===select.value);if(!item)return;
    selectDate(item.observed);
    const controls=document.getElementById('saint-date-choice');
    for(let ancestor=controls.parentElement;ancestor;ancestor=ancestor.parentElement)if(ancestor.tagName==='DETAILS')ancestor.open=true;
    controls.setAttribute('tabindex','-1');controls.focus({preventScroll:true});controls.scrollIntoView({block:'nearest'});
  });
  content.append(select,el('p','Jump to a feast, then confirm Official or Alternative. Browsing does not change your choice.'));
  finder.append(content);
}
export function renderFas(date, preferences, selectDate, linkReading, createSetActions, day) {
  install();
  // Preserve live controls before rebuilding weekday FAS content.
  dayNotes.remove();dayNotes.open=false;
  dayNotes.querySelectorAll('[data-day-note]').forEach(node=>node.remove());
  bibleNotice.remove();
  document.getElementById('fas-set-aside')?.remove();
  document.getElementById('fas-set-aside-notice')?.remove();
  document.getElementById('selected-date-notes')?.remove();
  document.getElementById('original-date-transfers')?.remove();
  panel.replaceChildren();
  const sets=day.sets;
  const names=[...new Set(sets.map(({row})=>row.title+(row.commemorationYear?' — '+row.commemorationYear:'')))];
  const heading=el('div',null,'reading-heading'),titles=el('div');
  const descriptions=[...new Set(sets.map(({row})=>row.subtitle).filter(Boolean))];
  if(names.length>1){
    titles.append(el('div',core.formatLong(date),'resolved-date'),el('h2','Commemorations'));
    const list=el('ul',null,'commemoration-names');
    for(const name of names)list.append(el('li',name));
    titles.append(list);
  }else if(sets.length){
    appendCommemorationHeading(titles,date,names.join('; '),descriptions.join('; '),'h2');
  }else{
    titles.append(el('div',core.formatLong(date),'resolved-date'));
    if(!day.mainServiceFirst && !day.inactive.length)titles.append(el('p','No commemorations today.','no-commemorations'));
  }
  heading.append(titles);panel.append(heading);
  const movedFromToday=day.observances.filter(item=>item.nominalDate&&item.observedDate&&core.sameDate(item.nominalDate,date)&&!core.sameDate(item.observedDate,date)&&item.active!==false&&!day.inactive.includes(item));
  if(movedFromToday.length) {
    const transfers=el('div',null,'set-aside-notice');transfers.id='original-date-transfers';
    for(const item of movedFromToday) {
      const reason=item.collision?.kind==='protected-period'
        ? 'This date falls within the Easter transfer period; the feast is kept after the Second Sunday of Easter.'
        : item.collision?.blockedBy ? `${item.collision.blockedBy} takes precedence on this date.` : '';
      transfers.append(el('p',`${item.name} is transferred to ${core.formatLong(item.observedDate)}. ${reason}`.trim()));
      const button=el('button',`View ${core.formatLong(item.observedDate)} readings`);button.type='button';
      button.addEventListener('click',()=>selectDate(item.observedDate,{festivalName:item.lookupName||item.name}));transfers.append(button);
    }
    if(day.mainServiceFirst)context.querySelector('.reading-heading').after(transfers);
    else titles.append(transfers);
  }
  const jump=el('select');jump.id='fas-jump';jump.setAttribute('aria-label','Find a FAS commemoration');
  jump.append(new Option('Find a commemoration in this year…',''));
  const listed=new Set();
  for(const row of rows){const identity=row.sharedObservance||row.id;if(listed.has(identity))continue;listed.add(identity);const sameName=rows.some(other=>other.id!==row.id&&other.title===row.title);const description=sameName&&row.subtitle?', '+row.subtitle:'';jump.append(new Option(row.md+' — '+row.title+description+(row.commemorationYear?' ('+row.commemorationYear+')':''),row.id));}
  jump.addEventListener('change',()=>{const row=rows.find(r=>r.id===jump.value);const year=Number(document.getElementById('year-select').value);if(row&&Number.isInteger(year)&&year>=1600&&year<=4099)selectDate(core.parseISO(year+'-'+row.md));});
  let finder=document.getElementById('fas-finder');
  if(!finder){finder=el('details',null,'calendar-card');finder.id='fas-finder';finder.append(el('summary','Find a commemoration'));document.querySelector('.date-panel').append(finder);}
  finder.querySelector('select')?.remove();finder.append(jump);
  renderFeastPicker(date,preferences,selectDate);
  const {observances,warnings,sunday,selection,mainName,exact,visible,mainServiceFirst,contextOnly,inactive}=day;
  if(contextOnly)document.getElementById('reading-content').prepend(bibleNotice);
  else panel.append(bibleNotice);
  panel.hidden=mainServiceFirst;
  const principalMovedAway=observances.some(item=>item.placement==='sunday'&&item.nominalDate&&item.assignedDate&&core.sameDate(item.nominalDate,date)&&!core.sameDate(item.assignedDate,date));
  context.open=mainServiceFirst||principalMovedAway;
  context.dataset.principalMovedAway=String(principalMovedAway);
  context.querySelector('summary').hidden=mainServiceFirst;
  context.querySelector('summary').textContent=`${exact?'Sunday / feast provision':'Sunday readings'} — ${mainName} · ${core.formatLong(selection.displayDate)}`;
  if(mainServiceFirst)panel.parentElement.prepend(context);
  else panel.parentElement.append(context);
  if(inactive.length){
    const notices=el('section');notices.id='selected-date-notes';
    for(const item of inactive){
      const chosen=item.authorisedDates.find(option=>option.active);
      const note=el('p',`${item.name}: ${item.choice==='alternative'?'authorised alternative':'official-date provision'} selected for ${core.formatLong(chosen.observed)}. Its readings are hidden here for this lectionary year. `,'notice');
      const button=el('button','View selected date');button.type='button';button.className='saint-date-link';
      button.addEventListener('click',()=>selectDate(chosen.observed));note.append(button);notices.append(note);
    }
    panel.parentElement.prepend(notices);
  }
  const dateControls=document.getElementById('saint-date-choice');
  const mainNotice=dayNotes.querySelector('#notice');
  for(const o of warnings){
    if(!dateControls.hidden&&dateControls.dataset.feastName===o.name)continue;
    const text=o.name+': '+(o.note||'Check the existing calendar provision.');
    if(!mainNotice.hidden&&mainNotice.textContent.includes(o.note||text))continue;
    const note=el('p',text,'notice');note.dataset.dayNote='';dayNotes.append(note);
  }
  let cards=panel;
  if(mainServiceFirst&&visible.length){
    const labels=[...new Map(visible.map(({row})=>{
      const name=row.sharedObservance||row.title;
      const appointment=observances.find(o=>o.name===name&&o.observedDate&&!core.sameDate(date,o.observedDate));
      const destination=appointment ? ` — ${appointment.informational&&appointment.active===false?'alternative provision on':'transferred to'} ${core.formatLong(appointment.observedDate)}` : '';
      return [name,name+destination];
    })).values()];
    // One disclosure replaces the duplicate notice and distant jump target.
    const aside=el('details',null,'easter-vigil');aside.id='fas-set-aside';aside.append(el('summary','Set aside — '+labels.join('; ')));
    context.querySelector('.reading-heading').after(aside);cards=aside;
    // The summary already names these transfers; expand it for reasons and links.
    const transfers=document.getElementById('original-date-transfers');
    if(transfers && movedFromToday.every(item=>visible.some(({row})=>(row.sharedObservance||row.title)===item.name)))aside.append(transfers);
  }
  const seen=new Set();
  for(const {row} of visible){
    const identity=row.sharedObservance||row.id;if(seen.has(identity))continue;seen.add(identity);
    const canonical=row.sharedObservance?findSharedReading(row.sharedObservance,selection.result.context.cycle):null;
    const card=el('article',null,'track-card continuous-card');card.dataset.fasId=row.id;
    const psalm=canonical?.psalm||row.biblePsalmLinkReference||row.biblePsalm;
    const actions=psalm==='Not yet verified'
      ? el('p','Complete-set link needs Psalm numbering confirmation.','partial-verse-note')
      : createSetActions([canonical?.ot||row.reading1LinkReference||row.reading1,psalm,canonical?.nt||row.reading2,canonical?.gospel||row.gospel].filter(Boolean),'all readings');
    actions.classList.add('fas-set-actions');
    const readingHeader=el('header');readingHeader.append(el('h3','Readings'),actions);card.append(readingHeader);
    if(row.reading1LinkNote&&!canonical)actions.append(el('span',row.reading1LinkNote,'reading-set-warning'));
    if(mainServiceFirst||visible.length>1){
      const heading=el('div',null,'fas-reading-title');
      const name=row.title+(row.commemorationYear?' — '+row.commemorationYear:'')+(row.set?' — '+row.set:'');
      appendCommemorationHeading(heading,date,name,row.subtitle,'h3');
      card.append(heading);
    }
    const dl=el('dl');
    addField(dl,'First reading',canonical?.ot||row.reading1,linkReading,canonical?.ot||row.reading1LinkReference||row.reading1);
    if(row.reading1LinkNote&&!canonical)dl.lastElementChild.querySelector('dd').append(el('span',row.reading1LinkNote,'partial-verse-note'));
    const matchingPsalm = !canonical && samePsalm(row.ps,row.biblePsalm);
    if(!canonical && !matchingPsalm && row.ps && row.biblePsalm && row.biblePsalm!=='Not yet verified' && !row.biblePsalmLinkReference) {
      addField(dl,psalmNoun(row.ps),`NZPB: ${row.ps}\nBible: ${row.biblePsalm}`,linkReading);
    } else {
    addField(dl,canonical||matchingPsalm?psalmNoun(canonical?.psalm||row.ps):`NZPB ${psalmNoun(row.ps)}`,canonical?.psalm||row.ps,canonical||matchingPsalm?linkReading:null,canonical?.psalm||row.biblePsalmLinkReference||row.ps);
    if(!canonical&&!matchingPsalm)addField(dl,`Bible ${psalmNoun(row.biblePsalm)}`,row.biblePsalm,row.biblePsalm==='Not yet verified'?null:linkReading,row.biblePsalmLinkReference||row.biblePsalm);
    }
    addField(dl,'Second reading',canonical?.nt||row.reading2,linkReading);
    addField(dl,'Gospel',canonical?.gospel||row.gospel,linkReading);
    card.append(dl);
    // Source evidence and reviewer decisions remain in data, not public cards.
    cards.append(card);
  }
  for(const button of document.querySelectorAll('[data-date]')){
    const d=core.parseISO(button.dataset.date),sets=matches(d,preferences,day.calendarObservances?.get(button.dataset.date));
    const fasOnly=sets.length>0&&d.getDay()!==0&&!button.classList.contains('observance')&&!sets.some(s=>s.row.sharedObservance);
    button.classList.toggle('fas-only',fasOnly);
    button.classList.toggle('resolved',core.sameDate(d,date));
    if(sets.length){button.classList.add('observance');const existing=JSON.parse(button.dataset.observanceNames||'[]');const names=[...new Set(sets.filter(s=>!existing.includes(s.row.sharedObservance||s.row.title)).map(s=>s.row.title))].join('; ');if(names){button.title+=(button.title?' · ':'')+'FAS: '+names;button.setAttribute('aria-label',button.getAttribute('aria-label')+'. FAS: '+names);}}
  }
  document.getElementById('date-adjustment').hidden=true;
  const selectedNotes=document.getElementById('selected-date-notes');
  if(selectedNotes){selectedNotes.dataset.dayNote='';dayNotes.append(selectedNotes);}
  const hasChoices=!dateControls.hidden;
  dayNotes.querySelector('summary').textContent=hasChoices
    ? `About this day — date choices for ${dateControls.dataset.feastName}`
    : selectedNotes ? 'About this day — a feast is selected for another date' : 'About this day — information available';
  // Temporarily withheld from the public interface; content retained for redesign.
  dayNotes.hidden=true;
  dateOptions.hidden=!hasChoices;
  dateOptions.querySelector('summary').textContent=hasChoices ? `Date options — ${dateControls.dataset.feastName}` : 'Date options';
  const headingHost=contextOnly?context:panel;
  headingHost.querySelector(':scope > .reading-heading').after(dayNotes);
  const url=new URL(location.href);url.searchParams.delete('fas-date');url.searchParams.set('date',core.formatISO(date));history.replaceState(null,'',url);
}
export function requestedFasDate(){const params=new URL(location.href).searchParams;const text=params.get('date')||params.get('fas-date');if(!/^\d{4}-\d{2}-\d{2}$/.test(text||''))return null;const d=core.parseISO(text);return d&&core.formatISO(d)===text&&d.getFullYear()>=1600&&d.getFullYear()<=4099?d:null;}
