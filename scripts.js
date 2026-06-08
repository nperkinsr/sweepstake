const teams = [
  { name: "Mexico", group: "Group A", flag: "🇲🇽" },
  { name: "South Africa", group: "Group A", flag: "🇿🇦" },
  { name: "South Korea", group: "Group A", flag: "🇰🇷" },
  { name: "Czech Republic", group: "Group A", flag: "🇨🇿" },

  { name: "Canada", group: "Group B", flag: "🇨🇦" },
  { name: "Bosnia-Herzegovina", group: "Group B", flag: "🇧🇦" },
  { name: "Qatar", group: "Group B", flag: "🇶🇦" },
  { name: "Switzerland", group: "Group B", flag: "🇨🇭" },

  { name: "Brazil", group: "Group C", flag: "🇧🇷" },
  { name: "Morocco", group: "Group C", flag: "🇲🇦" },
  { name: "Haiti", group: "Group C", flag: "🇭🇹" },
  {
    name: "Scotland",
    group: "Group C",
    flag: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}",
  },

  { name: "USA", group: "Group D", flag: "🇺🇸" },
  { name: "Paraguay", group: "Group D", flag: "🇵🇾" },
  { name: "Australia", group: "Group D", flag: "🇦🇺" },
  { name: "Turkey", group: "Group D", flag: "🇹🇷" },

  { name: "Germany", group: "Group E", flag: "🇩🇪" },
  { name: "Curacao", group: "Group E", flag: "🇨🇼" },
  { name: "Ivory Coast", group: "Group E", flag: "🇨🇮" },
  { name: "Ecuador", group: "Group E", flag: "🇪🇨" },

  { name: "Netherlands", group: "Group F", flag: "🇳🇱" },
  { name: "Japan", group: "Group F", flag: "🇯🇵" },
  { name: "Sweden", group: "Group F", flag: "🇸🇪" },
  { name: "Tunisia", group: "Group F", flag: "🇹🇳" },

  { name: "Belgium", group: "Group G", flag: "🇧🇪" },
  { name: "Egypt", group: "Group G", flag: "🇪🇬" },
  { name: "Iran", group: "Group G", flag: "🇮🇷" },
  { name: "New Zealand", group: "Group G", flag: "🇳🇿" },

  { name: "Spain", group: "Group H", flag: "🇪🇸" },
  { name: "Cape Verde", group: "Group H", flag: "🇨🇻" },
  { name: "Saudi Arabia", group: "Group H", flag: "🇸🇦" },
  { name: "Uruguay", group: "Group H", flag: "🇺🇾" },

  { name: "France", group: "Group I", flag: "🇫🇷" },
  { name: "Senegal", group: "Group I", flag: "🇸🇳" },
  { name: "Iraq", group: "Group I", flag: "🇮🇶" },
  { name: "Norway", group: "Group I", flag: "🇳🇴" },

  { name: "Argentina", group: "Group J", flag: "🇦🇷" },
  { name: "Algeria", group: "Group J", flag: "🇩🇿" },
  { name: "Austria", group: "Group J", flag: "🇦🇹" },
  { name: "Jordan", group: "Group J", flag: "🇯🇴" },

  { name: "Portugal", group: "Group K", flag: "🇵🇹" },
  { name: "DR Congo", group: "Group K", flag: "🇨🇩" },
  { name: "Uzbekistan", group: "Group K", flag: "🇺🇿" },
  { name: "Colombia", group: "Group K", flag: "🇨🇴" },

  {
    name: "England",
    group: "Group L",
    flag: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}",
  },
  { name: "Croatia", group: "Group L", flag: "🇭🇷" },
  { name: "Ghana", group: "Group L", flag: "🇬🇭" },
  { name: "Panama", group: "Group L", flag: "🇵🇦" },
];

const namesForm = document.querySelector("#namesForm");
const namesInput = document.querySelector("#namesInput");
const nameCount = document.querySelector("#nameCount");
const pageFrame = document.querySelector("#pageFrame");
const setupPanel = document.querySelector("#setupPanel");
const drawPanel = document.querySelector("#drawPanel");
const teamsGrid = document.querySelector("#teamsGrid");
const teamCardTemplate = document.querySelector("#teamCardTemplate");
const peopleStrip = document.querySelector("#peopleStrip");
const backButton = document.querySelector("#backButton");
const resetButton = document.querySelector("#resetButton");
const downloadButton = document.querySelector("#downloadButton");

let people = [];
let assignments = {};
let revealedCountries = new Set();

function parseNames(value) {
  return value
    .split(/\n|,/)
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name, index) => ({
      id: `${index}-${name.toLowerCase().replace(/\s+/g, "-")}`,
      name,
    }));
}

function countAssignments(personId) {
  return teams.filter(
    (team) =>
      revealedCountries.has(team.name) && assignments[team.name] === personId,
  ).length;
}

function getPersonById(personId) {
  return people.find((person) => person.id === personId);
}

function shuffleList(items) {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[randomIndex]] = [
      shuffledItems[randomIndex],
      shuffledItems[index],
    ];
  }

  return shuffledItems;
}

function createDraw() {
  const shuffledPeople = shuffleList(people);
  const personSlots = [];

  teams.forEach((team, index) => {
    personSlots.push(shuffledPeople[index % shuffledPeople.length].id);
  });

  const shuffledSlots = shuffleList(personSlots);

  return teams.reduce((draw, team, index) => {
    draw[team.name] = shuffledSlots[index];
    return draw;
  }, {});
}

function updateNameCount() {
  const total = parseNames(namesInput.value).length;
  nameCount.textContent = `${total} ${total === 1 ? "person" : "people"} added`;
}

function showDraw() {
  pageFrame.classList.remove("setup-view");
  setupPanel.classList.add("is-hidden");
  drawPanel.classList.remove("is-hidden");
}

function showSetup() {
  pageFrame.classList.add("setup-view");
  drawPanel.classList.add("is-hidden");
  setupPanel.classList.remove("is-hidden");
  namesInput.focus();
}

function renderPeopleStrip() {
  peopleStrip.innerHTML = "";

  people.forEach((person) => {
    const badge = document.createElement("div");
    badge.className = "person-badge";
    badge.innerHTML = `<span>${person.name}</span><strong>${countAssignments(person.id)}</strong>`;
    peopleStrip.insertAdjacentElement("beforeend", badge);
  });
}

function renderStatus() {
  const assignedCount = revealedCountries.size;

  downloadButton.classList.toggle("is-hidden", assignedCount !== teams.length);
}

function renderTeams() {
  teamsGrid.innerHTML = "";

  teams.forEach((team) => {
    const card = teamCardTemplate.content.firstElementChild.cloneNode(true);
    const isRevealed = revealedCountries.has(team.name);
    const assignedPerson = isRevealed
      ? getPersonById(assignments[team.name])
      : null;
    const button = card.querySelector(".assign-button");

    card.querySelector(".team-flag").textContent = team.flag;
    card.querySelector(".team-group").textContent = team.group;
    const teamName = card.querySelector("h2");
    teamName.textContent = team.name;
    teamName.classList.toggle("is-long-name", team.name.length > 13);
    card.querySelector(".assigned-person").textContent = assignedPerson
      ? assignedPerson.name
      : "";

    if (assignedPerson) {
      card.classList.add("is-assigned");
      button.remove();
    } else {
      button.addEventListener("click", () => {
        revealedCountries.add(team.name);
        renderTeams();
        renderPeopleStrip();
        renderStatus();
      });
    }

    teamsGrid.insertAdjacentElement("beforeend", card);
  });
}

function startDraw(event) {
  event.preventDefault();
  people = parseNames(namesInput.value);

  if (!people.length) {
    namesInput.focus();
    nameCount.textContent = "Add at least one person";
    return;
  }

  assignments = createDraw();
  revealedCountries = new Set();
  renderTeams();
  renderPeopleStrip();
  renderStatus();
  showDraw();
}

function resetAssignments() {
  assignments = createDraw();
  revealedCountries = new Set();
  renderTeams();
  renderPeopleStrip();
  renderStatus();
}

function cleanText(value) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

function getResultsByPerson() {
  return people.map((person) => ({
    name: person.name,
    countries: teams.filter((team) => assignments[team.name] === person.id),
  }));
}

function buildResultsMarkup() {
  const resultRows = getResultsByPerson()
    .map((person) => {
      const countryList = person.countries
        .map(
          (team) => `<li><span>${team.flag}</span>${cleanText(team.name)}</li>`,
        )
        .join("");

      return `
      <section class="result-card">
        <div class="person-heading">
          <h2>${cleanText(person.name)}</h2>
          <span>${person.countries.length}</span>
        </div>
        <ul>${countryList}</ul>
      </section>
    `;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>World Cup 2026 Sweepstake Results</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: Arial, Helvetica, sans-serif;
      color: #172033;
      background: #f7f5f0;
    }
    main {
      width: min(980px, calc(100% - 32px));
      margin: 0 auto;
      padding: 36px 0 48px;
    }
    header {
      margin-bottom: 24px;
      padding: 28px;
      color: #ffffff;
      background: #102236;
      border-radius: 8px;
    }
    p {
      margin: 0 0 10px;
      color: #d8dee8;
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    h1 {
      margin: 0;
      font-size: clamp(2.1rem, 5vw, 4rem);
      line-height: 0.98;
    }
    .result-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 14px;
    }
    .result-card {
      overflow: hidden;
      background: #ffffff;
      border: 1px solid #d6d9de;
      border-radius: 8px;
    }
    .person-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 16px 18px;
      background: #6d5b7a;
      color: #ffffff;
    }
    h2 {
      margin: 0;
      overflow-wrap: anywhere;
      font-size: 1.35rem;
      line-height: 1.1;
    }
    .person-heading span {
      display: grid;
      flex: 0 0 auto;
      place-items: center;
      min-width: 32px;
      height: 32px;
      padding: 0 8px;
      background: #ffffff;
      color: #172033;
      border-radius: 999px;
      font-weight: 800;
    }
    ul {
      display: grid;
      gap: 8px;
      margin: 0;
      padding: 16px 18px 18px;
      list-style: none;
    }
    li {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 30px;
      color: #172033;
      font-weight: 700;
    }
    li span {
      width: 1.8rem;
      font-size: 1.35rem;
      line-height: 1;
    }
    @media print {
      body { background: #ffffff; }
      main { width: 100%; padding: 0; }
      header, .result-card { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <p>FIFA World Cup 2026</p>
      <h1>Sweepstake results</h1>
    </header>
    <div class="result-grid">${resultRows}</div>
  </main>
</body>
</html>`;
}

function downloadResults() {
  const file = new Blob([buildResultsMarkup()], { type: "text/html" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(file);
  link.download = "world-cup-2026-sweepstake-results.html";
  link.click();
  URL.revokeObjectURL(link.href);
}

namesInput.addEventListener("input", updateNameCount);
namesForm.addEventListener("submit", startDraw);
backButton.addEventListener("click", showSetup);
resetButton.addEventListener("click", resetAssignments);
downloadButton.addEventListener("click", downloadResults);

updateNameCount();
