import api from './utils/api.js'

import {container,form, input} from './utils/domElements.js'

import {round, ternaire} from './utils/outils.js'

const {key, units, lang, baseCoordinate, baseCity} = api

// ** callback en cas de succès (utilisateur autorise la localisation)
const success = (position) => {
    const { latitude, longitude } = position.coords
    const URL = `${baseCoordinate}${latitude}&lon=${longitude}&appid=${key}&units=${units}&lang=${lang}`
    localWeather(URL).then((weatherData) => displayData(weatherData))
}

// ** callback en cas d'erreur (utilisateur n'autorise pas la localisation)
const error = () => {
    container.innerHTML = "<h2>Veuillez activer la localisation</h2>"
}

// ** Récupere la localisation 
navigator.geolocation.getCurrentPosition(success, error)

// ** Récupere les données méteos (OPENWEATHERMAP API)
const localWeather = async (URL) => {
   const response = await fetch(URL)
   const weatherData = await response.json()
   return weatherData
}
// ** Affiche les  données méteos dans la page index.html
const displayData = (wData) => {
    const {temp, temp_max, temp_min, humidity, feels_like} = wData.main
    temp > 15 ? container.id = "container-hot" : container.id = "container-cold"
    container.innerHTML = `
        <div class="city-container">
            <h2>${wData.name} ${wData.sys.country}</h2>
        </div>
        <div class="detail-container">
            <h3>${wData.weather[0].description.toUpperCase()}</h3>
            <ul>
                <li>Température <span id='${ternaire(temp, 15)}'>${round(temp)}°C</span></li>
                <li>Maximale  <span id='${ternaire(temp_max, 15)}' >${round(temp_max)}</span></li>
                <li>Minimale  <span id='${ternaire(temp_min, 12)}' >${round(temp_min)}</span></li>
                <li>Ressentie <span id='${ternaire(feels_like, 15)}' > ${round(feels_like)}</span></li>
                <li>Humidité <span>${humidity} %</span></li>
            </ul>
        </div>
    `
}


const getWeatherBasedOnInput = async (event) =>{
    event.preventDefault()
    const URL = `${baseCity}${input.value}&appid=${key}&units=${units}&lang=${lang}`
    localWeather(URL).then((weatherData) => displayData(weatherData))
}

form.addEventListener('submit', getWeatherBasedOnInput)


