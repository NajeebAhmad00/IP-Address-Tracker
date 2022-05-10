const IPAddressField = document.querySelector('#ip-address')
const locationField = document.querySelector('#location')
const timezoneField = document.querySelector('#timezone')
const ispField = document.querySelector('#isp')
const button = document.querySelector('button')
const map = document.querySelector('#map')
const topBar = document.querySelector('.top')
const info = document.querySelector('.info')
const api_key = "at_U04HhS9vrN1UnZuYzNYUqNEiiA5ig";

let inputField = document.querySelector('input')
let ip
let latitude
let longitude
let locationName
let mymap

$.getJSON("https://api.ipify.org?format=json",
    function (data) {
        ip = data.ip
    })

$(function () {
    tracker()
})

button.addEventListener('click', () => {
    ip = inputField.value
    tracker()
})

function tracker() {
    $.ajax({
        url: "https://geo.ipify.org/api/v1",
        data: { apiKey: api_key, ipAddress: ip },
        success: function (data) {
            IPAddressField.innerHTML = data.ip
            locationField.innerHTML = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`
            timezoneField.innerHTML = `UTC ${data.location.timezone}`
            ispField.innerHTML = data.isp
            inputField.value = data.ip
            latitude = data.location.lat
            longitude = data.location.lng
            locationName = `${data.location.city}, ${data.location.region}, ${data.location.country}`
            setTimeout(() => {
                mymap ? updateMap() : setMap()
            }, 500)
        }
    })
}

function setMap() {
    mymap = L.map('map').setView([latitude, longitude], 13)

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYmVucmF5IiwiYSI6ImNrdWF5OHp2czBpZ3oydm14NWJpYnEyOXUifQ.KKEGYDWR3ALAChxvyGKG-g'
    }).addTo(mymap);
    let marker = L.marker([latitude, longitude]).addTo(mymap);
    marker.bindPopup(locationName).openPopup();
}

function updateMap() {
    L.marker([latitude, longitude]).addTo(mymap).bindPopup(locationName).openPopup()
    mymap.setView([latitude, longitude], 13, { animate: true, pan: { duration: 1 } })
}