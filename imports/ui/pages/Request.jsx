import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  Button,
  Divider,
  Form,
  Input,
  NavBar,
  Result,
  Skeleton,
  Steps,
  Tabs,
} from 'antd-mobile';
import { Box, Flex } from '@chakra-ui/react';
import { CheckCircleFill } from 'antd-mobile-icons';

import { ChatteryWindow } from '../components/chattery/ChatteryWindow';
import { call } from '../../api/_utils/functions';
import { UserContext } from '../Layout';
import useChattery from '../../api/_utils/useChattery';
import RequestsCollection from '../../api/requests/request';
import { errorDialog, successDialog } from '../components/Toast';

const { Step } = Steps;
const { Tab } = Tabs;

const steps = [
  {
    title: 'Requested',
    description: 'Request sent',
  },
  {
    title: 'Accepted',
    description: 'Request is accepted',
  },
  {
    title: 'Handed',
    description: 'The borrower received the book to read',
  },
  {
    title: 'Returned',
    description: 'The borrower has returned the book to the owner',
  },
];

const myImg = (src) => <img src={src} alt="book image" height={64} />;

function Request({ request }) {
  const { currentUser } = useContext(UserContext);
  const [state, setState] = useState({
    messageInput: '',
    typingMessage: null,
    openTab: 'status',
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const { isChatLoading, discussion } = useChattery(id, currentUser);

  // useEffect(() => {
  //   getRequest();
  // }, []);

  const getRequest = async () => {
    try {
      const respond = await call('getSingleRequest', id);
      setState({
        ...state,
        request: respond,
      });
    } catch (error) {
      console.log(error);
      errorDialog(error.reason);
    }
  };

  const sendMessage = async (event) => {
    event && event.preventDefault();
    const { messageInput } = state;

    if (messageInput === '') {
      return;
    }

    try {
      await call('addMessage', id, messageInput);
      setState({
        ...state,
        messageInput: '',
      });
    } catch (error) {
      console.log(error);
      errorDialog(error.reason || error.error);
    }
  };

  const acceptRequest = async () => {
    if (currentUser._id !== request.ownerId) {
      return;
    }
    try {
      await call('acceptRequest', id);
      await getRequest();
      successDialog('Thank you!');
    } catch (error) {
      console.log(error);
      errorDialog(error.reason);
    }
  };

  const denyRequest = async () => {
    if (currentUser._id !== request.ownerId) {
      return;
    }
    try {
      await call('denyRequest', id);
      await getRequest();
      successDialog(
        'Request denied. We are sorry to have you deny this request'
      );
    } catch (error) {
      console.log(error);
      errorDialog(error.reason);
    }
  };

  const setIsHanded = async () => {
    if (currentUser._id !== request.ownerId) {
      return;
    }
    try {
      await call('setIsHanded', id);
      await getRequest();
      successDialog('Great that you have handed over the book!');
    } catch (error) {
      console.log(error);
      errorDialog(error.reason);
    }
  };

  const setIsReturned = async () => {
    if (currentUser._id !== request.ownerId) {
      return;
    }
    try {
      await call('setIsReturned', id);
      await getRequest();
      successDialog('Your book is back and available at your shelf <3');
    } catch (error) {
      console.log(error);
      errorDialog(error.reason);
    }
  };

  const getCurrentStatus = () => {
    if (request.isReturned) {
      return 3;
    } else if (request.isHanded) {
      return 2;
    } else if (request.isConfirmed) {
      return 1;
    } else {
      return 0;
    }
  };

  const getNotificationsCount = () => {
    if (!currentUser) {
      return null;
    }
    const currentItem = currentUser.notifications?.find((notification) => {
      return notification.contextId === request._id;
    });

    return currentItem && currentItem.count;
  };

  const removeNotification = async (messageIndex) => {
    const shouldRun = currentUser?.notifications?.find((notification) => {
      if (!notification.unSeenIndexes) {
        return false;
      }
      return notification?.unSeenIndexes?.some(
        (unSeenIndex) => unSeenIndex === messageIndex
      );
    });
    if (!shouldRun) {
      return;
    }
    try {
      await call('removeNotification', request._id, messageIndex);
    } catch (error) {
      errorDialog(error.reason || error.error);
      console.log('error', error);
    }
  };

  const getOthersName = () => {
    if (request.requesterUsername === currentUser.username) {
      return request.ownerUsername;
    } else {
      return request.requesterUsername;
    }
  };

  const { messageInput, openTab } = state;

  if (!currentUser) {
    return (
      <div>
        <NavBar>Request</NavBar>
        <Skeleton
          animated
          style={{ width: '100%', height: '80px', marginBottom: 24 }}
        />
        <Skeleton
          animated
          style={{ width: '100%', height: '80px', marginBottom: 24 }}
        />
        <Skeleton
          animated
          style={{ width: '100%', height: '80px', marginBottom: 24 }}
        />
        <Skeleton
          animated
          style={{ width: '100%', height: '80px', marginBottom: 24 }}
        />
      </div>
    );
  }

  if (!request) {
    return <div>Loading...</div>;
  }

  const requestedNotResponded = !request.isConfirmed && !request.isDenied;
  const iAmTheOwner = currentUser._id === request.ownerId;
  const currentStatus = getCurrentStatus();

  return (
    <div>
      <NavBar onBack={() => navigate('/messages')}>
        <b>{getOthersName()}</b>
      </NavBar>

      <Tabs
        activeKey={openTab}
        style={{ '--content-padding': '0px' }}
        onChange={(key) => {
          setState({ ...state, openTab: key });
        }}
      >
        {/* <Tab key="status" title={<Badge content={Badge.dot}>Status</Badge>}> */}
        <Tab key="status" title="Status">
          {requestedNotResponded && iAmTheOwner ? (
            <div>
              <Result
                description={`lending request by ${request.requesterUsername}`}
                icon={myImg(request.bookImage)}
                title={request.bookTitle}
              />
              <Divider style={{ borderStyle: 'dashed' }}>
                <Button
                  color="primary"
                  style={{ marginRight: 4 }}
                  onClick={() => acceptRequest()}
                >
                  Accept
                </Button>
                <Button style={{ marginLeft: 4 }} onClick={() => denyRequest()}>
                  Deny
                </Button>
              </Divider>
            </div>
          ) : (
            <div>
              <Result
                description={`lending requested by ${request.requesterUsername}`}
                icon={myImg(request.bookImage)}
                title={request.bookTitle}
              />
              <div>
                <Steps
                  current={currentStatus}
                  direction="horizontal"
                  size="small"
                  style={{
                    '--title-font-size': '14px',
                    '--description-font-size': '11px',
                  }}
                >
                  {steps.map((step, index) => (
                    <Step
                      key={step.title}
                      description={step.description}
                      icon={currentStatus >= index ? <CheckCircleFill /> : null}
                      title={step.title}
                      status={currentStatus >= index ? 'finish' : 'wait'}
                    />
                  ))}
                </Steps>
              </div>
            </div>
          )}

          {request.isConfirmed &&
            !request.isHanded &&
            currentUser._id === request.ownerId && (
              <Flex justify="center" style={{ padding: 12 }}>
                <Button
                  inline
                  size="small"
                  color="primary"
                  onClick={() => setIsHanded()}
                >
                  I've handed over the book
                </Button>
              </Flex>
            )}

          {request.isHanded &&
            !request.isReturned &&
            currentUser._id === request.ownerId && (
              <Flex justify="center" style={{ padding: 12 }}>
                <Button
                  inline
                  size="small"
                  color="primary"
                  onClick={() => setIsReturned()}
                >
                  I've received my book back
                </Button>
              </Flex>
            )}
        </Tab>

        <Tab
          key="messages"
          title={<Badge content={getNotificationsCount()}>Messages</Badge>}
        >
          <Box bg="#d9d9d9">
            <Flex direction="column" justify="space-between">
              <Box h="100%">
                <ChatteryWindow
                  messages={discussion || []}
                  removeNotification={removeNotification}
                />
              </Box>

              <Box w="100%" zIndex={9}>
                <Form onSubmit={(event) => sendMessage(event)}>
                  <Flex w="100%">
                    <Form.Item style={{ flexGrow: 1 }}>
                      <Input
                        value={messageInput}
                        onChange={(value) =>
                          setState({ ...state, messageInput: value })
                        }
                        placeholder="enter message"
                        style={{ fontSize: 14 }}
                      />
                    </Form.Item>
                    <Button
                      style={{ borderRadius: 0 }}
                      color="primary"
                      fill="solid"
                      flexGrow={0}
                      type="submit"
                      onClick={() => sendMessage()}
                    >
                      Send
                    </Button>
                  </Flex>
                </Form>
              </Box>
            </Flex>
          </Box>
        </Tab>
      </Tabs>
    </div>
  );
}

export default withTracker((props) => {
  const reqId = location?.pathname?.split('/')[2];
  Meteor.subscribe('request', reqId);
  const request = RequestsCollection
    ? RequestsCollection.findOne({ _id: reqId })
    : null;

  return {
    ...props,
    request,
  };
})(Request);
