import { test, expect } from '@playwright/test';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { KwilChip } from './src/app/components/kwil/KwilChip';
import fs from 'fs';

const html = renderToString(
  <div style={{ padding: '50px', backgroundColor: '#0A1410' }}>
    <KwilChip
      onClick={() => {}}
      onRemove={() => {}}
    >
      Interactive Chip
    </KwilChip>
  </div>
);

const fullHtml = `
<!DOCTYPE html>
<html>
<head>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body style="background-color: #0A1410">
${html}
</body>
</html>
`;

fs.writeFileSync('/home/jules/verification/test.html', fullHtml);
