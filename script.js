// =================== 🕒 CLOCK DISPLAY ===================
function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateClock, 1000);
updateClock();

// =================== 🌤️ WEATHER DISPLAY ===================
const apiKey = "464ada6dae3151b0fb9bbf18cba7bec4";
const lat = 59.3293;
const lon = 18.0686;

fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    const temp = Math.round(data.main.temp);
    const icon = data.weather[0].icon;
    const desc = data.weather[0].description;
    document.getElementById("weather").innerHTML = `<img src='https://openweathermap.org/img/wn/${icon}@2x.png' style='width:60px;'> <strong>${temp}&deg;C</strong><br><span>${desc}</span>`;
  })
  .catch(() => {
    document.getElementById("weather").textContent = "Weather unavailable";
  });

// =================== 🛒 GROCERY LIST ===================
let items = JSON.parse(localStorage.getItem("groceryList")) || [];

function saveItems() {
  localStorage.setItem("groceryList", JSON.stringify(items));
}

function renderItems() {
  const list = document.getElementById("items");
  list.innerHTML = "";
  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => {
      items.splice(index, 1);
      saveItems();
      renderItems();
    };
    li.appendChild(btn);
    list.appendChild(li);
  });
}

function addItem() {
  const input = document.getElementById("item-input");
  if (input.value.trim()) {
    items.push(input.value.trim());
    input.value = "";
    saveItems();
    renderItems();
  }
}
renderItems();

// =================== ✅ TO-DO LIST ===================
let todos = JSON.parse(localStorage.getItem("todoList")) || [];

function saveTodos() {
  localStorage.setItem("todoList", JSON.stringify(todos));
}

function renderTodos() {
  const list = document.getElementById("todo-list");
  list.innerHTML = "";
  todos.forEach((item, index) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    checkbox.onchange = () => {
      item.done = checkbox.checked;
      saveTodos();
    };
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(" " + item.text));
    list.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById("todo-input");
  if (input.value.trim()) {
    todos.push({ text: input.value.trim(), done: false });
    input.value = "";
    saveTodos();
    renderTodos();
  }
}
renderTodos();

// =================== 🎨 DYNAMIC BACKGROUND ===================
function updateBackground() {
  const hour = new Date().getHours();
  let bg = '#1a1a2e';
  let textColor = '#fff';

  if (hour >= 0 && hour < 6) bg = 'linear-gradient(to right, #000000, #0a0a23)';
  else if (hour >= 6 && hour < 8) bg = 'linear-gradient(to right, #000428, #004e92)';
  else if (hour >= 8 && hour < 12) bg = 'linear-gradient(to right, #2980b9, #6dd5fa)';
  else if (hour >= 12 && hour < 17) bg = 'linear-gradient(to right, #fceabb, #f8b500)';
  else if (hour >= 17 && hour < 20) bg = 'linear-gradient(to right, #2c3e50, #fd746c)';
  else bg = 'linear-gradient(to right, #0f2027, #203a43, #2c5364)';

  if (hour >= 10 && hour <= 15) textColor = '#000';
  else textColor = '#fff';

  document.body.style.background = bg;
  document.body.style.color = textColor;
  document.documentElement.style.setProperty('--text-color', textColor);
}
updateBackground();
setInterval(updateBackground, 60 * 60 * 1000); // every hour

// =================== 📰 NEWS TICKER ===================
async function fetchHeadlines() {
  const proxy = "https://api.allorigins.win/get?url=";
  const bbc = encodeURIComponent("https://feeds.bbci.co.uk/news/world/rss.xml");
  const aj = encodeURIComponent("https://www.aljazeera.net/aljazeera/rss");

  const fetchRSS = async (url) => {
    try {
      const res = await fetch(proxy + url);
      const data = await res.json();
      const parser = new DOMParser();
      const xml = parser.parseFromString(data.contents, "application/xml");
      const items = Array.from(xml.querySelectorAll("item")).slice(0, 5);
      return items.map(i => i.querySelector("title").textContent);
    } catch (e) {
      return ["Feed unavailable"];
    }
  };

  const bbcNews = await fetchRSS(bbc);
  const ajNews = await fetchRSS(aj);

  const headlines = [...bbcNews, ...ajNews];
  const ticker = document.getElementById("newsTicker");
  ticker.innerHTML = headlines.map(h => `<span>${h}</span>`).join('');
}

fetchHeadlines();
setInterval(fetchHeadlines, 30 * 60 * 1000); // every 30 minutes

// =================== 🔁 AUTO-REFRESH PAGE ===================
setTimeout(() => {
  location.reload();
}, 60 * 60 * 1000); // every 1 hour
