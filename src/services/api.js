import axios from "axios";
const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YTVkNzNjOGZkZTk5YThmODU5NTQyNDM2ZmJlM2U0MiIsIm5iZiI6MTcyNzQzMjYyNS4xMTI0NjgsInN1YiI6IjY2NDFmOWUwOTJkNzFkMjc0NWMxYjEwMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.M3xow8ZDKXS3BiqaboivkajeBp5W3mzmEIiG0wKxky4";
export default axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
        Authorization: `Bearer ${token}`
    }
})