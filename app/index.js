const getData = async () => {
    try {
        let response = await fetch("http://api.weatherapi.com/v1/forecast.json?key=1685cc285fcd4dfdb44163944240307&q=Yerevan&days=5&aqi=no&alerts=no")
        if(!response.ok){
            console.log("something went wrong")
            return
        }
        let objRes = await response.json()
        setCityValue(objRes.location.name)
        setCurrentTimeValue(objRes.location.localtime)
        console.log(objRes)
    }
    catch (error) {
        console.log("something went wrong")
    }
}

getData()

const setCityValue = (value) => {
    let city = document.querySelector('#city')

    city.innerHTML = value
}

const setCurrentTimeValue = (value) => {
    let time = document.querySelector('#time')
    const arr = value.split(' ')

    time.innerHTML = arr[1]
}
