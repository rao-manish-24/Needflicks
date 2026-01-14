import Movie from '../movie/Movie'
import './Movies.css';

const Movies = ({movies, updateMovieReview, message}) => {

    return (
        <div className="container-fluid nf-movies-container">
            <div className="row g-3">
                {movies && movies.length > 0
                    ? movies.map((movie) => (
                        <Movie key={movie._id} updateMovieReview={updateMovieReview} movie={movie} />
                    ))
                    : <div className="nf-empty-state">
                        <h2>{message || 'No movies available'}</h2>
                        <p>Check back later for new content</p>
                      </div>
                }

            </div>

        </div>
    )
}
export default Movies;
