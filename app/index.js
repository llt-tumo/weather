const { format } = require("date-fns")


let currenttempType = 'C'

const setLocationAndTimeBlock = (city, localtime) => {
    let cityBl = document.querySelector('#city')
    let timeBl = document.querySelector('#time')
    let dateBl = document.querySelector('#date')


    cityBl.innerHTML = city

    const arr = localtime.split(' ')
    timeBl.innerHTML = arr[1]

    const dateObj = new Date(arr[0])
    dateBl.innerHTML = format(dateObj, "EEEE, dd LLL")
}
const setWeatherInfo = (val, astro) => {
    let tempBl = document.querySelector('#todaysWeather')
    let feelsLikeBl = document.querySelector('#feelsLike')

    let type = currenttempType === 'C' ? 'C' : 'F'
    let temp = currenttempType === 'C' ? val.temp_c : val.temp_f
    let feelsLike = currenttempType === 'C' ? val.feelslike_c : val.feelslike_f

    tempBl.innerHTML = parseInt(temp) + "°" + type
    feelsLikeBl.innerHTML = "Feels like: <span>" + parseInt(feelsLike) + "°" + type + "</span>"

    let sunrise = document.querySelector('#sunriseTime')
    let sunset = document.querySelector('#sunsetTime')

    sunrise.innerHTML = astro.sunrise
    sunset.innerHTML = astro.sunset


    let cond = document.querySelector('#condition')
    cond.innerHTML = val.condition.text
    let mainImg = document.querySelector('#mainImg')
    mainImg.src = setMainIcon(val.condition.text)


    let humidity = document.querySelector('#humidity')
    let windSpeed = document.querySelector('#windSpeed')
    let pressure = document.querySelector('#pressure')
    let uv = document.querySelector('#uv')

    humidity.innerHTML = val.humidity + "%"
    windSpeed.innerHTML = val.wind_kph + "km/h"
    pressure.innerHTML = val.pressure_mb + "hPa"
    uv.innerHTML = val.uv

}
const setMainIcon = (text) => {
    //let mainImg = document.querySelector('#mainImg')
    if (text.toLowerCase().includes('sun')) {
        return "./images/clear 1.png"
    }
    else if (text.toLowerCase().includes('rain')) {
        return "./images/drizzle 1.png"
    }
    else if (text.toLowerCase().includes('mist')) {
        return "./images/mist 1.png"
    }
    else if (text.toLowerCase().includes('cloudy')) {
        return "./images/clouds 1.png"
    }
    else if (text.toLowerCase().includes('snow')) {
        return "./images/rain 2.png"
    }



}

const setForecast = (val) => {

    const forcastBlock = document.querySelector('.five-days-podcast')

    forcastBlock.innerHTML = '<h3>5 Days Forecast</h3>'

    val.forEach((item) => {
        const temp = currenttempType === 'C' ? item.day.maxtemp_c : item.day.maxtemp_f
        const type = currenttempType === 'C' ? 'C' : 'F'
        const path = setMainIcon(item.day.condition.text)
        const date = format(new Date(item.date), "EEEE, dd LLL")

        const row = document.createElement('div')
        row.classList.add('daily-forecast')

        row.innerHTML = `
            <img class="fdf-icon" src="${path}" alt="">
            <h5 class="fdf-degree">${parseInt(temp)}°${type}</h5>
            <p class="fdf-date">${date}</p>`

        forcastBlock.appendChild(row)


    })

}

const setHourlyForecast = (val) => {

    const arr = val.hour.filter(item => item.time.match(/12:00|15:00|18:00|21:00|00:00/))

    const hourlyForcastBlock = document.querySelector('.hours')

    hourlyForcastBlock.innerHTML = " "

    arr.forEach((item) => {
        

        const block = document.createElement('div')
        block.classList.add('weather-per-hour')
        const hour = item.time.split(' ')[1]
        const temp = currenttempType === 'C' ? item.temp_c: item.temp_f
        const type = currenttempType === 'C' ? 'C' : 'F'
        const wind = item.wind_kph


        if(hour === '21:00' || hour === "00:00"){
            block.classList.add('night')
        }


        block.innerHTML = `
        <h5 class="tph-hour">${hour}</h5>
        <img class="tph-icon" src="./images/clear 1.png" alt="">
        <h6 class="tph-degree">${parseInt(temp)}°${type}</h6>
        <img class="wind-dir"style="transform: rotate(${arrowDirection[item.wind_dir]})" src="./images/navigation 1.png" alt="">
        <h5 class="tph-wind">${parseInt(wind)}km/h</h5>`

        hourlyForcastBlock.appendChild(block)


    })


}

const arrowDirection = {
    'N': '0deg',
    'NNE': '23deg',
    'NE': '45deg',
    'ENE': '60deg',
    'E': '90deg',
    'ESE': '100deg',
    'SE': '130deg',
    'SSE': '160deg',
    'S': '180deg',
    'SSW': '-160deg',
    'SW': '-130deg',
    'WSW': '-100deg',
    'W': '-90deg',
    'WNW': '-60deg',
    'NW': '-45deg',
    'NNW': '-23deg',
    }




const getData = async ( city = 'Yerevan') => {
    try {
        let response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=1685cc285fcd4dfdb44163944240307&q=${city}&days=5&aqi=no&alerts=no`)
        if(!response.ok){
            console.log("something went wrong")
            return
        }
        let objRes = await response.json()
        setLocationAndTimeBlock(objRes.location.name, objRes.location.localtime)
        setWeatherInfo(objRes.current, objRes.forecast.forecastday[0].astro)
        setForecast(objRes.forecast.forecastday)
        setHourlyForecast(objRes.forecast.forecastday[0])
    }
    catch (error) {
        console.log("something went wrong", error)
    }
}

getData()

const mainBlock = document.querySelector('.main')
const themeToggle = document.querySelector('.toggle-wrapper')

themeToggle.addEventListener('click', () => {
    mainBlock.classList.toggle('dark')
})



const cel = document.querySelector('#celsiusBtn')
const far = document.querySelector('#farenheitBtn')

cel.addEventListener('click', () => {
    currenttempType = 'C'
    cel.classList.add('active')
    far.classList.remove('active')
    getData()
})

far.addEventListener('click', () => {
    currenttempType = 'F'
    far.classList.add('active')
    cel.classList.remove('active')
    getData()
})



const searchInput = document.querySelector('#searchInput')
const searchButton = document.querySelector('#searchButton')

searchButton.addEventListener('click', () => {
    getData(searchInput.value)
})