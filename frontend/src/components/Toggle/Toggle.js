//------------------------------------------------------------------------------------

import './Toggle.scss';

//------------------------------------------------------------------------------------

const Toggle = ({ state }) => {
    let className = state ? 'toggle-container on' : 'toggle-container off';

    return (
        <div className={className}>
            <div className='toggle'></div>
        </div>
    )
}

export default Toggle

//------------------------------------------------------------------------------------