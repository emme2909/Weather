/*  
    Weather - Super Guida JavaScript
    app.js  -  Matteo Moretti   apiKey = b658b4b7d5c127849aa0fc3be6ca9a70
                    Openweather                                     */ 


const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

const apiKey = "b658b4b7d5c127849aa0fc3be6ca9a70";


form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;
  
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = "";
      
      if (inputVal.includes(",")) {
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
       
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `Conosci già il tempo per ${
        filteredArray[0].querySelector(".city-name span").textContent
      } oppure inserisci anche il prefisso nazionale`;
      form.reset();
      input.focus();
      return;
    }
  }

 
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { main, name, sys, weather } = data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]
      }.svg`;

      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup>
        <div class="minMax">Min:${Math.round(main.temp_min)}º <span class="general"> Pressure:${main.pressure}% </span><br>Max: ${Math.round(main.temp_max)}º<span class="general">Humidity:${main.humidity}hp</span></div>
        </div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
        weather[0]["description"]
      }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
      li.innerHTML = markup;
      list.appendChild(li);
      
      console.log(data);
    })
    .catch(() => {
      msg.textContent = "Città non valida, riprova.";
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});

