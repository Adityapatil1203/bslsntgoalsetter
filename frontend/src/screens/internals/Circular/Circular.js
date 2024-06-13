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

const Circular = () => {
    const [circular, setcircular] = useState([]);
    const [notFound, setNotFound] = useState(true);
    const [buffer, setBuffer] = useState(true);
    const [loader, setLoader] = useState(false);
    const [file, setFile] = useState('');
    const [fileName, setFileName] = useState("");

    const [dialog, setDialog] = useState(false);

    const openDialog = (index) => {
        setDialog(true);
    }

    const closeDialog = () => {
        setDialog(false);
        setFile('');
        setFileName('');
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

    const getCircular = async () => {
        try {
            const res = await axios.get(`${baseUrl}/circular`);

            if (res.data) {
                const arrayData = [];
                for (const data of res.data) {
                    arrayData.unshift(data);
                }
                setcircular([...arrayData]);
                setNotFound(false);
            } else {
                setNotFound(true);
            }
            setBuffer(false);
        } catch (err) {
            console.log(err);
        }
    }

    const setCircular = async () => {
        if (file == '' || fileName == '') {
            alert('Please select circular.')
            return;
        }

        const formData = new FormData();
        formData.append("image", file);
        formData.append("fileName", fileName);

        try {
            const res = await axios.post(`${baseUrl}/circular`, formData);

            if (res.data) {
                if (res.data.message) {
                    alert('Circular added');
                    closeDialog();
                    getCircular();
                } else {
                    alert('Failed to add circular');
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
        getCircular();
    }, []);



    const getCircularPDF = (event) => {
        setFile(event.target.files[0]);
        setFileName(event.target.files[0].name);
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
                            <div className='screen-title title-large'>Circular</div>

                            <button className='outlined-button' onClick={() => openDialog()} style={{ marginBottom: '16px' }}>Add circular</button>

                            {buffer && notFound ? <Buffer /> : <></>}

                            {circular.length === 0 && !buffer
                                ? <Fallback title='Not found' text='No data found in the database. Try refreshing the page.' />
                                : <></>
                            }

                            {
                                circular.length !== 0 && !notFound && !buffer
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
                                                                <div className='table-title'>Download</div>
                                                            </div>
                                                        </th>
                                                    </tr>
                                                    {
                                                        circular.map((data, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{`${new Date(data.datetime).getFullYear()}-${new Date(data.datetime).getMonth() + 1}-${new Date(data.datetime).getDate()}`}</td>
                                                                    <td>{getTime(data.datetime)}</td>
                                                                    <td>
                                                                        <a className='link' href={data.image} target='_blank'>View circular</a>
                                                                    </td>
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
                                    <div className='title title-large'>Circular</div>
                                    <button className='icon-button' onClick={closeDialog}><Clear /></button>
                                </div>

                                <div className='dialog-content'>
                                    <input type='file' onChange={getCircularPDF} />
                                    <button className='filled-button' onClick={setCircular}>Add circular</button>
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

export default Circular