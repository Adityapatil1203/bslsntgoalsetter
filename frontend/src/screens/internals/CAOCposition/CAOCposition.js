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

const CAOCposition = () => {
    const [caocPosition, setCaocPosition] = useState([]);
    const [notFound, setNotFound] = useState(true);
    const [buffer, setBuffer] = useState(true);
    const [loader, setLoader] = useState(false);
    const [title, settitle] = useState('');
    const [link, setlink] = useState('');

    const [dialog, setDialog] = useState(false);

    const openDialog = (index) => {
        setDialog(true);
    }

    const closeDialog = () => {
        setDialog(false);
    }

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

    const getcaocPosition = async () => {
        try {
            const res = await axios.get(`${baseUrl}/caos`);

            if (res.data) {
                const arrayData = [];
                for (const data of res.data) {
                    arrayData.unshift(data);
                }
                setCaocPosition([...arrayData]);
                setNotFound(false);
            } else {
                setNotFound(true);
            }
            setBuffer(false);
        } catch (err) {
            console.log(err);
        }
    }

    const setcaocPosition = async () => {
        if (title.length == 0) {
            alert('Please add title');
            return;
        }
        if (link.length == 0) {
            alert('Please add link');
            return;
        }

        try {
            const res = await axios.post(`${baseUrl}/caos`, {
                link: link,
                title: title
            });

            if (res.data) {
                if (res.data.message) {
                    alert('CAOC position added');
                    closeDialog();
                    getcaocPosition();

                    settitle('');
                    setlink('');
                } else {
                    alert('Failed to add caocPosition');
                }
            } else {
                setNotFound(true);
            }
            setBuffer(false);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getcaocPosition();
    }, []);

    return (
        <>
            {
                localStorage.getItem('n_admin') !== null &&
                <>
                    <Header />
                    <div className="screen-container">
                        <Navigation />
                        <div className='side-container'>
                            <div className='screen-title title-large'>CAOC position</div>

                            <button className='outlined-button' onClick={() => openDialog()} style={{ marginBottom: '16px' }}>Add CAOC position</button>

                            {buffer && notFound ? <Buffer /> : <></>}

                            {caocPosition.length === 0 && !buffer
                                ? <Fallback title='Not found' text='No data found in the database. Try refreshing the page.' />
                                : <></>
                            }

                            {
                                caocPosition.length !== 0 && !notFound && !buffer
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
                                                                <div className='table-title'>Title</div>
                                                            </div>
                                                        </th>

                                                        <th>
                                                            <div className='table-head'>
                                                                <div className='table-title'>Link</div>
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
                                                    </tr>
                                                    {
                                                        caocPosition.map((data, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{data.title}</td>
                                                                    <td>
                                                                        <a className='link' href={data.link} target='_blank'>{data.link}</a>
                                                                    </td>
                                                                    <td>{`${new Date(data.datetime).getFullYear()}-${new Date(data.datetime).getMonth() + 1}-${new Date(data.datetime).getDate()}`}</td>
                                                                    <td>{getTime(data.datetime)}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody >
                                            </table >
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
                                    <div className='title title-large'>CAOC position</div>
                                    <button className='icon-button' onClick={closeDialog}><Clear /></button>
                                </div>

                                <div className='dialog-content'>
                                    <div className='label'>Title</div>
                                    <input className='inputfield' onChange={(e) => settitle(e.target.value)} />

                                    <div className='label'>Link</div>
                                    <input className='inputfield' onChange={(e) => setlink(e.target.value)} />

                                    <button className='filled-button' onClick={setcaocPosition} style={{ marginTop: '16px' }}>Add CAOC position</button>
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

export default CAOCposition