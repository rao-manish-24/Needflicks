import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {useEffect, useState} from 'react';
import Movies from '../movies/Movies';
import Spinner from '../spinner/Spinner';
import './Recommended.css';

const Recommended = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchRecommendedMovies = async () => {
            setLoading(true);
            setMessage("");

            try{
                const response = await axiosPrivate.get('/recommendedmovies');
                setMovies(response.data);
            } catch (error){
                console.error("Error fetching recommended movies:", error)
            } finally {
                setLoading(false);
            }

        }
        fetchRecommendedMovies();
    }, [])

    return (
        <div className="nf-recommended-page">
            <div className="nf-recommended-header">
                <h1 className="nf-recommended-title">Recommended For You</h1>
                <p className="nf-recommended-subtitle">Personalized picks based on your favorite genres</p>
            </div>
            {loading ? (
                <Spinner/>
            ) :(
                <div className="nf-content-section">
                    <Movies movies = {movies} message ={message} />
                </div>
            )}
        </div>
    )

}
export default Recommended