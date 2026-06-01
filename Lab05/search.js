const API = "https://restcountries.com/v3.1/name/";
const searchInput = document.getElementById("search");
const statusEl = document.getElementById("status");
const resultsContainer = document.getElementById("results");
let timeoutId = null;
let abortController = null;

searchInput.addEventListener("input", (event) => {
  const query = event.target.value.trim();
  if (timeoutId) clearTimeout(timeoutId);

  if (query.length < 2) {
    statusEl.textContent = "";
    resultsContainer.innerHTML = "";
    if (abortController) abortController.abort();
    return;
  }
  timeoutId = setTimeout(() => {
    loadCountries(query);
  }, 3000);
});

async function loadCountries(query) {
  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();
  const { signal } = abortController;
  statusEl.textContent = "Шукаю...";
  resultsContainer.innerHTML = "";

  try {
    const response = await fetch(`${API}${query}`, { signal });
    if (response.status === 404) {
      statusEl.textContent = "Нічого не знайдено";
      return;
    }
    if (!response.ok) {
      throw new Error("Помилка сервера");
    }
    const countries = await response.json();
    statusEl.textContent = `Знайдено: ${countries.length}`;
    renderCountries(countries);

  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Запит скасовано AbortController");
      return;
    }
    statusEl.textContent = "Помилка при завантаженні даних";
    console.error(error);
  }
}

function renderCountries(countries) {
  const markup = countries
    .map((country) => {
      const flag = country.flag || "🏳️";
      const name = country.name?.common || "Невідомо";
      const capital = country.capital ? country.capital.join(", ") : "Немає";
      const population = country.population ? country.population.toLocaleString() : "0";

      return `
        <div class="country">
          <div class="flag">${flag}</div>
          <h3>${name}</h3>
          <div class="meta">
            <p><strong>Столиця:</strong> ${capital}</p>
            <p><strong>Населення:</strong> ${population}</p>
          </div>
        </div>
      `;
    })
    .join("");

  resultsContainer.innerHTML = markup;
}