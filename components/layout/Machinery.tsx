/** Line-art field equipment. It stays behind the page and never stops moving. */
export function Machinery() {
  return (
    <div className="field-machines" aria-hidden>
      <svg className="machine pump" viewBox="0 0 280 200">
        <path d="M18 176 H262" />
        <path d="M46 176 V158 H78 V176" />
        <path d="M148 176 V86" />
        <path d="M138 176 H158" />
        <g className="pump-beam">
          <path d="M36 86 H214" />
          <path d="M36 86 L22 108 H48 Z" />
          <circle cx="206" cy="96" r="14" />
          <circle cx="206" cy="96" r="4" />
        </g>
        <path className="pump-rod" d="M36 104 V168" />
        <path d="M28 168 H44" />
      </svg>

      <svg className="machine turbine" viewBox="0 0 140 260">
        <path d="M66 118 V248" />
        <path d="M48 248 H92" />
        <g className="blades">
          <path d="M70 112 V28" />
          <path d="M70 112 L124 150" />
          <path d="M70 112 L16 150" />
        </g>
        <circle cx="70" cy="112" r="5" />
      </svg>

      <svg className="machine turbine turbine-far" viewBox="0 0 140 260">
        <path d="M66 118 V248" />
        <path d="M48 248 H92" />
        <g className="blades blades-slow">
          <path d="M70 112 V28" />
          <path d="M70 112 L124 150" />
          <path d="M70 112 L16 150" />
        </g>
        <circle cx="70" cy="112" r="5" />
      </svg>
    </div>
  );
}
