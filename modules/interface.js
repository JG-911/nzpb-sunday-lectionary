// Presentation only: never changes reading references, dates or preferences.
import {psalmNoun} from './psalm-labels.js?v=83.2.3';
let proper = '1';
let installed = false;
const selections = new Map();
// Display state only: never changes appointments, required readings or date choices.
function readingSelector(host, cards, label, key) {
  if (!host) return;
  host.querySelector(`:scope > [data-selector="${key}"]`)?.remove();
  if (cards.length < 2) return;
  const control = document.createElement('label');
  control.className = 'proper-selector compact-selector'; control.dataset.selector=key;
  control.append(`${label} `);
  const select=document.createElement('select'); select.setAttribute('aria-label',label);
  cards.forEach((card,index)=>select.add(new Option((card.querySelector('.fas-reading-title h3') || card.querySelector('header h3'))?.textContent || `Set ${index+1}`,String(index))));
  select.add(new Option('Show all','all')); control.append(select);
  const heading=host.querySelector(':scope > .reading-heading') || host.querySelector(':scope > summary');
  if(heading)heading.after(control);else host.prepend(control);
  if(key==='vigil') {
    const note=document.createElement('small');note.textContent='View both required groups; this selector does not make required readings optional.';
    control.append(note);
  }
  select.value=selections.get(key)||'0'; if(!select.value)select.value='0';
  const show=()=>{selections.set(key,select.value);cards.forEach((card,index)=>card.classList.toggle('draft-unselected',select.value!=='all'&&select.value!==String(index)));};
  select.addEventListener('change',show); show();
}
export function enhanceInterface(dateLabel) {
  const calendar = document.getElementById('calendar-disclosure');
  const readings = document.getElementById('readings');
  if (!installed) {
    installed = true;
    calendar.open = false;
    document.querySelector('.day-navigation').append(calendar);
    document.addEventListener('click', event => {
      if (!event.target.closest('.back-to-top')) return;
      document.getElementById('selected-date').focus({preventScroll:true});
      window.scrollTo({top:0,behavior:'instant'});
    });
  }
  document.getElementById('calendar-summary').textContent = 'Month Calendar';
  document.getElementById('calendar-summary').setAttribute('aria-label', `Calendar — ${dateLabel}`);
  for (const old of document.querySelectorAll('.track-card > .back-to-top')) old.remove();
  if (!readings.querySelector(':scope > .back-to-top')) {
    const back = document.createElement('button');
    back.type='button';back.className='back-to-top';back.textContent='Back to top ↑';
    readings.append(back);
  }
  const labels = {'Old Testament':'First Reading','First reading':'First Reading','New Testament':'Second Reading','Second reading':'Second Reading','Passion Gospel':'Gospel'};
  for (const dt of document.querySelectorAll('.track-card dt')) {
    const text = dt.firstChild;
    if (text?.nodeType === Node.TEXT_NODE && labels[text.textContent.trim()]) text.textContent = labels[text.textContent.trim()] + (dt.children.length ? ' ' : '');
    if(text?.nodeType===Node.TEXT_NODE && /^Psalm(?:s)?(?: \/ Canticle)?$/.test(text.textContent.trim())) {
      const value=dt.nextElementSibling?.textContent||'';
      if(/\bPsalm/i.test(value))text.textContent=psalmNoun(value);
    }
  }
  // One control for all three complete sets; keep each Proper's own actions.
  const host = document.getElementById('christmas-proper-links');
  if (!host.hidden) {
    let select = document.getElementById('christmas-proper-select');
    if (!select) {
      const label = document.createElement('label');
      label.className = 'proper-selector';
      label.textContent = 'Christmas readings ';
      select = document.createElement('select');
      select.id = 'christmas-proper-select';
      for (const value of ['1','2','3']) select.add(new Option(`Proper ${value}`,value));
      select.add(new Option('Show all','all'));
      label.append(select);host.prepend(label);
      select.addEventListener('change', () => {proper=select.value;showProper();});
    }
    select.value = proper;
    showProper();
  }
  readingSelector(document.querySelector('.palm-liturgy-grid'), [...document.querySelectorAll('.palm-liturgy-grid > .track-card')], 'Liturgy', 'palm');
  readingSelector(document.getElementById('vigil-readings'), [...document.querySelectorAll('#vigil-readings > .track-card')], 'Vigil readings', 'vigil');
  for(const id of ['fas-panel','fas-set-aside']) {
    const host=document.getElementById(id);
    readingSelector(host,[...(host?.querySelectorAll(':scope > .track-card')||[])],'Commemoration',id);
  }
  const late=document.getElementById('easter-late-service');
  const underlying=document.getElementById('underlying-sunday-provision');
  if(underlying) {
    let details=underlying.querySelector(':scope > details');
    if(!details) {
      details=document.createElement('details');const summary=document.createElement('summary');
      details.append(summary,...underlying.children);underlying.append(details);
    }
    const title=document.getElementById('underlying-sunday-title').textContent;
    details.querySelector('summary').textContent=`Underlying Sunday readings — ${title}`;
    const identity=`${dateLabel}|${title}`;
    if(details.dataset.day!==identity){details.open=underlying.closest('details')?.dataset.principalMovedAway==='true';details.dataset.day=identity;}
  }
  if(late&&!late.querySelector('details')) {
    const details=document.createElement('details'),summary=document.createElement('summary');
    summary.textContent='Easter Day — later services'; details.append(summary,...late.children);late.append(details);
  }
}
function showProper() {
  for (const card of document.querySelectorAll('[data-christmas-proper]')) card.hidden = proper !== 'all' && card.dataset.christmasProper !== proper;
}
