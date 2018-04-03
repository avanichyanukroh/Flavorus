//API Url's
let TASTEDIVE_SEARCH_URL = 'https://tastedive.com/api/similar?k=303566-Numu-0SMN2P46&info=1&q=movie:';
let TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie?api_key=bd392b20bbcc4afe8b0b8e5db2dc7e99';

//Global variables
let TMDBQueryList;
let moreInfo;
let exactMovieTitleList = [];
let exactMovieTitleMap = {};
let userInputFeedback = "movies";
let userQuery;
let resultsLength;

//watch for when Movies tab gets selected to search for only movies.
function watchMovieToggle() {
  $('.movie-search-toggle').click(function() {
    event.preventDefault();

    $(this).css("background", "#F4F4F4");
    $('.tv-shows-search-toggle').css("background", "lightgray");

    $('#js-query').attr("placeholder", "Search for suggested movies similar to...");
    userInputFeedback = "movies";
    TASTEDIVE_SEARCH_URL = 'https://tastedive.com/api/similar?k=303566-Numu-0SMN2P46&info=1&q=movie:';
    TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie?api_key=bd392b20bbcc4afe8b0b8e5db2dc7e99';

  });
}

//watch for when TV shows tab gets selected to search for only TV shows.
function watchTvShowsToggle() {
  $('.tv-shows-search-toggle').click(function() {
    event.preventDefault();

    $(this).css("background", "#F4F4F4");
    $('.movie-search-toggle').css("background", "lightgray");

    $('#js-query').attr("placeholder", "Search for suggested tv shows similar to...");
    userInputFeedback = "tv shows";
    TASTEDIVE_SEARCH_URL = 'https://tastedive.com/api/similar?k=303566-Numu-0SMN2P46&info=1&q=show:';
    TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/tv?api_key=bd392b20bbcc4afe8b0b8e5db2dc7e99';

  });
}

//watch submit event to send user input to Taste Dive Api
function watchSubmit() {
  $('.js-search-form').submit(function(event) {
      event.preventDefault();

      //clears all data collected from previous query if applicable
      $(".js-search-results").empty();
      TMDBQueryList = 0;
      exactMovieTitleList = [];
      exactMovieTitleMap = {};
      userQuery = 0;
      resultsLength = 0;

      const userInput = $(this).find('#js-query');
      const query =  userInput.val();
      userQuery = query;

      userInput.val("");
      getDataFromTasteDiveApi(query, queryToTMDBApi);
      });
}

//-------------------------------------------------------------------------------------------------------
//tastedive api ajax request
function getDataFromTasteDiveApi(searchTerm, callback) {
  
  const settings = {
    url: TASTEDIVE_SEARCH_URL + searchTerm,
    type: 'GET',
    dataType: 'jsonp',
    success: callback
    };

  $.ajax(settings).done(function (response) {
  console.log(response);
  });
}


function queryToTMDBApi(data) {

  let suggestedMoviesNameOnly = [];
  let moreInfoLinks = [];

  for (let i = 0; i < data.Similar.Results.length; i ++) {

      let suggestedMoviesList = data.Similar.Results[i].Name;

      let MoreInfoLink = {

        Name: data.Similar.Results[i].Name,
        wTeaser: data.Similar.Results[i].wTeaser,
        wUrl: data.Similar.Results[i].wUrl,
        yUrl: data.Similar.Results[i].yUrl,
        yID: data.Similar.Results[i].yID
      };

      suggestedMoviesNameOnly.push(suggestedMoviesList);
      moreInfoLinks.push(MoreInfoLink);
  }

  //sent to global variable to use the list of suggested titles later in another function
  TMDBQueryList = suggestedMoviesNameOnly;
  moreInfo = moreInfoLinks;

  for (let i = 0; i < suggestedMoviesNameOnly.length; i ++) {

    getDataFromTMDBApi(suggestedMoviesNameOnly[i], filterOnlyExactTitle);

  }

//setTimout function to give time for requested data to be received
  setTimeout(function() {

    exactMovieTitleList.sort(function( a , b ) {

      return a.flavorus_rating > b.flavorus_rating ? -1 : 1;

    });

    renderAssortedMovieList(exactMovieTitleList);

    //if results come back empty, this gives user feedback
    if (resultsLength == undefined || resultsLength == 0) {

      $(".suggested-results").html(`

          <h2 class="userInputFeedback">Could not find suggested ${userInputFeedback} result with the title "${userQuery}". Please try again.</h2>

        `);

    }

    //else return length, search type, and their query.
    else {
      $(".suggested-results").html(`

      <h2 class="userInputFeedback">Total of "${resultsLength}" suggested ${userInputFeedback} to watch similar to "${userQuery}".</h2>

    `);
    }
  
  }, 1000);

}


function renderAssortedMovieList(results) {
console.log(results);
console.log(moreInfo);
  for (let i = 0; i < results.length; i ++) {

    if (results[i].flavorus_rating > 100) {

        results[i].flavorus_rating = 100
    };

    if (userInputFeedback == "movies") {
      $(".js-search-results").append(
        `
      <div class="movieContainer row">
        <div class="movieOverviewPage">
        <img src="https://image.tmdb.org/t/p/w500/${results[i].poster_path}" alt="poster for the movie titled ${results[i].title}" class="poster col-3">
          <div class="movieContentContainer col-9">
            <h3 class="movieTitle">${results[i].title}</h3>
            <p class="movieReleaseDate">${results[i].release_date}</p>

            <p>${results[i].flavorus_rating}% Flavorus Rating</p>
            <div class="wa-star-bar-rating"><i style="width: ${results[i].flavorus_rating}%"></i></div>

            <p class="overviewDescription">Overview</p>
            <p class="movieOverview">${results[i].overview}</p>

            <div class="moreInfoContainer">
              <a href="${results[i].wUrl}" target="_blank" class="moreInfo">More Info</a>
              <a href="${results[i].yUrl}" target="_blank" class="trailer">Trailer</a>
            </div>
          </div>
        </div>
      </div>
              `
      );
    }
    else if (userInputFeedback == "tv shows") {
      $(".js-search-results").append(
        `
      <div class="movieContainer row">
        <div class="movieOverviewPage">
        <img src="https://image.tmdb.org/t/p/w500/${results[i].poster_path}" alt="poster for the movie titled ${results[i].name}" class="poster col-3">
          <div class="movieContentContainer col-9">
            <h3 class="movieTitle">${results[i].name}</h3>
            <p class="movieReleaseDate">${results[i].first_air_date}</p>

            <p>${results[i].flavorus_rating}% Flavorus Rating</p>
            <div class="wa-star-bar-rating"><i style="width: ${results[i].flavorus_rating}%"></i></div>

            <p class="overviewDescription">Overview</p>
            <p class="movieOverview">${results[i].overview}</p>

            <div class="moreInfoContainer">
              <a href="${results[i].wUrl}" target="_blank" class="moreInfo">More Info</a>
              <a href="${results[i].yUrl}" target="_blank" class="trailer">Trailer</a>
            </div>

          </div>
        </div>
      </div>
        `
      );
    }
  }
}

//---------------------------------------------------------------------------------------------------------
//TMDB api search code
function getDataFromTMDBApi(searchTerm, callback) {
  
  const settings = {
    url: TMDB_SEARCH_URL + "&language=en-US" + "&page=1" + "&include_adult=false" + "&query=" + searchTerm,
    "async": true,
    "crossDomain": true,
    "method": "GET",
    "headers": {},
    "data": "{}",
    success: callback
    };

  $.ajax(settings).done(function (response) {
  console.log(response);
  });
}

//takes the results from the TMDB get request and only keep the ones with exact query title
function filterOnlyExactTitle(data) {

  //sends results length to global variable to return user feedback.
  resultsLength = data.results.length;

  if (userInputFeedback == "movies") {

    for (let k = 0; k < data.results.length; k ++) {

      for (let i = 0; i < TMDBQueryList.length; i ++) {

          if (data.results[k].title === TMDBQueryList[i]) {

              if (!(data.results[k].title in exactMovieTitleMap)) {

                let exactMovieTitle = {
                  title: data.results[k].title,
                  poster_path: data.results[k].poster_path,
                  release_date: data.results[k].release_date,
                  vote_average: data.results[k].vote_average * 10,
                  popularity: data.results[k].popularity,
                  overview: data.results[k].overview,
                  flavorus_rating: Math.ceil(((100 - (((data.results[k].vote_average * 10) + data.results[k].popularity) / 2)) * .25) + 
                                  (((data.results[k].vote_average * 10) + data.results[k].popularity) / 2))

                };

                exactMovieTitleMap[data.results[k].title] = 1;

                exactMovieTitleList.push(exactMovieTitle);

              };
        }
      }
    }
  }

  else if (userInputFeedback == "tv shows") {

    for (let k = 0; k < data.results.length; k ++) {

      for (let i = 0; i < TMDBQueryList.length; i ++) {

          if (data.results[k].name == TMDBQueryList[i]) {

              if (!(data.results[k].name in exactMovieTitleMap)) {

                let exactMovieTitle = {
                  name: data.results[k].name,
                  poster_path: data.results[k].poster_path,
                  first_air_date: data.results[k].first_air_date,
                  vote_average: data.results[k].vote_average * 10,
                  popularity: data.results[k].popularity,
                  overview: data.results[k].overview,
                  flavorus_rating: Math.ceil(((100 - (((data.results[k].vote_average * 10) + data.results[k].popularity) / 2)) * .5) + 
                                  (((data.results[k].vote_average * 10) + data.results[k].popularity) / 2))

                };

                exactMovieTitleMap[data.results[k].name] = 1;

                exactMovieTitleList.push(exactMovieTitle);

              };
        }
      }
    }
  }

    for (let k = 0; k < exactMovieTitleList.length; k ++) {

      for (let i = 0; i < moreInfo.length; i ++) {

        if (exactMovieTitleList[k].title == moreInfo[i].Name || exactMovieTitleList[k].name == moreInfo[i].Name) {

          exactMovieTitleList[k].wTeaser = moreInfo[i].wTeaser;
          exactMovieTitleList[k].wUrl = moreInfo[i].wUrl;
          exactMovieTitleList[k].yUrl = moreInfo[i].yUrl;
          exactMovieTitleList[k].yID = moreInfo[i].yID;
        }
      }
    }
  console.log(exactMovieTitleList);
}

$(watchMovieToggle);
$(watchTvShowsToggle);
$(watchSubmit);