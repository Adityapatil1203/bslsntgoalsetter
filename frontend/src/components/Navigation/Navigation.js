//------------------------------------------------------------------------------------

import { Link, useLocation } from 'react-router-dom';
import './Navigation.scss';

//------------------------------------------------------------------------------------

// export let buttons = [
//     {
//         label: 'Dashboard',
//         link: '/dashboard',
//         isActive: false,
//     },
//     {
//         label: 'Approvals',
//         link: '/approvals',
//         isActive: false,
//     },
//     {
//         label: 'Owners',
//         link: '/owners',
//         isActive: false,
//     },
//     {
//         label: 'Vendors',
//         link: '/vendors',
//         isActive: false,
//     },
//     {
//         label: 'Employees',
//         link: '/employees',
//         isActive: false,
//     },
//     // {
//     //     label: 'Payments',
//     //     link: '/payments',
//     //     isActive: false,
//     // },
// ];

const Navigation = () => {
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
            label: 'Add',
            link: '/add',
            isActive: false,
        },
    ];

    const currentScreen = useLocation().pathname;
    for (const button of buttons) {
        if (currentScreen === button.link) {
            button.isActive = true;
        } else {
            button.isActive = false;
        }
    }

    return (
        <>
            {
                window.innerWidth > 840 &&
                <div className='side-navigation'>
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
                </div>
            }
        </>
    )
}

export default Navigation;

//------------------------------------------------------------------------------------
