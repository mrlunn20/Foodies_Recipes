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