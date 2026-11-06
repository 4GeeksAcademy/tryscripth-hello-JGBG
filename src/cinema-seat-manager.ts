import {
  COLUMNS,
  ROWS,
  countSeats,
  createCinema,
  fillCinema,
  findFirstFreePair,
  reserveSeat,
  type Cinema
} from "./cinema-seat-manager-core";

/** Prints the cinema with row and column numbers, using L and X for seat states. */
function showCinema(cinema: Cinema): void {
  const columnLabels: string[] = [];

  for (let columnIndex = 0; columnIndex < COLUMNS; columnIndex++) {
    columnLabels.push(String(columnIndex + 1).padStart(2, " "));
  }

  console.log(`    ${columnLabels.join(" ")}`);

  for (let rowIndex = 0; rowIndex < ROWS; rowIndex++) {
    const seatLabels: string[] = [];

    for (let columnIndex = 0; columnIndex < COLUMNS; columnIndex++) {
      const label = cinema[rowIndex][columnIndex] === 0 ? "L" : "X";
      seatLabels.push(label.padStart(2, " "));
    }

    console.log(`${String(rowIndex + 1).padStart(2, " ")} | ${seatLabels.join(" ")}`);
  }
}

/** Prints the room, seat counts, and first available adjacent pair for one scenario. */
function showScenario(title: string, cinema: Cinema): void {
  console.log(`\n${title}`);
  showCinema(cinema);

  const [free, occupied] = countSeats(cinema);
  console.log(`Asientos libres: ${free}. Asientos ocupados: ${occupied}.`);

  const pair = findFirstFreePair(cinema);
  if (pair === null) {
    console.log("No hay ningún par de asientos libres contiguos.");
  } else {
    const [row, firstColumn, secondColumn] = pair;
    console.log(`Primer par disponible: fila ${row}, columnas ${firstColumn} y ${secondColumn}.`);
  }
}

const emptyCinema = createCinema();
showScenario("Escenario 1: sala vacía", emptyCinema);

const partiallyOccupiedCinema = createCinema();
console.log("\nEscenario 2: reservas en una sala parcialmente ocupada");
console.log(reserveSeat(partiallyOccupiedCinema, 3, 5));
console.log(reserveSeat(partiallyOccupiedCinema, 3, 5));
console.log(reserveSeat(partiallyOccupiedCinema, 9, 1));
showScenario("Estado de la sala parcialmente ocupada", partiallyOccupiedCinema);

const nearlyFullCinema = createCinema();
fillCinema(nearlyFullCinema);
nearlyFullCinema[ROWS - 1][COLUMNS - 2] = 0;
nearlyFullCinema[ROWS - 1][COLUMNS - 1] = 0;
showScenario("Escenario 3: sala casi llena", nearlyFullCinema);

const fullCinema = createCinema();
fillCinema(fullCinema);
showScenario("Escenario 4: sala completamente llena", fullCinema);

const separatedSeatsCinema = createCinema();
fillCinema(separatedSeatsCinema);
separatedSeatsCinema[0][0] = 0;
separatedSeatsCinema[ROWS - 1][COLUMNS - 1] = 0;
showScenario("Escenario 5: asientos libres separados", separatedSeatsCinema);
console.log("Resultado literal de la búsqueda:", findFirstFreePair(separatedSeatsCinema));
