export type Seat = 0 | 1;
export type Cinema = Seat[][];

export const ROWS = 8;
export const COLUMNS = 10;

/** Creates an 8-by-10 cinema with every seat initially free. */
export function createCinema(): Cinema {
  const cinema: Cinema = [];

  for (let rowIndex = 0; rowIndex < ROWS; rowIndex++) {
    const row: Seat[] = [];

    for (let columnIndex = 0; columnIndex < COLUMNS; columnIndex++) {
      row.push(0);
    }

    cinema.push(row);
  }

  return cinema;
}

/** Counts and returns the free seats first and occupied seats second. */
export function countSeats(cinema: Cinema): [free: number, occupied: number] {
  let free = 0;
  let occupied = 0;

  for (let rowIndex = 0; rowIndex < ROWS; rowIndex++) {
    for (let columnIndex = 0; columnIndex < COLUMNS; columnIndex++) {
      if (cinema[rowIndex][columnIndex] === 0) {
        free++;
      } else {
        occupied++;
      }
    }
  }

  return [free, occupied];
}

/** Reserves a seat using 1-based coordinates and returns a success or error message. */
export function reserveSeat(cinema: Cinema, row: number, column: number): string {
  if (
    !Number.isInteger(row) ||
    !Number.isInteger(column) ||
    row < 1 ||
    row > ROWS ||
    column < 1 ||
    column > COLUMNS
  ) {
    return `Error: fila ${row} o columna ${column} fuera de rango.`;
  }

  if (cinema[row - 1][column - 1] === 1) {
    return `Error: el asiento de la fila ${row}, columna ${column} ya está ocupado.`;
  } else {
    cinema[row - 1][column - 1] = 1;
    return `Éxito: asiento reservado en la fila ${row}, columna ${column}.`;
  }
}

/** Returns the first horizontal pair of free seats, or null when no pair exists. */
export function findFirstFreePair(
  cinema: Cinema
): [row: number, firstColumn: number, secondColumn: number] | null {
  for (let rowIndex = 0; rowIndex < ROWS; rowIndex++) {
    for (let columnIndex = 0; columnIndex < COLUMNS - 1; columnIndex++) {
      if (cinema[rowIndex][columnIndex] === 0 && cinema[rowIndex][columnIndex + 1] === 0) {
        return [rowIndex + 1, columnIndex + 1, columnIndex + 2];
      }
    }
  }

  return null;
}

/** Fills every seat in the cinema. */
export function fillCinema(cinema: Cinema): void {
  for (let rowIndex = 0; rowIndex < ROWS; rowIndex++) {
    for (let columnIndex = 0; columnIndex < COLUMNS; columnIndex++) {
      cinema[rowIndex][columnIndex] = 1;
    }
  }
}
