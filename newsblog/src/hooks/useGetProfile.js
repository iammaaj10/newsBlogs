import { useEffect } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { getprofile } from '../redux/userSlice';

const useGetProfile = (id) => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile); // Get profile from Redux store

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
  }, [id, dispatch]); // Add dispatch to dependency array

  return profile; // Return profile data
};

export default useGetProfile;
