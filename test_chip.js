import React from 'react';
import { renderToString } from 'react-dom/server';
import { KwilChip } from './src/app/components/kwil/KwilChip';

const html = renderToString(
  <div style={{ padding: '20px', backgroundColor: '#050B08', display: 'flex', gap: '10px' }}>
    <KwilChip>Static Chip</KwilChip>
    <KwilChip onClick={() => {}} onRemove={() => {}}>Interactive Chip</KwilChip>
  </div>
);

console.log(html);
