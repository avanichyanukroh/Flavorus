const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie?api_key=bd392b20bbcc4afe8b0b8e5db2dc7e99';

function getDataFromApi(searchTerm, callback) {
  
  const settings = {
    url: TMDB_SEARCH_URL + "&language=en-US" + "&page=1" + "include_adult=false" + "&query=" + searchTerm,
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

function renderResult(result) {
  return `
    <div>
      <h3>${results.title}</h3> <img src="${results.poster_path}"/>
    </div>
  `;
}

function displayTmdbSearchData(data) {
  const results = data.results.map((item, index) => renderResult(item));
  $('.js-search-results').html(results);
}





function watchSubmit() {
  $('.js-search-form').submit(function(event) {
      event.preventDefault();
      const userInput = $(this).find('#js-query');
      const query =  userInput.val();
      userInput.val("");
      getDataFromApi(query, displayTmdbSearchData);
      });
}

$(watchSubmit);