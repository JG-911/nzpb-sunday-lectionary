// Presentation comparison only: retain verse letters and all source data.
export function normalisePsalm(value) {
  return String(value||'').toLowerCase().replace(/\bpsalms?\b/g,'').replace(/[–—]/g,'-').replace(/\s+/g,'').trim();
}
export function samePsalm(a,b) {
  return Boolean(a && b) && normalisePsalm(a)===normalisePsalm(b);
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
