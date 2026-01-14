import {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axiosClient from '../../api/axiosConfig';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import logo from '../../assets/Needflicks.png';
import './Login.css';

const Login = () => {
    
    const {setAuth} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const from = location.state?.from?.pathname || "/";
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);       

        try {
            const response = await axiosClient.post('/login', { email, password });
            console.log(response.data);
            if (response.data.error) {
                setError(response.data.error);
                return;
            }
           // console.log(response.data);
            setAuth(response.data);
            
           // localStorage.setItem('user', JSON.stringify(response.data));
            // Handle successful login (e.g., store token, redirect)
           navigate(from, {replace: true});
           //navigate('/');

        } catch (err) {
            console.error(err);
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    }; 
    return (
        <div className="nf-auth-page">
            <div className="nf-auth-card">
                <div className="nf-auth-logo">
                    <img src={logo} alt="Needflicks" />
                    <h2>Sign In</h2>
                    <p>Welcome back! Please login to your account.</p>
                </div>
                {error && <div className="nf-auth-error alert">{error}</div>}
                <Form onSubmit={handleSubmit} className="nf-auth-form">
                    <Form.Group controlId="formBasicEmail" className="mb-3">
                        <Form.Control
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword" className="mb-3">
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button
                        type="submit"
                        className="btn-submit w-100"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Signing in...
                            </>
                        ) : 'Sign In'}
                    </Button>
                </Form>
                <div className="nf-auth-links">
                    <span>New to Needflicks? </span>
                    <Link to="/register">Sign up now</Link>
                </div>
            </div>
        </div>
    )
}
export default Login;