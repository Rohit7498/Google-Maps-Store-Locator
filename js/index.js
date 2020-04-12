window.onload = function(){
   
}

var map;
var markers = [];
var infoWindow;


    // map options
    function initMap(){
        var options = {
            zoom:11,
            center: {lat: 34.063380, lng: -118.358080} 
        }
        // new map created
        map = new 
        google.maps.Map(document.getElementById('map'), options);
        
        infoWindow = new google.maps.InfoWindow();
        
        searchStoresFn();
        
        
    }



function searchStoresFn() {
    var searchedStores = [];
    var inpZip = document.getElementById('zip-code-input').value;
    console.log(inpZip); 
    for(var store of stores){
        var zip = store['address']['postalCode'].substring(0,5);
        if(inpZip){
            if(zip == inpZip){
                searchedStores.push(store);  
            }
        }
        else {
            searchedStores = stores; 
                
        }
        clearLocations();
        displayStores(searchedStores);
        showStoresMarker(searchedStores);
        goToMarkerOnClick();

    }
}    

function clearLocations() {
    infoWindow.close();
    for(var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}


function goToMarkerOnClick(){
    var storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function(elem, index){
        elem.addEventListener('click', function(){
            new google.maps.event.trigger(markers[index], 'click');
        });
    });
}

    function displayStores(stores){
        var storesHtml = '';
        for(var [index, store] of stores.entries()) {
            var address = store['addressLines'];
            var phone = store['phoneNumber'];
            storesHtml += `
            <div class="store-container">
            <div class="store-container-background">
                <div class="store-info-container">
                    <div class="store-address">
                        <span>${address[0]}</span>
                        <span>${address[1]}</span>     
                        
                        <!-- <i class="fas fa-circle fa-2x bullet">
                            <div class="circle" style="display: inline;">1</div>
                        </i> -->
                    </div>
                    <div class="store-phone-number">
                    ${phone}
                    </div>
                </div>
                <div class="store-number-container">
                    <div class="store-number">
                            ${++index}
                    </div>
                </div>
            </div>
        </div>       
            `;
        
            document.querySelector('.stores-list').innerHTML = storesHtml;
            //console.log(store);
        }

    }


function showStoresMarker(stores) {
    var bounds = new google.maps.LatLngBounds();
    for(var [index, store] of stores.entries()) {
        var name = store['name'];
        var address = store['addressLines'][0];
        var openStatusText = store['openStatusText'];
        var phone = store['phoneNumber'];
        var latlng = new google.maps.LatLng(
            store['coordinates']['latitude'],
            store['coordinates']['longitude']
        );
        bounds.extend(latlng);
        createMarker(latlng, address, name, openStatusText, phone, index+1);

    }
    map.fitBounds(bounds);

}

function createMarker(latlng, address, name, openStatusText, phone, index){
    var html = `<div class="store-info-window">
                    <div>
                    <div class="store-info-name">${name}</div> 
                    <div class="store-info-status">${openStatusText}</div>
                    <div class="store-info-address">
                    <div class="circle">
                        <i class="fas fa-location-arrow"></i>
                    </div>
                        ${address}
                    </div>
                    <div class="store-info-phone">
                    <div class="circle">
                        <i class="fas fa-phone-alt"></i>
                    </div>
                        ${phone}
                    </div>
                    </div>
                </div>`;
    
    var marker = new google.maps.Marker({
        map:map,
        position:latlng,
        label: index.toString()
    });
    
    google.maps.event.addListener(marker , 'click', function(){
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });

    markers.push(marker);
}