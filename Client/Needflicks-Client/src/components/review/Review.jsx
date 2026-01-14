import {Form, Button} from 'react-bootstrap';
import { useRef,useEffect,useState } from 'react';
import {useParams} from 'react-router-dom'
//import axiosPrivate from '../../api/axiosPrivateConfig';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import Movie from '../movie/Movie'
import Spinner from '../spinner/Spinner';
import './Review.css';

const Review = () => {

    const [movie, setMovie] = useState({});
    const [loading, setLoading] = useState(false);
    const revText = useRef();
    const { imdb_id } = useParams();
    const {auth,setAuth} = useAuth();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchMovie = async () => {
            setLoading(true);
            try {
                const response = await axiosPrivate.get(`/movie/${imdb_id}`);
                setMovie(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching movie:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setLoading(true);
        try {
            
            const response = await axiosPrivate.patch(`/updatereview/${imdb_id}`, { admin_review: revText.current.value });
            console.log(response.data);           

            setMovie(() => ({
                ...movie,
                admin_review: response.data?.admin_review ?? movie.admin_review,
                ranking: {
                    ranking_name: response.data?.ranking_name ?? movie.ranking?.ranking_name
                }
            }));

        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                 console.error('Unauthorized access - redirecting to login');
                 localStorage.removeItem('user');
                // setAuth(null);
            } else {
                console.error('Error updating review:', err);
            }

        } finally {
            setLoading(false);
        }
    }; 

    return (
      <>
        {loading ? (
            <Spinner />
        ) : (
            <div className="container nf-review-page">
                <h2 className="nf-review-title">
                    {auth && auth.role === "ADMIN" ? <span>Admin</span> : ''} Review
                </h2>
                <div className="nf-review-layout">
                    <div className="nf-review-movie-card">
                        <Movie movie={movie} />
                    </div>
                    <div className="nf-review-form-container">
                        <div className="nf-review-form-header">
                            <h3>{auth && auth.role === "ADMIN" ? 'Write Review' : 'Movie Review'}</h3>
                        </div>
                        {auth && auth.role === "ADMIN" ? (
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="adminReviewTextarea">
                                    <Form.Control
                                        ref={revText}
                                        required
                                        as="textarea"
                                        rows={8}
                                        className="nf-review-textarea"
                                        defaultValue={movie?.admin_review}
                                        placeholder="Write your review here..."
                                    />
                                </Form.Group>
                                <div className="d-flex justify-content-end">
                                    <Button type="submit" className="nf-review-submit">
                                        Submit Review
                                    </Button>
                                </div>
                            </Form> 
                        ):(
                            <div className="nf-review-display">
                                {movie.admin_review || 'No review available yet.'}
                            </div>
                        )}                           
                    </div>
                </div>
            </div>
        )}
    </>      

    );
}

export default Review;