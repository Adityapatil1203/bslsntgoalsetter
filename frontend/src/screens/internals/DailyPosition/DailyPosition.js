import '../internal.scss';
import Loading from '../../../components/Loading/Loading';
import Toggle from '../../../components/Toggle/Toggle';
import { useState, useEffect } from 'react';
import baseUrl from '../../../scripts/baseUrl';
import axios from 'axios';
import Header from '../../../components/Header/Header';
import Navigation from '../../../components/Navigation/Navigation';
import Fallback from '../../../components/Fallback/Fallback';
import { Clear } from '../../../components/Icons/Icons';
import Buffer from '../../../components/Buffer/Buffer';
import './DailyPosition.scss';
import Pagination from '../../../components/Pagination/Pagination';

const DailyPosition = () => {
    const [dailyPosition, setDailyPosition] = useState([]);
    const [notFound, setNotFound] = useState(true);
    const [buffer, setBuffer] = useState(true);
    const [loader, setLoader] = useState(false);
    const [file, setFile] = useState('');
    const [fileName, setFileName] = useState("");
    const [caption, setCaption] = useState("");

    const [dialog, setDialog] = useState(false);

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const [ownerTotalItems, setOwnerTotalItems] = useState(0);
    const [ownerItemsPerPage, setOwnerItemsPerPage] = useState(20);
    const [ownerActivePage, setOwnerActivePage] = useState(1);

    const openDialog = (index) => {
        // setDialog(dailyPosition[index]);
        setDialog(dailyPosition[ownerActivePage - 1][index])
    }

    const closeDialog = () => {
        setDialog(false);
        setFile('');
        setFileName('');
    }

    const getdailyPosition = async () => {
        try {
            const res = await axios.get(`${baseUrl}/todays-reflection`);

            if (res.data) {
                // const arrayData = [];
                // for (const data of res.data) {
                //     arrayData.unshift(data);
                // }
                // setDailyPosition([...arrayData]);
                // setNotFound(false);
                let array = [...res.data];
                let mainArray = [];

                let n = 0;
                for (let i = 0; i < Math.ceil(array.length / ownerItemsPerPage); i++) {
                    mainArray.push([]);
                    for (let a = 0; a < ownerItemsPerPage; a++) {
                        if (array[n] != undefined) {
                            mainArray[i].unshift(array[n]);
                            n++;
                        }
                    }
                }
                // setDailyPosition(mainArray);

                const arrayData = [];
                for (const data of mainArray) {
                    arrayData.unshift(data);
                }
                setDailyPosition([...arrayData]);
                setOwnerTotalItems(res.data.length);
                setNotFound(false);
            } else {
                setNotFound(true);
            }
            setBuffer(false);
        } catch (err) {
            console.log(err);
        }
    }

    const sortByDate = async () => {
        if (fromDate.length === 0) return alert("Please enter 'from' date");
        if (toDate.length === 0) return alert("Please enter 'to' date");

        let data = {
            from: fromDate,
            to: toDate,
        }

        try {
            setLoader(true);
            const res = await axios.post(`${baseUrl}/todays-reflection/sort-by-date`, data);

            if (res.data) {
                // const arrayData = [];
                // for (const data of res.data) {
                //     arrayData.unshift(data);
                // }
                // setDailyPosition([...arrayData]);
                // setNotFound(false);

                //###########

                let array = [...res.data];
                let mainArray = [];

                let n = 0;
                for (let i = 0; i < Math.ceil(array.length / ownerItemsPerPage); i++) {
                    mainArray.push([]);
                    for (let a = 0; a < ownerItemsPerPage; a++) {
                        if (array[n] != undefined) {
                            mainArray[i].unshift(array[n]);
                            n++;
                        }
                    }
                }
                // setDailyPosition(mainArray);

                const arrayData = [];
                for (const data of mainArray) {
                    arrayData.unshift(data);
                }
                setDailyPosition([...arrayData]);
                setOwnerTotalItems(res.data.length);
                setNotFound(false);
            } else {
                setNotFound(true);
            }
            setBuffer(false);
        } catch (err) {
            console.log(err);
        }
        setLoader(false);
    }

    useEffect(() => {
        getdailyPosition();
    }, []);

    const getTime = (datetime) => {
        let date = false;
        if (datetime) {
            var c_date = new Date(datetime);
            var hrs = c_date.getHours();
            var min = c_date.getMinutes();
            if (isNaN(hrs) || isNaN(min) || c_date === "Invalid Date") {
                return null;
            }
            var type = (hrs <= 12) ? " AM" : " PM";
            date = ((+hrs % 12) || hrs) + ":" + min + type;
            return date;
        }
        return date;
    }

    const getPageNumberOwner = (number) => {
        setOwnerActivePage(number);
    }

    return (
        <>
            {
                localStorage.getItem('n_admin') !== null &&
                <>
                    <Header />
                    <div className="screen-container">
                        <Navigation />
                        <div className='side-container'>
                            <div className='screen-title title-large'>Daily position</div>

                            <div className='inputfields-container'>
                                <div className='body'>
                                    <div>
                                        <div className='label label-small'>From</div>
                                        <input type='date' className='inputfield' onChange={(e) => setFromDate(e.currentTarget.value)} />
                                    </div>
                                    <div>
                                        <div className='label label-small'>To</div>
                                        <input type='date' className='inputfield' onChange={(e) => setToDate(e.currentTarget.value)} />
                                    </div>
                                </div>
                                <div className='footer'>
                                    <button className='filled-button' onClick={sortByDate}>Sort by date</button>
                                    <button className='filled-tonal-button' onClick={getdailyPosition}>Reset</button>
                                </div>
                            </div>

                            {buffer && notFound ? <Buffer /> : <></>}

                            {dailyPosition.length === 0 && !buffer
                                ? <Fallback title='Not found' text='No data found in the database. Try refreshing the page.' />
                                : <></>
                            }

                            {
                                dailyPosition.length !== 0 && !notFound && !buffer
                                    ?
                                    <>

                                        <div className='table-container center'>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <th>
                                                            <div className='table-head'>
                                                                <div className='table-title'>Sr.&nbsp;No.</div>
                                                            </div>
                                                        </th>

                                                        <th>
                                                            <div className='table-head'>
                                                                <div className='table-title'>Employee name</div>
                                                            </div>
                                                        </th>

                                                        <th>
                                                            <div className='table-head'>
                                                                <div className='table-title'>Today's reflection</div>
                                                            </div>
                                                        </th>

                                                        <th>
                                                            <div className='table-head'>
                                                                <div className='table-title'>Tomorrow's planning</div>
                                                            </div>
                                                        </th>

                                                        <th>
                                                            <div className='table-head'>
                                                                <div className='table-title'>Date</div>
                                                            </div>
                                                        </th>

                                                        <th>
                                                            <div className='table-head'>
                                                                <div className='table-title'>Time</div>
                                                            </div>
                                                        </th>

                                                        <th>
                                                            <div className='table-head'>
                                                                <div className='table-title'>View images</div>
                                                            </div>
                                                        </th>
                                                    </tr>
                                                    {
                                                        dailyPosition[ownerActivePage - 1].map((data, index) => {
                                                            return (
                                                                <tr key={index} onClick={() => openDialog(index)}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{data.addedByEmployee}</td>
                                                                    <td>{data.todaysReflection}</td>
                                                                    <td>{data.tomorrowsPlanning}</td>
                                                                    <td>{`${new Date(data.datetime).getFullYear()}-${new Date(data.datetime).getMonth() + 1}-${new Date(data.datetime).getDate()}`}</td>
                                                                    <td>{getTime(data.datetime)}</td>
                                                                    <td className='link'>View</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody >
                                            </table >
                                            <Pagination getTotalItems={ownerTotalItems} getItemsPerPage={ownerItemsPerPage} getPageNumber={getPageNumberOwner} activePage={ownerActivePage} />
                                        </div>
                                    </>
                                    : <></>
                            }
                        </div>
                    </div>

                    {
                        dialog &&
                        <div className='dialog-container'>
                            <div className='dialog'>
                                <div className='dialog-top'>
                                    <div className='title title-large'>Daily Position</div>
                                    <button className='icon-button' onClick={closeDialog}><Clear /></button>
                                </div>

                                <div className='dialog-content'>
                                    <div className='details-container-1'>
                                        <div>
                                            <div className='label label-medium'>Employee name</div>
                                            <div className='aadhaar-id body-large'>{dialog.addedByEmployee}</div>
                                        </div>

                                        <div>
                                            <div className='label label-medium'>Today's reflection</div>
                                            <div className='aadhaar-id body-large'>{dialog.todaysReflection}</div>
                                        </div>

                                        <div>
                                            <div className='label label-medium'>Tomorrow planning</div>
                                            <div className='aadhaar-id body-large'>{dialog.tomorrowsPlanning}</div>
                                        </div>
                                    </div>

                                    <div className='label label-medium'>Images</div>

                                    <div className='position-image-container'>
                                        {
                                            dialog.image_1 &&
                                            <div className='img'>
                                                <img src={dialog.image_1} />
                                                <a href={dialog.image_1} target='_blank' className='overlay'>Full screen</a>
                                            </div>
                                        }

                                        {
                                            dialog.image_2 &&
                                            <div className='img'>
                                                <img src={dialog.image_2} />
                                                <a href={dialog.image_2} target='_blank' className='overlay'>Full screen</a>
                                            </div>
                                        }

                                        {
                                            dialog.image_3 &&
                                            <div className='img'>
                                                <img src={dialog.image_3} />
                                                <a href={dialog.image_3} target='_blank' className='overlay'>Full screen</a>
                                            </div>
                                        }

                                        {
                                            dialog.image_4 &&
                                            <div className='img'>
                                                <img src={dialog.image_4} />
                                                <a href={dialog.image_4} target='_blank' className='overlay'>Full screen</a>
                                            </div>
                                        }

                                        {
                                            dialog.image_5 &&
                                            <div className='img'>
                                                <img src={dialog.image_5} />
                                                <a href={dialog.image_5} target='_blank' className='overlay'>Full screen</a>
                                            </div>
                                        }
                                    </div>

                                    <div className='position-image-container'>
                                        {
                                            dialog.image_6 &&
                                            <div className='img'>
                                                <img src={dialog.image_6} />
                                                <a href={dialog.image_6} target='_blank' className='overlay'>Full screen</a>
                                            </div>
                                        }

                                        {
                                            dialog.image_7 &&
                                            <div className='img'>
                                                <img src={dialog.image_7} />
                                                <a href={dialog.image_7} target='_blank' className='overlay'>Full screen</a>
                                            </div>
                                        }

                                        {
                                            dialog.image_8 &&
                                            <div className='img'>
                                                <img src={dialog.image_8} />
                                                <a href={dialog.image_8} target='_blank' className='overlay'>Full screen</a>
                                            </div>
                                        }

                                        {
                                            dialog.image_9 &&
                                            <div className='img'>
                                                <img src={dialog.image_9} />
                                                <a href={dialog.image_9} target='_blank' className='overlay'>Full screen</a>
                                            </div>
                                        }

                                        {
                                            dialog.image_10 &&
                                            <div className='img'>
                                                <img src={dialog.image_10} />
                                                <a href={dialog.image_10} target='_blank' className='overlay'>Full screen</a>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    {loader && <Loading />}
                </>
            }
        </>
    )
}

export default DailyPosition;