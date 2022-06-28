import React, { useEffect, useState } from "react";
// import displayArtist from "./Profile";
import "./Game.css";
import howler from "howler";

export const Game = () => {
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [userGuess, setUserGuess] = useState("");
  const [numOfGuesses, setNumOfGuesses] = useState(0);
  const [CurrentSong, setCurrentSong] = useState({});
  const [songIndex, setsongIndex] = useState(0);
  const [sounds, setSounds] = useState([]);
  const [answerKey, setanswerKey] = useState(null);

  useEffect(() => {
    setSelectedArtists(JSON.parse(localStorage["SelectedArtists"]));
    setSelectedSongs(JSON.parse(localStorage["SelectedSongs"]));
    setCurrentSong(JSON.parse(localStorage["SelectedSongs"])[0]);
    createHowls(JSON.parse(localStorage["SelectedSongs"]));
  }, []);

  const nextSong = () => {
    setCurrentSong(selectedSongs[songIndex + 1]);
    setsongIndex(songIndex + 1);
  };

  const artistNamesArray = () => {
    const artistNames = [];
    selectedArtists.map((artist) => {
      artistNames.push(artist.name);
    });
    return artistNames;
  };

  const handleGuesses = (artist) => {
    stopSound();
    setUserGuess(artist.name);
    const artistObj = CurrentSong.artists.filter((artist) =>
      artistNamesArray().includes(artist.name)
    );

    console.log(artistObj);
    console.log(artistObj[0].name);
    if (artist.name === artistObj[0].name) {
      setanswerKey(true);
      nextSong();
      return <div>Correct!</div>;
    }
    setNumOfGuesses(numOfGuesses + 1);
    setanswerKey(false);
  };

  const createHowls = (songsArray) => {
    const tempHowlsArray = [];
    for (let i = 0; i < songsArray.length; i++) {
      const song = songsArray[i];
      const songUrl = song["preview_url"];

      console.log(songUrl);
      const sound = new Howl({
        src: songUrl,
        format: ["mp3", "aac", "ogg"],
      });
      tempHowlsArray.push(sound);
    }
    setSounds(tempHowlsArray);
  };

  const playSound = () => {
    sounds[songIndex].play();
  };
  const stopSound = () => {
    sounds[songIndex].stop();
  };

  const answerCheck = () => {
    switch (answerKey) {
      case null:
        return null;
      case true:
        return (
          <>
            <h1>Correct!!!</h1>
          </>
        );
      case false:
        return (
          <>
            <h1>Incorrect!!!</h1>
          </>
        );
    }
  };

  const renderGame = () => {
    while (numOfGuesses <= selectedSongs.length) {
      // the only case where currentSong is undefined is when the user guesses all songs correctly.
      if (CurrentSong != undefined) {
        // render the game
        return (
          <div class="page">
            <div className="songDiv">
              <button class="btn" onClick={playSound}>
                play song
              </button>
              <button class="btn" onClick={stopSound}>
                stop song
              </button>
            </div>
            <div className="flex">
              {selectedArtists.map((artist) => (
                <div className="artistInfo" key={artist.name}>
                  <img className="image" src={artist.images[0].url}></img>
                  <button class="btn" onClick={() => handleGuesses(artist)}>
                    {artist.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      } else {
        if (answerKey != null) {
          setanswerKey(null);
        }
        return (
          <>
            <h1>You Won!!!</h1>
            <iframe
              src="https://giphy.com/embed/gX8F8kMRTx44M"
              width="480"
              height="373"
              frameBorder="0"
              className="giphy-embed"
              allowFullScreen
            ></iframe>
            <p>
              <a href="https://giphy.com/gifs/john-lists-candy-gX8F8kMRTx44M"></a>
            </p>
            <a href="/">
              <button class="btn">Play again?</button>
            </a>
          </>
        );
      }
    }
    if (numOfGuesses > selectedSongs.length) {
      // lost the game
      if (answerKey != null) {
        setanswerKey(null);
      }
      return (
        <>
          <h1>You lost!</h1>
          <iframe
            src="https://giphy.com/embed/l1EsYPdoDQ4mNPLzi"
            width="480"
            height="360"
            frameBorder="0"
            class="giphy-embed"
            allowFullScreen
          ></iframe>
          <p>
            <a href="https://giphy.com/gifs/spongebob-spongebob-squarepants-season-5-l1EsYPdoDQ4mNPLzi"></a>
          </p>
          <a href="/">
            <button class="btn">Play again?</button>
          </a>
        </>
      );
    }
    return null;
  };

  return (
    <div className="alignCenter">
      <h1 class="title">Who's Who??</h1>
      <div className="mainGameContainer">
        <div>{answerCheck()}</div>
        <div>{renderGame()}</div>
      </div>
    </div>
  );
};

export default Game;
