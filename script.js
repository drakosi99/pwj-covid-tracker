

window.onload = () => {
    getCountryData();
}


var map;
var infoWindow;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 30, lng: 0 },
        zoom: 2,
        styles: mapStyle
    });
    infoWindow = new google.maps.InfoWindow();
}

const getCountryData = () => {
    fetch("https://corona.lmao.ninja/v2/countries")
        .then((response) => {
            return response.json()
        }).then((data) => {
            showDataOnMap(data);
            showDataInTable(data);
        })
}

const buildChart = () => {
    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                label: 'My First dataset',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5, 2, 20, 30, 45]
            }]
        },

        // Configuration options go here
        options: {}
    });
}

const openInfoWindow = () => {
    infoWindow.open(map);
}

const showDataOnMap = (data) => {
    data.map((country) => {
        let countryCenter = {
            lat: country.countryInfo.lat,
            lng: country.countryInfo.long
        }

        var countryCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: countryCenter,
            radius: country.cases
        });

        var html = `
            <div class="info-container">
                <div class="info-flag" style="background-image: url(${country.countryInfo.flag});">
                </div>
                <div class="info-name">
                    ${country.country}
                </div>
                <div class="info-confirmed">
                    Total: ${country.cases}
                </div>
                <div class="info-recovered">
                    Recovered: ${country.recovered}
                </div>
                <div class="info-deaths">   
                    Deaths: ${country.deaths}
                </div>
            </div>
        `

        var infoWindow = new google.maps.InfoWindow({
            content: html,
            position: countryCircle.center
        });
        google.maps.event.addListener(countryCircle, 'mouseover', function () {
            infoWindow.open(map);
        });

        google.maps.event.addListener(countryCircle, 'mouseout', function () {
            infoWindow.close();
        })

    })

}

const showDataInTable = (data) => {
    var html = '';
    data.forEach((country) => {
        html += `
        <tr>
            <td>${country.country}</td>
            <td>${country.cases}</td>
            <td>${country.recovered}</td>
            <td>${country.deaths}</td>
        </tr>
        `
    })
    document.getElementById('table-data').innerHTML = html;
}

