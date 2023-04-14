import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router-dom';
import { NavBar, Button, Result, Icon, Tabs, Badge, Input, Steps, Divider } from 'antd-mobile';
import { Box, Flex } from '@chakra-ui/react';

import { RequestsCollection } from '../../api/collections';
import { ChatteryWindow } from '../components/chattery/ChatteryWindow';
import { successDialog, errorDialog } from '../../api/_utils/functions';

const Step = Steps.Step;

const steps = [
  {
    title: 'Accepted',
    description: 'Request is accepted',
  },
  {
    title: 'Handed',
    description: 'Borrower received the book to read',
  },
  {
    title: 'Returned',
    description: 'Borrower has returned the book to the owner',
  },
].map((step, index) => <Step key={step.title} title={step.title} description={step.description} />);

const myImg = (src) => <img src={src} alt="" width={48} height={66} />;

class Request extends Component {
  state = {
    messageInput: '',
    typingMessage: null,
    openTab: 0,
  };

  sendMessage = (event) => {
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
      messageInput: '',
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

    return messages.messages.map((message) => {
      if (message.from === currentUser._id) {
        message.isFromMe = true;
      }
      message.senderUsername = this.getMessageSender(message);
      return message;
    });
  };

  getMessageSender = (message) => {
    const { currentUser, request } = this.props;
    if (currentUser._id === message.from) {
      return 'me';
    } else if (request.requesterUsername === currentUser.username) {
      return request.ownerUsername;
    } else {
      return request.requesterUsername;
    }
  };

  acceptRequest = () => {
    const { currentUser, request } = this.props;
    if (currentUser._id !== request.ownerId) {
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
    if (currentUser._id !== request.ownerId) {
      return;
    }

    const self = this;
    const app = self.$f7;

    Meteor.call('denyRequest', request._id, (error, respond) => {
      if (error) {
        errorDialog(error.reason);
      } else {
        successDialog('Request denied. We are sorry to have you deny this request');
      }
    });
  };

  isHanded = () => {
    const { currentUser, request } = this.props;
    if (currentUser._id !== request.ownerId) {
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
    if (currentUser._id !== request.ownerId) {
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
      { title: <Badge text={notificationsCount}>Messages</Badge> },
    ];
  };

  getNotificationsCount = () => {
    const { request, currentUser } = this.props;
    const foundContext = currentUser.notifications.find((notification) => {
      return notification.contextId === request._id;
    });

    return foundContext && foundContext.count;
  };

  getOthersName = () => {
    const { request, currentUser } = this.props;
    if (request.requesterUsername === currentUser.username) {
      return request.ownerUsername;
    } else {
      return request.requesterUsername;
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
      return <div>Loading...</div>;
    }

    const requestedNotResponded = !request.is_confirmed && !request.is_denied;
    const iAmTheOwner = currentUser._id === request.ownerId;

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
            {requestedNotResponded && iAmTheOwner ? (
              <div>
                <Result
                  img={myImg(request.bookImage)}
                  title={request.bookTitle}
                  message={`${request.requesterUsername}`}
                  buttonText="Accept"
                  buttonType="primary"
                  onButtonClick={() => this.acceptRequest()}
                />

                <Divider />

                <Flex justify="center">
                  <Button inline type="warning" onClick={() => this.denyRequest()}>
                    Deny
                  </Button>
                </Flex>
              </div>
            ) : (
              <div>
                <Result
                  img={myImg(request.bookImage)}
                  title={request.bookTitle}
                  message={`${request.requesterUsername}`}
                />

                {/* <Flex justify="center">{myImg(request.bookImage)}</Flex> */}
                <div>
                  <Steps current={this.getCurrentStatus()} direction="horizontal" size="small">
                    {steps}
                  </Steps>
                </div>
              </div>
            )}

            {request.is_confirmed && !request.is_handed && currentUser._id === request.ownerId && (
              <Flex justify="center" style={{ padding: 12 }}>
                <Button inline size="small" type="primary" onClick={() => this.isHanded()}>
                  I've handed over the book
                </Button>
              </Flex>
            )}

            {request.is_handed && !request.is_returned && currentUser._id === request.ownerId && (
              <Flex justify="center" style={{ padding: 12 }}>
                <Button inline size="small" type="primary" onClick={() => this.isReturned()}>
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
                zIndex: 9,
              }}
            >
              <Flex style={{ width: '100%' }} justify="center">
                <Box>
                  <form onSubmit={(event) => this.sendMessage(event)}>
                    <Input
                      value={messageInput}
                      onChange={(value) => this.setState({ messageInput: value })}
                      placeholder="enter message"
                      onFocus={() => this.setState({ isAccordionOpen: false })}
                      style={{ fontSize: 14 }}
                    />
                  </form>
                </Box>
                <Box
                  style={{
                    flexGrow: 0,
                    flexBasis: 48,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <div w={24} onClick={() => this.sendMessage()} />
                </Box>
              </Flex>
            </div>
          </div>
        </Tabs>
      </div>
    );
  }
}

export default RequestContainer = withTracker((props) => {
  const currentUser = Meteor.user();
  const requestId = props.match.params.id;

  const reqSub = Meteor.subscribe('singleRequest', requestId);
  const request = currentUser && RequestsCollection.findOne(requestId);

  const msgSub = Meteor.subscribe('myMessages', requestId);
  const messages = currentUser && MessagesCollection.findOne({ requestId });

  const isLoading = !reqSub.ready() || !msgSub.ready();

  return {
    currentUser,
    request,
    messages,
    isLoading,
  };
})(Request);
