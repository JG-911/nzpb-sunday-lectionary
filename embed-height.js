// Send only content height to the embedding page; never send user preferences.
(() => {
  if (window.parent === window) return;
  const shell = document.querySelector('.app-shell');
  if (!shell) return;
  let lastHeight = 0;
  let queued = false;
  function reportHeight() {
    queued = false;
    const height = Math.ceil(shell.getBoundingClientRect().height);
    if (height <= 0 || height === lastHeight) return;
    lastHeight = height;
    window.parent.postMessage({ type: 'nzpb-lectionary-height', height }, '*');
  }
  function scheduleHeight() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(reportHeight);
  }
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(scheduleHeight).observe(shell);
  else new MutationObserver(scheduleHeight).observe(shell, { subtree: true, childList: true, attributes: true, characterData: true });
  window.addEventListener('resize', scheduleHeight);
  window.addEventListener('load', scheduleHeight);
  document.fonts?.ready.then(scheduleHeight);
  scheduleHeight();
})();
