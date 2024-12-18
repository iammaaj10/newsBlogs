// useGetProfile.js
import { useEffect } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { useDispatch } from 'react-redux';
import { getprofile } from '../redux/userSlice';

const useGetProfile = (id) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/profile/${id}`, {
          withCredentials: true,
        });
        dispatch(getprofile(res.data.user)); // Dispatch the user profile
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id, dispatch]); // Ensure dispatch is in the dependency array
};

export default useGetProfile;
