import {LectionaryCore as core} from '../lectionary-core.js?v=83.4.10';
export const sundayFeastReadings=[...(window.SUNDAY_DATA||[]),...(window.FEAST_DATA||[]),...(window.SAINTS_DATA||[])];
const response=await fetch(new URL('../data/fas-readings.json?v=83.4.10',import.meta.url));
if(!response.ok)throw new Error('FAS data could not be loaded');
export const fasRows=(await response.json()).rows.filter(row=>!row.sourceOnly);
const byDate=new Map();
for(const row of fasRows)for(const md of [row.md,row.alternativeDate].filter(Boolean)){if(!byDate.has(md))byDate.set(md,[]);byDate.get(md).push(row);}
for(const [source,alternate]of [['05-14','02-24'],['05-31','07-02']]){const set=(byDate.get(source)||[]).filter(r=>/Matthias|Visitation/.test(r.title));byDate.set(alternate,[...(byDate.get(alternate)||[]),...set]);}
export function isUnselected(item){return ['official','alternative'].includes(item.choice)&&item.authorisedDates?.[item.optionIndex]?.active===false;}
export function fasMatches(date,preferences,observances=core.observancesOn(date,preferences)){
 const md=d=>core.formatISO(d).slice(5);
 const result=new Map((byDate.get(md(date))||[]).map(row=>[row.id,{row}]));
 for(const item of observances){
  if(!item.nominalDate||!item.observedDate||!core.sameDate(date,item.observedDate)||core.sameDate(item.nominalDate,item.observedDate))continue;
  const normal=s=>s.toLowerCase().replace(/[^a-z]/g,'').replace(/^the/,'');
  for(const row of byDate.get(md(item.nominalDate))||[]){const a=normal(row.title),b=normal(item.name);if(a.includes(b)||b.includes(a))result.set(row.id,{row});}
 }
 const hiddenNames=new Set(observances.filter(isUnselected).map(item=>item.lookupName||item.name));
 return [...result.values()].filter(({row})=>!hiddenNames.has(row.sharedObservance||row.title));
}
export function findSharedReading(name,cycle){return [...(window.FEAST_DATA||[]),...(window.SAINTS_DATA||[])].find(e=>e.name===name&&(e.year===cycle||e.year==='Years A, B, C'));}
