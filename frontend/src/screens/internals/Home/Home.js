import './Home.scss';
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

const Home = () => {
    const [employees, setEmployees] = useState([]);
    const [notFound, setNotFound] = useState(true);
    const [buffer, setBuffer] = useState(true);
    const [loader, setLoader] = useState(false);

    const getEmployees = async () => {
        try {
            const res = await axios.get(`${baseUrl}/n-employee/all`);

            if (res.data) {
                const arrayData = [];
                for (const data of res.data) {
                    arrayData.unshift(data);
                }
                setEmployees([...arrayData]);
                setNotFound(false);
            } else {
                setNotFound(true);
            }
            setBuffer(false);
        } catch (err) {
            console.log(err);
        }
    }

    const changeStatus = async (id, status) => {
        if (status == 0) {
            status = 1;
        } else {
            status = 0;
        }

        const data = {
            id: id,
            status: status,
        }

        try {
            setNotFound(true);
            setBuffer(true);

            const res = await axios.post(`${baseUrl}/n-employee/changeStatus`, data);

            if (res.data) {
                setNotFound(false);
                getEmployees();
            } else {
                setNotFound(true);
            }
            setBuffer(false);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getEmployees();
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
                            {buffer && notFound ? <Buffer /> : <></>}

                            {employees.length === 0 && !buffer
                                ? <Fallback title='Not found' text='No data found in the database. Try refreshing the page.' />
                                : <></>
                            }

                            {
                                employees.length !== 0 && !notFound && !buffer
                                    ?
                                    <>
                                        <div className='screen-title title-large'>Home</div>

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
                                                                <div className='table-title'>Full&nbsp;name</div>
                                                            </div>
                                                        </th>

                                                        <th>
                                                            <div className='table-head'>
                                                                <div className='table-title'>Mobile</div>
                                                            </div>
                                                        </th>

                                                        <th>
                                                            <div className='table-head'>
                                                                <div className='table-title'>Status</div>
                                                            </div>
                                                        </th>
                                                    </tr>
                                                    {
                                                        employees.map((employee, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{employee.name}</td>
                                                                    <td>+91 {employee.mobile}</td>
                                                                    <td onClick={() => {
                                                                        changeStatus(employee.id, employee.isActive)
                                                                    }}>
                                                                        <div className='display-center'>
                                                                            {employee.isActive == 0
                                                                                ? <Toggle key={Math.random()} state={false} />
                                                                                : <Toggle key={Math.random()} state={true} />}
                                                                        </div>
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

                    {loader && <Loading />}
                </>
            }
        </>
    )
}

export default Home