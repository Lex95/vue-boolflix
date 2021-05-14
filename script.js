const app = new Vue({
    el: "#app",
    data: {
        key: "c5d3024d8abad31949172938951b96d9",
        query: "",
        moviesList: [],
        tvSeriesList: [],
        resultsList: []
    },
    computed: {
        getResultList() {
            this.resultsList = this.moviesList.concat(this.tvSeriesList)
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
                    this.moviesList = resp.data.results
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
        }
    }
})