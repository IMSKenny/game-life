// Количество клеток по горизонтали и вертикали
const ROWS = 16;
const COLUMNS = 16;

const cellState = [];
const initialState = [];
const heart = [
  [5, 5],
  [5, 6],
  [5, 8],
  [5, 9],
  [6, 4],
  [6, 7],
  [6, 10],
  [7, 5],
  [7, 9],
  [8, 6],
  [8, 8],
  [9, 7],
];

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const stopBtn = document.getElementById("stop-btn");
const presetsBtn = document.getElementById("presets-btn");

let intervalId; // Идентификатор интервала для обновления игрового поля

window.onload = function() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

function resetState() {
  // Удаляем все классы из всех клеток
  for (let i = 0; i < ROWS * COLUMNS; i++) {
    const cell = gameField.children[i];
    cell.classList.remove("alive", "dead");
  }

  // Обнуляем состояние игры
  currentState = new Array(ROWS * COLUMNS).fill(false);
}

// Создание игрового поля с клетками
const gameField = document.getElementById("game-field");

for (let i = 0; i < ROWS * COLUMNS; i++) {
  gameField.innerHTML += '<div class="cell"></div>';
}

// Данные о начальном состоянии клеток
for (let row = 0; row < ROWS; row++) {
  initialState[row] = [];
  for (let col = 0; col < COLUMNS; col++) {
    initialState[row][col] = false;
    // console.log(initialState[row][col]);
    // console.log(`${row} + ${col}`);
  }
}

setTimeout(() => {
  //рисуем сердце
  for (let i = 0; i < ROWS - 4; i++) {
    initialState[heart[i][0]][heart[i][1]] = true;
    const cell = gameField.children[ROWS * heart[i][0] + heart[i][1]];
    cell.classList.toggle("alive");
  }
},4000);

function updateState() {
  // Создаем новый двумерный массив для хранения нового состояния клеток
  const newState = [];
  for (let i = 0; i < ROWS; i++) {
    newState.push(new Array(COLUMNS).fill(false));
  }
  // Проходим по каждой клетке на игровом поле
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const cell = getCell(row, col);
      const neighbors = getNeighbors(row, col);

      // Определяем новое состояние клетки на основе правил игры "Жизнь"
      if ((cell && neighbors === 2) || neighbors === 3) {
        newState[row][col] = true;
      } else if (!cell && neighbors === 3) {
        newState[row][col] = true;
      }
    }
  }
  // Обновляем состояние клеток на игровом поле
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      setCell(row, col, newState[row][col]);
    }
  }
}

function getCell(row, col) {
  const index = row * COLUMNS + col;
  const cell = gameField.children[index];
  return cell.classList.contains("alive");
}

function setCell(row, col, value) {
  const index = row * COLUMNS + col;
  const cell = gameField.children[index];
  cell.classList.toggle("alive", value);
}

function getNeighbors(row, col) {
  let count = 0;

  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (
        i >= 0 &&
        i < ROWS &&
        j >= 0 &&
        j < COLUMNS &&
        !(i === row && j === col)
      ) {
        const cell = getCell(i, j);
        if (cell) {
          count++;
        }
      }
    }
  }

  return count;
}

function setupEventListeners() {
  // Добавляем обработчик событий клика на каждую клетку
  for (let i = 0; i < ROWS * COLUMNS; i++) {
    const cell = gameField.children[i];
    cell.addEventListener("click", () => {
      cell.classList.toggle("alive");
    });
  }
}

// Отрисовываем начальную конфигурацию клеток
//drawInitialState();

// Добавляем обработчики событий клика на каждую клетку
setupEventListeners();

// setInterval(() => {
//   updateState();
// }, 1000 / 30);

startBtn.addEventListener("click", () => {
  if (!intervalId) {
    intervalId = setInterval(() => {
      updateState();
    }, 1000 / 5);
  }
  startBtn.classList.add("button-down");
  pauseBtn.classList.remove("button-down");
});

pauseBtn.addEventListener("click", () => {
  clearInterval(intervalId);
  intervalId = undefined;
  pauseBtn.classList.add("button-down");
  startBtn.classList.remove("button-down");
});

//   startBtn.addEventListener("mousedown", () => {
//     startBtn.classList.add(".button-down");
//   });

//   pauseBtn.addEventListener("mousedown", () => {
//     pauseBtn.classList.toggle(".button-down");
//   });

stopBtn.addEventListener("click", () => {
  clearInterval(intervalId);
  intervalId = undefined;
  resetState();
  startBtn.classList.remove("button-down");
  pauseBtn.classList.remove("button-down");
});

presetsBtn.addEventListener("click", () => {
  clearInterval(intervalId);
  intervalId = undefined;
  resetState();
  startBtn.classList.remove("button-down");
  pauseBtn.classList.remove("button-down");
  let i = 0;
  for (let row = 0; row < ROWS; row++) {
    initialState[row] = [];
    for (let col = 0; col < COLUMNS; col++) {
      initialState[row][col] = !!Math.round(Math.random() - 0.3);

      if (initialState[row][col]) {
        const cell = gameField.children[i];
        cell.classList.toggle("alive");
      }
      i++;
      console.log(row + col);
      // console.log(`${row} + ${col}`);
    }
  }
});
