import React from 'react';
import './Styles/Resources.css';

const Resources = () => {
    return (
        <div className='cda resources-container'>
            <div className=' d-flex justify-content-center'>Our Resources</div>
            <div className='d-flex justify-content-evenly resources-boxes'>
                <div className='resource-box'>Resource 1</div>
                <div className='resource-box'>Resource 2</div>
                <div className='resource-box'>Resource 3</div>
                <div className='resource-box'>Resource 4</div>
            </div>
        </div>
    );
}

export default Resources;
