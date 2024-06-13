//------------------------------------------------------------------------------------

import { useState } from 'react';
import { ExpandLess, ExpandMore } from '../Icons/Icons';
import './Pagination.scss';

//------------------------------------------------------------------------------------

const Pagination = ({ getTotalItems, getItemsPerPage, getPageNumber, activePage }) => {
    const [totalItems, setTotalItems] = useState(getTotalItems);
    const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);

    let totalButtonsCount = Math.ceil(totalItems / itemsPerPage);
    let totalButtonsData = [];

    for (let i = 1; i <= totalButtonsCount; i++) {
        totalButtonsData.push({
            isActive: i == activePage ? true : false,
            number: i,
        });
    }

    let previousClassName = activePage <= 1 ? 'pagination previous disabled' : 'pagination previous';
    let nextClassName = activePage >= totalButtonsCount ? 'pagination next disabled' : 'pagination next';

    return (
        <>
            {
                totalButtonsCount != 0 && totalButtonsData.length != 1 &&
                <div className='pagination-container'>
                    <div className={previousClassName} onClick={() => getPageNumber(activePage - 1)}>
                        <ExpandLess />
                    </div>
                    {
                        totalButtonsData.map((data) => {
                            let className = data.isActive ? 'pagination active' : 'pagination';
                            return <div key={data.number} className={className} onClick={() => getPageNumber(data.number)}>{data.number}</div>
                        })
                    }
                    <div className={nextClassName} onClick={() => getPageNumber(activePage + 1)}>
                        <ExpandMore />
                    </div>
                </div>
            }
        </>
    )
}

export default Pagination;

//------------------------------------------------------------------------------------