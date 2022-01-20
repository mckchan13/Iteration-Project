import React from 'react';
import "../../styles/online.css";

const ChatOnline = () => {
    return (
      <div className="chatOnline">
        <div className="chatOnlineFriend">
          <div className="chatOnlineImgContainer">
                    <img
                        className='chatOnlineImg'
              src="https://canary.contestimg.wish.com/api/webimage/5c263b2074a5cc23546e9fa3-large.jpg?cache_buster=13e3d9c6d820556967649c0afc4af380"
              alt=""
            />
            <div className="chatOnlineBadge"></div>
                </div>
                <span className='chatOnlineName'>John Doe</span>
        </div>
      </div>
    );
};

export default ChatOnline;
