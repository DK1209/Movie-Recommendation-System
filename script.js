const APIkey="5bdeaf6240d18bb55b66a09434c3f079";
const APIURL = "https://api.themoviedb.org/3/discover/movie?api_key=5bdeaf6240d18bb55b66a09434c3f079";
const imgpath="https://image.tmdb.org/t/p/w1280";
const searchAPI="https://api.themoviedb.org/3/search/movie?&api_key=5bdeaf6240d18bb55b66a09434c3f079&query=";

    const main=document.getElementById('main');
    const form=document.getElementById('form');
    const search=document.getElementById('search');

function truncate_synopsis(overview, maxlength){
    if (overview.length<=maxlength)
    return overview;
    else{
        return overview.slice(0,maxlength)+"...";
    }
}

function showMovies(movies){
    main.innerHTML="";
    movies.forEach((movie) => {
        const { poster_path, title, vote_average,overview
        } = movie;
        if (title){
        if (poster_path){
            let short_overview=truncate_synopsis(overview,300);
        const movieEl=document.createElement("div");
        movieEl.classList.add("movie");

        movieEl.innerHTML=`
        <img
         src="${imgpath + poster_path}"
          alt="${title}"
          >
            <div class="movie-info">
                <h3>${title}</h3>
        <span class="${getClassByRate(vote_average)}">${vote_average}</span>
    </div>
    <div class="overview">
    ${short_overview}
    </div>
    `;
    main.appendChild(movieEl);
        }
    }else{
        window.location.href = "error.html";
    }
})
};

function getClassByRate(vote){
    if (vote>=8){
        return 'green';
    }
    else if (vote>=6){
        return 'orange';
    }
    else return 'red';
}

let recommendedData;
async function searchMovie() {
    const movieTitle = search.value;

    if (!movieTitle) {
        alert("Please enter a movie title.");
        return;
    }

    try {
        // Perform a movie search to get the details of the searched movie
        const searchResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${APIkey}&query=${encodeURIComponent(movieTitle)}`);
        const searchData = await searchResponse.json();

        if (searchData.results && searchData.results.length > 0) {
            const searchedMovie = searchData.results[0]; // Get the first movie in the search result
            const genreIds = searchedMovie.genre_ids;

            // Get similar movies based on the genre of the searched movie
            const allMoviesResponse = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${APIkey}&sort_by=popularity.desc`);
            const allMoviesData = await allMoviesResponse.json();

            recommendedData = allMoviesData.results.filter(movie => {
                return arrayEquals(movie.genre_ids, genreIds);
            })
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('recommendations').innerHTML = 'Error fetching data. Please try again later.';
    }
}

function arrayEquals(a, b) {
    if (a.length===b.length){
    a.sort();
    b.sort();
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
}
else if (a.length>b.length){
    var st=new Set(a);
    for (let it=0; it<b.length;it++){
        if (st.has(b[it])===false) return false;
    }
    return true;
}
else{
    var st=new Set(b);
    for (let it=0; it<a.length;it++){
        if (st.has(a[it])===false) return false;
    }
    return true;
}
  }

    getMovies(APIURL);
    async function getMovies(url) {
        const resp = await fetch(url);
        const respData = await resp.json();
    
        await searchMovie();
        const combineData = [...new Set(respData.results.concat(recommendedData))];
    
        showMovies(combineData);
    }

    form.addEventListener("submit", async (e) => { // Add 'async' here to use 'await' inside the listener
        e.preventDefault();
    
        const movieTitle = search.value;
        if (!movieTitle) {
            alert("Please enter a movie title.");
            return;
        }
        await searchMovie(); // Add 'await' here to wait for the searchMovie function to finish
        getMovies(searchAPI + movieTitle);
    });
