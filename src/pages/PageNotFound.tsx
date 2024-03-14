//PageNotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './pageNotFound.css';

const PageNotFound: React.FC = () => {
    return (
        <div className='page-not-found container'>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist</p>
            <Link to="/">Go to the home page</Link>
        </div>
    );
};

export default PageNotFound;