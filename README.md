[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Yq2osyvW)

### 🎯 Projektöversikt

Ni ska skapa en **Proof of Concept (PoC)** för en molnlagringstjänst. Målet är en "renare" version av Google Drive utan reklam och popups. Fokus ligger på att demonstrera hur ni hanterar komponenter och dataflöden i Angular.

### 🧱 Krav för Godkänt (G) - Frontend & Komponenter

Fokus på att bygga UI med Angular-komponenter. Ingen backend krävs (data kan ligga i minnet eller `localStorage`).

**Design:**

* Vänstermeny (Sidebar) – behöver inte vara klickbar, men ska visa hur knappar stylas.
* Huvudvy – En lista med filer i mitten.
* Funktionalitet – Kunna ladda upp och ladda ner filer (mockat).

**Obligatoriska Angular-komponenter:**

1. **Sidebar:** Behållaren för vänstermenyn.
2. **Knapp-komponent:** Ska återanvändas för menyvalen (t.ex. "Min enhet"). Ska ta emot text och ev. ikon som input.
3. **Filvy-komponent:** Behållaren för sökfältet och fillistan.
4. **Sökfälts-komponent:** Visuell (behöver inte fungera för G).
5. **Filrads-komponent:** Presentation av en enskild fil (namn, ikon, datum etc.).

### ⭐ Krav för Väl Godkänt (VG) - Backend, Styling & Sök

Här krävs en riktig server och mer avancerad frontend.

**1. Styling & UX:**

* Responsiv design (anpassad för mobil).
* **Tema:** Ljust/Mörkt läge (ska styras av webbläsarens inställningar, `prefers-color-scheme`).

**2. Node.js Server:**

* Ska kunna serva den byggda Angular-applikationen (statisk HTML/JS/CSS).
* Ska spara uppladdade filer fysiskt på serverns disk.

**3. REST-API (Endpoints):**

* `PUT api/files/*` – Skapa/Ersätt fil (body innehåller filens bytes).
* `GET api/files` – Lista alla filer.
* `GET api/files/*` – Ladda ner specifik fil.
* `DELETE api/files/*` – Ta bort fil.

**4. Funktionalitet:**

* **Sök:** Sökfältet måste fungera (filtrera på namn/typ). "Fuzzy search" rekommenderas starkt.

### ⚠️ Viktiga begränsningar & Regler

* **Framework only:** Ingen `.innerHTML` eller `document.createElement`. All DOM-manipulation måste ske via Angular ("The Angular Way").
* **NPM:** Var restriktiv med externa paket. Oscar (ledningen) gillar inte onödiga beroenden, så varje paket måste motiveras.


Färg till bakgrundsbild vid no files:
#A0A4A8 - bör funka till både ljust och mörkt tema