
//tastedive api search code
const TASTEDIVE_SEARCH_URL = 'https://tastedive.com/api/similar?k=303566-Numu-0SMN2P46&info=1';
const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie?api_key=bd392b20bbcc4afe8b0b8e5db2dc7e99';

let movieNames;

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

function renderResultTasteDive(result) {
  /*return `
    <div>
      <h3>${result.Name}</h3>
      <p>
      Teaser: ${result.wTeaser}<br>
      Wikipedia: ${result.wUrl}<br>
      Trailer: ${result.yUrl}
      <p>
    </div>
  `;*/
}

function displayTasteDiveSearchData(data) {
  const results = data.Similar.Results.map(function(item, index) {
    movieNames = item.Name;
    getDataFromTMDBApi(item.Name, displayTmdbSearchData);
    renderResultTasteDive(item);
});
  console.log(data.Similar.Results);
/*  $('.js-search-results').html(results); */
}





function watchSubmit() {
  $('.js-search-form').submit(function(event) {
      event.preventDefault();
      const userInput = $(this).find('#js-query');
      const query =  userInput.val();
      userInput.val("");
      getDataFromTasteDiveApi(query, displayTasteDiveSearchData);
      });
}





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

function renderResultTMDB(result) {
  return `
    <div>
      <h3>title:${result.title}</h3> <img src="https://image.tmdb.org/t/p/w500${result.poster_path}"
      <p>
      release date: ${result.release_date} <br>
      rating: ${result.vote_average} <br>
      popularity: ${result.popularity}
      
    </div>
  `;
}

function displayTmdbSearchData(data) {
  const results = data.results.map(function(item, index) {

  if (item.title == movieNames) {

    renderResultTMDB(item);
    }
  })
  $('.js-search-results').append(results);

}




/*
function watchSubmit() {
  $('.js-search-form').submit(function(event) {
      event.preventDefault();
      const userInput = $(this).find('#js-query');
      const query =  userInput.val();
      userInput.val("");
      getDataFromTMDBApi(query, displayTmdbSearchData);
      });
}

$(watchSubmit);

*/

$(watchSubmit);