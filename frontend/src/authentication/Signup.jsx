import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, createUserWithEmailAndPassword, updateProfile, revokeAccessToken } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from "axios";    

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [universityName, setUniversityName] = useState('');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);  // Avatar modal
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const avatarLinks = [
    'https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?t=st=1731232968~exp=1731236568~hmac=de16d89919804086b8545f032b2ec907789da65e4e37425935dece6ee265c2bd&w=740',
    'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-175961.jpg?t=st=1731232969~exp=1731236569~hmac=df952cfa52ec0dd8e5803e424d49a052ff84c3382a5e125c473573c637bd229e&w=740',
    'https://img.freepik.com/free-vector/smiling-redhaired-cartoon-boy_1308-174709.jpg?t=st=1731232463~exp=1731236063~hmac=a9a05813b4c6b923d7e3486ce5020fd28f82c39aa114517aac7153e21fb48eef&w=740',
    'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg?t=st=1731232968~exp=1731236568~hmac=2df6f036003087e2ba608092483229c766f09453c5c5ad28c3aecfaf8190b099&w=740',
    'https://img.freepik.com/free-vector/woman-with-braided-hair-illustration_1308-174675.jpg?t=st=1731232968~exp=1731236568~hmac=56626b5b9790fb5e77f6402b54dadce20d73a59c5ce7b7bfe4d08640d395c26e&w=740',
    'https://img.freepik.com/free-vector/woman-floral-traditional-costume_1308-176159.jpg?t=st=1731232968~exp=1731236568~hmac=b2a47c674aad1918eb4ed80b70012b52d75fd803aaa76a1687899fed630a5980&w=740',
    'https://img.freepik.com/free-vector/woman-traditional-costume_1308-175787.jpg?t=st=1731232524~exp=1731236124~hmac=042f91e146ed62a66fe2ed06020bba64868673110a5f2c7e6f315292a003a9d5&w=740'
  ];


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseToken = await userCredential.user.getIdToken();
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      const userData = {
        firebaseToken,
        name,
        email,
      };

      const response = await fetch("http://localhost:3000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log("User saved to MongoDB!");
        localStorage.setItem("user", JSON.stringify(userData));
        setIsModalOpen(true); // Open the modal
      } else {
        console.error("Error saving user:", response.statusText);
      }
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const userCredentials = await signInWithPopup(auth, googleProvider);
      const firebaseToken = await userCredentials.user.getIdToken();
      const user = userCredentials.user;
      const name = user.displayName || 'Default Name';
      const email = user.email;

      const userData = {
        firebaseToken,
        name,
        email,
      };

      const response = await fetch("http://localhost:3000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log("User saved to MongoDB!");
        localStorage.setItem("user", JSON.stringify(userData));
        setIsModalOpen(true); // Open the modal
      } else {
        console.error("Error saving user:", response.statusText);
      }
    } catch (error) {
      console.error('Google sign-in error:', error.message);
    }
  };

  // const addUniToUser = async()=>{
  //     const name  = JSON.parse(localStorage.getItem('user')).name;
  //     const email  = JSON.parse(localStorage.getItem('user')).email;
  //   const res = await axios.post('http://localhost:3000/api/university/addusertouni',{
  //     universityName,
  //     name,
  //     email
  //   })
  //   const data = res.data;
  //   setIsModalOpen(false);
  //   setIsSecondModalOpen(true); 
  //   navigate('/home');  
  //   console.log(data);
  // }
  const addUniToUser = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const name = user.name;
    const email = user.email;
    localStorage.setItem('university',universityName);
    try {
    const res = await axios.post('http://localhost:3000/api/university/addusertouni',{
    universityName,
        name,
        email,
      });
      console.log(res.data);
      setIsModalOpen(false);       // Close initial modal
      setIsAvatarModalOpen(true);   // Open avatar selection modal  
      // navigate('/home');            
    } catch (error) {
      console.error('Error adding university to user:', error);
    }
  };

  const handleAvatarSelect = async(avatar) => {
    setSelectedAvatar(avatar);
    localStorage.setItem('avatar',avatar);
    setIsAvatarModalOpen(false);
    console.log('Selected Avatar:', avatar);
    
    const  firebaseUid = JSON.parse(localStorage.getItem('user')).email;
    try {
      const response = await fetch('http://localhost:3000/api/users/update-avatar', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email, // Send the firebaseUid of the logged-in user
          profilePicture: avatar, // Send the selected avatar URL
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log("Avatar updated successfully:", result);
        navigate('/home'); // Redirect or take action after updating the avatar
      } else {
        console.error("Error updating avatar:", result);
      }
    } catch (error) {
      console.error("Error in updating avatar:", error);
    }
    
    navigate('/home');

  };

  // const handleSave = async () => {
  //   if (universityName) {
  //     const response = await fetch("http://localhost:3000/api/university/adduniname",{
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({universityName}),
  //     });
  //     const data = await response.json();
  //     console.log(data.msg);  
  //     console.log(`University Name: ${universityName}`);
  //     setIsModalOpen(false);
  //     navigate('/home'); 
  //   } else {
  //     alert("Please enter your university name.");
  //   }
  // };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-gray-700" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-700" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
            />
          </div>
          <div>
            <label className="block text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Confirm your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?
          <Link to="/login" className="text-blue-500 hover:underline ml-1">Login</Link>
        </p>

        <div className="mt-6 text-center">
          <button
            onClick={handleGoogleSignIn}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 w-full mb-2"
          >
            Sign up with Google
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-blue-100 p-6 rounded-lg w-80 shadow-lg">
            <h2 className="text-xl font-semibold text-blue-700 mb-4 text-center">Enter University Name</h2>
            <input
              type="text"
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              placeholder="University Name"
              className="w-full p-2 border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={addUniToUser}
                className="bg-blue-600 text-white    px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

{isAvatarModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-8 rounded-lg shadow-xl w-[30rem]"> {/* Increased width */}
      <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">Select an Avatar</h2>
      <div className="grid grid-cols-3 gap-6 place-items-center mb-4"> {/* Increased columns to 3 */}
        {avatarLinks.map((avatar, index) => (
          <img
            key={index}
            src={avatar}
            alt={`Avatar ${index + 1}`}
            onClick={() => handleAvatarSelect(avatar)}
            className="cursor-pointer w-24 h-24 rounded-full border-4 border-transparent shadow-lg transform transition-transform duration-300 hover:scale-125 hover:border-blue-400" 
          />
        ))}
      </div>
      <button
        onClick={() => setIsAvatarModalOpen(false)}
        className="block mx-auto bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition"
      >
        Close
      </button>
    </div>
  </div>
)}



    </div>
  );
}

export default Signup;
