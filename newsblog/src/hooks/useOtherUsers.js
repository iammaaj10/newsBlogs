import { useEffect } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { useDispatch } from 'react-redux';
import { getOtherUsers } from '../redux/userSlice';

const useOtherUsers = (id) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/otheruser/${id}`, {
          withCredentials: true,
        });
        dispatch(getOtherUsers(res.data.otherUsers)); 
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (id) {
      fetchProfile(); 
    }
  }, [id]); 
};

export default useOtherUsers;
