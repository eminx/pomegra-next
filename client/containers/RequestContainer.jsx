import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router-dom';
import {
  ActivityIndicator,
  NavBar,
  Button,
  Flex,
  Result,
  Icon,
  Tabs,
  Badge,
  InputItem,
  Steps,
  WingBlank,
  WhiteSpace,
  Accordion
} from 'antd-mobile';
import { IoMdSend } from 'react-icons/io';

import { Requests } from '../../imports/api/collections';
import { ChatteryWindow } from '../reusables/chattery/ChatteryWindow';
import { successDialog, errorDialog, notificationsCounter } from '../functions';

const Step = Steps.Step;
const FlexItem = Flex.Item;

const steps = [
  {
    title: 'Accepted',
    description: 'Request is accepted'
  },
  {
    title: 'Handed',
    description: 'Borrower received the book to read'
  },
  {
    title: 'Returned',
    description: 'Borrower has returned the book to the owner'
  }
].map((step, index) => (
  <Step key={step.title} title={step.title} description={step.description} />
));

const myImg = src => <img src={src} alt="" width={48} height={66} />;

class Request extends Component {
  state = {
    messageInput: '',
    typingMessage: null,
    openTab: 0
  };

  sendMessage = event => {
    event && event.preventDefault();
    const { request } = this.props;
    const messageInput = this.state.messageInput;
    if (messageInput === '') {
      return;
    }

    Meteor.call('addMessage', request._id, messageInput, (error, respond) => {
      if (error) {
        console.log(error);
        return;
      }
    });

    this.setState({
      messageInput: ''
    });
  };

  getChatMessages = () => {
    const { messages, currentUser } = this.props;

    if (!messages || !messages.messages) {
      return null;
    }

    if (messages.messages.length === 0) {
      return null;
    }

    return messages.messages.map(message => {
      if (message.from === currentUser._id) {
        message.isFromMe = true;
      }
      message.senderUsername = this.getMessageSender(message);
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

    Meteor.call('acceptRequest', request._id, (error, respond) => {
      if (error) {
        errorDialog(error.reason);
      } else {
        successDialog('Thank you for being a generous human being');
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
        errorDialog(error.reason);
      } else {
        successDialog(
          'Request denied. We are sorry to have you deny this request'
        );
      }
    });
  };

  isHanded = () => {
    const { currentUser, request } = this.props;
    if (currentUser._id !== request.req_from) {
      return;
    }

    Meteor.call('isHanded', request._id, (error, respond) => {
      if (error) {
        errorDialog(error.reason);
      } else {
        successDialog('Great that you have handed over the book!');
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
        errorDialog(error.reason);
      } else {
        successDialog('Your book is back and available at your shelf <3');
      }
    });
  };

  getCurrentStatus = () => {
    const { request } = this.props;

    if (request.is_returned) {
      return 3;
    } else if (request.is_handed) {
      return 2;
    } else if (request.is_confirmed) {
      return 1;
    } else {
      return 0;
    }
  };

  getTabs = () => {
    const notificationsCount = this.getNotificationsCount();

    let dottedStatus = true;

    return [
      { title: <Badge dot={dottedStatus}>Status</Badge> },
      { title: <Badge text={notificationsCount}>Messages</Badge> }
    ];
  };

  getNotificationsCount = () => {
    const { request, currentUser } = this.props;
    const foundContext = currentUser.notifications.find(notification => {
      return notification.contextId === request._id;
    });

    return foundContext && foundContext.count;
  };

  getOthersName = () => {
    const { request, currentUser } = this.props;
    if (request.requester_name === currentUser.username) {
      return request.owner_name;
    } else {
      return request.requester_name;
    }
  };

  render() {
    const { currentUser, request, isLoading } = this.props;
    const { backToRequests, messageInput, openTab } = this.state;

    if (!currentUser) {
      return null;
    }

    if (backToRequests) {
      return <Redirect to="/messages" />;
    }

    const messages = this.getChatMessages();

    if (isLoading || !request) {
      return <ActivityIndicator toast text="Loading..." />;
    }

    const requestedNotResponded = !request.is_confirmed && !request.is_denied;
    const iAmTheOwner = currentUser._id === request.req_from;

    return (
      <div>
        <NavBar
          mode="light"
          leftContent={<Icon type="left" />}
          onLeftClick={() => this.setState({ backToRequests: true })}
          rightContent={<Icon type="ellipsis" />}
        >
          <b>{this.getOthersName()}</b>
        </NavBar>

        <Tabs
          tabs={this.getTabs()}
          page={openTab}
          onTabClick={(tab, index) => {
            this.setState({ openTab: index });
          }}
          swipeable={false}
          animated={false}
        >
          <div>
            <WhiteSpace />
            {requestedNotResponded && iAmTheOwner ? (
              <div>
                <Result
                  img={myImg(request.book_image_url)}
                  title={request.book_name}
                  message={`${request.requester_name}`}
                  buttonText="Accept"
                  buttonType="primary"
                  onButtonClick={() => this.acceptRequest()}
                />
                <WhiteSpace size="lg" />
                <Flex justify="center">
                  <Button
                    inline
                    type="warning"
                    onClick={() => this.denyRequest()}
                  >
                    Deny
                  </Button>
                </Flex>
                <WhiteSpace size="lg" />
              </div>
            ) : (
              <div>
                <Result
                  img={myImg(request.book_image_url)}
                  title={request.book_name}
                  message={`${request.requester_name}`}
                />
                <WhiteSpace size="lg" />
                {/* <Flex justify="center">{myImg(request.book_image_url)}</Flex> */}
                <div>
                  <Steps
                    current={this.getCurrentStatus()}
                    direction="horizontal"
                    size="small"
                  >
                    {steps}
                  </Steps>
                </div>
              </div>
            )}

            {request.is_confirmed &&
              !request.is_handed &&
              currentUser._id === request.req_from && (
                <Flex justify="center" style={{ padding: 12 }}>
                  <WhiteSpace size="lg" />
                  <Button
                    inline
                    size="small"
                    type="primary"
                    onClick={() => this.isHanded()}
                  >
                    I've handed over the book
                  </Button>
                </Flex>
              )}

            {request.is_handed &&
              !request.is_returned &&
              currentUser._id === request.req_from && (
                <Flex justify="center" style={{ padding: 12 }}>
                  <WhiteSpace size="lg" />
                  <Button
                    inline
                    size="small"
                    type="primary"
                    onClick={() => this.isReturned()}
                  >
                    I've received my book back
                  </Button>
                </Flex>
              )}
          </div>

          <div>
            <Flex direction="column" justify="between">
              <ChatteryWindow
                messages={messages || []}
                // removeNotification={this.removeNotification}
              />

              <div style={{ height: 44 }} />
            </Flex>

            <div
              style={{
                position: 'fixed',
                height: 44,
                width: '100%',
                bottom: 0,
                zIndex: 9
              }}
            >
              <Flex style={{ width: '100%' }} justify="center">
                <FlexItem>
                  <form onSubmit={event => this.sendMessage(event)}>
                    <InputItem
                      value={messageInput}
                      onChange={value => this.setState({ messageInput: value })}
                      placeholder="enter message"
                      onFocus={() => this.setState({ isAccordionOpen: false })}
                      style={{ fontSize: 14 }}
                    />
                  </form>
                </FlexItem>
                <FlexItem
                  style={{
                    flexGrow: 0,
                    flexBasis: 48,
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <IoMdSend size={24} onClick={() => this.sendMessage()} />
                </FlexItem>
              </Flex>
            </div>
          </div>
        </Tabs>
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

// Template.allNotifications.helpers({
//   unreadMessage: () => {
//     const currentUserId = Meteor.userId();

//     if (
//       Messages.findOne({
//         is_seen_by_other: 0,
//         last_msg_by: { $exists: true, $ne: currentUserId }
//       })
//     ) {
//       return true;
//     } else {
//       return false;
//     }
//   },

//   unseenRequestReply: () => {
//     const currentUserId = Meteor.userId();

//     if (
//       Requests.findOne({
//         is_replied_and_not_seen: 1,
//         req_by: currentUserId
//       })
//     ) {
//       return true;
//     } else {
//       return false;
//     }
//   },

//   openRequest: () => {
//     const isOpenReq = Books.findOne({
//       added_by: Meteor.userId(),
//       on_request: 1
//     });

//     return isOpenReq;
//   }
// });
