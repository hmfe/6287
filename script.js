// Handle input from user
const inputHandler = () => {
  let query = document.querySelector("#search").value;
  // only do a search if input is more than 1 char
  query.length >= 1 ? search(query.toLowerCase()) : hideHandler(true);
};

const search = query => {
  const url = `https://restcountries.eu/rest/v2/name/${query}`;

  clearSearchList(); // clear searchlist before returning new results
  fetch(url)
    .then(response => response.json())
    .then(results => {
      if (results.status === 404) {
        notFoundHandler(true); // show not found if server respondes with 404
      } else {
        notFoundHandler(false);
        results.forEach(element => {
          generateSearchList(element); // call render function for results
        });
      }
    })
    .catch(e => console.log(e));
};

// Generate a list of the result from query and append to dom
const generateSearchList = data => {
  const ul = document.querySelector("#result-list");
  const li = document.createElement("li");
  const text = matchCharacter(data.name.toLowerCase());
  li.innerHTML = text;
  li.id = data.alpha2Code;
  li.tabIndex = 0;
  li.onclick = () => saveResult(data.name);
  hideHandler(false);
  ul.append(li);
};

// match chars in result list with chars in query
const matchCharacter = city => {
  const inputVal = document.querySelector("#search").value;
  return city.replace(new RegExp(inputVal), match => `<strong>${match}</strong>`);
};

const saveResult = city => {
  // select parent elementet
  const historyList = document.querySelector("#search-history");

  //create needed elements
  const timeStampEl = document.createElement("h6"),
        cityNameEl = document.createElement("h5"),
        li = document.createElement("li"),
        button = buildButton();
  
  // add values and attributes
  cityNameEl.className = "flex";
  timeStampEl.innerHTML = getFormattedYear();
  cityNameEl.innerHTML = city.toLowerCase();
  li.id = Date.now();
  li.className = "history-item";

  //append to dom
  li.append(cityNameEl, timeStampEl, button);
  historyList.append(li);

};

const getFormattedYear = () => {
  const date = new Date();
  const formattedYear = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}, ${toTwelveHours(date)}`;

  return formattedYear;
}
const buildButton = () => {
  const button = document.createElement("button");
  button.className = "clear-btn";
  button.innerHTML = "&#10005;";
  button.addEventListener("click", () => removeHistoryItem(event));
  return button;
}

// make time format 
const toTwelveHours = date => {
  const hour = date.getHours();
  // make 24h to 12h
  const twelveHour = hour % 12 || 12;
  const minutes = date.getMinutes();
  const suffix = hour <= 11 ? "AM" : "PM";

  return `${twelveHour}:${minutes} ${suffix}`;
};

// remove all saved history item
const clearSearchHistory = () => {
  const list = document.querySelector("#search-history");
  clearHandler(); // also clear search
  list.innerHTML = "";
};

//remove specific saved item
const removeHistoryItem = el => {
  // find the clicked buttons parent element and remove it
  const item = document.getElementById(el.target.parentNode.id);
  item.remove();
};

// Handler for showing and hiding "no results" text
const notFoundHandler = bool => {
  const div = document.getElementById("not-found");
  bool ? (div.hidden = false) : (div.hidden = true);
};

// Clear all earlier appended elements in list
const clearSearchList = () => {
  const ul = document.querySelector("#result-list");
  ul.innerHTML = "";
};

// handler for hiding and showing the container div for search results
const hideHandler = bool => {
  const resultDiv = document.querySelector("#search-result");
  bool ? resultDiv.setAttribute("hidden", "") : resultDiv.removeAttribute("hidden");
};

// empty the input element and hide the results
const clearHandler = () => {
  const input = document.querySelector("#search");
  input.value = "";
  hideHandler(true);
};
