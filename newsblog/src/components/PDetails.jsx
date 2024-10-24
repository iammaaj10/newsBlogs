import React from 'react'
import  { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import {auth,db} from './firebase'
import {doc,getDoc} from "firebase/firestore"
import {toast} from 'react-toastify'

const PDetails = () => {
    const [userDetails, setuserDetails]=useState(null)
    const navigate = useNavigate(); 
    const fetchUserData =async()=>{
        auth.onAuthStateChanged(async(user)=>{
            const docRef=doc(db,"Users",user.uid) 
            const docSnap = await getDoc(docRef)
            if(docSnap.exists())
            {
                setuserDetails(docSnap.data())
                console.log(docSnap.data());
                
            }
            else{
                console.log("User not logged in !");
                
            }
        })
    }
    useEffect(()=>{
        fetchUserData()
    },[])

    async function handleLogout(){
        await auth.signOut();
        navigate ('/')
    }
  return (
    <div>
        {userDetails?(
            <>
            <div className='flex justify-start p-2 gap-4 '>
            <h3 className='text-2xl font-semibold font-poppins text-white'>Welcome <span className='bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600'>{userDetails.username}</span></h3>
             <button className='bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 px-4 py-1 rounded-full font-semibold  hover:text-white hover:scale-105' onClick={handleLogout}>
                Logout
             </button>
            </div>
            
            </>
        ):(
            <p className='text-center justify-center text-2xl font-semibold'>Loading...</p>
        )}
    </div>
  )
}

export default PDetails