import React, {useState} from 'react';
import jsonSong from './assets/songs.json'

const Home = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.createRef();

  const [nowPlaying, setNowPlaying] = useState(-1)

  // Filter changed and new songs are yet to be played
  const [filterChanged, setFilterChanged] = useState(false)

  const toggleAudio = () => {
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
  };

  return (
    <div>
      {/* Render filter options */}
      <div className='filters'>
        <h3 className='title'>The Minimalist Song Player</h3>
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
        <div className='col-lg-3 col-sm-12'>
            <button onClick={goPrev} className='prenex'>
            <svg xmlns="http://www.w3.org/2000/svg" width={'0.4cm'} viewBox="0 0 320 512"><path d="M267.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160L64 241V96c0-17.7-14.3-32-32-32S0 78.3 0 96V416c0 17.7 14.3 32 32 32s32-14.3 32-32V271l11.5 9.6 192 160z"/></svg>
            </button>
            
            <button onClick={toggleAudio} className='playallbutton'>
            {isPlaying ?
            <svg xmlns="http://www.w3.org/2000/svg" width={'0.6cm'} viewBox="0 0 320 512"><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg> : 
            <svg className='playlogo' xmlns="http://www.w3.org/2000/svg" width={'0.6cm'} viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>}
            </button>

            <button onClick={goNext} className='prenex'>
            <svg xmlns="http://www.w3.org/2000/svg" width={'0.4cm'} viewBox="0 0 320 512"><path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241V96c0-17.7 14.3-32 32-32s32 14.3 32 32V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V271l-11.5 9.6-192 160z"/></svg>
            </button>
        </div>
        <div className='col-lg-9 col-sm-12'>
            <audio className='audioPlayer' autoPlay={isPlaying} controls
            ref={audioRef} 
            onEnded={goNext}
            src={`https://stlyash.github.io/yash-fm/assets/${sindex}.mp3`} />
        </div>
      </div>
    </div>
  );
};

export default Home;
