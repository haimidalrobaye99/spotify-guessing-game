import React, { useEffect, useState } from "react";
import fetchFromSpotify, { request } from "../services/api";
import "./Game.css"
const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

const Home = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const [token, setToken] = useState("");
  const [numberOfSongs, setNumberOfSongs] = useState(0);
  const [numberOfArtists, setNumberOfArtists] = useState(0);
  const [artists, setArtists] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [artistTopTracks1, setArtistTopTracks1] = useState([]);
  const [artistTopTracks2, setArtistTopTracks2] = useState([]);
  const [artistTopTracks3, setArtistTopTracks3] = useState([]);
  const [artistTopTracks4, setArtistTopTracks4] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [settingsStep, setSettingsStep] = useState(0);

  const startGame = () => {
    getRandomTopSongs();
  };

  const setGenreAndArtistsInGenre = (genre) => {
    setSettingsStep(settingsStep + 1);
    setSelectedGenre(genre);
    loadArtists(genre);
  };

  const setNumberOfArtistsAndGetRandomArtists = (input) => {
    setSettingsStep(settingsStep + 1);
    setNumberOfArtists(input);
    generateRandomArtists(input);
  };

  const setNumberOfSongsAndGetTopSongs = (input) => {
    setSettingsStep(settingsStep + 1);
    setNumberOfSongs(input);
    getTopSongs();
  };

  const generateRandomArtists = (number) => {
    const randomNumber = [];
    if (artists.length > 0) {
      while (randomNumber.length < number) {
        const numToAdd = Math.floor(Math.random() * artists.length);
        if (!randomNumber.includes(numToAdd)) {
          randomNumber.push(numToAdd);
        }
      }
    }

    console.log(randomNumber);

    const tempArtists = [];
    for (let j = 0; j < randomNumber.length; j++) {
      tempArtists.push(artists[randomNumber[j]]);
    }
    console.log(tempArtists);

    setSelectedArtists(tempArtists);
    localStorage["SelectedArtists"] = JSON.stringify(tempArtists);
  };

  const getRandomTopSongs = () => {
    const masterArray = artistTopTracks1.concat(
      artistTopTracks2,
      artistTopTracks3,
      artistTopTracks4
    );
    const tempSongs = [];
    const randomSongNumbers = [];

    while (randomSongNumbers.length < numberOfSongs) {
      const numToAdd = Math.floor(Math.random() * masterArray.length);
      if (
        !randomSongNumbers.includes(numToAdd) &&
        masterArray[numToAdd]["preview_url"]
      ) {
        randomSongNumbers.push(numToAdd);
        tempSongs.push(masterArray[numToAdd]);
      }
    }
    setSelectedSongs(tempSongs);
    localStorage["SelectedSongs"] = JSON.stringify(tempSongs);
  };
  const getTopSongs = () => {
    for (let i = 1; i <= selectedArtists.length; i++) {
      getArtistTopTracks(selectedArtists[i - 1].id, i);
    }
  };

  const loadGenres = async (t) => {
    setConfigLoading(true);
    const response = await fetchFromSpotify({
      token: t,
      endpoint: "recommendations/available-genre-seeds",
    });
    console.log(response);
    setGenres(response.genres);
    setConfigLoading(false);
  };

  const loadArtists = async (genre) => {
    setConfigLoading(true);
    const response = await fetchFromSpotify({
      token: token,
      endpoint: `search?q=genre%3A${genre}&type=artist`,
    });
    console.log(response);
    setArtists(response.artists.items);
    setConfigLoading(false);
  };

  const getArtistTopTracks = async (artistID, artistNumber) => {
    setConfigLoading(true);
    const response = await fetchFromSpotify({
      token: token,
      endpoint: `artists/${artistID}/top-tracks?market=US`,
    });
    console.log(response);
    setConfigLoading(false);

    switch (artistNumber) {
      case 1:
        setArtistTopTracks1(response.tracks);
        break;
      case 2:
        setArtistTopTracks2(response.tracks);
        break;
      case 3:
        setArtistTopTracks3(response.tracks);
        break;
      case 4:
        setArtistTopTracks4(response.tracks);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setAuthLoading(true);

    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        setAuthLoading(false);
        setToken(storedToken.value);
        loadGenres(storedToken.value);
        return;
      }
    }
    console.log("Sending request to AWS endpoint");
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      setAuthLoading(false);
      setToken(newToken.value);
      loadGenres(newToken.value);
    });
  }, []);

  if (authLoading || configLoading) {
    return <div>Loading...</div>;
  }

  const renderSettings = () => {
    while (settingsStep <= 3)
      switch (settingsStep) {
        case 0:
          return (
            <div class = "form center" >
              <div class="selecter"> Welcome! Want to test your music knowledge? Select a Genre to get started:
              <select
                value={selectedGenre}
                onChange={(event) =>
                  setGenreAndArtistsInGenre(event.target.value)
                }
              >
                <option value="" />
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
            <iframe src="https://giphy.com/embed/cmqvGkc7c7tHHFeKP8" 
            width="550" 
            height="480" 
            frameBorder="0" 
            class="giphy-embed" 
            allowFullScreen></iframe>
            <p><a href="https://giphy.com/gifs/pointing-jenn-robbins-cmqvGkc7c7tHHFeKP8"></a></p>
            </div>
          );
        case 1:
          return (
            <div class="form center">
            <div class="selecter">
              Next, choose the number of artists to guess from: 
              <select
                value={numberOfArtists}
                onChange={(event) =>
                  setNumberOfArtistsAndGetRandomArtists(event.target.value)
                }
              >
                <option value="0"></option>
                <option value="1"> 1</option>
                <option value="2"> 2</option>
                <option value="3"> 3</option>
                <option value="4"> 4</option>
              </select>
            </div>
            <iframe src="https://giphy.com/embed/tqfS3mgQU28ko" 
            width="550" 
            height="360" 
            frameBorder="0" 
            class="giphy-embed" 
            allowFullScreen></iframe><p>
              <a href="https://giphy.com/gifs/headphones-spongebob-squarepants-tqfS3mgQU28ko"></a></p>
            </div>
          );

        case 2:
          return (
            <div class="form center">
              <div class="selecter">
              Lastly, choose the number of songs to guess for: 
              <select
                value={numberOfSongs}
                onChange={(event) =>
                  setNumberOfSongsAndGetTopSongs(event.target.value)
                }
              >
                <option value="0"></option>
                <option value="1"> 1</option>
                <option value="2"> 2</option>
                <option value="3"> 3</option>
              </select>
            </div>
            <iframe src="https://giphy.com/embed/xT77XPbvrQgE58pSta" 
            width="550" 
            height="480" 
            frameBorder="0" 
            class="giphy-embed" 
            allowFullScreen></iframe><p><a href="https://giphy.com/gifs/john-barrowman-have-fun-xT77XPbvrQgE58pSta"></a></p>
            </div>
          );
        case 3:
          return (
            <>
              <a href="/game">
                <button class = "btn" onClick={startGame}>Start Game</button>
              </a>
            </>
          );
      }
  };

  return <div>{renderSettings()}</div>;
};

export default Home;
