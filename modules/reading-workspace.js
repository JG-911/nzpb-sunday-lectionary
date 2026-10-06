// Presentation only: choosing a reading does not change observance preferences.
import {observanceNotice} from './observance-notice.js?v=83.4.8';
let undo=[];
let settingsOpen=false;
const choices=new Map();
export function resetReadingWorkspace(){
  for(const restore of undo.reverse())restore();
  undo=[];
  document.getElementById('reading-workspace')?.remove();
}
function move(node,destination){
  if(!node)return;
  const marker=document.createComment('reading workspace return');node.before(marker);
  destination.append(node);
  undo.push(()=>{marker.replaceWith(node);});
}
function property(node,key,value){const old=node[key];node[key]=value;undo.push(()=>{node[key]=old;});}
export function buildReadingWorkspace(day,date){
  const root=document.getElementById('readings');
  const workspace=document.createElement('div');workspace.id='reading-workspace';root.prepend(workspace);
  const settings=document.createElement('div');settings.className='reading-settings';settings.id='reading-settings-panel';settings.hidden=!settingsOpen;
  const settingsTitle=document.createElement('button');settingsTitle.type='button';settingsTitle.className='settings-toggle';settingsTitle.setAttribute('aria-label','Settings');settingsTitle.title='Settings';settingsTitle.setAttribute('aria-controls',settings.id);settingsTitle.setAttribute('aria-expanded','false');
  settingsTitle.setAttribute('aria-expanded',String(settingsOpen));
  settingsTitle.addEventListener('click',()=>{settingsOpen=!settingsOpen;settings.hidden=!settingsOpen;settingsTitle.setAttribute('aria-expanded',String(settingsOpen));});
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.7');
  const path=document.createElementNS(svg.namespaceURI,'path');
  // Simple six-tooth gear, drawn locally rather than relying on emoji fonts.
  path.setAttribute('d','M9.5 3h5l.5 2.5 2 1.2 2.4-.8 2.5 4.2-1.9 1.8v2.3l1.9 1.7-2.5 4.2-2.4-.8-2 1.2-.5 2.5h-5L9 20.5l-2-1.2-2.4.8-2.5-4.2L4 14.2v-2.3l-1.9-1.8L4.6 5.9l2.4.8 2-1.2Z');
  svg.setAttribute('viewBox','0 1 24 24');const circle=document.createElementNS(svg.namespaceURI,'circle');circle.setAttribute('cx','12');circle.setAttribute('cy','13');circle.setAttribute('r','3.2');svg.append(path,circle);settingsTitle.append(svg);workspace.append(settingsTitle,settings);
  move(document.querySelector('.reading-link-notice'),settings);
  move(document.getElementById('date-options'),settings);
  if(Number(date.slice(0,4))>2026){
    const verification=document.createElement('p');
    verification.textContent=`Dates for ${date.slice(0,4)} are calculated from the current transfer rules, pending confirmation against that year's official Lectionary.`;
    settings.append(verification);
  }
  const transfer=document.getElementById('transfer-choice');
  if(transfer&&!transfer.hidden)move(transfer,settings);
  const picker=document.createElement('nav');picker.className='reading-picker';picker.setAttribute('aria-label','Choose readings');
  const buttons=document.createElement('div');buttons.className='reading-name-buttons';picker.append(buttons);workspace.append(picker);
  const display=document.createElement('div');display.className='selected-reading';workspace.append(display);
  const entries=[];
  const context=document.getElementById('reading-content').parentElement;
  const fas=document.getElementById('fas-panel');
  const aside=document.getElementById('fas-set-aside');
  const cards=[...(aside||fas).querySelectorAll(':scope > .track-card')];
  const add=(id,label,node)=>{
    const panel=document.createElement('section');panel.className='reading-choice-panel';display.append(panel);move(node,panel);
    entries.push({id,label,panel});return panel;
  };
  const appendStatus=(panel,name,setAside=false,appointment=null)=>{
    const item=appointment||day.observances.find(o=>(o.lookupName||o.name)===name);
    const precedenceName=day.exact&&document.getElementById('te-pouhere-provision')?.hidden===false?'Te Pouhere Sunday':day.mainName;
    const notice=observanceNotice({name,mainName:precedenceName,setAside,item,date:new Date(date+'T12:00:00')});
    if(notice.short){
      const note=document.createElement('p');note.className='reading-observance-note';note.textContent=notice.short;panel.prepend(note);
      const subtitle=panel.querySelector('#sunday-subheading');
      if(subtitle&&/^(Transferred|Sunday observance selected)/.test(subtitle.textContent))property(subtitle,'hidden',true);
      if(!document.getElementById('original-date-transfers')?.textContent.includes(name)){
        const detail=document.createElement('p');detail.textContent=notice.detail;settings.append(detail);
      }
    }
  };
  // Move commemoration cards before the main context, so they cannot remain nested.
  const commemorationEntries=[];
  if(!day.mainServiceFirst && !cards.length){
    const empty=document.createElement('section');empty.append(fas.querySelector('.reading-heading').cloneNode(true));
    const panel=document.createElement('section');panel.className='reading-choice-panel';panel.append(empty);display.append(panel);
    commemorationEntries.push({id:'day',label:'Selected day — no commemorations',panel});
  }
  for(const card of cards){
    const row=day.visible.find(({row})=>row.id===card.dataset.fasId)?.row;
    const label=row?.title||card.querySelector('.fas-reading-title h3')?.textContent||fas.querySelector('h2')?.textContent||'Commemoration';
    const panel=add(card.dataset.fasId,label,card);
    appendStatus(panel,row?.sharedObservance||label,day.mainServiceFirst);
    if(!card.querySelector('.fas-reading-title'))panel.prepend(fas.querySelector('.reading-heading').cloneNode(true));
    property(card,'hidden',false);
    const excluded=card.classList.contains('draft-unselected');card.classList.remove('draft-unselected');undo.push(()=>card.classList.toggle('draft-unselected',excluded));
    commemorationEntries.push(entries.at(-1));
  }
  if(aside)property(aside,'hidden',true);
  property(fas,'hidden',true);
  const underlying=document.getElementById('underlying-sunday-provision');
  let underlyingEntry;
  if(day.exact&&underlying&&!underlying.hidden){
    const panel=add('underlying',document.getElementById('underlying-sunday-title').textContent,underlying);
    const details=underlying.querySelector(':scope > details');if(details){property(details,'open',true);property(details.querySelector('summary'),'hidden',true);}
    underlyingEntry=entries.at(-1);
  }
  // Te Pouhere has its own provision; Ordinary readings are a separate choice.
  const tePouhere=document.getElementById('te-pouhere-provision');
  const hasTePouhere=day.exact&&tePouhere&&!tePouhere.hidden;
  let ordinaryEntry;
  if(hasTePouhere){
    const heading=document.getElementById('ordinary-alternative-heading');
    const panel=add('ordinary',document.getElementById('ordinary-alternative-title').textContent,heading);
    move(document.getElementById('track-choice'),panel);
    move(document.getElementById('tracks'),panel);
    ordinaryEntry=entries.at(-1);
  }
  const specialEntries=[];
  if(day.exact)for(const [id,label]of [['easter-vigil','The Great Vigil of Easter'],['easter-late-service','Easter Day — later services']]){
    const node=document.getElementById(id);if(!node||node.hidden)continue;
    add(id,label,node);specialEntries.push(entries.at(-1));
    const details=node.tagName==='DETAILS'?node:node.querySelector(':scope > details');
    if(details){property(details,'open',true);property(details.querySelector('summary'),'hidden',true);}
  }
  let main;
  // The resolver also supplies nearby Sunday context on weekdays. It is not
  // an appointment for the selected date and must not become a reading choice.
  if(day.exact){
    add('main',hasTePouhere?'Te Pouhere Sunday':day.mainName,context);property(context,'open',true);property(context.querySelector(':scope > summary'),'hidden',true);
    main=entries.at(-1);
    appendStatus(main.panel,day.mainName,false,day.selection.result.observance);
  }else property(context,'hidden',true);
  const ordered=main?(day.mainServiceFirst?[main,...commemorationEntries]:[...commemorationEntries,main]):[...commemorationEntries];
  if(ordinaryEntry)ordered.splice(main?1:0,0,ordinaryEntry);
  ordered.push(...specialEntries);
  if(underlyingEntry)ordered.push(underlyingEntry);
  const notices=document.getElementById('original-date-transfers');
  if(notices)move(notices,settings);
  const stateKey=date+'|'+ordered.map(e=>e.id).join(',');
  const select=(entry)=>{
    choices.set(stateKey,entry.id);
    for(const e of ordered){e.panel.hidden=e!==entry;e.button.setAttribute('aria-pressed',String(e===entry));}
  };
  for(const entry of ordered){
    const button=document.createElement('button');button.type='button';button.textContent=entry.label;button.addEventListener('click',()=>select(entry));buttons.append(button);entry.button=button;
  }
  select(ordered.find(e=>e.id===choices.get(stateKey))||ordered[0]);
  if(ordered.length===1)picker.hidden=true;
}
