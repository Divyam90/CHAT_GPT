// import React, { useEffect } from 'react'
// import { useNavigate } from 'react-router-dom';

// const Loading = () => {
//   const navigate = useNavigate()

//   useEffect(()=>{
//     const timeout =  setTimeout(() => {
//       navigate('/')
//     }, 8000);
//     return ()=>clearTimeout(timeout)
//   })

//   return (
//     <div className='bg-gradient-to-b from-[#531B81] to-[#29184B] backdrop-opacity-60 flex items-center justify-center h-screen w-screen text-white text-2xl '>
//       <div className='w-10 h-10 rounded-full border-3 border-white border-t-transparent animate-spin'>

//       </div>
//     </div>
//   )
// }

// export default Loading


import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Loading = () => {
  const navigate = useNavigate();
  const {fetchUser} = useAppContext()

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUser()
      navigate("/");
    }, 8000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="bg-gradient-to-b from-gray-900 via-black to-gray-950 flex items-center justify-center h-screen w-screen text-white">
      <div className="flex flex-col items-center space-y-6">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-gray-600 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(255,255,255,0.2)]"></div>

        {/* Animated Loading text */}
        <p className="text-xl font-medium tracking-wider flex space-x-1">
          <span className="animate-bounce">L</span>
          <span className="animate-bounce delay-100">o</span>
          <span className="animate-bounce delay-200">a</span>
          <span className="animate-bounce delay-300">d</span>
          <span className="animate-bounce delay-400">i</span>
          <span className="animate-bounce delay-500">n</span>
          <span className="animate-bounce delay-600">g</span>
          <span className="animate-bounce delay-700">.</span>
          <span className="animate-bounce delay-800">.</span>
          <span className="animate-bounce delay-900">.</span>
        </p>

        {/* Subtitle */}
        <p className="text-sm text-gray-400">
          Preparing your experience, please wait...
        </p>
      </div>
    </div>
  );
};

export default Loading;
