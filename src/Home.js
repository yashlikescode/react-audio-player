import React, {useState} from 'react';
import jsonSong from './assets/songs.json'

const Home = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.createRef();

  const [nowPlaying, setNowPlaying] = useState(-1);

  // Filter changed and new songs are yet to be played
  const [filterChanged, setFilterChanged] = useState(false);

  const toggleAudio = () => {
    setshuffling(false);
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      if(nowPlaying===-1 || filterChanged){
      setSindex((Number(filteredSongs[0].Id)).toString());
      setNowPlaying(0);
      audio.play();
      setFilterChanged(false);
      }
      else
      audio.play();
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
    if(isPlaying)
    setIsPlaying(!isPlaying);
    setFilterChanged(true);
  };

  const handleLanguageToggle = (language) => {
    setSelectedLanguages((prevSelectedLanguages) =>
      prevSelectedLanguages.includes(language)
        ? prevSelectedLanguages.filter((selectedLanguage) => selectedLanguage !== language)
        : [...prevSelectedLanguages, language]
    );
    if(isPlaying)
    setIsPlaying(!isPlaying);
    setFilterChanged(true)
  };

  const filteredSongs = jsonSong.filter(
    (song) =>
      (selectedGenres.length === 0 || selectedGenres.includes(song.Genre)) &&
      (selectedLanguages.length === 0 || selectedLanguages.includes(song.Language))
  );

  function getRandomSong() {
    var randomIndex = Math.floor(Math.random() * filteredSongs.length);
    return filteredSongs[randomIndex].Id;
  }

  const [shuffling, setshuffling] = useState(false);

  const shuffle = () => {
    setshuffling(true);
    const audio = audioRef.current;
      setSindex((Number(getRandomSong())).toString());
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
    <div key={song.Id} className='song-list'>
      <button className='songPlayButton' 
      onClick={() => playAudio(`${(song.Id).toString()}`)}>
      <svg className='playlogo' xmlns="http://www.w3.org/2000/svg" width={'0.3cm'} viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>
      </button>
      <span>{song.Title}</span>
    </div>
  ));

  const goNext = () => {
    if (nowPlaying + 1 === filteredSongs.length)
    {
      setSindex((Number(filteredSongs[0].Id)).toString());
      setNowPlaying(0);
      
    }
    else{setSindex((Number(filteredSongs[nowPlaying+1].Id)).toString());
    setNowPlaying(nowPlaying+1);}
    setIsPlaying(true);
  };

  const shufflenext = () => {
      setSindex((Number(getRandomSong())).toString());
      setNowPlaying(0);
      setIsPlaying(true);
  };

  const goPrev = () => {
    if(nowPlaying === 0)
    {
      setSindex((Number(filteredSongs[filteredSongs.length - 1].Id)).toString());
      setNowPlaying(filteredSongs.length - 1);
    }
    else{
      setSindex((Number(filteredSongs[nowPlaying-1].Id)).toString());
      setNowPlaying(nowPlaying-1);
    }
    setIsPlaying(true);
  };
  return (
    <div>
      <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Do You Like The Minimalist Song Player ?</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div>Please send an email to <a href="mailto:kmryashasvi@gmail.com">kmryashasvi@gmail.com</a> or fill <a target='_blank' href='https://forms.gle/9apB2o2c1hHo9xgq9'>this</a> form for any - </div>
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
      <div className='filters'>
          <div className='title-bar'>
              <h3 className='title'>The Minimalist Song Player</h3>
              <button className='title-button' data-bs-toggle="modal" data-bs-target="#exampleModal">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 550"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
              </button>
          </div>

              <div className='row p-0 m-0'>
                <div className='col-sm-12 col-md-6 col-lg-4 p-0 m-0'>
                    <div className='filterplate'>
                      <label className='filtitle'>Mood:</label>
                      {jsonSong.map((song) => song.Genre).filter((value, index, self) => self.indexOf(value) === index).map((genre, index) => (
                        <div key={index} style={{display:'inline', marginRight:'0.5cm'}}>
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
                </div>
                <div className='col-sm-12 col-lg-4 col-md-6 p-0 m-0'>
                  <div className='filterplate'>
                      <label className='filtitle'>Language:</label>
                      {jsonSong.map((song) => song.Language).filter((value, index, self) => self.indexOf(value) === index).map((language, index) => (
                        <div key={index} style={{display:'inline', marginRight:'0.5cm'}}>
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
                </div>
              </div>
              
          </div>


      <div className='songdiv'>
        {renderedSongs}
      </div>


      <div className='player row text-center pt-2 m-0'>

        <div className='songName'>
          <div className="loading-wave">
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
          </div>
          {jsonSong[Number(sindex-1)].Title}
        </div>


        <div className='col-lg-3 col-sm-12'>
            <button onClick={shuffle} className='prenex'>
            <svg xmlns="http://www.w3.org/2000/svg" width={'0.6cm'}  viewBox="0 0 512 512"><path d="M403.8 34.4c12-5 25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V160H352c-10.1 0-19.6 4.7-25.6 12.8L284 229.3 244 176l31.2-41.6C293.3 110.2 321.8 96 352 96h32V64c0-12.9 7.8-24.6 19.8-29.6zM164 282.7L204 336l-31.2 41.6C154.7 401.8 126.2 416 96 416H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c10.1 0 19.6-4.7 25.6-12.8L164 282.7zm274.6 188c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V416H352c-30.2 0-58.7-14.2-76.8-38.4L121.6 172.8c-6-8.1-15.5-12.8-25.6-12.8H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c30.2 0 58.7 14.2 76.8 38.4L326.4 339.2c6 8.1 15.5 12.8 25.6 12.8h32V320c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64z"/></svg>
            </button>

            <button onClick={shuffling?shufflenext:goPrev} className='prenex'>
            <svg xmlns="http://www.w3.org/2000/svg" width={'0.4cm'} viewBox="0 0 320 512"><path d="M267.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160L64 241V96c0-17.7-14.3-32-32-32S0 78.3 0 96V416c0 17.7 14.3 32 32 32s32-14.3 32-32V271l11.5 9.6 192 160z"/></svg>
            </button>
            
            <button onClick={toggleAudio} className='playallbutton'>
            {isPlaying ?
            <svg xmlns="http://www.w3.org/2000/svg" width={'0.6cm'} viewBox="0 0 320 512"><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg> : 
            <svg className='playlogo' xmlns="http://www.w3.org/2000/svg" width={'0.6cm'} viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>}
            </button>

            <button onClick={shuffling?shufflenext:goNext} className='prenex'>
            <svg xmlns="http://www.w3.org/2000/svg" width={'0.4cm'} viewBox="0 0 320 512"><path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241V96c0-17.7 14.3-32 32-32s32 14.3 32 32V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V271l-11.5 9.6-192 160z"/></svg>
            </button>
        </div>
        <div className='col-lg-9 col-sm-12'>
            <audio className='audioPlayer' autoPlay={isPlaying} controls
            ref={audioRef} 
            onEnded={shuffling?shufflenext:goNext}
            onPause={toggleAudio}
            src={`https://stlyash.github.io/yash-fm/assets/${sindex}.mp3`} />
        </div>
      </div>
    </div>
  );
};

export default Home;
