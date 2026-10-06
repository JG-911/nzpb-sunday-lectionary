// Existing keys deliberately retained for compatibility with deployed users' choices.
export const FESTIVAL_CHOICE_STORAGE_KEY='nzpb-lectionary-festival-choices-v1';
export const PRINCIPAL_CHOICE_STORAGE_KEY='nzpb-lectionary-principal-choices-v1';
export const TRACK_CHOICE_STORAGE_KEY='nzpb-lectionary-annual-track-v1';
export function loadTrackChoices(){return Object.fromEntries(Object.entries(read(TRACK_CHOICE_STORAGE_KEY)).filter(([key,value])=>/^\d{4}$/.test(key)&&['continuous','related'].includes(value)));}
function read(key){try{const value=JSON.parse(localStorage.getItem(key)||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}catch{return {};}}
export function loadFestivalChoices(){return read(FESTIVAL_CHOICE_STORAGE_KEY);}
export function loadPrincipalChoices(){return Object.fromEntries(Object.entries(read(PRINCIPAL_CHOICE_STORAGE_KEY)).filter(([key,value])=>/^(epiphany|presentation|allSaints)-\d{4}$/.test(key)&&['date','sunday'].includes(value)));}
export function saveChoices(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
