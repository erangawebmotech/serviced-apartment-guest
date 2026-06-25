process.env.SESSION_SECRET = 'a1b2c3d4e5f67890g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5'

process.env.URL_BACKEND = 'apartment-api.webmotech.com'
process.env.BEST_WEB_URL = 'ebadge.bestweb.lk'

import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  // @ts-expect-error: TextDecoder is not writable on global object in some environments
  global.TextDecoder = TextDecoder;
}
if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = class {
    observe() { }
    unobserve() { }
    disconnect() { }
  };
}


Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => ({
    fillRect: () => { },
    clearRect: () => { },
    getImageData: () => ({ data: [] }),
    putImageData: () => { },
    createImageData: () => [],
    setTransform: () => { },
    drawImage: () => { },
    beginPath: () => { },
    moveTo: () => { },
    lineTo: () => { },
    closePath: () => { },
    stroke: () => { },
    fill: () => { },
    measureText: () => ({ width: 0 }),
  }),
});
