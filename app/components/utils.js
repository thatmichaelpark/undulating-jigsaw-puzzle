const formatTime = (timeInSeconds) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;
  const twoDigits = (a) => (a <= 9 ? '0' : '') + a;

  return `${hours}:${twoDigits(minutes)}:${twoDigits(seconds)}`;
};

// eslint-disable-next-line max-params
const hitTest = function(mx, my, piece, pieceContentSize) {
// mx, my: mouse coordinates
// piece.x, piece.y: piece center coordinates
// piece.rot: piece's rotation (0, 90, 180, or 270)
// Return true if (mx, my) hits the piece.
  const { x, y, rot } = piece;
  const dx = mx - x;
  const dy = my - y;
  let cx = pieceContentSize / 2;
  let cy = pieceContentSize / 2;

  switch (rot) {
    case 0:
      cx += dx;
      cy += dy;
      break;
    case 90:
      cx += dy;
      cy -= dx;
      break;
    case 180:
      cx -= dx;
      cy -= dy;
      break;
    default: // 270
      cx -= dy;
      cy += dx;
      break;
  }
  const left = 0;
  const right = pieceContentSize;
  const top = 0;
  const bottom = pieceContentSize;

  return left < cx && cx < right && top < cy && cy < bottom;
};

// eslint-disable-next-line max-params
const createWaveData = (nWaveData, nWaves, maxWaveDepth, maxFreq, maxV) => {
  const waveData = [];

  for (let i = 0; i <= nWaveData; ++i) {
    const waveDatum = [];
    let maxDepth = 0;

    for (let k = 0; k < nWaves; ++k) {
      const a = (Math.random() - 0.5);
      const freq = Math.random() * maxFreq;
      const v = (Math.random() - 0.5) * 2 * maxV;

      maxDepth += Math.abs(a);
      waveDatum.push({ a, freq, v });
    }
    for (let k = 0; k < nWaves; ++k) {
      waveDatum[k].a *= maxWaveDepth / maxDepth;
    }
    waveData.push(waveDatum);
  }

  return waveData;
};

// eslint-disable-next-line max-params
const generateWaves = (waveData, pieceSize, nPieces, time) => {
  const result = [];

  for (let i = 0; i < pieceSize * nPieces; ++i) {
    const theta = i * Math.PI * 2 / pieceSize;
    let sum = 0;

    for (let k = 0; k < waveData.length; ++k) {
      sum += waveData[k].a * Math.sin(waveData[k].freq * theta +
        waveData[k].v * time);
    }
    result.push(sum * Math.sin(theta / 2));
  }

  return result;
};

// eslint-disable-next-line max-params
const checkNeighbor = (puzzle, piece, drow, dcol) => {
// Checks piece's neighbor in array (offset by drow, dcol);
// if the piece and its neighbor are adjacent on screen then
// return neighbor, otherwise return null.
  const neighbor =
    puzzle.state.pieceDataArray[piece.row + drow][piece.col + dcol];

  if (piece.group === neighbor.group) { // neighbor is in same group?
    return null;
  }
  if (piece.rot !== neighbor.rot) { // different orientations?
    return null;
  }
  let x = piece.x;
  let y = piece.y;

  switch (piece.rot) {
    case 0:
      x += dcol * puzzle.pieceContentSize;
      y += drow * puzzle.pieceContentSize;
      break;
    case 90:
      x -= drow * puzzle.pieceContentSize;
      y += dcol * puzzle.pieceContentSize;
      break;
    case 180:
      x -= dcol * puzzle.pieceContentSize;
      y -= drow * puzzle.pieceContentSize;
      break;
    default: // 270
      x += drow * puzzle.pieceContentSize;
      y -= dcol * puzzle.pieceContentSize;
      break;
  }
  const dx = neighbor.x - x;
  const dy = neighbor.y - y;

  if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
    puzzle.moveGroup(piece.group, dx, dy);

    return neighbor;
  }

  return null;
};

const checkNeighbors = (puzzle, piece) => {
  const { row, col } = piece;
  let neighbor;

  if (row > 0) {
    if ((neighbor = checkNeighbor(puzzle, piece, -1, 0)) !== null) {
      return neighbor;
    }
  }
  if (row < puzzle.nRows - 1) {
    if ((neighbor = checkNeighbor(puzzle, piece, 1, 0)) !== null) {
      return neighbor;
    }
  }
  if (col > 0) {
    if ((neighbor = checkNeighbor(puzzle, piece, 0, -1)) !== null) {
      return neighbor;
    }
  }
  if (col < puzzle.nCols - 1) {
    if ((neighbor = checkNeighbor(puzzle, piece, 0, 1)) !== null) {
      return neighbor;
    }
  }

  return null;
};

const rotateGroupInit = function(puzzle, group) {
  const spd = puzzle.state.sortedPieceData.slice(); // copy

  group.forEach((piece) => {
    piece.x0 = piece.x;   // save original x, y, rot
    piece.y0 = piece.y;
    piece.rot0 = piece.rot;
  });
  puzzle.setState({ sortedPieceData: spd });
};
const rotateGroupStep = function(puzzle, group, angle) {
  // angle goes from 0 to 90 or -90
  const spd = puzzle.state.sortedPieceData.slice(); // copy
  const rads = angle * Math.PI / 180;
  const sin = Math.sin(rads);
  const cos = Math.cos(rads);

  group.forEach((piece) => {
    piece.rot = piece.rot0 + angle;
    const dx = piece.x0 - puzzle.mx0;
    const dy = piece.y0 - puzzle.my0;

    piece.x = puzzle.mx0 + cos * dx - sin * dy;
    piece.y = puzzle.my0 + sin * dx + cos * dy;
  });
  puzzle.setState({ sortedPieceData: spd });
};
const rotateGroupEnd = function(puzzle, group, angle) {
  // angle === 90 or -90
  const spd = puzzle.state.sortedPieceData.slice(); // copy

  group.forEach((piece) => {
    piece.rot = (piece.rot0 + angle + 360) % 360;
    const dx = piece.x0 - puzzle.mx0;
    const dy = piece.y0 - puzzle.my0;

    if (angle === 90) {
      piece.x = puzzle.mx0 - dy;
      piece.y = puzzle.my0 + dx;
    }
    else {
      piece.x = puzzle.mx0 + dy;
      piece.y = puzzle.my0 - dx;
    }
  });
  puzzle.setState({ sortedPieceData: spd });
};

exports.formatTime = formatTime;
exports.hitTest = hitTest;
exports.createWaveData = createWaveData;
exports.generateWaves = generateWaves;
exports.checkNeighbors = checkNeighbors;
exports.rotateGroupInit = rotateGroupInit;
exports.rotateGroupStep = rotateGroupStep;
exports.rotateGroupEnd = rotateGroupEnd;
