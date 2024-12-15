import React, { useState } from 'react';
import axios from "axios"
import { USER_API_END_POINT } from '../utils/constant';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import {useDispatch} from "react-redux"
import { getUsers } from '../redux/userSlice';

const Login = () => {
  const [login, setLogin] = useState(true);
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [toggle, setToggle] = useState(true)
  const navgiate = useNavigate()
  const displatch =useDispatch()

  const submitHandler = async (e) => {
    e.preventDefault();
    if (login) {
      try {
        const res = await axios.post(`${USER_API_END_POINT}/login `, { email, password },{
          headers: {
            "Content-Type":"application/json",

          },
          withCredentials:true
        })
        displatch(getUsers(res?.data?.user))
        if(res.data.success)
          {
            navgiate("/premium")
            toast.success(res.data.message)
            setLogin(true)
          }

      } catch (error) {
        toast.error(error.response.data.message)
        console.log(error);

      }
    }
    else {
      try {
        const res = await axios.post(`${USER_API_END_POINT}/register `, { name, username, email, password },{
          headers: {
            "Content-Type":"application/json",

          },
          withCredentials:true
        })
        if(res.data.success)
        {
          toast.success(res.data.message)
        }

      } catch (error) {
        toast.error(error.response.data.message)
        console.log(error);

      }
    }

  }

  const loginSignUphandler = () => {
    setLogin(!login);
  };

  const toggleform = () => {
    setToggle(!toggle)
  }

  return (
    <>
      {toggle && (
        <div className='flex items-center justify-center mt-6 fixed inset-0 backdrop-blur-sm bg-opacity-30 z-10'>

          <div className='w-96 p-6 m-3 border rounded-md bg-slate-100 border-white shadow-md relative'>
            <i
              className="fa-regular fa-circle-xmark right-2 absolute text-black top-2 font-bold text-lg hover:text-orange-600 cursor-pointer" onClick={toggleform}
            ></i>
            <form onSubmit={submitHandler}>
              <div className='p-3 flex flex-col gap-4'>
                <div className='text-center'>
                  <h1 className='text-black font-bold font-poppins text-2xl'>{login ? "Login" : "Register"}</h1>
                </div>
                {!login && (
                  <>
                    <input
                      type='text'
                      placeholder='Enter the Name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className='text-black bg-slate-100 p-3 rounded-md'
                      required
                    />
                    <input
                      type='text'
                      placeholder='Enter the Username'
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className='text-black bg-slate-100 p-3 rounded-md'
                      required
                    />
                  </>
                )}
                <input
                  type='email'
                  placeholder='Enter the email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='text-black bg-slate-100 p-3 rounded-md'
                  required
                />
                <input
                  type='password'
                  placeholder='Enter the password '
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='text-black bg-slate-100 p-3 rounded-md'
                  required
                />
              </div>
              <div className='text-center'>
                <button
                  type='submit'
                  className='bg-blue-700 rounded-3xl p-2 m-3 w-28 font-semibold text-white hover:bg-orange-500 hover:text-black cursor-pointer'
                >
                  {login ? "Login" : "SignUp"}
                </button>
                <h1 className='text-md'>
                  {login ? "Do not have an account?" : "Already have an account?"}{" "}
                  <span
                    className='text-blue-600 font-medium font-poppins cursor-pointer'
                    onClick={loginSignUphandler}
                  >
                    {login ? "Create an account" : "Login"}
                  </span>
                </h1>
              </div>
            </form>
          </div>

        </div>
      )}
    </>
  );
};

export default Login;
