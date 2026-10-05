// Presentation comparison only: retain verse letters and all source data.
export function normalisePsalm(value) {
  return String(value||'').toLowerCase().replace(/\bpsalms?\b/g,'').replace(/[–—]/g,'-').replace(/\s+/g,'').trim();
}
export function samePsalm(a,b) {
  return Boolean(a && b) && normalisePsalm(a)===normalisePsalm(b);
}
// Preserve the source alternative order; never move matching references first.
export function psalmNumberingOptions(value) {
  const lines=String(value).split(/\r?\n/);
  const parts=prefix=>(lines.find(line=>line.startsWith(prefix))?.slice(prefix.length)||'')
    .split(/\s+or\s+/i).filter(Boolean).map(part=>/^\d/.test(part.trim())?`Psalm ${part.trim()}`:part.trim());
  const bible=parts('Bible: '),nzpb=parts('NZPB: ');
  // Unequal lists are not safe to align by position. Retain both complete lists.
  if(bible.length!==nzpb.length)return [{bible:bible.join(' or '),nzpb:nzpb.join(' or '),shared:false}];
  return nzpb.map((reference,index)=>({nzpb:reference,bible:bible[index],shared:samePsalm(reference,bible[index])}));
}
export function psalmNoun(value) {
  const numbers=new Set();
  for(const match of String(value||'').matchAll(/Psalms?\s+(\d+)/gi))numbers.add(match[1]);
  for(const part of String(value||'').split(/\r?\n|;|\bor\b|\band\b/i)) {
    const text=part.replace(/^(?:Bible|NZPB):\s*/i,'').replace(/\bPsalms?\s*/gi,'').trim();
    if(!/^\d/.test(text))continue;
    if(text.includes(':'))numbers.add(text.match(/^\d+/)[0]);
    else for(const number of text.match(/\d+/g)||[])numbers.add(number);
  }
  return numbers.size>1?'Psalms':'Psalm';
}
