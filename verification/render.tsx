import { renderToString } from 'react-dom/server';
import React from 'react';

// Using relative path that will be bundled
import { KwilProgress } from '../src/app/components/kwil/KwilProgress';

const html = renderToString(
  <div style={{ backgroundColor: '#1a1a1a', padding: '20px', width: '400px' }}>
    <KwilProgress value={75} label="Progress Label" />
  </div>
);

console.log(`
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body { margin: 0; background: #000; display: flex; justify-content: center; align-items: center; height: 100vh; }
    </style>
  </head>
  <body>
    ${html}
  </body>
</html>
`);
