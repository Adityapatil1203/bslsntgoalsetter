//------------------------------------------------------------------------------------

import './Fallback.scss';

//------------------------------------------------------------------------------------

const Fallback = (props) => {
    return (
        <div className="fallback">
            <div className='title headline-medium'>{props.title}</div>
            <div className='text body-medium'>{props.text}</div>
        </div>
    )
}

export default Fallback;

//------------------------------------------------------------------------------------
