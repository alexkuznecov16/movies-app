import React, { useEffect, useState } from 'react';
import './MoviesApp.css';

// Main function
const MoviesApp = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // for modal add and remove
    const [selectedMovie, setSelectedMovie] = useState(null); // choose selected movie ID

    // On click open modal
    const openModal = (movie) => {
        setSelectedMovie(movie); // add movie id
        setIsModalOpen(true); // open modal
        document.body.style.overflow = 'hidden'; // no scroll (when modal is open)
    };

    // On click close modal
    const closeModal = () => {
        setIsModalOpen(false); // close modal
        document.body.style.overflow = ''; // yes scroll (when modal is close)
    };

    // Check rating and add color
    const getRatingColorClass = (voteAverage) => {
        if (voteAverage >= 7) {
            return 'high-rating'; // gold rating
        } else if (7 > voteAverage <= 4) {
            return 'normal-rating'; // green rating
        } else {
            return 'low-rating'; // red rating
        }
    };

    // Trunc text
    const truncateOverview = (overview, maxWords) => {
        const words = overview.split(' ');
        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '...'; // trunc text to max length and in the end add (...)
        }
        return overview; // if words length is 40 or less
    };

    const [movieList, setMovieList] = useState([]); // movie list

    // request function (get movie info in json)
    const getMovies = () => {
        fetch('https://api.themoviedb.org/3/discover/movie?api_key=a5f4430ee08f744a0557811bcd2b6ebe') // API url
            .then((response) => response.json()) // response to json format
            .then((json) => setMovieList(json.results)); // set to movieList all movies
    };

    // useEffect work every time for movies correct showing
    useEffect(() => {
        getMovies();
    }, []);
    
    return (
        <div className='Movies'>
            <ul className='Movies__container'>
                {movieList.map((movie) => (
                    <li className='Movies-item' key={movie.id} onClick={() => openModal(movie)}>
                        <div className='Movies-item__poster'>
                            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt='poster' className='Movies-item__poster-image' />
                            <div className='Movies-item__poster-lang'>{movie.original_language}</div>
                            <span className='Movies-item__poster-date'>{movie.release_date}</span>
                        </div>
                        <div className='Movies-item__info'>
                            <h3 className='Movies-item-title'>{movie.original_title}</h3>
                            <p className='Movies-item-text'>
                                {truncateOverview(movie.overview, 40)} {/* Ограничение до 40 слов */}
                            </p>
                            <div className='Movies-item__rating'>
                                <p className='Movies-item__rating__block'>
                                    Rating: <span className={`Movies-item__rating-value ${getRatingColorClass(movie.vote_average)}`}> {movie.vote_average}</span>
                                </p>
                                <p className='Movies-item__rating__block'>
                                    Vote count: <span className='Movies-item__rating-vote-count'> {movie.vote_count}</span>
                                </p>
                            </div>
                        </div>
                    </li>
                ))}
                {isModalOpen && selectedMovie && (
                    <div className='modal'>
                        <div className='modal-content'>
                            <span className='close' onClick={closeModal}>
                                &times;
                            </span>
                            <div className='Movies-item__poster'>
                                <div className='Movies__images'>
                                    <img src={`https://image.tmdb.org/t/p/w500/${selectedMovie.poster_path}`} alt='poster' className='Movies-item__poster-image' />
                                    <img src={`https://image.tmdb.org/t/p/w500/${selectedMovie.backdrop_path}`} alt='image' className='Movies-item__image' />
                                </div>
                                <div className='Movies-item__poster-lang'>{selectedMovie.original_language}</div>
                                <span className='Movies-item__poster-date'>{selectedMovie.release_date}</span>
                            </div>
                            <div className='Movies-item__info'>
                                <a href={`https://www.google.com/search?client=firefox-b-d&q=${selectedMovie.original_title}`} className='Movies-item-title'>{selectedMovie.original_title}</a>
                                <p className='Movies-item-text'>
                                    {selectedMovie.overview}
                                </p>
                                <div className='Movies-item__rating'>
                                    <p className='Movies-item__rating__block'>
                                        Rating: <span className={`Movies-item__rating-value ${selectedMovie.vote_average}`}> {selectedMovie.vote_average}</span>
                                    </p>
                                    <p className='Movies-item__rating__block'>
                                        Vote count: <span className='Movies-item__rating-vote-count'> {selectedMovie.vote_count}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </ul>
        </div>
    );
};

export default MoviesApp;
