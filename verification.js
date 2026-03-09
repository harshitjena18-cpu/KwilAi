import React from 'react';
import { renderToString } from 'react-dom/server';
import { KwilChip } from './src/app/components/kwil/KwilChip';
import fs from 'fs';

const html = renderToString(
  React.createElement('div', { style: { padding: '20px', backgroundColor: '#050B08', display: 'flex', gap: '10px' } },
    React.createElement(KwilChip, null, 'Static Chip'),
    React.createElement(KwilChip, { onClick: () => {}, onRemove: () => {} }, 'Interactive Chip')
  )
);

const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* Mimic some tailwind variants not supported by default CDN */
    .focus-visible\\:ring-2:focus-visible { box-shadow: 0 0 0 2px var(--tw-ring-color); }
    .focus-visible\\:ring-\\[\\#00FF9C\\]\\/50:focus-visible { --tw-ring-color: rgba(0, 255, 156, 0.5); }
    .focus-visible\\:ring-offset-2:focus-visible { box-shadow: 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color), 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); }
    .focus-visible\\:ring-offset-\\[\\#050B08\\]:focus-visible { --tw-ring-offset-color: #050B08; --tw-ring-offset-width: 2px; }
    .focus-visible\\:outline-none:focus-visible { outline: 2px solid transparent; outline-offset: 2px; }

    /* Simulate browser focus for screenshot */
    .simulated-focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
        box-shadow: 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color), 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
        --tw-ring-color: rgba(0, 255, 156, 0.5);
        --tw-ring-offset-color: #050B08;
        --tw-ring-offset-width: 2px;
    }
  </style>
</head>
<body style="background-color: #050B08; height: 100vh; display: flex; align-items: center; justify-content: center;">
  ${html}
  <script>
    // Add simulated focus class for screenshot purposes
    setTimeout(() => {
        const btn = document.querySelector('[role="button"]');
        if (btn) btn.classList.add('simulated-focus');
    }, 100);
  </script>
</body>
</html>
`;

fs.writeFileSync('/home/jules/verification/test.html', fullHtml);
