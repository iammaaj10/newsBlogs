import React from 'react'
import Entertainmentnews from '../components/Entertainmentnews'

const Entertainment = () => {
  return (
    
    <div>
        <div className="flex justify-center items-center py-6">
    <div className=" mt-10 text-4xl font-bold font-poppins bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600">
        Entertainment News Section
    </div>
</div>

        <Entertainmentnews/>
    </div>
  )
}

export default Entertainment