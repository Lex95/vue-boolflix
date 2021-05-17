const app = new Vue({
    el: "#app",
    data: {
        key: "c5d3024d8abad31949172938951b96d9",
        query: "",
        moviesList: [],
        tvSeriesList: [],
        moviesGenresList: [],
        tvSeriesGenresList: [],
        selectedGenre: ""
    },
    computed: {
        getResultList() {
            const result = this.moviesList.concat(this.tvSeriesList);
            result.map((element) => {
                this.getActors(element);
                this.getMovieGenre(element)
            })
            return result
        },
        getGenresList() {
            const result = this.moviesGenresList;
            this.tvSeriesGenresList.forEach(element => {
                if (!result.includes(element)) {
                    result.push(element)
                }
            })
            return result
        }
    },
    methods: {
        doAxiosSearch(searchType) {
            const axiosParameters = {
                params: {
                    api_key: this.key,
                    query: this.query,
                    language: "it-IT"
                }
            }
            axios.get("https://api.themoviedb.org/3/search/" + searchType, axiosParameters).then((resp) => {
                if (searchType == "movie") {
                    this.moviesList = resp.data.results;
                } else if (searchType == "tv") {
                    this.tvSeriesList = resp.data.results.map((element) => {
                        element.original_title = element.original_name;
                        element.title = element.name;
                        return element
                    })
                }
            })
        },
        querySubmit() {
            this.doAxiosSearch("movie");
            this.doAxiosSearch("tv");
        },
        getFlag(movie) {
            return "flag-icon flag-icon-" + this.getCountryCode(movie.original_language)
        },
        // brutto brutto ma sto smattando
        getCountryCode(language) {
            switch (language) {
                case "en":
                    return "gb";
                case "it":
                    return "it";
                case "fr":
                    return "fr";
                case "de":
                    return "de";
                case "es":
                    return "es";
                default:
                    return "va";
            }
        },
        getPosterUrl(movie) {
            const posterWidth = 342
            if (movie.poster_path) {
                return "https://image.tmdb.org/t/p/w" + posterWidth + movie.poster_path
            } else {
                return ""
            }
        },
        voteToStars(movie) {
            return Math.ceil(movie.vote_average / 2)
        },
        // milestone 5
        getActors(movie) {
            var searchType = "";
            if (this.moviesList.includes(movie)) {
                searchType = "movie/"
            } else {
                searchType = "tv/"
            }

            var cast = [];
            axios.get("https://api.themoviedb.org/3/" + searchType + movie.id + "/credits?api_key=" + this.key).then((resp) => {
                resp.data.cast.forEach((element, index) => {
                    if (index < 5) {
                        cast.push(resp.data.cast[index].name)
                    }
                })
            })
            this.$set(movie, "cast", cast)
        },
        getMovieGenre(movie) {
            var searchType = "";
            if (this.moviesList.includes(movie)) {
                searchType = "movie/"
            } else {
                searchType = "tv/"
            }
            const axiosParameters = {
                params: {
                    api_key: this.key,
                    language: "it-IT"
                }
            }
            var result = [];
            axios.get("https://api.themoviedb.org/3/" + searchType + movie.id, axiosParameters).then((resp) => {
                resp.data.genres.forEach(element => result.push(element.name))
            })
            this.$set(movie, "genere", result)
        },
        // milestone 6
        doAxiosGenreSearch(searchType) {
            const axiosParameters = {
                params: {
                    api_key: this.key,
                    language: "it-IT"
                }
            }

            axios.get("https://api.themoviedb.org/3/genre/" + searchType + "/list", axiosParameters).then((resp) => {
                if (searchType == "movie") {
                    this.moviesGenresList = resp.data.genres
                } else if (searchType == "tv") {
                    this.tvSeriesGenresList = resp.data.genres
                }
            }) 
        },
        getGenres() {
            this.doAxiosGenreSearch("movie");
            this.doAxiosGenreSearch("tv")
        }
    }
})
