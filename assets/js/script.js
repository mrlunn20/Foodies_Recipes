<<<<<<< HEAD
// Get search history and print it to buttons
searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
// this step is skipped if there is no search history
if (searchHistory) {
    for (var i = 0; i < searchHistory.length; i++) {
        var newBtn = $("<button>");
        newBtn.text(searchHistory[i]);
        newBtn.addClass("btn btn-lg btn-block search-history-btn")
        $("#search-history").append(newBtn);
    }
}

=======
$(document).ready(function(){

    //temporary variables only for development
    //TODO: delete the two variables below when releasing the project
    let srchRandomEP = "https://arielcc88.github.io/UT-FSWD-DEPLOYED/assets/srch_random.json";
    let srchByIngrdEP = "https://arielcc88.github.io/UT-FSWD-DEPLOYED/assets/srch_by_ingrd.json";

     /*-------------------------------------------
                    MAIN
    -------------------------------------------*/
    //User actions






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
})
>>>>>>> a4c53f37859abf1d613194188a342f7efbf9a053
