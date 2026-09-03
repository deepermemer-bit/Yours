const songs = [
  {
    name: "BURA",
    artist: "Farak, Thugs from Overseas, 10A",
    audio: "gaan/Bura.mp3",
    cover: "gaanchitr/Bura(cover).jpg",
  },
  {
    name: "FIGHT BACK",
    artist: "NEFFEX",
    audio: "gaan/Fight Back.mp3",
    cover: "gaanchitr/Fight back (cover).jpg",
  },
  {
    name: "MADIRA",
    artist: "Seedhe Maut",
    audio: "gaan/Madira.mp3",
    cover: "gaanchitr/Madira(cover).jpg",
  },
  {
    name: "MAHESHWARI",
    artist: "Little Bhatia, Aditya Raj",
    audio: "gaan/MAHESHWARI.mp3",
    cover: "gaanchitr/maheshwari(cover).jpg",
  },
  {
    name: "A MODERN MANTRA",
    artist: "Govinda",
    audio: "gaan/A Modern Mantra.mp3", 
    cover:"gaanchitr/A modern mantra (cover).jpg",
  },
  {
    name: "YOUR EYES",
    artist: "Barney Sku, Taqiya Zaman",
    audio: "gaan/Your Eyes.mp3",
    cover: "gaanchitr/Your eyes(cover).jpg",
  },
  {
    name: "AAYI HO TUM",
    artist: "PATHAK, Aviraag ",
    audio: "gaan/Aayi Ho Tum.mp3",
    cover: "gaanchitr/aayi ho tum(cover).jpg",
  },
  {
    name: "ARSENAL",
    artist: "Shlok, OG Tehran",
    audio: "gaan/ARSENAL.mp3",
    cover: "gaanchitr/Arsenal(cover).jpg",
  },
  {
    name: "BARQAT",
    artist: "Satyam, Nandan",
    audio: "gaan/Barqat.mp3",
    cover: "gaanchitr/Barqat(cover).jpg",
  },
  {
    name: "UDI UDI",
    artist: "Aneesh, Sarkar, Hruday, Aneesh Poojari",
    audio: "gaan/Udi Udi.mp3",
    cover: "gaanchitr/Udi udi(cover).jpg",
  }
];

const audio = document.getElementById("audio");
const gaankhaal = document.getElementById("gaankhaal");
const gaannaam = document.getElementById("gaannaam");
const gaankalakaar = document.getElementById("gaankalakaar")
let currentSong = 0;
let changingSong = false;

function loadSong(index) {
  const song = songs[index];
  audio.src = song.audio;
  gaankhaal.src = song.cover;
  gaannaam.textContent = song.name;
  gaankalakaar.textContent = `BY ${song.artist}`;
}
loadSong(currentSong);

const playpause = document.getElementById("playpause");
const playicon = document.getElementById("playicon");
playpause.addEventListener("click", function() {
  if (audio.paused) {
    audio.play();
    playicon.src = "images/pause.svg";
  } else {
    audio.pause();
    playicon.src = "images/play.svg";
  }
});

const pichla = document.getElementById("pichla");
const aage = document.getElementById("aage");
function changeSong(direction) {
  if (changingSong) {
    return;
  }
  changingSong = true;
  const gaanchitra = document.querySelector(".gaanchitra");
  if (direction === "next") {
    gaanchitra.classList.add("slide-out-left");
  } else {
    gaanchitra.classList.add("slide-out-right");
  }
  setTimeout(function() {
    if (direction === "next") {
      currentSong++;
      if (currentSong >= songs.length) {
        currentSong = 0;
      }
    } else {
      currentSong--;
      if (currentSong < 0) {
        currentSong = songs.length - 1;
      }
    }

    loadSong(currentSong);
    gaanchitra.classList.remove(
      "slide-out-left",
      "slide-out-right"
    );
    if (direction === "next") {
      gaanchitra.classList.add("slide-in-right");
    } else {
      gaanchitra.classList.add("slide-in-left");
    }
    audio.play();
    playicon.src = "images/pause.svg";
    setTimeout(function() {
      gaanchitra.classList.remove(
        "slide-in-left",
        "slide-in-right"
      );
      changingSong = false;
    }, 350);
  }, 350);
}
aage.addEventListener("click", function() {
  changeSong("next");
});
pichla.addEventListener("click", function() {
  changeSong("previous");
});

const progressbar = document.getElementById("progressbar");
audio.addEventListener("timeupdate", function() {
  if (audio.duration) {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressbar.value = progress;
    progressbar.style.background = `
    linear-gradient(
    to right,
    white ${progress}%,
    rgba(255,255,255,0.35) ${progress}%,
    rgba(255,255,255,0.35) 100%)`;
  }
});
progressbar.addEventListener("input", function() {
  if (audio.duration) {
    audio.currentTime = (progressbar.value / 100) * audio.duration;
  }
});

audio.addEventListener("ended", function() {
  changeSong("next");
});

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

const tasklist = document.querySelector(".tasklist");
const addtodo = document.querySelector(".addtodo");
function setupTask(task) {
  const checkbox = task.querySelector('input[type="checkbox"]');
  const tasktext = task.querySelector(".tasktext");
  const deleteButton = task.querySelector(".todobutton");
  checkbox.addEventListener("change", function() {
    task.classList.toggle("completed", checkbox.checked);
    saveTasks();
  });
  tasktext.addEventListener("input", function() {
    saveTasks();
  });
  deleteButton.addEventListener("click", function() {
    task.remove();
    saveTasks();
  });
}

function saveTasks() {
  const tasks = document.querySelectorAll(".task");
  const taskData = [];
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
function createTask(text = "To-do", completed = false) {
  const task = document.createElement("div");
  task.className = "task";
  task.innerHTML = `
  <input type="checkbox">
  <span class="tasktext" contenteditable="true">${text}</span>
  <button type="button" class="todobutton">×</button>`;
  tasklist.appendChild(task);
  const checkbox = task.querySelector('input[type="checkbox"]');
  checkbox.checked = completed;
  if (completed) {
    task.classList.add("completed");
  }
  setupTask(task);
}

function loadTasks() {
  const savedTasks = 
    JSON.parse(localStorage.getItem("tasks")) || [];
  if (savedTasks.length === 0) {
    document.querySelectorAll(".task").forEach(setupTask);
    return;
  }
  tasklist.innerHTML = "";
  savedTasks.forEach(function(taskData) {
    createTask(taskData.text, taskData.completed);
  });
}

addtodo.addEventListener("click", function(){
  createTask();
  saveTasks();
});
loadTasks();

