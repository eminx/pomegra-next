import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {
  ActivityIndicator,
  NavBar,
  Button,
  Flex,
  Result,
  Icon,
  Link,
  List,
  InputItem,
  Steps,
  WingBlank,
  WhiteSpace,
  Menu,
  Accordion
} from 'antd-mobile';
import { IoMdSend } from 'react-icons/io';

import { Requests } from '../../imports/api/collections';
import { ChatteryWindow } from '../reusables/chattery/ChatteryWindow';
import { Redirect } from 'react-router-dom';

const Step = Steps.Step;

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
    attachments: [],
    sheetVisible: false,
    typingMessage: null,
    menuOpened: false,
    chatInputValue: '',
    isAccordionOpen: true
  };

  componentDidMount() {
    // const { messages } = this.props;
    // if (!messages.is_seen_by_other) {
    //   this.setState({
    //     isAccordionOpen: false
    //   })
    // }
  }

  sendMessage = event => {
    event && event.preventDefault();
    const { request } = this.props;
    const messageInput = this.state.chatInputValue;
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
      chatInputValue: ''
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

  getCurrentStatus = () => {
    const { request } = this.props;

    if (request.is_returned) {
      return steps[2].title;
    } else if (request.is_handed) {
      return steps[1].title;
    } else if (request.is_confirmed) {
      return steps[0].title;
    } else {
      return null;
    }
  };

  toggleMenu = () => {
    this.setState({
      menuOpened: !this.state.menuOpened
    });
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
    const {
      menuOpened,
      backToRequests,
      chatInputValue,
      isAccordionOpen
    } = this.state;

    if (!currentUser) {
      return null;
    }

    if (backToRequests) {
      return <Redirect to="/messages" />;
    }

    const messages = this.getChatMessages();

    if (isLoading || !request) {
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
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Accordion
            style={{ position: 'absolute', top: 0, width: '100%' }}
            className="request-accordion"
            activeKey={isAccordionOpen ? 'only-panel' : 'no-panel'}
            onChange={() =>
              this.setState({ isAccordionOpen: !isAccordionOpen })
            }
          >
            <Accordion.Panel
              key="only-panel"
              header={request.book_name}
              style={{
                textAlign: 'center',
                backgroundColor:
                  requestedNotResponded && iAmTheOwner ? '#e94f4f' : null
              }}
            >
              <WingBlank>
                {requestedNotResponded && iAmTheOwner ? (
                  <div>
                    <WhiteSpace size="lg" />
                    <Result
                      img={myImg(request.book_image_url)}
                      title={request.book_name}
                      message={`${request.requester_name} would like to read your book`}
                      buttonText="Accept"
                      buttonType="primary"
                      onButtonClick={() => this.acceptRequest()}
                    />
                    <WhiteSpace />
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
                    <Flex justify="center">
                      {myImg(request.book_image_url)}
                    </Flex>
                    <WhiteSpace size="lg" />
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
              </WingBlank>

              <WingBlank>
                {request.is_confirmed &&
                  !request.is_handed &&
                  currentUser._id === request.req_from && (
                    <Flex justify="center" style={{ padding: 12 }}>
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
              </WingBlank>
              <WhiteSpace size="lg" />
            </Accordion.Panel>
          </Accordion>
        </div>

        {messages && (
          <ChatteryWindow
            messages={messages}
            // removeNotification={this.removeNotification}
          />
        )}

        <Flex style={{ position: 'fixed', bottom: 0, width: '100%' }}>
          <Flex.Item>
            <form onSubmit={event => this.sendMessage(event)}>
              <InputItem
                value={chatInputValue}
                onChange={value => this.setState({ chatInputValue: value })}
                placeholder="enter message"
                onFocus={() => this.setState({ isAccordionOpen: false })}
              />
            </form>
          </Flex.Item>
          <Flex.Item style={{ flexGrow: 0, flexBasis: 36 }}>
            <IoMdSend size={24} onClick={() => this.sendMessage()} />
          </Flex.Item>
        </Flex>
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
