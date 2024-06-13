//------------------------------------------------------------------------------------


import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import '../external.scss';
import baseUrl from '../../../scripts/baseUrl';
import Loading from '../../../components/Loading/Loading';
import { Visibility, VisibilityOff } from '../../../components/Icons/Icons.js'

//------------------------------------------------------------------------------------

const Login = () => {
    const [validLogin, setValidLogin] = useState(false);

    const [admin, setAdmin] = useState({
        mobile: '',
        password: '',
    });

    const [loader, setLoader] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(false);

    useEffect(() => {
        /* const body = document.getElementsByTagName('body')[0];
        const onEnter = document.getElementById('on-enter');
        body.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                onEnter.click();
            }
        }); */

        status();

        // blocking some keys for username
        const mobile = document.getElementById('mobile');
        mobile.addEventListener('keypress', (event) => {
            var regex = new RegExp("^[0-9]+$");
            var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
            if (!regex.test(key)) {
                event.preventDefault();
                return false;
            }
        });
    }, []);

    // useEffect(() => {
    //     // blocking some keys for username
    //     const username = document.getElementById('username');
    //     username.addEventListener('keypress', (event) => {
    //         var regex = new RegExp("^[a-zA-Z0-9@.]+$");
    //         var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    //         if (!regex.test(key)) {
    //             event.preventDefault();
    //             return false;
    //         }
    //     });
    // }, [adminLogin]);

    const status = async () => {
        setLoader(true);

        if (localStorage.getItem('n_admin') !== null && JSON.parse(localStorage.getItem('n_admin')).message) {
            setValidLogin(true);
        } else {
            setValidLogin(false);
        }

        setLoader(false);
    }

    const login = async () => {
        try {
            setLoader(true);
            const res = await axios.post(`${baseUrl}/n-admin/login`, admin);
            // console.log(res.data);

            if (res.data.id) {
                localStorage.setItem('n_admin', JSON.stringify(res.data));
                setValidLogin(true);
            } else {
                alert('Invalid user, please try again.');
            }
        } catch (err) {
            console.log(err);
        }
        setLoader(false);
    }

    const validate = () => {
        let mobile = document.getElementById('mobile');
        let mobileHint = document.getElementById('mobile-hint');
        let password = document.getElementById('password');
        let passwordHint = document.getElementById('password-hint');

        let ismobileValid = false;
        let isPasswordValid = false;

        //mobile validation
        if (mobile.value.length == 0) {
            mobile.parentElement?.classList.add('error');
            mobileHint.innerHTML = 'Please enter mobile no.';
            ismobileValid = false;
        } else {
            mobile.parentElement?.classList.remove('error');
            mobileHint.innerHTML = '&nbsp;';
            ismobileValid = true;
        }

        //password validation
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        if (password.value.match(passwordRegex)) {
            password.parentElement?.classList.remove('error');
            passwordHint.innerHTML = '&nbsp;';
            isPasswordValid = true;
        } else {
            password.parentElement?.classList.add('error');
            passwordHint.innerHTML = 'Please enter password between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.';
            isPasswordValid = false;
        }

        //if valid
        if (ismobileValid && isPasswordValid) {
            login();
        } else {
            setValidLogin(false);
        }
    }

    const validateEmployeeCreds = () => {
        let mobile = document.getElementById('mobile');
        let mobileHint = document.getElementById('mobile-hint');
        let password = document.getElementById('password');
        let passwordHint = document.getElementById('password-hint');

        let ismobileValid = false;
        let isPasswordValid = false;

        //mobile validation
        if (mobile.value.length == 0) {
            mobile.parentElement?.classList.add('error');
            mobileHint.innerHTML = 'Please enter mobile no.';
            ismobileValid = false;
        } else if (mobile.value.length != 10) {
            mobile.parentElement?.classList.add('error');
            mobileHint.innerHTML = 'Please enter valid mobile no.';
            ismobileValid = false;
        } else {
            mobile.parentElement?.classList.remove('error');
            mobileHint.innerHTML = '&nbsp;';
            ismobileValid = true;
        }

        //password validation
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        // if (password.value.match(passwordRegex)) {
        //     password.parentElement?.classList.remove('error');
        //     passwordHint.innerHTML = '&nbsp;';
        //     isPasswordValid = true;
        // }
        if (password.value.length != 0) {
            password.parentElement?.classList.remove('error');
            passwordHint.innerHTML = '&nbsp;';
            isPasswordValid = true;
        } else {
            password.parentElement?.classList.add('error');
            passwordHint.innerHTML = 'Please enter password between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.';
            isPasswordValid = false;
        }

        //if valid
        if (ismobileValid && isPasswordValid) {
            login();
        } else {
            setValidLogin(false);
        }
    }

    const handleChange = (e) => {
        setAdmin(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const enterClick = (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            let button = document.getElementById('on-enter');
            button.click();
        }
    }

    return (
        <>
            <div className='external-screen'>
                <div className="frame">
                    <div className="outlined-card">
                        <form onKeyUp={event => enterClick(event)}>
                            <div className="app-title headline-small">Login</div>

                            <div className='label label-medium'>Enter your mobile</div>
                            <div className="input-container">
                                <input type='number' id='mobile' name='mobile' className='inputfield' placeholder='Mobile' maxLength={100} onChange={handleChange} />
                                <div id='mobile-hint' className="input-hints">&nbsp;</div>
                            </div>

                            <div className='label label-medium'>Enter your password</div>
                            <div className="input-container password-inputfield">
                                <input type={passwordVisibility ? 'text' : 'password'} id='password' name='password' className='inputfield' placeholder='Password' maxLength={200} onChange={handleChange} />
                                <div id='password-hint' className="input-hints">&nbsp;</div>
                                <div className='password-visibility'>
                                    <button type='button' className='icon-button' onClick={() => setPasswordVisibility((prev) => !prev)}>
                                        {
                                            passwordVisibility ? <VisibilityOff /> : <Visibility />
                                        }
                                    </button>
                                </div>
                            </div>

                            <div className="bottom-buttons">
                                <Link to='/register'>
                                    <button type='button' className='text-button'>Don't have admin account? Register here</button>
                                </Link>
                                <button type='button' id='on-enter' className='filled-button' onClick={validate}>Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
            {loader && <Loading />}
            {validLogin && <Navigate replace to="/home" />}
        </>
    )
}

export default Login;

//------------------------------------------------------------------------------------