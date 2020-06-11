$(document).ready(function(){

    //temporary variables only for development
    //TODO: delete the two variables below when releasing the project
    let srchRandomEP = "https://arielcc88.github.io/UT-FSWD-DEPLOYED/assets/srch_random.json";
    let srchByIngrdEP = "https://arielcc88.github.io/UT-FSWD-DEPLOYED/assets/srch_by_ingrd.json";

    /*-------------------------------------------
                    VAR DECLARATION
    -------------------------------------------*/
    //maps and geolocation vars
    let pos;
    let map;
    let bounds;
    let infoWindow;
    let currentInfoWindow;
    let service;
    let infoPane;
    let usrGeoFlag = false; //indicates state of geolocation permissions by user. 

     /*-------------------------------------------
                    MAIN
    -------------------------------------------*/
    //User actions

// Event listenter for Click in text area for "Search Recipes"

    $("#sch-button").on("click", function(event){
    //prevent default submission
        event.preventDefault();
        if(isTextBoxEmpty( $("#search-input").val())){
            //text box empty
        }
        else{
            //search by ingredient 
        }
    });

    function isTextBoxEmpty(textString){
        if (textString == '') {
            return true
            
        } else {
        return false
        }
    }


    /*-------------------------------------------
                    FUNCTIONS
    -------------------------------------------*/
    //TODO: Un-comment function below when releasing project.
    // function fnQueryRcpAPI(strEndPoint){
    //     //apiSettings get passed into ajax call
    //     let apiSettings = {
    //         "async": true,
    //         "crossDomain": true,
    //         "url": strEndPoint,
    //         "method": "GET",
    //         "headers": {
    //             "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    //             "x-rapidapi-key": "f2143b91dcmsh2ab34738e9c4db3p18fd8ajsne4052a78d8a5"
    //         }
    //     }

    //     //querying endpoint at rapid API
    //     $.ajax(apiSettings).then(function (response) {
    //         console.log(response);
    //         //TODO: call next step function to extract recipe names and query google's API
    //     });
    // }

    //Temp function for development only
    //TODO: Delete function below when releasing project. Only used for development stage
    function fnQueryRcpAPI(strEndPoint){
        //apiSettings get passed into ajax call
        let apiSettings = {
            "async": true,
            "url": strEndPoint,
            "method": "GET",
        }

        //querying endpoint at rapid API
        $.ajax(apiSettings).then(function (response) {
            console.log(response);
            //TODO: call next step function to extract recipe names and query google's API
        });
    }


    function fnGeolocationUser(mapCtnerId, rcpName){
        if (!usrGeoFlag) {
            //either browser doesn't support geolocation or usr blocked permissions.
            //HTML5 geolocation
            if (navigator.geolocation) { //checking if browser supports geolocation property
                //navigator.geolocation.getCurrentPosition(success, error, options)
                navigator.geolocation.getCurrentPosition(position => { //on success a callback function is called with position object as only input param.
                pos = {
                    //pos object to center new map on.
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                usrGeoFlag = true; 
                console.log("geo approved ", usrGeoFlag);
                console.log("usr coords ", pos);
                fnMapsRender(usrGeoFlag, true, mapCtnerId, rcpName);
            }, () => {
                // Browser supports geolocation, but user has denied permission
                fnMapsRender(usrGeoFlag, true, mapCtnerId, rcpName);
                });
            } else {
                // Browser doesn't support geolocation
                fnMapsRender(usrGeoFlag, false, mapCtnerId, rcpName);
            }
        }
        else {
            //usr has already granted geolocation permissions.
            fnMapsRender(usrGeoFlag, true, mapCtnerId, rcpName);
        }        
    }

    // Handle a geolocation error
    function fnMapsRender(geoFlag, browserHasGeolocation, mapCtnerElementId, rcpName) {
        //clearing content on element
        $("#" + mapCtnerElementId).empty();
        // Initialize variables
        bounds = new google.maps.LatLngBounds(); //new instance of Maps API Class LatLngBounds. Represents a rectangle in geographical coordinates
        infoWindow = new google.maps.InfoWindow; //popup window above the map at a given location to display content
        currentInfoWindow = infoWindow;
        //checking geoFlag to determine whether normal rendering or default location
        if (geoFlag) {
            //normal rendering. usr's location
            map = new google.maps.Map(document.getElementById(mapCtnerElementId), {
                    center: pos,
                    zoom: 15
                });
            bounds.extend(pos); //define the geographical rectangle with pos as center reference.
            infoWindow.setPosition(pos); //defining location on the Map where the info window will be located
            infoWindow.setContent("You are here."); //defining content of info Window
            infoWindow.open(map); //loading info window on map element
            map.setCenter(pos); //defining center view of map on user's location
        }
        else {
            //geolocation issues
            //setting default values for map object
            // Set default location to Central Texas
            pos = { lat: 30.266, lng: -97.733 };
            console.log("geolocation error ", pos);
            map = new google.maps.Map(document.getElementById(mapCtnerElementId), {
              center: pos,
              zoom: 15
            });
    
            // Display an InfoWindow at the map center
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
              'Geolocation permissions denied. Using default location.' :
              'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(map);
            currentInfoWindow = infoWindow;
        }

        // Call Places Nearby Search on either usr's location or default
        getNearbyPlaces(pos, rcpName);
    }

    // Run a Nearby Places Search - Places where recipe could be served
    function getNearbyPlaces(position, rcpName) {
        //request object to be passed into service request method
        let request = {
            location: position,
            rankBy: google.maps.places.RankBy.DISTANCE,
            keyword: rcpName
        };
    
        service = new google.maps.places.PlacesService(map); // applying to map object to be displayed
        service.nearbySearch(request, nearbyCallback); //gets results -> create markers
    }

        // Handle the results (up to 20) of the Nearby Search
    function nearbyCallback(srvResults, srvStatus) {
        if (srvStatus == google.maps.places.PlacesServiceStatus.OK) {
            //verifying service executed correctly -> call create markers
            createMarkers(srvResults);
        }
    }

    // Set markers at the location of each place result
    function createMarkers(places) {
        places.forEach(place => {
            let marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name
            });
    
            // click listener to each marker
            google.maps.event.addListener(marker, 'click', () => {
                let request = {
                    placeId: place.place_id,
                    fields: ['name', 'formatted_address', 'geometry', 'rating',
                    'website', 'photos']
                };
    
                /* places details only queried on demand to avoid hitting API rate limits*/
                service.getDetails(request, (placeResult, status) => {
                    showDetails(placeResult, marker, status)
                });
            });
    
            // Adjust the map bounds to include the location of this marker
            bounds.extend(place.geometry.location);
        });
        /* Once all the markers have been placed, adjust the bounds of the map to
        * show all the markers within the visible area. */
        map.fitBounds(bounds);
    }
})

