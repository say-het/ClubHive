import React, { useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';



const UserProfile = () => {

const navigate = useNavigate();

  // const {id} = useParams();
  // const {details, setDetails} = useState();

  // const fetchUserInfo = async(req,res)=>{
  //   const res = await axios.post(`http://localhost:3000/api/users/user/:${id}`,{
  //     id
  //   })
  //   const data  = res.json();
  //   if(res.status==200){
  //     console.log("OK");
  //     console.log(data)
  //   }
  // }
  const avatar = localStorage.getItem('avatar');
  const university = localStorage.getItem('university');
  const user = JSON.parse(localStorage.getItem('user'));
  const name = user.name;
  const email = user.email;
  
  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.clear();
      // setHeading('');
      // setIsLoggedIn(false);
      navigate('/');
      // location.reload();

    } catch (e) {
      console.error("Error logging out:", e);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <img
            src={avatar || 'https://via.placeholder.com/100'}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-2 border-blue-500"
          />
        </div>

        {/* User Info */}
        {/* <h2 className="text-2xl font-semibold text-center mb-4">{user.name}</h2> */}
        <h2 className="text-2xl font-semibold text-center mb-4">{name}</h2>

        <div className="text-gray-700 text-center">
         <p className="mb-2"><strong>University: </strong>{university}</p>
         <p className="mb-2"><strong>Email: </strong>{email}</p> 

          {/* <p className="mb-2"><strong>University:</strong> {user.university || 'Not provided'}</p>
          <p className="mb-2"><strong>Email:</strong> {user.email || 'Not provided'}</p> */}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-around">
          <button  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 focus:outline-none">
            Edit Profile
          </button>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 focus:outline-none">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
