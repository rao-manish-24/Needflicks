import './Spinner.css';

const Spinner = () => {

    return (
        <div className="nf-loading">
            <div className="nf-spinner"></div>
            <p className="nf-loading-text">Loading...</p>
        </div>
    );
}

export default Spinner;