import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import jsonSong from "./assets/songs.json";

const Home = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [value, setValue] = useState("");
  const searchRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);

  // New refs & state for dynamic heights
  const filtersRef = useRef(null);
  const playerRef = useRef(null);
  const songDivRef = useRef(null);
  const [filtersHeight, setFiltersHeight] = useState(0);
  const [playerHeight, setPlayerHeight] = useState(0);

  const toggleSearch = (e) => {
    if (e) e.preventDefault();
    setSearchOpen((prev) => {
      const next = !prev;
      if (next) {
        // focus after the input is mounted
        setTimeout(() => {
          if (searchRef.current) searchRef.current.focus();
        }, 50);
      }
      return next;
    });
  };
  const [languageOpen, setLanguageOpen] = useState(false);

  const toggleLanguage = (e) => {
    if (e) e.preventDefault();
    setLanguageOpen((prev) => {
      const next = !prev;
      return next;
    });
  };
  const [moodOpen, setMoodOpen] = useState(false);

  const toggleMood = (e) => {
    if (e) e.preventDefault();
    setMoodOpen((prev) => {
      const next = !prev;
      return next;
    });
  };

  // Clearing search box on alt + c
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'c') {
        setValue('');
        searchRef.current.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Measure filters and player heights and update on resize or layout changes
  useLayoutEffect(() => {
    function measure() {
      const fH = filtersRef.current ? filtersRef.current.offsetHeight : 0;
      const pH = playerRef.current ? playerRef.current.offsetHeight : 0;
      setFiltersHeight(fH);
      setPlayerHeight(pH);
    }

    // initial measure
    measure();

    // measure again after a short timeout to account for fonts/async layout
    const t = setTimeout(measure, 50);

    // update on window resize
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [searchOpen, languageOpen, moodOpen, value, selectedGenres, selectedLanguages, isPlaying]);

  const handleChangeSearch = (e) => {
    setValue(e.target.value);
    searchRef.current.focus();
  };

  const [nowPlaying, setNowPlaying] = useState(-1);

  // Filter changed and new songs are yet to be played
  const [filterChanged, setFilterChanged] = useState(false);

  const toggleAudio = () => {
    setshuffling(false);
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      if (nowPlaying === -1 || filterChanged) {
        setSindex(Number(filteredSongs[0].Id).toString());
        setNowPlaying(0);
        audio.play();
        setFilterChanged(false);
      } else audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const [sindex, setSindex] = useState(1);
  const handleGenreToggle = (genre) => {
    setSelectedGenres((prevSelectedGenres) =>
      prevSelectedGenres.includes(genre)
        ? prevSelectedGenres.filter((selectedGenre) => selectedGenre !== genre)
        : [...prevSelectedGenres, genre]
    );
    if (isPlaying) setIsPlaying(!isPlaying);
    setFilterChanged(true);
  };

  const handleLanguageToggle = (language) => {
    setSelectedLanguages((prevSelectedLanguages) =>
      prevSelectedLanguages.includes(language)
        ? prevSelectedLanguages.filter(
            (selectedLanguage) => selectedLanguage !== language
          )
        : [...prevSelectedLanguages, language]
    );
    if (isPlaying) setIsPlaying(!isPlaying);
    setFilterChanged(true);
  };

  const filteredSongs = jsonSong.filter(
    (song) =>
      (selectedGenres.length === 0 || selectedGenres.includes(song.Genre)) &&
      (selectedLanguages.length === 0 ||
        selectedLanguages.includes(song.Language)) &&
      (value.trim() === "" ||
        song.Title.toLowerCase().includes(value.toLowerCase())) //add || to add more filters
  );

  function getRandomSong() {
    var randomIndex = Math.floor(Math.random() * filteredSongs.length);
    return filteredSongs[randomIndex].Id;
  }

  const [shuffling, setshuffling] = useState(false);

  const shuffle = () => {
    setshuffling(true);
    const audio = audioRef.current;
    setSindex(Number(getRandomSong()).toString());
    setNowPlaying(0);
    audio.play();
    setFilterChanged(false);
    setIsPlaying(true);
  };

  const playAudio = (audioFileName) => {
    setSindex(audioFileName);
    setIsPlaying(true);
  };

  const renderedSongs = filteredSongs.map((song) => (
    <div key={song.Id} className="song-list">
      <button
        className="songPlayButton"
        onClick={() => playAudio(`${song.Id.toString()}`)}
      >
        <svg
          className="playlogo"
          xmlns="http://www.w3.org/2000/svg"
          width={"0.3cm"}
          viewBox="0 0 384 512"
        >
          <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
        </svg>
      </button>
      <span>{song.Title}</span>
    </div>
  ));

  const goNext = () => {
    if (nowPlaying + 1 === filteredSongs.length) {
      setSindex(Number(filteredSongs[0].Id).toString());
      setNowPlaying(0);
    } else {
      setSindex(Number(filteredSongs[nowPlaying + 1].Id).toString());
      setNowPlaying(nowPlaying + 1);
    }
    setIsPlaying(true);
  };

  const shufflenext = () => {
    setSindex(Number(getRandomSong()).toString());
    setNowPlaying(0);
    setIsPlaying(true);
  };

  const goPrev = () => {
    if (nowPlaying === 0) {
      setSindex(Number(filteredSongs[filteredSongs.length - 1].Id).toString());
      setNowPlaying(filteredSongs.length - 1);
    } else {
      setSindex(Number(filteredSongs[nowPlaying - 1].Id).toString());
      setNowPlaying(nowPlaying - 1);
    }
    setIsPlaying(true);
  };

  // compute songdiv style based on measured heights
  const songDivStyle = {
    // use viewport height as base; adjust by measured heights
    height: `calc(100vh - ${filtersHeight}px - ${playerHeight}px)`,
    marginTop: `${filtersHeight}px`,
    overflowY: "auto"
  };

  return (
    <div>
      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Did you like Yash FM ?
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div>
                Please send an email to{" "}
                <a href="mailto:kmryashasvi@gmail.com">kmryashasvi@gmail.com</a>{" "}
                or fill{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://forms.gle/9apB2o2c1hHo9xgq9"
                >
                  this
                </a>{" "}
                form for any -{" "}
              </div>
              <ul>
                <li>Song Suggestions</li>
                <li>Questions</li>
                <li>Feedbacks / Suggestions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Render filter options */}
      <div className="filters" ref={filtersRef}>
        <div className="title-bar">
          <h1 className="title" style={{ display: "inline" }}>Yash FM</h1>
          {/* Search toggle button (click to open/close) */}
          <button
           style={{ display: "inline" }}
            className={`search-toggle-button ${searchOpen ? 'search-toggle-open' : 'search-toggle-closed'}`}
            onClick={toggleSearch}
            aria-expanded={searchOpen}
            aria-label={searchOpen ? "Close search" : "Open search"}
          >
            
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="0.7cm"><path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z"/></svg>

          </button>
          {/* Language toggle button (click to open/close) */}
          <button
           style={{ display: "inline" }}
            className={`search-toggle-button ${languageOpen ? 'search-toggle-open' : 'search-toggle-closed'}`}
            onClick={toggleLanguage}
            aria-expanded={languageOpen}
            aria-label={languageOpen ? "Close language" : "Open language"}
          >
            
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="0.7cm"><path d="M192 64C209.7 64 224 78.3 224 96L224 128L352 128C369.7 128 384 142.3 384 160C384 177.7 369.7 192 352 192L342.4 192L334 215.1C317.6 260.3 292.9 301.6 261.8 337.1C276 345.9 290.8 353.7 306.2 360.6L356.6 383L418.8 243C423.9 231.4 435.4 224 448 224C460.6 224 472.1 231.4 477.2 243L605.2 531C612.4 547.2 605.1 566.1 589 573.2C572.9 580.3 553.9 573.1 546.8 557L526.8 512L369.3 512L349.3 557C342.1 573.2 323.2 580.4 307.1 573.2C291 566 283.7 547.1 290.9 531L330.7 441.5L280.3 419.1C257.3 408.9 235.3 396.7 214.5 382.7C193.2 399.9 169.9 414.9 145 427.4L110.3 444.6C94.5 452.5 75.3 446.1 67.4 430.3C59.5 414.5 65.9 395.3 81.7 387.4L116.2 370.1C132.5 361.9 148 352.4 162.6 341.8C148.8 329.1 135.8 315.4 123.7 300.9L113.6 288.7C102.3 275.1 104.1 254.9 117.7 243.6C131.3 232.3 151.5 234.1 162.8 247.7L173 259.9C184.5 273.8 197.1 286.7 210.4 298.6C237.9 268.2 259.6 232.5 273.9 193.2L274.4 192L64.1 192C46.3 192 32 177.7 32 160C32 142.3 46.3 128 64 128L160 128L160 96C160 78.3 174.3 64 192 64zM448 334.8L397.7 448L498.3 448L448 334.8z"/></svg>

          </button>
          {/* Mood toggle button (click to open/close) */}
          <button
           style={{ display: "inline" }}
            className={`search-toggle-button ${moodOpen ? 'search-toggle-open' : 'search-toggle-closed'}`}
            onClick={toggleMood}
            aria-expanded={moodOpen}
            aria-label={moodOpen ? "Close mood" : "Open mood"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="0.7cm"><path d="M532 71C539.6 77.1 544 86.3 544 96L544 400C544 444.2 501 480 448 480C395 480 352 444.2 352 400C352 355.8 395 320 448 320C459.2 320 470 321.6 480 324.6L480 207.9L256 257.7L256 464C256 508.2 213 544 160 544C107 544 64 508.2 64 464C64 419.8 107 384 160 384C171.2 384 182 385.6 192 388.6L192 160C192 145 202.4 132 217.1 128.8L505.1 64.8C514.6 62.7 524.5 65 532.1 71.1z"/></svg>
          </button>
          <button
            className="title-button"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 550">
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
            </svg>
          </button>
        </div>

        <div className="row p-0 m-0">
          {moodOpen && (<div className="col-sm-12 col-md-6 col-lg-4 p-0 m-0">
            <div className="filterplate">
              <label className="filtitle">Mood:</label>
              {jsonSong
                .map((song) => song.Genre)
                .filter((value, index, self) => self.indexOf(value) === index)
                .map((genre, index) => (
                  <div
                    key={index}
                    style={{ display: "inline", marginRight: "0.5cm" }}
                  >
                    <label>
                      <input
                        type="checkbox"
                        value={genre}
                        checked={selectedGenres.includes(genre)}
                        onChange={() => handleGenreToggle(genre)}
                      />
                      {genre}
                    </label>
                  </div>
                ))}
            </div>
          </div>)}
          {languageOpen && (<div className="col-sm-12 col-lg-4 col-md-6 p-0 m-0">
            <div className="filterplate">
              <label className="filtitle">Language:</label>
              {jsonSong
                .map((song) => song.Language)
                .filter((value, index, self) => self.indexOf(value) === index)
                .map((language, index) => (
                  <div
                    key={index}
                    style={{ display: "inline", marginRight: "0.5cm" }}
                  >
                    <label>
                      <input
                        type="checkbox"
                        value={language}
                        checked={selectedLanguages.includes(language)}
                        onChange={() => handleLanguageToggle(language)}
                      />
                      {language}
                    </label>
                  </div>
                ))}
            </div>
          </div>)}
          {searchOpen && (<div className="col-sm-12 col-lg-4 col-md-6 p-0 m-0" >
            <div className="filterplate">
              <label className="filtitle">Search:</label>
              {/* Conditionally render the input so it doesn't take space when closed */}
              <form onSubmit={(e) => e.preventDefault()} style={{ display: 'inline' }}>
                
                  <input
                    placeholder=" Start Typing..."
                    value={value}
                    onChange={handleChangeSearch}
                    type="text"
                    className="searchText"
                    ref={searchRef}
                  />
                
              </form>

              {/* Clear button — only useful when input exists; hide when closed */}
              
                <button
                  className="clearButton"
                  onClick={() => {
                    setValue('');
                    if (searchRef.current) searchRef.current.focus();
                  }}
                  aria-label="Clear search"
                >
                  &#10006;
                </button>
              
            </div>
          </div>)}
        </div>
      </div>
      
      <div className="songdiv" ref={songDivRef} style={songDivStyle}>
        {renderedSongs}
      </div>

      <div className="player row text-center m-0" ref={playerRef}>
        {isPlaying && (<div
          className="songName">
          <div className="loading-wave">
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
          </div>
          {jsonSong[Number(sindex - 1)].Title}
        </div>)}

        <div className="col-lg-3 col-sm-12">
          <button onClick={shuffle} className="prenex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={"0.6cm"}
              viewBox="0 0 512 512"
            >
              <path d="M403.8 34.4c12-5 25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V160H352c-10.1 0-19.6 4.7-25.6 12.8L284 229.3 244 176l31.2-41.6C293.3 110.2 321.8 96 352 96h32V64c0-12.9 7.8-24.6 19.8-29.6zM164 282.7L204 336l-31.2 41.6C154.7 401.8 126.2 416 96 416H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c10.1 0 19.6-4.7 25.6-12.8L164 282.7zm274.6 188c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V416H352c-30.2 0-58.7-14.2-76.8-38.4L121.6 172.8c-6-8.1-15.5-12.8-25.6-12.8H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c30.2 0 58.7 14.2 76.8 38.4L326.4 339.2c6 8.1 15.5 12.8 25.6 12.8h32V320c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64z" />
            </svg>
          </button>

          <button onClick={shuffling ? shufflenext : goPrev} className="prenex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={"0.4cm"}
              viewBox="0 0 320 512"
            >
              <path d="M267.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160L64 241V96c0-17.7-14.3-32-32-32S0 78.3 0 96V416c0 17.7 14.3 32 32 32s32-14.3 32-32V271l11.5 9.6 192 160z" />
            </svg>
          </button>

          <button onClick={toggleAudio} className="playallbutton">
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={"0.6cm"}
                viewBox="0 0 320 512"
              >
                <path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z" />
              </svg>
            ) : (
              <svg
                className="playlogo"
                xmlns="http://www.w3.org/2000/svg"
                width={"0.6cm"}
                viewBox="0 0 384 512"
              >
                <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
              </svg>
            )}
          </button>

          <button onClick={shuffling ? shufflenext : goNext} className="prenex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={"0.4cm"}
              viewBox="0 0 320 512"
            >
              <path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241V96c0-17.7 14.3-32 32-32s32 14.3 32 32V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V271l-11.5 9.6-192 160z" />
            </svg>
          </button>
        </div>
        <div className="col-lg-9 col-sm-12">
          <audio
            className="audioPlayer"
            autoPlay={isPlaying}
            controls
            ref={audioRef}
            onEnded={shuffling ? shufflenext : goNext}
            src={`https://yashlikescode.github.io/yash-fm/assets/${sindex}.mp3`}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;