//------------------------------------------------------------------------------------

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, json, useLocation, useNavigate } from 'react-router-dom';
import { ExpandLess, ExpandMore, Notifications } from '../Icons/Icons';
// import { buttons } from '../Navigation/Navigation';
import './Header.scss';
import baseUrl from '../../scripts/baseUrl';
import Loading from '../Loading/Loading';

//------------------------------------------------------------------------------------

/* const buttons = [
    {
        label: 'Home',
        link: '/',
        isActive: false,
    },
]; */

const Header = () => {
    let buttons = [
        {
            label: 'Home',
            link: '/home',
            isActive: false,
        },
        {
            label: 'Daily position',
            link: '/daily-position',
            isActive: false,
        },
        {
            label: 'Circular',
            link: '/circular',
            isActive: false,
        },
        {
            label: 'CAOC position',
            link: '/caoc-position',
            isActive: false,
        },
        {
            label: 'Image gallery',
            link: '/gallery',
            isActive: false,
        },
        {
            label: 'Add station ',
            link: '/gallery',
            isActive: false,
        },
    ];

    const [navigationState, setNavigationState] = useState(false);
    const currentScreen = useLocation().pathname;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);

    for (const button of buttons) {
        if (currentScreen === button.link) {
            button.isActive = true;
        } else {
            button.isActive = false;
        }
    }

    const handleNavigationState = () => {
        setNavigationState((prev) => !prev);
    }

    const logout = async () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.clear();
            navigate('/login');
        }
    }

    // useEffect(() => {
    //     if (prevCount != notifications) {
    //         let audio = new Audio(NotificationSound);
    //         audio.play();
    //         prevCount = notifications;
    //     }
    // }, [notifications]);

    return (
        <>
            <div className='header'>
                <div className='leading-container'>
                    <div className="app-title title-large">Admin panel</div>
                </div>
                <div className="trailing-container">
                    {
                        window.innerWidth > 840 &&
                        <button className="filled-tonal-button" onClick={logout}>Logout</button>
                    }
                    {
                        window.innerWidth < 840 &&
                        <button className="icon-button" onClick={handleNavigationState}>
                            {
                                navigationState ? <ExpandLess /> : <ExpandMore />
                            }
                        </button>
                    }
                </div>

                {
                    navigationState & window.innerWidth < 840
                        ? <div className='navigation-container'>
                            {
                                buttons.map((button, index) => {
                                    const className = button.isActive ? 'navigation-button active' : 'navigation-button';
                                    return (
                                        <Link to={button.link} key={index}>
                                            <button className={className}>{button.label}</button>
                                        </Link>
                                    )
                                })
                            }
                            <div className='bottom-buttons'>
                                <button className="filled-tonal-button" onClick={logout}>Logout</button>
                            </div>
                        </div>
                        : <></>
                }
            </div >
            {loader && <Loading />}
        </>
    )
}

export default Header;

//------------------------------------------------------------------------------------
