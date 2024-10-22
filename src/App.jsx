import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [animeList, setAnimeList] = useState([]);
  const [filteredAnimeList, setFilteredAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [averageReviewers, setAverageReviewers] = useState(0);
  const [countShonen, setCountShonen] = useState(0);
  const [countShojo, setCountShojo] = useState(0);
  const [countAction, setCountAction] = useState(0);
  const [countRomance, setCountRomance] = useState(0);
  const [countFantasy, setCountFantasy] = useState(0);
  const [countDrama, setCountDrama] = useState(0);
  const [searchVal, setSearchVal] = useState("");

  // Fetch the anime data
  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      try {
        const response1 = await fetch(`https://api.jikan.moe/v4/top/anime?page=1`);
        const data1 = await response1.json();

        const response2 = await fetch(`https://api.jikan.moe/v4/top/anime?page=2`);
        const data2 = await response2.json();

        const combinedAnimeList = [...data1.data, ...data2.data].filter(anime => anime.rank !== null);

        setAnimeList(combinedAnimeList);
        setFilteredAnimeList(combinedAnimeList); // Initialize filtered list with full list
        calculateStats(combinedAnimeList);
        console.log(combinedAnimeList);
      } catch (error) {
        console.error("Error fetching anime:", error);
      }
      setLoading(false);
    };

    fetchAnime();
  }, []);

  // Calculate stats
  const calculateStats = (animeList) => {
    let ratingTotal = 0;
    let reviewerTotal = 0;
    let shonenCount = 0;
    let shojoCount = 0;
    let actionCount = 0;
    let romanceCount = 0;
    let dramaCount = 0;
    let fantasyCount = 0;

    animeList.forEach(anime => {
      ratingTotal += anime.score;
      reviewerTotal += anime.members;
      if (anime.demographics.some(genre => genre.name === "Shounen" || genre.name === "Seinen")) {
        shonenCount++;
      }
      if (anime.demographics.some(genre => genre.name === "Shoujo" || genre.name === "Josei")) {
        shojoCount++;
      }
      if (anime.genres.some(genre => genre.name === "Action")) {
        actionCount++;
      }
      if (anime.genres.some(genre => genre.name === "Romance")) {
        romanceCount++;
      }
      if (anime.genres.some(genre => genre.name === "Drama")) {
        dramaCount++;
      }
      if (anime.genres.some(genre => genre.name === "Fantasy")) {
        fantasyCount++;
      }
    });

    setAverageRating((ratingTotal / animeList.length).toFixed(2));
    setAverageReviewers((reviewerTotal / animeList.length).toFixed(2));
    setCountShonen(shonenCount);
    setCountShojo(shojoCount);
    setCountAction(actionCount);
    setCountRomance(romanceCount);
    setCountFantasy(fantasyCount);
    setCountDrama(dramaCount);
  };

  // Handle search functionality
  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchVal(searchValue);

    if (searchValue === "") {
      setFilteredAnimeList(animeList); // Show full list when search is empty
    } else {
      const filteredList = animeList.filter(anime =>
        anime.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredAnimeList(filteredList); // Update with the filtered list
    }
  };

  // Handle genre filtering
  const handleGenreFilter = (genreName) => {
    const filteredList = animeList.filter(anime =>
      anime.genres.some(genre => genre.name === genreName)
    );
    setFilteredAnimeList(filteredList); // Update with the filtered list
  };

  const clearFilter = () => {
    setFilteredAnimeList(animeList); // Show full list when search is empty
  }

  return (
    <div className="appContainer">
      <div className="sidebarContainer"></div>
      <div className="statContainer">
        <div className="stat">
          <h1>Stats</h1>
          <p>Average Rating: {averageRating}</p>
          <p>Average # of Members: {Math.round(averageReviewers)}</p>
          <p>Number of Shonen/Seinen: {countShonen}</p>
          <p>Number of Shojo/Josei: {countShojo}</p>
        </div>
        <div className="stat">
          <h1>Genres</h1>
          <p>Action Anime: {countAction}</p>
          <p>Romance Anime: {countRomance}</p>
          <p>Drama Anime: {countDrama}</p>
          <p>Fantasy Anime: {countFantasy}</p>
        </div>
      </div>
      <br></br>
      <div className="dataContainer">
        <h1>Top 50 Anime</h1>
        <div className="searchContainer">
          <input
            type="text"
            placeholder="Search anime by title"
            value={searchVal}
            onChange={handleSearch}
            className="searchBar"
          />
          <button className="genreButton" onClick={() => handleGenreFilter('Action')}>Action</button>
          <button className="genreButton" onClick={() => handleGenreFilter('Romance')}>Romance</button>
          <button className="genreButton" onClick={() => handleGenreFilter('Fantasy')}>Fantasy</button>
          <button className="genreButton" onClick={() => handleGenreFilter('Drama')}>Drama</button>
          <button className="genreButton" onClick={() => clearFilter()}>Clear Filter</button>
        </div>
        <div className="tableContainer">
        {!loading ? (
          <table class="scrolldown">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Title</th>
                <th>Type</th>
                <th>Episodes</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnimeList
                .sort((a, b) => a.rank - b.rank) // Sort by rank before mapping
                .map(anime => (
                  <tr key={anime.mal_id}>
                    <td>{anime.rank}</td>
                    <td>{anime.title}</td>
                    <td>{anime.type}</td>
                    <td>{anime.episodes}</td>
                    <td>{anime.score}</td>
                  </tr>
                ))}
            </tbody>

          </table>
        ) : (
          <p>Loading...</p>
        )}
        </div>

      </div>
    </div>
  );
};

export default App;
