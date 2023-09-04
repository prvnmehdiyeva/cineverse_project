const global = {
  currentpage: window.location.pathname,
  api: {
    apiKey: "72b36c997ad7f1bb8699866763c500fe",
    apiUrl: "https://api.themoviedb.org/3/",
  },
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
}

// display bg
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement("div")
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`
  overlayDiv.style.backgroundSize = "cover"
  overlayDiv.style.backgroundPosition = "center"
  overlayDiv.style.backgroundRepeat = "no-repeat"
  overlayDiv.style.height = "100vh"
  overlayDiv.style.width = "100vw"
  overlayDiv.style.position = "absolute"
  overlayDiv.style.top = "0"
  overlayDiv.style.left = "0"
  overlayDiv.style.zIndex = "-1"
  overlayDiv.style.opacity = "0.1"

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv)
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv)
  }
}
// Highlight active link
function highlightActive() {
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === global.currentpage) {
      link.classList.add("active")
    }
  })
}
//Now playing
async function getNowPlaying() {
  const { results } = await fetchAPIData("movie/upcoming")

  results.forEach((movie) => {
    const div = document.createElement("div")
    div.classList.add("swiper-slide")
    div.innerHTML = `
    <a href="movie-details.html?id=1">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
      movie.title
    }" />
    </a>
    <h4 class="swiper-rating">
      <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
        1
      )} / 10
    </h4>
    `
    document.querySelector(".swiper-wrapper").appendChild(div)

    initSwiper()
  })
}
// Swiper
function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: "auto",
    centeredSlides: "true",
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  })
}
// TV Details
async function getTvDetails() {
  const tvId = window.location.search.split("=")[1]
  const tv = await fetchAPIData(`tv/${tvId}`)

  displayBackgroundImage("tv", tv.backdrop_path)
  const div = document.createElement("div")

  div.innerHTML = `<div class="details-top">
    <div>
    ${
      tv.poster_path
        ? `<img
      src="https://image.tmdb.org/t/p/w500${tv.poster_path}"
      class="card-img-top"
      alt="${tv.name}"
    />`
        : `<img
    src="images/no-image.jpg"
    class="card-img-top"
    alt="${tv.name}"
  />`
    }
    </div>
    <div>
      <h2>${tv.original_title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${tv.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${tv.release_date}</p>
      <p>
      ${tv.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${tv.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
      </ul>
      <a href="${
        tv.homepage
      }" target="_blank" class="btn">Visit Show Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Show Info</h2>
    <ul>
      <li><span class="text-secondary">Number Of Episodes:</span> ${
        tv.episodes
      }</li>
      <li>
        <span class="text-secondary">Last Episode To Air:</span> ${tv.episodes}
      </li>
      <li><span class="text-secondary">Status:</span> ${tv.release_date}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${tv.production_companies
      .map((company) => `<span>${company.name}</span>`)
      .join("")}</div>
  </div>`

  document.querySelector("#show-details").appendChild(div)
}
//Movie Details
async function getMovieDetails() {
  const movieId = window.location.search.split("=")[1]
  const movie = await fetchAPIData(`movie/${movieId}`)

  displayBackgroundImage("movie", movie.backdrop_path)
  const div = document.createElement("div")

  div.innerHTML = `<div class="details-top">
    <div>
    ${
      movie.poster_path
        ? `<img
      src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
      class="card-img-top"
      alt="${movie.name}"
    />`
        : `<img
    src="images/no-image.jpg"
    class="card-img-top"
    alt="${movie.name}"
  />`
    }
    </div>
    <div>
      <h2>${movie.original_title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${movie.release_date}</p>
      <p>
        ${movie.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
      </ul>
      <a href="${
        movie.homepage
      }" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> ${movie.budget}</li>
      <li><span class="text-secondary">Revenue:</span> ${movie.revenue}</li>
      <li><span class="text-secondary">Runtime:</span> ${movie.runtime}</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">
      ${movie.production_companies
        .map((company) => `<span>${company.name}</span>`)
        .join("")}
    </div>
  </div>`

  document.querySelector("#movie-details").appendChild(div)
}
// Popular TV Shows
async function getPopularTvShows() {
  const { results } = await fetchAPIData("tv/popular")

  results.forEach((show) => {
    const div = document.createElement("div")
    div.classList.add("card")
    div.innerHTML = `<div class="card">
    <a href="tv-details.html?id=${show.id}">
      ${
        show.poster_path
          ? `<img
        src="https://image.tmdb.org/t/p/w500${show.poster_path}"
        class="card-img-top"
        alt="${show.name}"
      />`
          : `<img
      src="images/no-image.jpg"
      class="card-img-top"
      alt="${show.name}"
    />`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${show.name}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${show.first_air_date}</small>
      </p>
    </div>
  </div>`

    document.querySelector("#popular-shows").appendChild(div)
  })
}
// Popular movies
async function getPopularMovies() {
  const { results } = await fetchAPIData("movie/popular")

  results.forEach((movie) => {
    const div = document.createElement("div")
    div.classList.add("card")
    div.innerHTML = `<div class="card">
    <a href="movie-details.html?id=${movie.id}">
      ${
        movie.poster_path
          ? `<img
        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
        class="card-img-top"
        alt="Movie Title"
      />`
          : `<img
      src="images/no-image.jpg"
      class="card-img-top"
      alt="Movie Title"
    />`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${movie.title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${movie.release_date}</small>
      </p>
    </div>
  </div>`

    document.querySelector("#popular-movies").appendChild(div)
  })
}
//  SearchSearchSearchSearchSearchSearchSearchSearchSearch
async function search() {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)

  global.search.type = urlParams.get("type")
  global.search.term = urlParams.get("search-term")

  if (global.search.term !== "" && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchAPIData()

    global.search.page = page
    global.search.totalPages = total_pages
    global.search.totalResults = total_results

    if (results.length === 0) {
      showAlert("No results found")
      return
    }

    displaySearchResults(results)

    document.querySelector("#search-term").value = ""
  } else {
    showAlert("Please type movies or tv-shows that you want search")
  }
}
function displaySearchResults(results) {
  // Clear previous results
  document.querySelector("#search-results").innerHTML = ""
  document.querySelector("#search-results-heading").innerHTML = ""
  document.querySelector("#pagination").innerHTML = ""

  results.forEach((result) => {
    const div = document.createElement("div")
    div.classList.add("card")
    div.innerHTML = `
          <a href="${global.search.type}-details.html?id=${result.id}">
            ${
              result.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${result.poster_path}"
              class="card-img-top"
              alt="${
                global.search.type === "movie" ? result.title : result.name
              }"
            />`
                : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
             alt="${
               global.search.type === "movie" ? result.title : result.name
             }"
          />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${
              global.search.type === "movie" ? result.title : result.name
            }</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${
                global.search.type === "movie"
                  ? result.release_date
                  : result.first_air_date
              }</small>
            </p>
          </div>
        `

    document.querySelector("#search-results-heading").innerHTML = `
              <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
    `

    document.querySelector("#search-results").appendChild(div)
  })

  displayPagination()
}
// Create & Display Pagination For Search
function displayPagination() {
  const div = document.createElement("div")
  div.classList.add("pagination")
  div.innerHTML = `
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `

  document.querySelector("#pagination").appendChild(div)

  // Disable prev button if on first page
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true
  }

  // Disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true
  }

  // Next page
  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++
    const { results, total_pages } = await searchAPIData()
    displaySearchResults(results)
  })

  // Prev page
  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--
    const { results, total_pages } = await searchAPIData()
    displaySearchResults(results)
  })
}
function showAlert(message, className = "error") {
  const div = document.createElement("div")
  div.classList.add("alert")
  div.appendChild(document.createTextNode(message))
  document.querySelector("#alert").appendChild(div)

  setTimeout(() => div.remove(), 3000)
}

async function searchAPIData() {
  const API_KEY = global.api.apiKey
  const API_URL = global.api.apiUrl

  showSpinner()
  const res = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  )
  const data = await res.json()

  hideSpinner()

  return data
}
async function fetchAPIData(endpoint) {
  const API_KEY = global.api.apiKey
  const API_URL = global.api.apiUrl

  showSpinner()

  const res = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  )
  const data = await res.json()

  hideSpinner()

  return data
}

function showSpinner() {
  document.querySelector(".spinner").classList.add("show")
}
function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show")
}
// init app
function init() {
  switch (global.currentpage) {
    case "/":
    case "/index.html":
      // console.log('Home');
      getNowPlaying()
      getPopularMovies()
      break
    case "/movie-details.html":
      getMovieDetails()
      break
    case "/search.html":
      search()
      break
    case "/shows.html":
      getPopularTvShows()
      break
    case "/tv-details.html":
      getTvDetails()
      break
  }
  highlightActive()
}
document.addEventListener("DOMContentLoaded", init)
