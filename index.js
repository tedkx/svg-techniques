import { random } from './node_modules/@georgedoescode/generative-utils/dist/esm/index.js';
import { SVG } from './node_modules/@svgdotjs/svg.js/src/main.js';
import './node_modules/tinycolor2/dist/tinycolor-min.js';
import { gsap } from './node_modules/gsap/all.js';
import * as blockDrawers from './blockDrawers.js';

const globals = {
  colors: null,
  squareSize: 100,
};

function getTwoColors(colors) {
  let foregroundIndex = random(0, colors.length - 1, true),
    backgroundIndex = foregroundIndex;
  while (backgroundIndex === foregroundIndex)
    backgroundIndex = random(0, colors.length - 1, true);

  return {
    foreground: colors[foregroundIndex],
    background: colors[backgroundIndex],
  };
}

function generateSquare(svg, i, j, palette) {
  const { squareSize } = globals;
  const point = { x: i * squareSize, y: j * squareSize };

  const blockDrawer = random(Object.values(blockDrawers));

  blockDrawer(svg, globals, point, getTwoColors(palette));

  //   // Create group element
  //   const group = svg.group().addClass('draw-block');

  //   // Draw Block
  //   group.rect(squareSize, squareSize).fill(background).move(x, y);
}

function generateGrid() {
  document.querySelector('.container').innerHTML = '';
  const { squareSize } = globals;
  const numRows = random(5, 9, true);
  const numCols = random(5, 9, true);

  const svg = SVG() // Create the SVG
    .addTo('.container')
    .size('100%', '100%')
    .viewbox(`0 0 ${numRows * squareSize} ${numCols * squareSize}`);

  const palette = random(globals.colors);

  for (let i = 0; i < numRows; i++)
    for (let j = 0; j < numCols; j++) generateSquare(svg, i, j, palette);

  // Set background color
  const bg = tinycolor
    .mix(palette[0], palette[1], 50)
    .desaturate(10)
    .toString();

  // Make Lighter version
  const bgInner = tinycolor(bg).lighten(10).toString();
  // And darker version
  const bgOuter = tinycolor(bg).darken(10).toString();

  // Set to CSS Custom Properties
  gsap.to('.container', {
    '--bg-inner': bgInner,
    '--bg-outer': bgOuter,
    duration: 0.5,
  });
}

await fetch('/node_modules/nice-color-palettes/100.json')
  .then(response => response.json())
  .then(colors => {
    globals.colors = colors;
    generateGrid();
    document
      .querySelector('.regenerate-button')
      .addEventListener('click', generateGrid);
  });
