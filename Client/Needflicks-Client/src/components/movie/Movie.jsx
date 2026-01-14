import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCirclePlay} from '@fortawesome/free-solid-svg-icons';
import "./Movie.css";

const Movie = ({movie,updateMovieReview}) => {
    return (
        <div className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4 nf-movie-card-wrapper" key={movie._id}>
            <Link
                to={`/stream/${movie.youtube_id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
            <div className="card h-100 movie-card">
                <div className="nf-poster-container">
                    <img src={movie.poster_path} alt={movie.title} 
                        className="card-img-top"
                    />
                    <span className="play-icon-overlay">
                            <FontAwesomeIcon icon={faCirclePlay} />
                    </span>
                    {movie.ranking?.ranking_name && (
                        <span className="nf-ranking-badge">
                            {movie.ranking.ranking_name}
                        </span>
                    )}
                </div>
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{movie.title}</h5>
                    <p className="card-text mb-2">{movie.imdb_id}</p>
                </div>
                  {updateMovieReview && (
                        <Button
                            variant="outline-info"
                            onClick={e => {
                                e.preventDefault();
                                updateMovieReview(movie.imdb_id);
                            }}
                            className="m-3"
                        >
                            Review
                        </Button>
                    )}
            </div>
            </Link>
        </div>
    )
}
export default Movie;