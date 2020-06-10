$(document).ready(function(){

    //temporary variables only for development
    //TODO: delete the two variables below when releasing the project
    let srchRandomEP = "https://arielcc88.github.io/UT-FSWD-DEPLOYED/assets/srch_random.json";
    let srchByIngrdEP = "https://arielcc88.github.io/UT-FSWD-DEPLOYED/assets/srch_by_ingrd.json";

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
  
  //calling predicate function with isTextBoxEmpty Function and we pass 
  //the value of the text box

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
})
