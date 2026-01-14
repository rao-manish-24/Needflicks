import {useState, useEffect} from 'react';
import axiosClient from '../../api/axiosConfig'
import Movies from '../movies/Movies';
import Spinner from '../spinner/Spinner';
import './Home.css';

const Home =({updateMovieReview}) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState();

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setMessage("");
            try{
                const response = await axiosClient.get('/movies');
                setMovies(response.data);
                if (response.data.length === 0){
                    setMessage('There are currently no movies available')
                }

            }catch(error){
                console.error('Error fetching movies:', error)
                setMessage("Error fetching movies")
            }finally{
                setLoading(false)
            }
        }
        fetchMovies();
    }, []);

    return (
        <div className="nf-home">
            {loading ? (
                <Spinner/>
            ):  (
                <div className="nf-content-section">
                    <div className="nf-section-header">
                        <h2 className="nf-section-title">Popular on Needflicks</h2>
                    </div>
                    <Movies movies ={movies} updateMovieReview={updateMovieReview} message ={message}/>
                </div>
            )}
        </div>
    );

};

export default Home;


