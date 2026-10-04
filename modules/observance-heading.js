// Public date wording uses the existing resolver; no transfer rules are changed.
export function observanceHeading(entry,result,date,core) {
  const fallback=result.observance ? (result.subtitle || (entry.subheading!==result.name?entry.subheading:'')) : entry.subheading;
  if(entry.name==='The Annunciation of our Saviour to the Blessed Virgin Mary') {
    const nominal=new Date(date.getFullYear(),2,25,12);
    const observed=core.annunciationDate(date.getFullYear());
    return core.sameDate(nominal,observed)
      ? ''
      : `Transferred from ${core.formatLong(nominal)}; observed ${core.formatLong(observed)}.`;
  }
  const item=result.observance;
  if(item?.nominalDate) {
    const observed=item.observedDate || (item.placement==='sunday'?item.assignedDate:item.nominalDate);
    if(observed&&!core.sameDate(item.nominalDate,observed)) {
      return `${item.placement==='sunday'?'Sunday observance selected':'Transferred'}: ${core.formatLong(observed)}. Calendar date: ${core.formatLong(item.nominalDate)}.`;
    }
  }
  if(entry.name==='Ascension Day' || /^\d{1,2} [A-Z][a-z]+$/.test(fallback||''))return '';
  return fallback||'';
}
