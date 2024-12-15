import React from 'react'
import CreatePost from './CreatePost'
import BlogPost from './BlogPost'
import { useSelector } from 'react-redux'

const Post = () => {

  const {blogs} =useSelector(state => state.blogs)
  return (
    <div className='w-[55%] ' >
        <div>
        <CreatePost/>
        {
          blogs.map((blogs)=><BlogPost key={blogs?._id} blogs={blogs}/>)
        }
        
        </div>
        
    </div>
  )
}

export default Post