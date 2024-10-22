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
  const [countComedy, setCountComedy] = useState(0);
  const [countDrama, setCountDrama] = useState(0);
  const [searchVal, setSearchVal] = useState("");
  const [sliderVal, setSliderVal] = useState(0); 

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
        setFilteredAnimeList(combinedAnimeList); 
        calculateStats(combinedAnimeList);
        console.log(combinedAnimeList);
      } catch (error) {
        console.error("Error fetching anime:", error);
      }
      setLoading(false);
    };

    fetchAnime();
  }, []);

  const calculateStats = (animeList) => {
    let ratingTotal = 0;
    let reviewerTotal = 0;
    let shonenCount = 0;
    let shojoCount = 0;
    let actionCount = 0;
    let romanceCount = 0;
    let dramaCount = 0;
    let comedyCount = 0;

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
      if (anime.genres.some(genre => genre.name === "Comedy")) {
        comedyCount++;
      }
    });

    setAverageRating((ratingTotal / animeList.length).toFixed(2));
    setAverageReviewers((reviewerTotal / animeList.length).toFixed(2));
    setCountShonen(shonenCount);
    setCountShojo(shojoCount);
    setCountAction(actionCount);
    setCountRomance(romanceCount);
    setCountComedy(comedyCount);
    setCountDrama(dramaCount);
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchVal(searchValue);

    if (searchValue === "") {
      setFilteredAnimeList(animeList); 
    } else {
      const filteredList = animeList.filter(anime =>
        anime.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredAnimeList(filteredList); 
    }
  };

  const handleGenreFilter = (genreName) => {
    const filteredList = animeList.filter(anime =>
      anime.genres.some(genre => genre.name === genreName)
    );
    setFilteredAnimeList(filteredList); 
  };

  const handleSlide = (event) => {
    const value = Number(event.target.value); 
    setSliderVal(value); 

    const filteredList = animeList.filter(anime => anime.score >= value);
    setFilteredAnimeList(filteredList); 
  };

  const clearFilter = () => {
    setFilteredAnimeList(animeList); 
  };

  return (
    <div className="appContainer">
      <div className="sidebarContainer"></div>
      <div className="statContainer">
        <div className="stat">
          <h1>Stats</h1>
          <h3>Average Rating: {averageRating}</h3>
          <h3>Average # of Members: {Math.round(averageReviewers)}</h3>
          <h3>Number of Shonen/Seinen: {countShonen}</h3>
          <h3>Number of Shojo/Josei: {countShojo}</h3>
        </div>
        <img src="https://static.wikia.nocookie.net/delicious-in-dungeon/images/2/22/Senshi_Transparent.png" height="300px"></img>
        <div className="stat">
          <h1>Genres</h1>
          <h3>Action Anime: {countAction}</h3>
          <h3>Romance Anime: {countRomance}</h3>
          <h3>Drama Anime: {countDrama}</h3>
          <h3>Comedy Anime: {countComedy}</h3>
        </div>
      </div>
      <br />
      <div className="dataContainer">
        <h1>Top 50 Anime</h1>
        <p>source: MyAnimeList.net</p>
        <div className="searchContainer">
          <div className="scrollFilter">
            <button>Score: </button>
            <input
              type="range"
              min="8.5" 
              max="9.3" 
              step="0.1"
              value={sliderVal}
              onChange={handleSlide}
            />
          </div>
          <br />
          <input
            type="text"
            placeholder="Search anime by title"
            value={searchVal}
            onChange={handleSearch}
            className="searchBar"
          />
          <button className="genreButton" onClick={() => handleGenreFilter('Action')}>Action</button>
          <button className="genreButton" onClick={() => handleGenreFilter('Romance')}>Romance</button>
          <button className="genreButton" onClick={() => handleGenreFilter('Comedy')}>Comedy</button>
          <button className="genreButton" onClick={() => handleGenreFilter('Drama')}>Drama</button>
          <button className="genreButton" onClick={() => clearFilter()}>Clear Filter</button>
        </div>
        <div className="tableContainer">
          {!loading ? (
            <table className="scrolldown">
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
                  .sort((a, b) => a.rank - b.rank) 
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
