// App shell + Tweaks panel

const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "vermillion",
  "lang": "ko"
}/*EDITMODE-END*/;

const ACCENTS = {
  vermillion: "oklch(0.62 0.22 25)",
  cobalt:     "oklch(0.55 0.2 250)",
  chartreuse: "oklch(0.78 0.2 130)",
  magenta:    "oklch(0.6 0.26 330)",
  canary:     "oklch(0.85 0.18 95)",
};

const ACCENT_SOFTS = {
  vermillion: "oklch(0.62 0.22 25 / 0.12)",
  cobalt:     "oklch(0.55 0.2 250 / 0.14)",
  chartreuse: "oklch(0.78 0.2 130 / 0.18)",
  magenta:    "oklch(0.6 0.26 330 / 0.14)",
  canary:     "oklch(0.85 0.18 95 / 0.22)",
};

const ON_ACCENTS = {
  vermillion: "#FFFFFF",
  cobalt:     "#FFFFFF",
  chartreuse: "#0A0A0A",
  magenta:    "#FFFFFF",
  canary:     "#0A0A0A",
};

const useReveal = () => {
  React.useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
};

const Nav = ({ t, onTweaksToggle }) => (
  <nav className="nav">
    <div className="nav-inner">
      <a className="logo" href="#top">
        <span className="logo-dot" />
        <span>ssullemon</span>
        <span className="logo-badge">BETA v0.3.1</span>
      </a>
      <div className="nav-links">
        <a href="#services">{t.navFeatures}</a>
        <a href="#testi">{t.navTesti || "후기"}</a>
        <a href="#final">{t.navDownload}</a>
      </div>
      <a href="#final" className="nav-cta">{t.navDownload} →</a>
    </div>
  </nav>
);

const Tweaks = ({ open, state, setState, t }) => {
  const apply = (patch) => {
    const next = { ...state, ...patch };
    setState(next);
    window.parent?.postMessage({ type: "__edit_mode_set_keys", edits: patch }, "*");
  };
  return (
    <div className={"tweaks " + (open ? "active" : "")}>
      <h5>
        <span>{t.tweaksTitle}</span>
        <span className="mono" style={{fontSize: 10, color: "var(--ink-50)"}}>v0.3.1</span>
      </h5>

      <div className="tweaks-row">
        <label>{t.tweaksMode}</label>
        <div className="seg">
          <button className={state.theme === "light" ? "on" : ""} onClick={() => apply({theme: "light"})}>{t.tweaksLight}</button>
          <button className={state.theme === "dark" ? "on" : ""} onClick={() => apply({theme: "dark"})}>{t.tweaksDark}</button>
        </div>
      </div>

      <div className="tweaks-row">
        <label>{t.tweaksAccent}</label>
        <div className="swatch-row">
          {Object.keys(ACCENTS).map(k => (
            <div key={k}
              className={"swatch " + (state.accent === k ? "on" : "")}
              style={{background: ACCENTS[k]}}
              onClick={() => apply({accent: k})}
              title={k} />
          ))}
        </div>
      </div>

      <div className="tweaks-row">
        <label>{t.tweaksLang}</label>
        <div className="seg">
          <button className={state.lang === "ko" ? "on" : ""} onClick={() => apply({lang: "ko"})}>한국어</button>
          <button className={state.lang === "en" ? "on" : ""} onClick={() => apply({lang: "en"})}>EN</button>
          <button className={state.lang === "ja" ? "on" : ""} onClick={() => apply({lang: "ja"})}>日本語</button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [state, setState] = React.useState(TWEAKS_DEFAULTS);
  const [tweaksOpen, setTweaksOpen] = React.useState(false);

  // edit-mode messaging
  React.useEffect(() => {
    const handler = (e) => {
      const d = e.data || {};
      if (d.type === "__activate_edit_mode") setTweaksOpen(true);
      if (d.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", handler);
    window.parent?.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  // apply theme + accent
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
    document.documentElement.style.setProperty("--accent", ACCENTS[state.accent]);
    document.documentElement.style.setProperty("--accent-soft", ACCENT_SOFTS[state.accent]);
    document.documentElement.style.setProperty("--on-accent", ON_ACCENTS[state.accent]);
  }, [state.theme, state.accent]);

  useReveal();

  const t = window.I18N[state.lang] || window.I18N.ko;

  return (
    <div id="top">
      <Nav t={t} />
      <Hero t={t} />
      <Ticker t={t} />
      <Problem t={t} />
      <Services t={t} />
      <Testimonials t={t} />
      <FinalCTA t={t} />
      <Footer t={t} />
      <Tweaks open={tweaksOpen} state={state} setState={setState} t={t} />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
