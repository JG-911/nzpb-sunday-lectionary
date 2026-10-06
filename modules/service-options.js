import {LectionaryCore as core} from '../lectionary-core.js?v=83.4.9';
export function trackYear(date) {
  const year=date.getFullYear();
  return date>=core.adventOne(year)?year:year-1;
}
export function annualTrack(choices,date) {
  return choices[trackYear(date)]==='related'?'related':'continuous';
}
export function palmService(data,procession,substitute=false) {
  const usePalms=!procession&&substitute;
  return {first:usePalms?data.palmsGospel:data.passionOt,
    psalm:usePalms?data.palmsPsalm:data.passionPsalm,
    nt:data.passionNt,gospel:data.passionGospel,
    title:usePalms?'Liturgy of the Passion — with Liturgy of the Palms readings':'Liturgy of the Passion'};
}
export const palmInstructions='With a procession: use the Liturgy of the Palms for the procession, followed by the full Liturgy of the Passion in the service. Without a procession: use the full Liturgy of the Passion, or use the readings from the Liturgy of the Palms in place of Isaiah and Psalm 31. Philippians and the Passion Gospel from the Liturgy of the Passion are included in either arrangement.';
