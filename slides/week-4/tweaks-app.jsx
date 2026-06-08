// tweaks-app.jsx — Tweaks panel for FEAST Week 1 deck

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#C5050C",
  "background": "bone",
  "showFooters": true
}/*EDITMODE-END*/;

const ACCENT_OPTIONS = ['#C5050C', '#2E4756', '#5C7A2E', '#B07700'];
const BG_OPTIONS = ['bone', 'white', 'cream'];
const BG_VALUES = { bone: '#F7F3EC', white: '#FFFFFF', cream: '#EFE7D6' };

function applyTweaks(t) {
  // Accent → recolor key uses of badger red on non-divider slides
  document.documentElement.style.setProperty('--badger-red', t.accent);
  // Background → swap deck-stage default page color
  const bg = BG_VALUES[t.background] || BG_VALUES.bone;
  document.documentElement.style.setProperty('--bone', bg);
  // Footers
  document.querySelectorAll('.deck-footer').forEach(el => {
    el.style.display = t.showFooters ? '' : 'none';
  });
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => { applyTweaks(t); }, [t]);
  return (
    <TweaksPanel>
      <TweakSection label="Theme" />
      <TweakColor label="Accent" value={t.accent} options={ACCENT_OPTIONS}
                  onChange={(v) => setTweak('accent', v)} />
      <TweakRadio label="Background" value={t.background} options={BG_OPTIONS}
                  onChange={(v) => setTweak('background', v)} />
      <TweakSection label="Chrome" />
      <TweakToggle label="Slide footers" value={t.showFooters}
                   onChange={(v) => setTweak('showFooters', v)} />
    </TweaksPanel>
  );
}

const root = ReactDOM.createRoot(document.getElementById('tweaks-root'));
root.render(<App />);
