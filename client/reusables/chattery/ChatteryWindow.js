import React from 'react';
import PropTypes from 'prop-types';

import { ChatteryBubble } from './ChatteryBubble';

class ChatteryWindow extends React.Component {
  constructor(props) {
    super(props);
    this.chatWindow = React.createRef();
  }

  componentDidMount() {
    this.scrollBottom();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.scrollBottom();
  }

  scrollBottom = () => {
    const chatWindow = this.chatWindow.current;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  };

  render() {
    const { messages } = this.props;

    return (
      <div className="chattery-window-container">
        <div className="chattery-window" ref={this.chatWindow}>
          {messages &&
            messages.map((message, index) => (
              <ChatteryBubble
                key={message.text.substring(0, 20) + index}
                createdDate={message.date}
                senderUsername={message.senderUsername}
                isSeen={false}
                isFromMe={message.isFromMe}
              >
                {message.text}
              </ChatteryBubble>
            ))}
        </div>
      </div>
    );
  }
}

ChatteryWindow.propTypes = {
  messages: PropTypes.array.isRequired,
  meta: PropTypes.object
};

export { ChatteryWindow };
