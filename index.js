//API Url's
const TASTEDIVE_SEARCH_URL = 'https://tastedive.com/api/similar?k=303566-Numu-0SMN2P46&info=1';
const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie?api_key=bd392b20bbcc4afe8b0b8e5db2dc7e99';

//Global variables
let TMDBQueryList;
let exactMovieTitleList = [];
let exactMovieTitleMap = {};

//watch submit event to send user input to Taste Dive Api
function watchSubmit() {
  $('.js-search-form').submit(function(event) {
      event.preventDefault();

      //clears all data collected from previous query if applicable
      $(".js-search-results").empty();
      TMDBQueryList = 0;
      exactMovieTitleList = [];
      exactMovieTitleMap = {};

      const userInput = $(this).find('#js-query');
      const query =  userInput.val();

      $(".suggested-results").html(`

          <h2>Suggested results for "${query}"</h2>

        `);

      userInput.val("");
      getDataFromTasteDiveApi(query, queryToTMDBApi);
      });
}


//tastedive api ajax request
function getDataFromTasteDiveApi(searchTerm, callback) {
  
  const settings = {
    url: TASTEDIVE_SEARCH_URL + "&q=movie:" + searchTerm,
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

  for (let i = 0; i < data.Similar.Results.length; i ++) {

      let suggestedMoviesList = data.Similar.Results[i].Name;

      suggestedMoviesNameOnly.push(suggestedMoviesList);
  }

  //sent to global variable to use the list of suggested titles later in another function
  TMDBQueryList = suggestedMoviesNameOnly;

  for (let i = 0; i < suggestedMoviesNameOnly.length; i ++) {

    getDataFromTMDBApi(suggestedMoviesNameOnly[i], filterOnlyExactTitle);

  }

//setTimout function to give time for requested data to be received
  setTimeout(function() {

    exactMovieTitleList.sort(function( a , b ) {

      return a.point_value > b.point_value ? -1 : 1;

    });

    console.log(exactMovieTitleList);

    renderAssortedMovieList(exactMovieTitleList);
  
  }, 1000);

}


function renderAssortedMovieList(results) {

    console.log(exactMovieTitleList.length);

  for (let i = 0; i < results.length; i ++) {

  $(".js-search-results").append(
    `
    <div class="movieContainer row">
      <img src="https://image.tmdb.org/t/p/w500/${results[i].poster_path}" alt="poster for the movie titled ${results[i].title}" class="poster col-3">
      <div class="movieContentContainer col-9">
        <h3 class="movieTitle">${results[i].title}</h3>
        <div class="movieReleaseDate">${results[i].release_date}</div>
        <div class="movieRating">${results[i].vote_average}</div>
        <p class="movieOverview">${results[i].overview}</p>
      </div>
    </div>
    `
    );
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

  for (let k = 0; k < data.results.length; k ++) {

    for (let i = 0; i < TMDBQueryList.length; i ++) {

        if (data.results[k].title === TMDBQueryList[i]) {

            if (!(data.results[k].title in exactMovieTitleMap)) {



              let exactMovieTitle = {
                title: data.results[k].title,
                poster_path: data.results[k].poster_path,
                release_date: data.results[k].release_date,
                vote_average: data.results[k].vote_average * 10 + "%",
                popularity: data.results[k].popularity,
                overview: data.results[k].overview,
                point_value: (((data.results[k].vote_average * 10) + data.results[k].popularity) / 2)
              };

              exactMovieTitleMap[data.results[k].title] = 1;

              exactMovieTitleList.push(exactMovieTitle);

            };
      }
    }
  }
}



$(watchSubmit);

