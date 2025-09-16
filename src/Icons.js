const NODE_ICONS = {
  start: `    <svg
      viewBox="0 0 24 24"
      aria-label="Start node"
      role="img"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      width="24"
      height="24"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M10 9.5 L15 12 L10 14.5 Z" />
    </svg>`,
  dialogue: `    <svg
      viewBox="0 0 24 24"
      aria-label="Dialogue node"
      role="img"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      width="24"
      height="24"
    >
      <path d="M6 7.5h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H11l-3.5 3v-3H6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Z" />
      <path d="M9 11h6M9 13h4" />
    </svg>`,
  script: `<svg
      viewBox="0 0 24 24"
      aria-label="Script node"
      role="img"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      width="24"
      height="24"
    >
      <path d="M9 8l-4 4 4 4" />
      <path d="M15 8l4 4-4 4" />
      <path d="M13 6l-2 12" />
    </svg>`,
  branch: `<svg
      viewBox="0 0 24 24"
      aria-label="Branch node"
      role="img"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      width="24"
      height="24"
    >
      <circle cx="12" cy="6" r="2" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
      <path d="M12 8v3c0 2-1.5 3-3.5 3H7" />
      <path d="M12 11c0 2 1.5 3 3.5 3H17" />
    </svg>`,
};

const APP_ICONS = {
  Graph: ` <svg viewBox="0 0 24 24" aria-label="Node" role="img" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
  <circle cx="12" cy="5" r="2" />
  <circle cx="5" cy="19" r="2" />
  <circle cx="19" cy="19" r="2" />
  <path d="M12 7v6M7 18l5-5M17 18l-5-5" />
</svg>
`,
  Node: `<svg viewBox="0 0 24 24" aria-label="Single node" role="img"
  fill="none" stroke="currentColor" stroke-width="1.75"
  stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
  <path d="M12 3l7 4v10l-7 4-7-4V7z" />
  <path d="M12 3v18" />
  <path d="M19 7l-7 4-7-4" />
</svg>
`,
  Translation: `<svg viewBox="0 0 24 24" aria-label="Translations / Dictionary" role="img" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
  <path d="M3 5h7a4 4 0 0 1 4 4v10a2 2 0 0 0-2-2H3Z" />
  <path d="M21 5h-7a4 4 0 0 0-4 4v10a2 2 0 0 1 2-2h9Z" />
</svg>
`,
  Languages: `<svg viewBox="0 0 24 24" aria-label="Languages" role="img" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
  <circle cx="12" cy="12" r="9" />
  <path d="M3.5 9h17M3.5 15h17" />
  <path d="M12 3a17 17 0 0 1 0 18a17 17 0 0 1 0-18Z" />
</svg>
`,
  Trash: `<svg viewBox="0 0 24 24" aria-label="Trash" role="img" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
  <path d="M3 6h18" />
  <path d="M8 6V4h8v2" />
  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  <line x1="10" y1="11" x2="10" y2="17" />
  <line x1="14" y1="11" x2="14" y2="17" />
</svg>
`,
  Light: `<svg viewBox="0 0 24 24" aria-label="Dark mode" role="img" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
  <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
</svg>
`,
  Fit: `<svg viewBox="0 0 24 24" aria-label="Fit to view" role="img" fill="none"
  stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"
  width="24" height="24">
  <polyline points="3 9 3 3 9 3" />
  <polyline points="15 3 21 3 21 9" />
  <polyline points="21 15 21 21 15 21" />
  <polyline points="9 21 3 21 3 15" />
</svg>
`,
  Rearrange: `<svg viewBox="0 0 24 24" aria-label="Rearrange horizontally" role="img"
  fill="none" stroke="currentColor" stroke-width="1.75"
  stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
  <path d="M4 12h16" />
  <path d="M8 8l-4 4 4 4" />
  <path d="M16 8l4 4-4 4" />
</svg>
`,
  History: `<svg viewBox="0 0 24 24" aria-label="History" role="img"
  fill="none" stroke="currentColor" stroke-width="1.75"
  stroke-linecap="round" stroke-linejoin="round"
  width="24" height="24">
  <path d="M3 12a9 9 0 1 1 3 6.7" />
  <polyline points="3 3 3 8 8 8" />
  <path d="M12 7v
`,
};

export { NODE_ICONS, APP_ICONS };
