import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 
import { auth } from './firebase'; 

const Login = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Login Successfully", { position: 'top-center' });

            
            navigate('/premium');
            
        } catch (error) {
            toast.error(error.message, { position: 'bottom-center' });
        }
    };

    return (
        <div className='flex items-center justify-center mt-6 fixed inset-0 backdrop-blur-sm bg-opacity-30 z-10'>
            <ToastContainer/>
            <div className='w-96 p-6 m-3 border rounded-md bg-slate-100 border-white shadow-md relative'>
                <i
                    className="fa-regular fa-circle-xmark right-2 absolute text-black top-2 font-bold text-lg hover:text-orange-600 cursor-pointer"
                    onClick={onClose}
                ></i>
                <form onSubmit={handleSubmit}>
                    <div className='p-3 flex flex-col gap-4'>
                        <div className='text-center'>
                            <h1 className='text-black font-bold font-poppins text-2xl'>Login</h1>
                        </div>
                        <input
                            type='text'
                            placeholder='Enter the email'
                            className='text-black bg-slate-100 p-3 rounded-md'
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type='password'
                            placeholder='Enter the password'
                            className='text-black bg-slate-100 p-3 rounded-md'
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className='text-center'>
                        <button
                            type='submit'
                            className='bg-blue-700 rounded-3xl p-2 m-3 w-28 font-semibold text-white hover:bg-orange-500 hover:text-black cursor-pointer'
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
