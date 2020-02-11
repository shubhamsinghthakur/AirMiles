"use strict";
let currentCity,destination,cityName;
let citySessionSet="", cityLocalset="";

let validateLogin=()=> {
    if (document.getElementById("email").value === "admin@gmail.com" &&
        document.getElementById("password").value === "admin") {
        console.log("validate login");
        initStorage();
        window.location.href="distanceCalculator.html";

    }
}

let initStorage=()=>{
    localStorage.setItem("cityLocalset",cityLocalset);
    sessionStorage.setItem("citySessionSet",citySessionSet);
}

let updateStorage=(cityName)=>{
    let updatedLocalSet=localStorage.getItem("cityLocalset");
    updatedLocalSet=updatedLocalSet+cityName.toUpperCase()+" ";
    localStorage.setItem("cityLocalset",updatedLocalSet);

    let updatedSessionSet=sessionStorage.getItem("citySessionSet");
    updatedSessionSet=updatedSessionSet+cityName.toUpperCase()+"  " ;
    sessionStorage.setItem("citySessionSet",updatedSessionSet);
}

let getCurrentCoords=  ()=>{
    try{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (currentPosition){
                currentCity = { latitude: currentPosition.coords.latitude, longitude: currentPosition.coords.longitude};
                console.log("currentCity",currentCity);
            })
        }
        else {
            document.getElementById("Distance in Miles").innerHTML = "Geolocation is not supported by this browser.";
        }
    }
    catch (e) {
        console.log(e);
    }

}

let fetchCityInfo=async()=>{
    try{
        await getCurrentCoords();
        cityName = document.getElementById("city").value;


        destination=await fetch(`https://restcountries.eu/rest/v2/capital/${cityName}`)
                          .then(data=>{return data.json()})
                          .then(data=>{return setupDestinationCity(data[0].latlng)});

        console.log(currentCity,destination);
        calHaversineDist(currentCity,destination);
    }
    catch (e) {
        console.log("e from fetch city info: ", e);
    }

}

let setupDestinationCity= (latLng)=>{
    updateStorage(cityName);
    destination = { latitude: latLng[0], longitude: latLng[1]};
    return destination;
}

let convertToRad = (diff)=>{
    return (Math.PI/180)*diff;
}

let calHaversineDist = (city1,city2)=>{
    const{mileConvertor, kmConvertor} ={mileConvertor: 3958.756 , kmConvertor:6371};
    console.log(city1,city2);
    let latDiff= convertToRad(city1.latitude-city2.latitude);
    let lonDiff= convertToRad(city1.longitude-city2.longitude);
    let lat1Rad= convertToRad(city1.latitude);
    let lat2Rad= convertToRad(city2.latitude);

    let a = Math.pow(Math.sin(latDiff/2),2)+ Math.pow(Math.sin(lonDiff/2),2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
    let rawDist= 2*Math.asin(Math.sqrt(a));;
    console.log((rawDist*mileConvertor).toFixed(2),"Miles"); //set the value to the DOM
    console.log((rawDist*kmConvertor).toFixed(2),"Kilometeres");

    document.getElementById("msg").innerHTML =`Distance from your location to ${cityName.toUpperCase()} is:`;
    document.getElementById("distInfoMiles").innerHTML =`${(rawDist*mileConvertor).toFixed(2)} Miles`;
    document.getElementById("distInfoKm").innerHTML =`${(rawDist*kmConvertor).toFixed(2)} Kilometeres`;
}

let showCitiesInSession=()=>{
    let cities = sessionStorage.getItem("citySessionSet");
    document.getElementById("citiesInSession").innerHTML =cities;
}

let showCitiesInLocal=()=>{
    let cities = localStorage.getItem("cityLocalset");
    document.getElementById("citiesInLocal").innerHTML =cities;
}

