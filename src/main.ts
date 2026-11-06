import "./style.css";
import {
  COLUMNS,
  ROWS,
  countSeats,
  createCinema,
  findFirstFreePair,
  reserveSeat
} from "./cinema-seat-manager-core";

const cinema = createCinema();
const columnLabels = requireElement<HTMLDivElement>("#column-labels");
const rowLabels = requireElement<HTMLDivElement>("#row-labels");
const seatGrid = requireElement<HTMLDivElement>("#seat-grid");
const freeCount = requireElement<HTMLElement>("#free-count");
const occupiedCount = requireElement<HTMLElement>("#occupied-count");
const message = requireElement<HTMLParagraphElement>("#status-message");
const findPairButton = requireElement<HTMLButtonElement>("#find-pair");

/** Returns a required page element or throws when the HTML is missing it. */
function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if (element === null) {
    throw new Error(`Falta el elemento requerido ${selector} en index.html.`);
  }

  return element;
}

/** Updates a seat button from the value stored in the cinema matrix. */
function updateSeatButton(button: HTMLButtonElement, row: number, column: number): void {
  const occupied = cinema[row - 1][column - 1] === 1;

  button.classList.toggle("seat--occupied", occupied);
  button.classList.toggle("seat--free", !occupied);
  button.textContent = occupied ? "X" : "L";
  button.setAttribute("aria-label", `Fila ${row}, asiento ${column}, ${occupied ? "ocupado" : "libre"}`);
  button.setAttribute("aria-pressed", String(occupied));
}

/** Creates the numbered labels and all 80 seat buttons from the 8-by-10 matrix. */
function buildSeatMap(): void {
  for (let column = 1; column <= COLUMNS; column++) {
    const label = document.createElement("span");
    label.textContent = String(column).padStart(2, "0");
    columnLabels.append(label);
  }

  for (let row = 1; row <= ROWS; row++) {
    const label = document.createElement("span");
    label.textContent = String(row).padStart(2, "0");
    rowLabels.append(label);

    for (let column = 1; column <= COLUMNS; column++) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "seat seat--free";
      button.dataset.row = String(row);
      button.dataset.column = String(column);
      updateSeatButton(button, row, column);
      seatGrid.append(button);
    }
  }
}

/** Refreshes the free and occupied totals from the matrix. */
function updateCounts(): void {
  const [free, occupied] = countSeats(cinema);
  freeCount.textContent = String(free);
  occupiedCount.textContent = String(occupied);
}

/** Displays feedback and styles it according to its status. */
function showMessage(text: string, kind: "success" | "error" | "info"): void {
  message.textContent = text;
  message.dataset.kind = kind;
}

/** Removes the visual highlight from the previously suggested pair. */
function clearPairHighlight(): void {
  seatGrid.querySelectorAll(".seat--suggested").forEach((button) => {
    button.classList.remove("seat--suggested");
  });
}

/** Reserves the clicked seat and refreshes the map and totals when it succeeds. */
function handleSeatClick(event: MouseEvent): void {
  if (!(event.target instanceof Element)) {
    return;
  }

  const button = event.target.closest<HTMLButtonElement>(".seat");
  if (!button || !seatGrid.contains(button)) {
    return;
  }

  const row = Number(button.dataset.row);
  const column = Number(button.dataset.column);
  const result = reserveSeat(cinema, row, column);
  const succeeded = result.startsWith("Éxito:");

  showMessage(result, succeeded ? "success" : "error");

  if (succeeded) {
    updateSeatButton(button, row, column);
    updateCounts();
    clearPairHighlight();
  }
}

/** Finds and highlights the first pair of free seats, or reports that none exists. */
function handleFindPair(): void {
  clearPairHighlight();
  const pair = findFirstFreePair(cinema);

  if (pair === null) {
    showMessage("No hay ningún par de asientos libres contiguos.", "error");
    return;
  }

  const [row, firstColumn, secondColumn] = pair;
  const firstSeat = seatGrid.querySelector<HTMLButtonElement>(
    `.seat[data-row="${row}"][data-column="${firstColumn}"]`
  );
  const secondSeat = seatGrid.querySelector<HTMLButtonElement>(
    `.seat[data-row="${row}"][data-column="${secondColumn}"]`
  );

  firstSeat?.classList.add("seat--suggested");
  secondSeat?.classList.add("seat--suggested");
  showMessage(`Pareja disponible: fila ${row}, columnas ${firstColumn} y ${secondColumn}.`, "info");
}

buildSeatMap();
updateCounts();
seatGrid.addEventListener("click", handleSeatClick);
findPairButton.addEventListener("click", handleFindPair);
