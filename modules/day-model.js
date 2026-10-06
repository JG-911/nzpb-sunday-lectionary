import {LectionaryCore as core} from '../lectionary-core.js?v=83.4.9';
import {fasMatches,isUnselected,sundayFeastReadings} from './reading-data.js?v=83.4.9';
// Sole owner of selected-day main-versus-FAS layout decisions. No DOM or storage.
export function createDayModel(date,preferences={},direction='next',festivalOverride=null){
 const selection=core.resolveSelection(date,direction,preferences,festivalOverride);
 const observances=core.observancesOn(date,preferences);
 const sets=fasMatches(date,preferences,observances);
 const sunday=date.getDay()===0;
 const mainName=selection.result.name;
 const exact=core.sameDate(selection.displayDate,date);
 const visible=sets.filter(({row})=>!(exact&&row.sharedObservance===mainName));
 const appointedService=exact&&selection.result.available&&selection.result.observance&&!selection.result.observance.informational;
 const mainServiceFirst=sunday||Boolean(appointedService);
 return {selection,entry:core.findEntry(selection.result,sundayFeastReadings),observances,sets,sunday,mainName,exact,visible,mainServiceFirst,contextOnly:mainServiceFirst||sets.length===0,
  inactive:observances.filter(isUnselected),
  warnings:observances.filter(o=>!isUnselected(o)&&(o.collision||o.informational||(o.observedDate&&!core.sameDate(date,o.observedDate))))};
}
