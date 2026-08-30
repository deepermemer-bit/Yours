const shan = document.getElementById("shan");
function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  shan.textContent = `${hours}:${minutes}`;
}

updateTime();
setInterval(updateTime, 1000);

const searchform = document.getElementById("searchform");
const searchinput = document.getElementById("searchinput");

const tapmaan = document.getElementById("tapmaan");
const sthaan = document.getElementById("sthaan");
const mausamchin = document.querySelector(".mausamchin");

async function getWeather(latitude, longitude) {
  const response = await fetch(
     `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`
  );
  const data = await response.json();
  tapmaan.textContent = `${Math.round(data.current.temperature_2m)}°`;

  updateWeatherIcon(data.current.weather_code);

  const locationResponse = await fetch( 
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
  );

  const locationData = await locationResponse.json();
  sthaan.textContent = locationData.city || locationData.locality;
}

function updateWeatherIcon(weatherCode) {
  let iconClass;

  if (weatherCode === 0) {
    iconClass = "wi-day-sunny";
  } else if (weatherCode >= 1 && weatherCode <= 3) {
    iconClass = "wi-day-cloudy";
  } else if (weatherCode >= 45 && weatherCode <= 48) {
    iconClass = "wi-day-fog";
  } else if (weatherCode >= 51 && weatherCode <= 67) {
    iconClass = "wi-rain";
  } else if (weatherCode >= 71 && weatherCode <= 77) {
    iconClass = "wi-snow";
  } else if (weatherCode >= 80 && weatherCode <= 82) {
    iconClass = "wi-showers";
  } else if (weatherCode >= 95 && weatherCode <= 99) {
    iconClass = "wi-thunderstorm";
  }else {
    iconClass = "wi-day-cloudy";
  }

  mausamchin.className = `wi ${iconClass} mausamchin`;
}

navigator.geolocation.getCurrentPosition(
  function(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getWeather(latitude, longitude);
  }
);

searchform.addEventListener("submit", function(event) {
  event.preventDefault();
  const query = searchinput.value.trim();
  if (query === "") {
    return;
  }
  let url;
  if (
  query.startsWith("https://") ||
  query.startsWith("http://")
) {
    url = query;
  } else if (
    query.startsWith("www.") ||
    query.includes(".com") ||
    query.includes(".in") ||
    query.includes(".org") ||
    query.includes(".net")
  ) {
    url = "https://" + query.replace(/^https?:\/\//,"");
  } else {
    url = "https://www.google.com/search?q=" + encodeURIComponent(query);
  }
    let recentTabs = JSON.parse(localStorage.getItem("recentTabs")) || [];
    recentTabs.unshift({
      name: query,
      url: url
     });
    recentTabs = recentTabs.slice(0,9);
    localStorage.setItem("recentTabs", JSON.stringify(recentTabs));
    window.location.href = url;
});

const tabs = document.querySelector(".tabs");
function showRecentTabs() {
  const recentTabs = JSON.parse(localStorage.getItem("recentTabs")) || [];
  tabs.innerHTML = "";
  recentTabs.forEach(function(tab) {
    const recentTab = document.createElement("div");
    recentTab.className = "recent-item";
    recentTab.innerHTML = `<img src="images/googleicon.svg" alt="Google"> <span>${tab.name}</span>`;
    recentTab.addEventListener("click", function() {
      window.location.href = tab.url;
    });
    tabs.appendChild(recentTab);
  });
}
showRecentTabs();

const tasks = document.querySelectorAll (".task");
tasks.forEach(function(task, index) {
  const checkbox = task.querySelector('input[type="checkbox"]');
  const tasktext = task.querySelector(".tasktext");
  checkbox.addEventListener("change", function() {
    if (checkbox.checked) {
      task.classList.add("completed")
        } else {
          task.classList.remove("completed");
        }
    saveTasks();
    });
  tasktext.addEventListener("input", function() {saveTasks();
  });
});

function saveTasks() {
  const taskData  = [];
  tasks.forEach(function(task) {
    const checkbox = task.querySelector('input[type="checkbox"]');
    const tasktext = task.querySelector(".tasktext");
    taskData.push({
      text: tasktext.textContent,
      completed: checkbox.checked
    });
  });
  localStorage.setItem("tasks", JSON.stringify(taskData));
}
 function loadTasks() {
   const savedTasks = JSON.parse(localStorage.getItem("tasks"));
   if (!savedTasks) {
     return;
   }
   tasks.forEach(function(task, index) {
     const checkbox = task.querySelector('input[type="checkbox"]');
     const tasktext = task.querySelector(".tasktext");
     if (savedTasks[index]) {
       tasktext.textContent =  savedTasks[index].text;
       checkbox.checked = savedTasks[index].completed;
       if (checkbox.checked) {
         task.classList.add("completed");
       }
     }
   });
 }

loadTasks();

