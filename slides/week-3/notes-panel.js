/**
 * Speaker notes panel — press N to toggle.
 *
 * Reads the same <script id="speaker-notes"> JSON that deck-stage uses.
 * Supports both flat string arrays and labeled objects ({slide, notes}).
 * Listens for the deck-stage "slidechange" CustomEvent to stay in sync.
 */
(function() {
  // Build the panel DOM
  var panel = document.createElement('div');
  panel.id = 'notes-panel';
  panel.style.cssText = [
    'display:none', 'position:fixed', 'bottom:0', 'left:0', 'right:0',
    'z-index:2147483645', 'max-height:30vh', 'overflow-y:auto',
    'background:rgba(28,26,25,0.92)',
    '-webkit-backdrop-filter:blur(12px)', 'backdrop-filter:blur(12px)',
    'color:#E8E4DC', 'padding:20px 32px',
    'font:16px/1.6 ui-sans-serif,system-ui,-apple-system,sans-serif',
    'border-top:2px solid rgba(197,5,12,0.6)'
  ].join(';');

  var header = document.createElement('div');
  header.style.cssText = 'display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px';

  var label = document.createElement('span');
  label.style.cssText = 'font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(197,5,12,0.8)';
  label.textContent = 'Speaker Notes';

  var hint = document.createElement('span');
  hint.style.cssText = 'font-size:11px;color:rgba(232,228,220,0.4)';
  hint.textContent = 'Press N to hide';

  header.appendChild(label);
  header.appendChild(hint);

  var text = document.createElement('div');
  text.style.whiteSpace = 'pre-wrap';

  panel.appendChild(header);
  panel.appendChild(text);
  document.body.appendChild(panel);

  // Parse notes
  var notesData = [];
  try {
    var raw = JSON.parse(document.getElementById('speaker-notes').textContent || '[]');
    if (Array.isArray(raw)) notesData = raw;
  } catch (e) {}

  function update(index) {
    var entry = notesData[index];
    if (!entry) { text.textContent = ''; label.textContent = 'Speaker Notes'; return; }
    text.textContent = typeof entry === 'string' ? entry : (entry.notes || '');
    label.textContent = entry.slide ? 'Speaker Notes — ' + entry.slide : 'Speaker Notes';
  }

  var visible = false;

  document.querySelector('deck-stage').addEventListener('slidechange', function(e) {
    update(e.detail.index);
  });

  window.addEventListener('keydown', function(e) {
    if (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'n' || e.key === 'N') {
      visible = !visible;
      panel.style.display = visible ? 'block' : 'none';
      e.preventDefault();
    }
    if (e.key === 'p' || e.key === 'P') {
      window.open('presenter.html', '_blank');
      e.preventDefault();
    }
  });

  update(0);
})();
