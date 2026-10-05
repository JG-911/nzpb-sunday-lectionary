// Concise interface wording, not a quotation from the Lectionary.
export function observanceNotice({name,mainName,setAside,item,date}){
  const format=d=>d.toLocaleDateString('en-NZ',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).replace(/,/g,'');
  const observed=item?.observedDate||(item?.placement==='sunday'?item.assignedDate:null);
  const moved=item?.nominalDate&&observed&&item.nominalDate.toDateString()!==observed.toDateString();
  const reason=setAside?`Set aside: ${mainName} takes precedence.`:'';
  if(!moved)return {short:reason,detail:reason?`${name}: ${reason}`:''};
  const inactive=item.informational&&item.active===false;
  const short=inactive?`Alternative date: ${format(observed)}.`
    : date.toDateString()===observed.toDateString()?`Transferred from ${format(item.nominalDate)}.`
    : `Transferred to ${format(observed)}.`;
  const detail=`${name}: ${inactive?'Alternative provision':'Transferred'} from ${format(item.nominalDate)} to ${format(observed)}.${reason?' '+reason:''}`;
  return {short,detail};
}
