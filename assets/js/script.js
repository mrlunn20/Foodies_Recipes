$(document).ready(function(){
    $('.collapsible').collapsible();
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
    let schRandomFlag = false;
    let gblRcpObj;
     /*-------------------------------------------
                    MAIN
    -------------------------------------------*/
    //User actions
    // Event listenter for Click in text area for "Search Recipes"
    $(".sch-form").on("submit", function(event){
        event.preventDefault();
        let strRcpEndPoint;
        if(isTextBoxEmpty($("#search-input").val())){
            //text box empty
           strRcpEndPoint = fnRcpEndPointAssembly();
           schRandomFlag = true;
        }
        else{
            //search by ingredient -- i.e apples,flour,sugar ---   apples,flour ,Sugar  
            strRcpEndPoint = fnRcpEndPointAssembly($("#search-input").val());
            schRandomFlag = false;
        }
        //call function to query rcp API
        fnQueryRcpAPI(strRcpEndPoint, schRandomFlag);

        //display section with results
        fnClassHiddenRemove();

        //scroll to element
        fnScrollToElement("rcp-result-section");
    });

    $("#rcpsearch-btn").on("click", function(event){
        event.preventDefault();
        let strRcpEndPoint;
        if(isTextBoxEmpty($("#search-input").val())){
            //text box empty
           strRcpEndPoint = fnRcpEndPointAssembly();
           schRandomFlag = true;
        }
        else{
            //search by ingredient -- i.e apples,flour,sugar ---   apples,flour ,Sugar  
            strRcpEndPoint = fnRcpEndPointAssembly($("#search-input").val());
            schRandomFlag = false;
        }
        //call function to query rcp API
        fnQueryRcpAPI(strRcpEndPoint, schRandomFlag);

        //display section with results
        fnClassHiddenRemove();

        //scroll to element
        fnScrollToElement("rcp-result-section");
    });

    $(document).on("click", ".card-content", (event) => {
        event.stopPropagation();
        fnRcpActiveToggle();
        fnCreatePanelCollabInfo(event.currentTarget.getAttribute("data-eindex"));
        event.currentTarget.classList.add("rcpcard-active");
    });

    //maps listener
    $(document).on("click", ".mp-load", (event) => {
        event.stopPropagation();
        //debugger
        fnGeolocationUser(event.currentTarget.getAttribute("data-mapctner"), event.currentTarget.getAttribute("data-rcpname"));
    });

    /*-------------------------------------------
                    FUNCTIONS
    -------------------------------------------*/
    //predicate function -> text input empty
    function isTextBoxEmpty(textString){
        if (textString == '') {
            return true
        } else { 
            return false
        }
    }

    //change class on result section
    function fnClassHiddenRemove(){
        $("#rcp-result-section").removeClass("d-hidden");
    }

    //scroll to element
    function fnScrollToElement(elemId){
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#" + elemId).offset().top
        }, 1000);
    }

    //changing active class for rcp cards
    function fnRcpActiveToggle(){
        $(".rcpcard-active").removeClass("rcpcard-active");
    }

    //food API endpoint assembly
    function fnRcpEndPointAssembly(strIngredientList){
        let endPointURL;
        //optional argument (ingredient list)
        //if list is passed, replace commas with comma URL encoding '%252C'
        strIngredientList = strIngredientList || null;
        if (!strIngredientList) {
           endPointURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?number=5";
           //TODO: remove line below before release 
           //endPointURL = srchRandomEP;
        }
        else{
            //using ingredient list
            strIngredientList = strIngredientList.trim().toLowerCase(); //trimming and lower case change
            strIngredientList = strIngredientList.replace(/\s/g, ""); //replacing any inner space in the string
            strIngredientList = strIngredientList.replace(/,/g, "%252C"); //replacing comma with comma encoding for URL
            endPointURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=5&ranking=1&ignorePantry=false&ingredients=" + strIngredientList;
            //endPointURL = srchByIngrdEP;
        }
        //return end point URL
        return endPointURL
    }

    //TODO: Un-comment function below when releasing project.
    function fnQueryRcpAPI(strEndPoint, isRandomSch){
        //apiSettings get passed into ajax call
        let apiSettings = {
            "async": true,
            "crossDomain": true,
            "url": strEndPoint,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
                "x-rapidapi-key": "f2143b91dcmsh2ab34738e9c4db3p18fd8ajsne4052a78d8a5"
            }
        }

        //querying endpoint at rapid API
        $.ajax(apiSettings).then(function (response) {
        if (isRandomSch) {
            //call DOMAssembly function and pass reponse obj
            fnRcpListDOMAssembly(response, isRandomSch);
        } else {
            //search by ingred extension
            fnExtendSchByIngredients(response);
        }
        });
    }

    //Temp function for development only
    //TODO: Delete function below when releasing project. Only used for development stage
    // function fnQueryRcpAPI(strEndPoint, isRandomSch){
    //     //apiSettings get passed into ajax call
    //     let apiSettings = {
    //         "async": true,
    //         "url": strEndPoint,
    //         "method": "GET",
    //     }

    //     //querying endpoint at rapid API
    //     $.ajax(apiSettings).then(function(response) {
    //         if (isRandomSch) {
    //             //call DOMAssembly function and pass reponse obj
    //             fnRcpListDOMAssembly(response, isRandomSch);
    //         } else {
    //             //search by ingred extension
    //             fnRcpListDOMAssembly(response);
    //         }
    //         // console.log("fnQueryRcpAPI ajax end here");
    //     });
    // }

    function fnExtendSchByIngredients(rcpObjArr){
        let rcpInfoObj = {};
        let rcpIDString = "";
        let apiBulkQueryURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk?ids=";
        //api settings here
        let apiBulkSettings = {
            "async": true,
            "crossDomain": true,
            "url": "",
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
                "x-rapidapi-key": "f2143b91dcmsh2ab34738e9c4db3p18fd8ajsne4052a78d8a5"
            }
        };
        //----
        //extract the recipe ids for bulk query
        rcpObjArr.forEach((element,index) => {
            rcpIDString += element.id
            if (!(index === rcpObjArr.length - 1)) {
                rcpIDString += ",";
            }
        });
        //updating apiBulkSettings with url
        apiBulkSettings["url"] = apiBulkQueryURL + rcpIDString;

        //second ajax call to rcp API to extract additional information
        $.ajax(apiBulkSettings).then(function(responseBulk){
            if (responseBulk) {
                //ensuring no empty array is pushed to previous object
                rcpInfoObj["recipes"] = responseBulk;
                //pushing bulk object into schByIng object
                rcpObjArr.push(rcpInfoObj);
                //console.log("search by Ing updated ", rcpObjArr);

                //call DOM Assembly function below
                fnRcpListDOMAssembly(rcpObjArr, false);
            }
        });
    }



    function fnRcpListDOMAssembly(rcpData, randomSDOM){
        //recipe result list creation
        //initiate -> remove nay previous result
        $("#rcp-list-ul").empty();
        //extract obj with recipe information
        let objRecipes;
        if (randomSDOM) {
            objRecipes = rcpData.recipes;
            // console.log("random");
        }
        else {
            objRecipes = rcpData[rcpData.length - 1].recipes;
            // console.log("ingredients");
        }
        // console.log(objRecipes);
        gblRcpObj = objRecipes;
        objRecipes.forEach((element,index) => {
            fnCreateRcpCardElement(element, index);
        });
        fnCreatePanelCollabInfo(0);
    }

    function fnCreateRcpCardElement(rcpInfo, elNumInd){
        let ilCard = $("<li>");
        ilCard.attr({"class": "rcp_title_card"});
        //card content
        let cardDiv = $("<div>");
        cardDiv.attr({"class": "card horizontal hoverable"});
        //card stacked div
        let cardstDiv = $("<div>");
        cardstDiv.attr({"class": "card-stacked"});
        //card content div
        let cardCntDiv = $("<div>");
        cardCntDiv.attr({
            "class": "card-content",
            "data-eIndex": elNumInd
        });
        //title
        let titleSpan = $("<span>");
        titleSpan.attr({"class": "card-title grey-text text-darken-4"});
        titleSpan.text(rcpInfo.title);
        //icon
        // let titleIcon = $("<i>");
        // titleIcon.attr({"class": "material-icons ic-title-rcp"});
        // titleIcon.text("restaurant_menu");
        //action section in card
        let cardAction = $("<div>");
        cardAction.attr({"class": "card-action"});
        //save recipe link
        let svRcpLink = $("<a>");
        svRcpLink.text("Save Recipe");
        //plus sing icon for svRcpLink
        let svRcpIcon = $("<i>");
        svRcpIcon.attr({"class": "material-icons ic-save-rcp"});
        svRcpIcon.text("add");

        //adding icon to span
        // titleSpan.prepend(titleIcon);
        // appending span to card content
        cardCntDiv.append(titleSpan);
        //appending card content to card-stacked
        cardstDiv.append(cardCntDiv);

         //prepend icon to a tag
         svRcpLink.prepend(svRcpIcon);
         //adding link to card action div
         cardAction.append(svRcpLink);
        //appending card action to card-stacked
        // cardstDiv.append(cardAction);

        //append card stacked to card horizontal
        cardDiv.append(cardstDiv);

        //card to il element
        ilCard.append(cardDiv);

        //append ilCard to ul element
        $("#rcp-list-ul").append(ilCard);

         //activating first recipe card
         $("div[data-eindex='0']").addClass("rcpcard-active");
    }

    function fnCreatePanelCollabInfo(rcpIndex){
        let rcpInfofromEl = gblRcpObj[rcpIndex];
        let vegetarian = rcpInfofromEl.vegetarian ? "Yes" : "No";
        let vegan = rcpInfofromEl.vegan ? "Yes" : "No";
        let dairy = rcpInfofromEl.dairyFree ? "Yes" : "No";
        let gluten = rcpInfofromEl.glutenFree ? "Yes" : "No";
        let servings = rcpInfofromEl.servings ? rcpInfofromEl.servings : "";
        let prepTime = rcpInfofromEl.preparationMinutes ? rcpInfofromEl.preparationMinutes : "";
        let cookTime = rcpInfofromEl.cookingMinutes ? rcpInfofromEl.cookingMinutes : "";

        //getting ingredients
        let extendedIngrd = rcpInfofromEl.extendedIngredients;
        let strIngredientsHTML = "";

        extendedIngrd.forEach((ingrdInfo, ingIndex) => {
            strIngredientsHTML += "<li>" + ingrdInfo.originalString + "</li>";
        });

        //collapsible ul
        // let ulCollapsible = $("<ul>");
        // ulCollapsible.attr({"class": "collapsible"});
        $(".collapsible").empty();
        let liCollapsibleRcp = $("<li>");
        let liCollapsibleMaps = $("<li>");
        
        liCollapsibleRcp.html(
            "<div class=\"collapsible-header\"> " + 
            "   <i class=\"material-icons\">restaurant_menu</i>" + rcpInfofromEl.title +
            "</div>" +
            "<div class=\"collapsible-body\">" +
            // "   <span>Lorem ipsum dolor sit amet.</span>" +
            "   <div class=\"row\">" +
            "       <div class=\"col s12 m4 l4\">" +
            "           <div class=\"rcpImgCtner\">" +
            "               <img src=\"" + rcpInfofromEl.image + "\" alt=\"" + rcpInfofromEl.title + "\" class=\"rcpImg\">" +
            "           </div>" + 
            "           <ul class=\"rcpFactList\">" + 
            "               <li>Vegetarian: " + vegetarian + "</li>" + 
            "               <li>Vegan: " + vegan + "</li>" + 
            "               <li>Gluten Free: " + gluten + "</li>" + 
            "               <li>Dairy Free: " + dairy + "</li>" + 
            "               <li>Servings: " + servings + "</li>" + 
            "               <li>Prep. Time(min): " + prepTime + "</li>" + 
            "               <li>Cook. Time(min): " + cookTime + "</li>" + 
            "           </ul>" +
            "       </div>" + 
            "       <div class=\"col s12 m8 l8 ingrd-ctner\">" +
            "           <h5>Ingredients</h5>" + 
            "           <ul class=\"rcpFactList\">" + strIngredientsHTML + "</ul>" +
            "       </div>" +
            "       <div class=\"col s12\">" + 
            "           <h5>Summary</h5>" +
            "           <p>" + rcpInfofromEl.summary + "</p>" +
            "       </div>"+
            "       <div class=\"col s12\">" + 
            "           <h5>Instructions</h5>" +
            "           <p>" + rcpInfofromEl.instructions + "</p>" +
            "       </div>"+                    
            "   </div>" +
            "</div>"
        );
        $(".collapsible").append(liCollapsibleRcp);

        /** Maps */
        liCollapsibleMaps.html(
            "<div class=\"collapsible-header mp-load\" data-mapctner=\"mp-" + rcpInfofromEl.id + "\" data-rcpname=\"" + rcpInfofromEl.title +"\"> " + 
            "   <i class=\"material-icons\">place</i>Show Nearby Restaurants" +
            "</div>" +
            "<div class=\"collapsible-body\">" +
            "<p class=\"mp-notifier\"></p>" +
            "   <div class=\"row\">" +
            "       <div class=\"col s12 m12 l12 mp-outer-ctner\">" +
            "           <div class=\"mp-ctner\" id=\"mp-" + rcpInfofromEl.id + "\"> " +
            "           </div>" +
            "       </div>" +
            "   </div>" +
            "</div>"
        );
        $(".collapsible").append(liCollapsibleMaps);

        infoPane = document.getElementById('panel');
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
                // console.log("geo approved ", usrGeoFlag);
                // console.log("usr coords ", pos);
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
            //verifying service executed correctly -> call create markers if results were found
            createMarkers(srvResults);
        }
        else if (srvStatus == "ZERO_RESULTS"){
            //displaying nearby restaurants if no results were found for the recipe
            getNearbyPlaces(pos, "restaurant");
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

    // Builds an InfoWindow to display details above the marker
    function showDetails(placeResult, marker, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          let placeInfowindow = new google.maps.InfoWindow();
          let rating = "None";
          if (placeResult.rating) rating = placeResult.rating;
          placeInfowindow.setContent('<div><strong>' + placeResult.name +
            '</strong><br>' + 'Rating: ' + rating + '<br>' + placeResult.formatted_address +
            '</div>');
          placeInfowindow.open(marker.map, marker);
          currentInfoWindow.close();
          currentInfoWindow = placeInfowindow;
        } else {
          console.log('showDetails failed: ' + status);
        }
      }
})

