const app = new Vue({
    el: "#app",
    data: {
        key: "c5d3024d8abad31949172938951b96d9",
        query: "",
        moviesList: [],
    },
    methods: {
        querySubmit() {
            axios.get("https://api.themoviedb.org/3/search/movie", {
                params: {
                    api_key: this.key,
                    query: this.query,
                    language: "it-IT"
                }
            }).then((resp) => {
                this.moviesList = resp.data.results
            })
        }
    }
})