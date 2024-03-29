import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import RequestsCollection from '../../api/requests/request';

const useChattery = (requestId, currentUser) =>
  useTracker(() => {
    const subscription = Meteor.subscribe('chat', requestId);
    const chat = RequestsCollection.findOne({ _id: requestId });
    const discussion = chat?.messages?.map((message) => ({
      ...message,
      isFromMe: currentUser && message && message.senderId === currentUser._id,
    }));
    return {
      discussion,
      isChatLoading: !subscription.ready(),
    };
  }, [requestId]);

export default useChattery;
