import React from 'react';
import { Link } from 'react-router-dom';
import supabase from "../supabaseClient"
import { useEffect, useState } from 'react'

function Welcome() {
  const [fetchError, setFetchError] = useState(null)
  const [universities, setUnis] = useState(null)

  // useEffect(() => {
  //   const fetchUnis = async () => {
  //     const {data, error} = await supabase
  //     .from('universities')
  //     .select()

  //     if (error) {
  //       setFetchError('Could not fetch universities')
  //       setUnis(null)
  //       console.log(error)
  //     }
  //     if (data) {
  //       setUnis(data)
  //       setFetchError(null)
  //     }
  //   }

  //   fetchUnis()

  // }, [])
  
  return (
    <div className="fullscreen-background"> 
      <h1 className="font-tiny5 font-bold text-center text-white text-8xl mt-10 mb-1 heading-shadow">Welcome To HiveMind!</h1>
      <h3 className="font-dotgothic text-center text-white text-3xl my-5">Click below to navigate</h3>

      {/* <div className="supabase testing">
        {fetchError && (<p>{fetchError}</p>)}
        {universities && (
          <div className="uni printage">
            {universities.map(university => (
              <p key={university.uni_id} > {university.uni_name} </p>
            ))}
          </div>
        )}
      </div> */}

      <Link to="/register">
        <button className="font-dotgothic custom-button">Create Account</button>
      </Link>
      <Link to="/login">
        <button className="mt-10 font-dotgothic custom-button">Login</button>
      </Link>
    </div>
  );
}

export default Welcome;
