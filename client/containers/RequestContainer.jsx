import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {
  ActivityIndicator,
  NavBar,
  Button,
  Flex,
  Result,
  Link,
  List,
  WingBlank,
  WhiteSpace
} from 'antd-mobile';

import { Requests } from '../../imports/api/collections';
import AppTabBar from '../reusables/AppTabBar';
import Chattery from '../chattery';

const myImg = src => (
  <img
    src={src}
    // className="spe am-icon am-icon-md"
    alt=""
    width={48}
    height={66}
  />
);

class Request extends Component {
  state = {
    messageInput: '',
    attachments: [],
    sheetVisible: false,
    typingMessage: null
  };

  componentDidMount() {}

  sendMessage = event => {
    event.preventDefault();
    const { request } = this.props;

    const self = this;
    const messageInput = self.messagebarComponent.f7Messagebar
      .getValue()
      .replace(/\n/g, '<br>')
      .trim();

    if (messageInput === '') {
      return;
    }

    Meteor.call('addMessage', request._id, messageInput, (error, respond) => {
      if (error) {
        console.log(error);
        return;
      }
    });

    self.setState({
      // Reset attachments
      attachments: [],
      // Hide sheet
      sheetVisible: false
    });
    self.messagebarComponent.f7Messagebar.clear();

    // Focus area
    if (messageInput.length) self.messagebarComponent.f7Messagebar.focus();
  };

  getChatMessages = () => {
    const { messages, currentUser } = this.props;

    return messages.map(message => {
      if (message.senderId === currentUser._id) {
        message.isFromMe = true;
      }
      return message;
    });
  };

  getMessageSender = message => {
    const { currentUser, request } = this.props;
    if (currentUser._id === message.from) {
      return 'me';
    } else if (request.requester_name === currentUser.username) {
      return request.owner_name;
    } else {
      return request.requester_name;
    }
  };

  acceptRequest = () => {
    const { currentUser, request } = this.props;
    if (currentUser._id !== request.req_from) {
      return;
    }

    const self = this;
    const app = self.$f7;

    Meteor.call('acceptRequest', request._id, (error, respond) => {
      if (error) {
        app.dialog.alert(`${error.reason}`, 'Error', () => {
          console.log(error);
        });
      } else {
        const notification = app.notification.create({
          // icon: '<i class="icon success"></i>',
          title: 'Great!',
          subtitle: 'Thank you for being a generous human being',
          closeButton: true,
          closeTimeout: 6000,
          opened: true
        });
        notification.open();
      }
    });
  };

  denyRequest = () => {
    const { currentUser, request } = this.props;
    if (currentUser._id !== request.req_from) {
      return;
    }

    const self = this;
    const app = self.$f7;

    Meteor.call('denyRequest', request._id, (error, respond) => {
      if (error) {
        app.dialog.alert(`${error.reason}`, 'Error', () => {
          console.log(error);
        });
      } else {
        const notification = app.notification.create({
          // icon: '<i class="icon success"></i>',
          title: 'Sorry...',
          subtitle: 'We are sorry to have you deny this request',
          closeButton: true,
          closeTimeout: 6000,
          opened: true
        });
        notification.open();
      }
    });
  };

  isHanded = () => {
    const { currentUser, request } = this.props;
    if (currentUser._id !== request.req_from) {
      return;
    }

    const self = this;
    const app = self.$f7;

    Meteor.call('isHanded', request._id, (error, respond) => {
      if (error) {
        app.dialog.alert(`${error.reason}`, 'Error', () => {
          console.log(error);
        });
      } else {
        const notification = app.notification.create({
          // icon: '<i class="icon success"></i>',
          title: 'Success!',
          subtitle: 'Great that you have handed over the book!',
          closeButton: true,
          closeTimeout: 6000,
          opened: true
        });
        notification.open();
      }
    });
  };

  isReturned = () => {
    const { currentUser, request } = this.props;
    if (currentUser._id !== request.req_from) {
      return;
    }

    const self = this;
    const app = self.$f7;

    Meteor.call('isReturned', request._id, (error, respond) => {
      if (error) {
        app.dialog.alert(`${error.reason}`, 'Error', () => {
          console.log(error);
        });
      } else {
        const notification = app.notification.create({
          // icon: '<i class="icon success"></i>',
          title: 'Success!',
          subtitle: 'Your book is back and available at your shelf <3',
          closeButton: true,
          closeTimeout: 6000,
          opened: true
        });
        notification.open();
      }
    });
  };

  render() {
    const { currentUser, request, isLoading } = this.props;
    const { sheetVisible } = this.state;

    if (!currentUser) {
      return null;
    }

    const messages = this.getChatMessages();

    if (isLoading || !request || !messages) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 50
          }}
        >
          <ActivityIndicator text="Loading..." />
        </div>
      );
    }

    return (
      <div>
        <NavBar>Lending Request</NavBar>
        <WhiteSpace size="lg" />
        <WingBlank>
          {!request.is_confirmed &&
            !request.is_denied &&
            currentUser._id === request.req_from && (
              <div>
                <Result
                  img={myImg(request.book_image_url)}
                  title={request.book_name}
                  message={`${request.requester_name} would like to read your book`}
                  buttonText="Accept"
                  buttonType="primary"
                  onButtonClick={() => this.acceptRequest()}
                />
                <WhiteSpace />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    inline
                    type="danger"
                    onClick={() => this.denyRequest()}
                  >
                    Deny
                  </Button>
                </div>
              </div>
            )}
        </WingBlank>

        <WingBlank>
          {request.is_confirmed &&
            !request.is_handed &&
            currentUser._id === request.req_from && (
              <Flex>
                <Flex.Item>
                  <Button onClick={() => this.isHanded()}>
                    Book is handed over
                  </Button>
                </Flex.Item>
              </Flex>
            )}
        </WingBlank>

        <WingBlank>
          {request.is_handed &&
            !request.is_returned &&
            currentUser._id === request.req_from && (
              <Flex>
                <Flex.Item>
                  <Button onClick={() => this.isReturned()}>
                    My book is returned
                  </Button>
                </Flex.Item>
              </Flex>
            )}
        </WingBlank>

        <Chattery
          messages={messages}
          onNewMessage={this.sendMessage}
          // removeNotification={this.removeNotification}
        />

        {/* <MessagesF7
          ref={el => {
            this.messagesComponent = el;
          }}
        >
          <MessagesTitle>
            <b>Sunday, Feb 9,</b> 12:58
          </MessagesTitle>

          {messages &&
            messages.messages.map((message, index) => (
              <Message
                key={message.date.toString()}
                type={currentUser._id === message.from ? 'sent' : 'received'}
                name={this.getMessageSender(message)}
                first={index === 0}
                last={messages.messages.length === index}
                tail
              >
                {message.text && (
                  <span
                    slot="text"
                    dangerouslySetInnerHTML={{ __html: message.text }}
                  />
                )}
              </Message>
            ))}
          {this.state.typingMessage && (
            <Message
              type="received"
              typing={true}
              // first={true}
              // last={true}
              // tail={true}
              header={`${this.state.typingMessage.name} is typing`}
              avatar={this.state.typingMessage.avatar}
            ></Message>
          )}
        </MessagesF7> */}

        {/* <Messagebar
          placeholder={'Message'}
          ref={el => {
            this.messagebarComponent = el;
          }}
          attachmentsVisible={false}
          sheetVisible={sheetVisible}
        >
          <Link
            iconIos="f7:camera_fill"
            iconAurora="f7:camera_fill"
            iconMd="material:camera_alt"
            slot="inner-start"
            onClick={() => {
              this.setState({ sheetVisible: !this.state.sheetVisible });
            }}
          ></Link>
          <Link
            iconIos="f7:arrow_up_circle_fill"
            iconAurora="f7:arrow_up_circle_fill"
            iconMd="material:send"
            slot="inner-end"
            onClick={event => this.sendMessage(event)}
          ></Link>
          {/* <MessagebarAttachments>
                {this.state.attachments.map((image, index) => (
                  <MessagebarAttachment
                    key={index}
                    image={image}
                    onAttachmentDelete={() => this.deleteAttachment(image)}
                  ></MessagebarAttachment>
                ))}
              </MessagebarAttachments> */}
        {/* <MessagebarSheet>
                {this.state.images.map((image, index) => (
                  <MessagebarSheetImage
                    key={index}
                    image={image}
                    checked={this.state.attachments.indexOf(image) >= 0}
                    onChange={this.handleAttachment.bind(this)}
                  ></MessagebarSheetImage>
                ))}
              </MessagebarSheet> 
        </Messagebar> */}

        <AppTabBar />
      </div>
    );
  }
}

export default RequestContainer = withTracker(props => {
  const currentUser = Meteor.user();
  const requestId = props.match.params.id;

  const reqSub = Meteor.subscribe('singleRequest', requestId);
  const request = currentUser && Requests.findOne(requestId);

  const msgSub = Meteor.subscribe('myMessages', requestId);
  const messages = currentUser && Messages.findOne({ req_id: requestId });

  const isLoading = !reqSub.ready() || !msgSub.ready();

  return {
    currentUser,
    request,
    messages,
    isLoading
  };
})(Request);
