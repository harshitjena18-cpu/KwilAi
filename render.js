import React from 'react';
import { renderToString } from 'react-dom/server';
import { KwilChip } from './src/app/components/kwil/KwilChip';

const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { background-color: #050B08; color: white; padding: 50px; font-family: sans-serif; }
    /* Mock tailwind classes used in KwilChip */
    .inline-flex { display: inline-flex; }
    .items-center { align-items: center; }
    .gap-2 { gap: 0.5rem; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .rounded-full { border-radius: 9999px; }
    .border { border-width: 1px; border-style: solid; }
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
    .duration-200 { transition-duration: 200ms; }
    .bg-\\[\\#00FF9C\\]\\/20 { background-color: rgba(0, 255, 156, 0.2); }
    .text-\\[\\#00FF9C\\] { color: #00FF9C; }
    .border-\\[\\#00FF9C\\]\\/40 { border-color: rgba(0, 255, 156, 0.4); }
    .hover\\:scale-105:hover { transform: scale(1.05); }
    .cursor-pointer { cursor: pointer; }
    .focus-visible\\:outline-none:focus-visible { outline: 2px solid transparent; outline-offset: 2px; }
    .focus-visible\\:ring-2:focus-visible { box-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); }
    .focus-visible\\:ring-\\[\\#00FF9C\\]:focus-visible { --tw-ring-color: #00FF9C; }
    .focus-visible\\:ring-offset-2:focus-visible { --tw-ring-offset-width: 2px; }
    .focus-visible\\:ring-offset-\\[\\#050B08\\]:focus-visible { --tw-ring-offset-color: #050B08; box-shadow: 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color), var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); }
    .ml-1 { margin-left: 0.25rem; }
    .text-current { color: currentColor; }
    .hover\\:opacity-70:hover { opacity: 0.7; }
    .focus-visible\\:ring-current:focus-visible { --tw-ring-color: currentColor; }
    .px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
  </style>
</head>
<body>
  <h2>Interactive Chip (Clickable)</h2>
  <div id="interactive">
    ${renderToString(React.createElement(KwilChip, { onClick: () => console.log('clicked'), onRemove: () => console.log('removed') }, 'Interactive Chip'))}
  </div>

  <h2 style="margin-top: 40px;">Static Chip (Not Clickable)</h2>
  <div id="static">
    ${renderToString(React.createElement(KwilChip, null, 'Static Chip'))}
  </div>
</body>
</html>
`;

console.log(html);
