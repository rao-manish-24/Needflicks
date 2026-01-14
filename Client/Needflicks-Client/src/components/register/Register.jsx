import { useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axiosClient from '../../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/Needflicks.png';
import './Register.css';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [favouriteGenres, setFavouriteGenres] = useState([]);
    const [genres, setGenres] = useState([]);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGenreChange = (e) => {
        const options = Array.from(e.target.selectedOptions);
        setFavouriteGenres(options.map(opt => ({
            genre_id: Number(opt.value),
            genre_name: opt.label
        })));
    };
   const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const defaultRole ="USER";

        console.log(defaultRole);

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                role: defaultRole,
                favourite_genres: favouriteGenres
            };
            const response = await axiosClient.post('/register', payload);
            if (response.data.error) {
                setError(response.data.error);
                return;
            }
            // Registration successful, redirect to login
            navigate('/login', { replace: true });
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const fetchGenres = async () => {
        try {
            const response = await axiosClient.get('/genres');
            setGenres(response.data);
        } catch (error) {
            console.error('Error fetching movie genres:', error);
        }
        };
    
        fetchGenres();
    }, []);


    return (
        <div className="nf-auth-page">
            <div className="nf-auth-card nf-register-card">
                <div className="nf-auth-logo">
                    <img src={logo} alt="Needflicks" />
                    <h2>Create Account</h2>
                    <p>Join Needflicks and start streaming today.</p>
                </div>
                {error && <div className="nf-auth-error alert">{error}</div>}
                <Form onSubmit={handleSubmit} className="nf-auth-form">
                    <div className="nf-form-row">
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="First name"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Last name"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </div>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            isInvalid ={!!confirmPassword && password !== confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                            Passwords do not match.
                        </Form.Control.Feedback>
                    </Form.Group>
                    
                    <p className="nf-form-section-title">Select your favorite genres</p>
                    <Form.Group className="mb-3">
                        <Form.Select
                            multiple
                            className="nf-genre-select"
                            value={favouriteGenres.map(g => String(g.genre_id))}
                            onChange={handleGenreChange}
                        >
                            {genres.map(genre => (
                                <option key={genre.genre_id} value={genre.genre_id} label={genre.genre_name}>
                                    {genre.genre_name}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Text className="nf-genre-help">
                            Hold Ctrl (Windows) or Cmd (Mac) to select multiple genres.
                        </Form.Text>
                    </Form.Group>
                    <Button
                        type="submit"
                        className="btn-submit w-100"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Creating account...
                            </>
                        ) : 'Sign Up'}
                    </Button>                        
                </Form>
                <div className="nf-auth-links">
                    <span>Already have an account? </span>
                    <Link to="/login">Sign in</Link>
                </div>
            </div>           
        </div>
    )
}
export default Register;