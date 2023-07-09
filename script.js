const APIkey="5bdeaf6240d18bb55b66a09434c3f079";
const APIURL = "https://api.themoviedb.org/3/discover/movie?api_key=5bdeaf6240d18bb55b66a09434c3f079";
const imgpath="https://image.tmdb.org/t/p/w1280";
const searchAPI="https://api.themoviedb.org/3/search/movie?&api_key=5bdeaf6240d18bb55b66a09434c3f079&query=";

    const main=document.getElementById('main');
    const form=document.getElementById('form');
    const search=document.getElementById('search');

    getMovies(APIURL);
    async function getMovies(url){
    const resp=await fetch(url);
    const respData=await resp.json();

    showMovies(respData.results);
    };

function showMovies(movies){
    main.innerHTML="";
    movies.forEach((movie) => {
        const { poster_path, title, vote_average,overview
        } = movie;
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
    ${overview}
    </div>
    `;
    main.appendChild(movieEl);
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

form.addEventListener("submit", (e)=>{
    e.preventDefault();

    const searchTerm=search.value;

    if (searchTerm){
        getMovies(searchAPI+searchTerm);

        search.value="";
    }
});