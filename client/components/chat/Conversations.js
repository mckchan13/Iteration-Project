import React from 'react';
import '../../styles/conversations.css'

const Conversations = () => {
    return(
    <div className='conversation'>
        <img className='conversationImg'
                src='https://canary.contestimg.wish.com/api/webimage/5c263b2074a5cc23546e9fa3-large.jpg?cache_buster=13e3d9c6d820556967649c0afc4af380'
                alt=''
        />
        <span className='conversationName'>John Doe</span>
        </div>
    );
};

export default Conversations;
