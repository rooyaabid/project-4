const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");

searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();

    if (searchTerm !== "") {
        searchMovies(searchTerm);
    }
});

function searchMovies(title) {
    const apiKey = '42075aaa'; // Replace with your actual OMDb API key
    const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(title)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const moviesContainer = document.querySelector(".movies__container");
            moviesContainer.innerHTML = "";

            if (data.Search) {
                data.Search.forEach(movie => {
                    moviesContainer.innerHTML += moviesHTML(movie, false);
                });
            } else {
                moviesContainer.innerHTML = `<p>No results found for "${title}"</p>`;
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

function moviesHTML(movie, isFeatured) {
    if (movie.Poster === "N/A") {
        movie.Poster = "./assets/img_not_found.jpg";
    }

    const rating = `- ${movie.imdbRating}/10`;

    return `<div class="movie" data-hidden-data="${movie.imdbID}">
                <div class="poster__half no-cursor">
                    <img src="${movie.Poster}" alt="" />
                </div>
                <div class="text__half">
                    <h1 class="movie__title">${movie.Title}</h1>
                    <h3 class="year">${movie.Year} ${(rating === "- undefined/10" || isFeatured === true) ? "" : rating}</h3>
                </div>
            </div>`;
}
const filterDropdown = document.getElementById("filter");

filterDropdown.addEventListener("change", (event) => {
    const selectedFilter = event.target.value;

    if (selectedFilter !== "") {
        filterMovies(selectedFilter);
    }
});

function filterMovies(filterType) {
    const moviesContainer = document.querySelector(".movies__container");
    const movies = Array.from(moviesContainer.querySelectorAll(".movie"));

    switch (filterType) {
        case "NEW":
            movies.sort((a, b) => {
                const releaseDateA = a.querySelector(".year").innerText;
                const releaseDateB = b.querySelector(".year").innerText;
                return compareReleaseDates(releaseDateB, releaseDateA);
            });
            break;
        case "OLD":
            movies.sort((a, b) => {
                const releaseDateA = a.querySelector(".year").innerText;
                const releaseDateB = b.querySelector(".year").innerText;
                return compareReleaseDates(releaseDateA, releaseDateB);
            });
            break;
        // Add more cases for other filter options if needed

        default:
            break;
    }

    // Clear the container and append the sorted movies
    moviesContainer.innerHTML = "";
    movies.forEach((movie) => {
        moviesContainer.appendChild(movie);
    });
}

// Helper function to compare release dates as strings
function compareReleaseDates(dateA, dateB) {
    // Assuming date format is YYYY
    return parseInt(dateB, 10) - parseInt(dateA, 10);
}


