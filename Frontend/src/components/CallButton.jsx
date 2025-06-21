import { VideoIcon } from 'lucide-react'
import React from 'react'

const CallButton = ({handleVideoCall}) => {
  return (
    <div style={{
        position: "absolute",
        right: 20,
        top: 20,
        width: "fit-content",
        display: "flex",
        justifyItems: "end",
        alignItems: "center",
    }}>
        <button onClick={handleVideoCall} className='cursor-pointer'>
            <VideoIcon className='w-7 h-7' />
        </button>
    </div>
  )
}

export default CallButton