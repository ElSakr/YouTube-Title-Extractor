const fs = require('fs');
const path = require('path');

// Simple function to create a canvas and draw a YouTube-like icon
function createIcon(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);
  
  // Red play button shape
  ctx.fillStyle = '#FF0000';
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();
  
  // White play triangle
  ctx.fillStyle = '#FFFFFF';
  const triangleSize = radius * 0.7;
  ctx.beginPath();
  ctx.moveTo(centerX + triangleSize/2, centerY);
  ctx.lineTo(centerX - triangleSize/3, centerY - triangleSize/2);
  ctx.lineTo(centerX - triangleSize/3, centerY + triangleSize/2);
  ctx.closePath();
  ctx.fill();
  
  return canvas.toDataURL('image/png');
}

// Since we can't run this in Node directly (it uses browser APIs),
// I'll provide instructions on how to create icons manually
console.log(`
Since this script uses browser APIs, you'll need to create the icons manually:

1. Create 16x16, 48x48, and 128x128 PNG icons
2. Save them as:
   - images/icon16.png
   - images/icon48.png
   - images/icon128.png

You can use any image editor or online icon generator to create simple YouTube-themed icons.
`); 