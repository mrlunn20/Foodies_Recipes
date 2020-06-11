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
        event.preventDefault()
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


    function fnGeolocationUser(mapCtnerId){
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
                fnMapsRender(usrGeoFlag, true, mapCtnerId);
            }, () => {
                // Browser supports geolocation, but user has denied permission
                fnMapsRender(usrGeoFlag, true, mapCtnerId);
                });
            } else {
                // Browser doesn't support geolocation
                fnMapsRender(usrGeoFlag, false, mapCtnerId);
            }
        }
        else {
            //usr has already granted geolocation permissions.
            fnMapsRender(usrGeoFlag, true, mapCtnerId);
        }        
    }

    // Handle a geolocation error
    function fnMapsRender(geoFlag, browserHasGeolocation, mapCtnerElementId) {
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
            bounds.extend(pos);
            infoWindow.setPosition(pos);
            infoWindow.setContent("You are here.");
            infoWindow.open(map);
            map.setCenter(pos);
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

        // // Call Places Nearby Search on either usr's location or default
        // getNearbyPlaces(pos);
    }
})

