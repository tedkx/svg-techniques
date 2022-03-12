import { random } from './node_modules/@georgedoescode/generative-utils/dist/esm/index.js';

const innerCircleChance = 0.3;
const rotatedCrossChance = 0.4;
const selectedCharacters = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  // O removed for looking like a circle
  'P',
  // Q removed for an annoying descender
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '&',
];

function drawCircle(
  draw,
  { squareSize },
  { x, y },
  { foreground, background }
) {
  // Create group element
  const group = draw.group().addClass('draw-circle');

  // Draw Background
  group.rect(squareSize, squareSize).fill(background).move(x, y);

  // Draw Foreground
  group.circle(squareSize).fill(foreground).move(x, y);

  // 30% of the time add an inner circle
  if (Math.random() < innerCircleChance) {
    group
      .circle(squareSize / 2)
      .fill(background)
      .move(x + squareSize / 4, y + squareSize / 4);
  }
}

function drawOppositeCircles(
  draw,
  { squareSize },
  { x, y },
  { foreground, background }
) {
  const group = draw.group().addClass('opposite-circles');
  const circleGroup = draw.group();

  group.rect(squareSize, squareSize).fill(background).move(x, y);

  const mask = draw.rect(squareSize, squareSize).fill('#fff').move(x, y);

  // Choose one of these options
  const offset = random([
    [0, 0, squareSize, squareSize], // top left + bottom right
    [0, squareSize, squareSize, 0], // top right + bottom left
    [squareSize / 2, 0, squareSize / 2, squareSize], // top center, bottom center
    [0, squareSize / 2, squareSize, squareSize / 2], // center left, center right
  ]);

  // Use new offsets when placing circles
  circleGroup
    .circle(squareSize)
    .fill(foreground)
    .center(x + offset[0], y + offset[1]);

  circleGroup
    .circle(squareSize)
    .fill(foreground)
    .center(x + offset[2], y + offset[3]);

  circleGroup.maskWith(mask);
  group.add(circleGroup);
}

function drawDots(draw, { squareSize }, { x, y }, { foreground, background }) {
  const group = draw.group().addClass('dots');

  const sizeOptions = [2, 3, 4];
  const size = random(sizeOptions);

  const offset = 10;
  const circleSize = 10;
  const space = (squareSize - offset * 2 - circleSize) / (size - 1);

  // Draw Background
  group.rect(squareSize, squareSize).fill(background).move(x, y);

  // Draw Dots
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++)
      group
        .circle(circleSize)
        .fill(foreground)
        .move(x + offset + i * space, y + offset + j * space);
}

function drawCross(draw, { squareSize }, { x, y }, { foreground, background }) {
  const group = draw.group().addClass('draw-cross');
  const crossGroup = draw.group();
  // Draw Background
  group.rect(squareSize, squareSize).fill(background).move(x, y);

  // Draw Foreground
  crossGroup
    .rect(squareSize / 1.5, squareSize / 5)
    .fill(foreground)
    .center(x + squareSize / 2, y + squareSize / 2);

  crossGroup
    .rect(squareSize / 1.5, squareSize / 5)
    .fill(foreground)
    .center(x + squareSize / 2, y + squareSize / 2)
    .transform({ rotate: 90 });

  if (Math.random() < rotatedCrossChance)
    crossGroup.transform({ rotate: 45, origin: 'center center' });
}

function drawDiagonalSquare(
  draw,
  { squareSize },
  { x, y },
  { foreground, background }
) {
  const group = draw.group().addClass('diagonal-square');

  // Draw Background
  group.rect(squareSize, squareSize).fill(background).move(x, y);

  // Draw Foreground

  let polygon;
  if (Math.random() > 0.5) {
    polygon = group.polygon(
      `${x},${y} ${x},${y + squareSize}, ${x + squareSize},${y}`
    );
  } else {
    polygon = group.polygon(
      `${x},${y} ${x + squareSize},${y} ${x + squareSize},${y + squareSize}`
    );
  }

  polygon.fill(foreground);
}

function drawLetterBlock(
  draw,
  { squareSize },
  { x, y },
  { foreground, background }
) {
  const group = draw.group().addClass('half-square');
  const mask = draw.rect(squareSize, squareSize).fill('#fff').move(x, y);

  // Draw Background
  group.rect(squareSize, squareSize).fill(background).move(x, y);

  // Draw Foreground
  const character = random(selectedCharacters);
  const text = group.plain(character);
  text.font({
    family: 'Source Code Pro',
    size: squareSize * 1.2,
    weight: 800,
    anchor: 'middle',
    fill: foreground,
    leading: 1,
  });
  text.center(x + squareSize / 2, y + squareSize / 2);
  text.rotate(random([0, 90, 180, 270]));
  group.maskWith(mask);
}

function drawHalfSquare(
  draw,
  { squareSize },
  { x, y },
  { foreground, background }
) {
  const group = draw.group().addClass('half-square');

  let halfX = 2;
  let halfY = 2;
  if (random([0, 1])) halfX = 1;
  else halfY = 1;

  // Draw Background
  group.rect(squareSize, squareSize).fill(background).move(x, y);

  // Draw Foreground
  group
    .rect(squareSize / halfX, squareSize / halfY)
    .fill(foreground)
    .move(x, y);
}

export {
  drawCircle,
  drawCross,
  drawDiagonalSquare,
  drawDots,
  drawHalfSquare,
  drawLetterBlock,
  drawOppositeCircles,
};
