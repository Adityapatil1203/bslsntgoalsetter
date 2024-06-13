//------------------------------------------------------------------------------------

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import '../external.scss';
import baseUrl from '../../../scripts/baseUrl';
import Loading from '../../../components/Loading/Loading';
import { Visibility, VisibilityOff } from '../../../components/Icons/Icons.js'

//------------------------------------------------------------------------------------

const nameValidation = () => {
    const name = document.getElementById('name');
    const nameHint = document.getElementById('name-hint');
    if (name.value.length === 0) {
        name.parentElement?.classList.add('error');
        nameHint.innerHTML = 'Please enter full name';
        return false;
    } else {
        name.parentElement?.classList.remove('error');
        nameHint.innerHTML = '&nbsp;';
        return true;
    }
}

const emailValidation = () => {
    const email = document.getElementById('email');
    const emailHint = document.getElementById('email-hint');
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (email.value.match(emailRegex)) {
        email.parentElement?.classList.remove('error');
        emailHint.innerHTML = '&nbsp;';
        return true;
    } else {
        email.parentElement?.classList.add('error');
        emailHint.innerHTML = 'Please enter valid email';
        return false;
    }
}

const mobileValidation = () => {
    const mobile = document.getElementById('mobile');
    const mobileHint = document.getElementById('mobile-hint');
    const mobileRegex = /^\d{10}$/;
    if (mobile.value.match(mobileRegex)) {
        mobile.parentElement?.classList.remove('error');
        mobileHint.innerHTML = '&nbsp;';
        return true;
    } else {
        mobile.parentElement?.classList.add('error');
        mobileHint.innerHTML = 'Please enter valid mobile';
        return false;
    }
}

const passwordValidation = () => {
    const password = document.getElementById('password');
    const passwordHint = document.getElementById('password-hint');
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (password.value.match(passwordRegex)) {
        password.parentElement?.classList.remove('error');
        passwordHint.innerHTML = '&nbsp;';
        return true;
    } else {
        password.parentElement?.classList.add('error');
        passwordHint.innerHTML = 'Please enter password between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.';
        return false;
    }
}

//------------------------------------------------------------------------------------


const Register = () => {
    const [admin, setAdmin] = useState({
        name: '',
        mobile: '',
        password: '',
    });

    const [validRegistration, setValidRegistration] = useState(false);
    const [loader, setLoader] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(false);

    useEffect(() => {
        /* const body = document.getElementsByTagName('body')[0];
        const onEnter = document.getElementById('on-enter');
        body.addEventListener("keyup", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                onEnter.click();
            }
        }); */

        //blocking some keys for name
        const name = document.getElementById('name');
        name.addEventListener('keypress', (event) => {
            var regex = new RegExp("^[a-zA-Z ]+$");
            var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
            if (!regex.test(key)) {
                event.preventDefault();
                return false;
            }
        });

        //blocking some keys for email
        // const email = document.getElementById('email');
        // email.addEventListener('keypress', (event) => {
        //     var regex = new RegExp("^[a-zA-Z0-9.@]+$");
        //     var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        //     if (!regex.test(key)) {
        //         event.preventDefault();
        //         return false;
        //     }
        // });

        return () => {
            /* const body = document.getElementsByTagName('body')[0];
            const onEnter = document.getElementById('on-enter');
            body.removeEventListener("keyup", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    onEnter.click();
                }
            }); */
        }
    });

    const addAdmin = async () => {
        try {
            setLoader(true);
            const res = await axios.post(`${baseUrl}/n-admin/register`, admin);

            if (res.data.message) {
                localStorage.setItem('n_admin', JSON.stringify(res.data));
                alert('New admin has been registered successsfuly.');
                setValidRegistration(true);
            } else {
                alert('Failed to register, please try again.');
            }
        } catch (err) {
            console.log(err);
        }
        setLoader(false);
    }

    //validation
    const validate = () => {
        nameValidation();
        // emailValidation();
        mobileValidation();
        passwordValidation();

        if (
            nameValidation() &&
            // emailValidation() &&
            mobileValidation() &&
            passwordValidation()
        ) {
            addAdmin();
        } else {
            setValidRegistration(false);
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
                            <div className="app-title headline-small">Admin Registration</div>

                            {/* Full name */}
                            <div className='label label-medium'>Enter your fullname</div>
                            <div className="input-container">
                                <input type="text" id='name' className='inputfield uppercase' name='name' placeholder='Full name' onBlur={nameValidation} onChange={handleChange} />
                                <div id='name-hint' className="input-hints">&nbsp;</div>
                            </div>

                            {/* Email */}
                            {/* <div className='label label-medium'>Enter your email</div>
                            <div className="input-container">
                                <input type="email" id='email' className='inputfield' name='email' placeholder='Email' maxLength={200} onBlur={emailValidation} onChange={handleChange} />
                                <div id='email-hint' className="input-hints">&nbsp;</div>
                            </div> */}

                            {/* Mobile number */}
                            <div className='label label-medium'>Enter your mobile no.</div>
                            <div className="input-container">
                                <input type="number" id='mobile' className='inputfield' name='mobile' placeholder='Mobile no.' maxLength={10} onBlur={mobileValidation} onChange={handleChange} />
                                <div id='mobile-hint' className="input-hints">&nbsp;</div>
                            </div>

                            {/* Password */}
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
                                <Link to='/login'>
                                    <button type='button' className='text-button'>Already have an account? Login here</button>
                                </Link>
                                <button type='button' id='on-enter' className='filled-button' onClick={validate}>Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
            {loader && <Loading />}
            {validRegistration && <Navigate replace to="/home" />}
        </>
    )
}

export default Register;

//------------------------------------------------------------------------------------
