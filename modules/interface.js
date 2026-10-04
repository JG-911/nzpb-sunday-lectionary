// Presentation only: never changes reading references, dates or preferences.
let proper = '1';
let installed = false;
export function enhanceInterface(dateLabel) {
  const calendar = document.getElementById('calendar-disclosure');
  const readings = document.getElementById('readings');
  if (!installed) {
    installed = true;
    calendar.open = false;
    document.addEventListener('click', event => {
      if (!event.target.closest('.back-to-top')) return;
      document.getElementById('jump-readings').focus({preventScroll:true});
      window.scrollTo({top:0,behavior:'instant'});
    });
    document.getElementById('jump-readings').addEventListener('click', () => {
      readings.focus({preventScroll:true});
      readings.scrollIntoView({block:'start'});
    });
  }
  document.getElementById('calendar-summary').textContent = dateLabel;
  document.getElementById('calendar-summary').setAttribute('aria-label', `Calendar — ${dateLabel}`);
  for (const card of document.querySelectorAll('.track-card')) {
    if (card.querySelector(':scope > .back-to-top')) continue;
    const back = document.createElement('button');
    back.type='button';back.className='back-to-top';back.textContent='Back to top ↑';
    card.append(back);
  }
  const labels = {'Old Testament':'First Reading','First reading':'First Reading','New Testament':'Second Reading','Second reading':'Second Reading','Passion Gospel':'Gospel'};
  for (const dt of document.querySelectorAll('.track-card dt')) {
    const text = dt.firstChild;
    if (text?.nodeType === Node.TEXT_NODE && labels[text.textContent.trim()]) text.textContent = labels[text.textContent.trim()] + (dt.children.length ? ' ' : '');
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
      label.append(select);host.prepend(label);
      select.addEventListener('change', () => {proper=select.value;showProper();});
    }
    select.value = proper;
    showProper();
  }
}
function showProper() {
  for (const card of document.querySelectorAll('[data-christmas-proper]')) card.hidden = card.dataset.christmasProper !== proper;
}
