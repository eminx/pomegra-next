import React from 'react';
import PropTypes from 'prop-types';

import { ChatteryBubble } from './ChatteryBubble';

class ChatteryWindow extends React.Component {
  constructor(props) {
    super(props);
    this.chatWindow = React.createRef();
    this.state = {
      isAnimating: false
    };
  }

  componentDidMount() {
    this.scrollBottom();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.scrollBottom();
    if (!prevProps.messages || !this.props.messages) {
      return;
    }

    if (prevProps.messages.length === this.props.messages.length - 1) {
      this.setState({
        isAnimating: true
      });

      setTimeout(() => this.setState({ isAnimating: false }), 0.1);
    }
  }

  scrollBottom = () => {
    const chatWindow = this.chatWindow.current;
    // chatWindow.scrollTop = chatWindow.scrollHeight;
    chatWindow.scroll({
      top: chatWindow.scrollHeight,
      // left: 0,
      behavior: 'smooth'
    });
  };

  render() {
    const { messages } = this.props;
    const { isAnimating } = this.state;

    return (
      <div className="chattery-window-container">
        <div className="chattery-window" ref={this.chatWindow}>
          {messages &&
            messages.map((message, index) => {
              return (
                <ChatteryBubble
                  key={message.text.substring(0, 20) + index}
                  createdDate={message.date}
                  senderUsername={message.senderUsername}
                  isSeen={false}
                  isFromMe={message.isFromMe}
                  isAnimating={isAnimating}
                  lastItem={messages.length === index + 1}
                >
                  {message.text}
                </ChatteryBubble>
              );
            })}
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
