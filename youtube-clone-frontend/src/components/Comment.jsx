import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { format } from 'timeago.js'
import { BASE_URL } from '../config'

const Comment = ({videoId}) => {
    const {currentUser} = useSelector((state) => state.user);
    const [comments, setComments] = useState([]);

    useEffect(() => {
      const fetchComments = async() => {
        try{
          const res = await axios.get(`${BASE_URL}/comments/${videoId}`);
          setComments(res.data);
        }
        catch(error){
          console.log(error);
        }
      };

      fetchComments();
    }, [videoId])

  return (
    <div>
      <div className='mt-4  font-bold text-xl text-gray-300'>{comments.length} Comments</div>
      <div className='flex gap-4 mt-4'>
        <img src={currentUser?.profilePicture} alt={currentUser?.channelName} className='w-10 h-10 rounded-full' />
        <input type="text" placeholder='Add a comment...' />
      </div>
      
      {comments.map((comment) => (
        <div key={comment._id} className='flex gap-4 mt-4 mb-4'>
        <img src={comment.userId?.profilePicture} alt={comment.userId?.channelName} className='w-10 h-10 rounded-full' />
        <div>
          <div className='flex items-center text-xs gap-2'>@{comment.userId.channelName}<div className='text-2xs text-gray-500'>{format(comment.createdAt)}</div></div>
          <div className='text-md'>{comment.text}</div>
        </div>
      </div>
      ))} 
    </div>
  )
}

export default Comment

