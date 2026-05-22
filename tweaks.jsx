// tweaks.jsx — CartyGo deck tweaks panel
// Modifies CSS custom properties on :root in response to user choices.

const PALETTES = [
  // [accent, accent-2, accent-bg, lime, lime-2]
  { id: 'lavender-lime', label: 'Lavender × Lime', stops: ['#C9B8FA','#A88CFF','#ECE4FA','#CFE96A','#B9D74C'] },
  { id: 'mint-cobalt',   label: 'Mint × Cobalt',   stops: ['#A7E3C8','#1F8A5B','#DDF1E5','#B8D8FF','#3D7BE0'] },
  { id: 'peach-ink',     label: 'Peach × Ink',     stops: ['#FFC9A8','#E07A47','#FBE3D1','#F1D88A','#C9A23A'] },
  { id: 'rose-sage',     label: 'Rose × Sage',     stops: ['#F4B6C7','#D4537C','#FBE2E9','#C7D9B4','#7BA060'] },
];

const FONT_CHOICES = [
  { id: 'archivo',  label: 'Archivo Black',  display: '"Archivo Black", system-ui, sans-serif', body: '"Manrope", system-ui, sans-serif' },
  { id: 'anton',    label: 'Anton',          display: '"Anton", system-ui, sans-serif',          body: '"Manrope", system-ui, sans-serif' },
  { id: 'bowlby',   label: 'Bowlby One',     display: '"Bowlby One", system-ui, sans-serif',     body: '"Plus Jakarta Sans", system-ui, sans-serif' },
  { id: 'instrserif', label: 'Instrument',   display: '"Instrument Serif", Georgia, serif',     body: '"Manrope", system-ui, sans-serif' },
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "paletteId": "lavender-lime",
  "fontId": "archivo"
}/*EDITMODE-END*/;

function applyTweaks(t) {
  const pal = PALETTES.find(p => p.id === t.paletteId) || PALETTES[0];
  const fnt = FONT_CHOICES.find(f => f.id === t.fontId) || FONT_CHOICES[0];
  const r = document.documentElement.style;
  r.setProperty('--accent',    pal.stops[0]);
  r.setProperty('--accent-2',  pal.stops[1]);
  r.setProperty('--accent-bg', pal.stops[2]);
  r.setProperty('--lime',      pal.stops[3]);
  r.setProperty('--lime-2',    pal.stops[4]);
  r.setProperty('--font-display', fnt.display);
  r.setProperty('--font-body',    fnt.body);
}

// Apply immediately on script load (before the panel mounts) so first paint is correct
applyTweaks(TWEAK_DEFAULTS);

function CartyGoTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => { applyTweaks(t); }, [t.paletteId, t.fontId]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Color Palette" />
      <TweakColor
        label="Accent"
        value={PALETTES.find(p => p.id === t.paletteId)?.stops.slice(0,3) || PALETTES[0].stops.slice(0,3)}
        options={PALETTES.map(p => p.stops.slice(0, 3))}
        onChange={(arr) => {
          const match = PALETTES.find(p => p.stops.slice(0,3).every((c,i) => c === arr[i]));
          if (match) setTweak('paletteId', match.id);
        }}
      />
      <div style={{ fontSize: 11, color: 'rgba(41,38,27,.5)', marginTop: -4 }}>
        {PALETTES.find(p => p.id === t.paletteId)?.label}
      </div>

      <TweakSection label="Display Font" />
      <TweakSelect
        label="Family"
        value={t.fontId}
        options={FONT_CHOICES.map(f => ({ value: f.id, label: f.label }))}
        onChange={(v) => setTweak('fontId', v)}
      />
      <div style={{
        fontFamily: FONT_CHOICES.find(f => f.id === t.fontId)?.display,
        fontSize: 38, lineHeight: 1, letterSpacing: '-0.02em',
        color: '#0E0E14', padding: '10px 12px',
        background: '#FAEFE0', border: '1px solid #1A1A22', borderRadius: 12,
        marginTop: 4,
      }}>
        CartyGo
      </div>
    </TweaksPanel>
  );
}

// Mount
const tweakMount = document.createElement('div');
document.body.appendChild(tweakMount);
ReactDOM.createRoot(tweakMount).render(<CartyGoTweaks />);
