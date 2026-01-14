import {useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import {useNavigate, NavLink, Link} from 'react-router-dom'
import useAuth from '../../hooks/useAuth';
import logo from '../../assets/Needflicks.png';
import './Header.css';

const Header = ({handleLogout}) => {
    const navigate = useNavigate();
    const {auth} = useAuth();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Navbar expand="lg" className={`nf-navbar ${scrolled ? 'scrolled' : ''}`}>
            <Container fluid>
                <Navbar.Brand>
                     <img
                        alt="Needflicks"
                        src={logo}
                        width="35"
                        height="35"
                        className="d-inline-block align-top me-2"
                    />
                    NEEDFLICKS
                </Navbar.Brand>

            <Navbar.Toggle aria-controls="main-navbar-nav" />
                <Navbar.Collapse id="main-navbar-nav">
                    <Nav className ="me-auto">
                        <Nav.Link as = {NavLink} to="/">
                            Home
                        </Nav.Link>
                        <Nav.Link as = {NavLink} to="/recommended">
                            Recommended
                        </Nav.Link>
                    </Nav>
    
                    <Nav className ="ms-auto align-items-center">
                        {auth ? (
                        <>
                            <span className="nf-user-greeting me-3">
                                Hello, <strong>{auth.first_name}</strong>
                            </span>
                            <Button className="btn-logout" size="sm" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                        ):(
                            <>
                                <Button
                                    className="btn-login me-2"
                                    size="sm"
                                    onClick={() => navigate("/login")} 
                                >
                                    Login
                                </Button>
                                <Button
                                    className="btn-register"
                                    size="sm"
                                    onClick={() => navigate("/register")}  
                                >
                                    Register
                                </Button>                        
                            </>
                        )}
                    </Nav>       
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
export default Header;