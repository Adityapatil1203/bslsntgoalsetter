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

const Gallery = () => {
    const [gallery, setGallery] = useState([]);
    const [notFound, setNotFound] = useState(true);
    const [buffer, setBuffer] = useState(true);
    const [loader, setLoader] = useState(false);
    const [file, setFile] = useState('');
    const [fileName, setFileName] = useState("");
    const [caption, setCaption] = useState("");

    const [dialog, setDialog] = useState(false);

    const openDialog = (index) => {
        setDialog(true);
    }

    const closeDialog = () => {
        setDialog(false);
        setFile('');
        setFileName('');
    }

    const getgallery = async () => {
        try {
            const res = await axios.get(`${baseUrl}/gallery/image`);

            if (res.data) {
                const arrayData = [];
                for (const data of res.data) {
                    arrayData.unshift(data);
                }
                setGallery([...arrayData]);
                setNotFound(false);
            } else {
                setNotFound(true);
            }
            setBuffer(false);
        } catch (err) {
            console.log(err);
        }
    }

    const setgallery = async () => {
        if (file == '' || fileName == '') {
            alert('Please select image.')
            return;
        }

        if (caption == '') {
            alert('Please add caption.')
            return;
        }

        const formData = new FormData();
        formData.append("image", file);
        formData.append("fileName", fileName);

        try {
            const res = await axios.post(`${baseUrl}/gallery/image/${caption}`, formData);

            if (res.data) {
                if (res.data.message) {
                    alert('Image added to gallery');
                    closeDialog();
                    getgallery();
                } else {
                    alert('Failed to add image in gallery');
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
        getgallery();
    }, []);

    const getImage = (event) => {
        setFile(event.target.files[0]);
        setFileName(event.target.files[0].name);
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

    return (
        <>
            {
                localStorage.getItem('n_admin') !== null &&
                <>
                    <Header />
                    <div className="screen-container">
                        <Navigation />
                        <div className='side-container'>
                            <div className='screen-title title-large'>Image gallery</div>

                            <button className='outlined-button' onClick={() => openDialog()} style={{ marginBottom: '16px' }}>Add image to gallery</button>

                            {buffer && notFound ? <Buffer /> : <></>}

                            {gallery.length === 0 && !buffer
                                ? <Fallback title='Not found' text='No data found in the database. Try refreshing the page.' />
                                : <></>
                            }

                            {
                                gallery.length !== 0 && !notFound && !buffer
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
                                                                <div className='table-title'>Image</div>
                                                            </div>
                                                        </th>

                                                        <th>
                                                            <div className='table-head'>
                                                                <div className='table-title'>Caption</div>
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
                                                                <div className='table-title'>View image</div>
                                                            </div>
                                                        </th>
                                                    </tr>
                                                    {
                                                        gallery.map((data, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>
                                                                        <img src={data.image} style={{ width: '100px', padding: '8px 0 0 0' }} />
                                                                    </td>
                                                                    <td>{data.caption}</td>
                                                                    <td>{`${new Date(data.datetime).getFullYear()}-${new Date(data.datetime).getMonth() + 1}-${new Date(data.datetime).getDate()}`}</td>
                                                                    <td>{getTime(data.datetime)}</td>
                                                                    <td>
                                                                        <a className='link' href={data.image} target='_blank'>View image</a>
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
                                    <div className='title title-large'>Gallery</div>
                                    <button className='icon-button' onClick={closeDialog}><Clear /></button>
                                </div>

                                <div className='dialog-content'>
                                    <input type='file' onChange={getImage} />

                                    <div className='label'>Caption</div>
                                    <input type='text' className='inputfield' onChange={(e) => setCaption(e.target.value)} />

                                    <button className='filled-button' style={{ marginTop: '16px' }} onClick={setgallery}>Add image to gallery</button>
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

export default Gallery;