import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Block,
  Page,
  Navbar,
  Input,
  Button,
  List,
  ListItem,
  ListInput,
} from 'framework7-react';
import { Requests } from '../../imports/api/collections';

class Request extends Component {
  state = {
    messageInput: '',
  };

  sendMessage = event => {
    event.preventDefault();
    const { request } = this.props;
    const { messageInput } = this.state;
    if (messageInput === '') {
      return;
    }

    console.log(messageInput);

    Meteor.call('addMessage', request._id, messageInput, (error, respond) => {
      if (error) {
        console.log(error);
      } else {
        console.log(respond);
        this.setState({
          messageInput: '',
        });
      }
    });
  };

  render() {
    const { currentUser, request, messages } = this.props;

    const detailListItemStyle = {
      justifyContent: 'flex-end',
      height: 18,
      fontSize: 12,
    };

    if (!request || !currentUser) {
      return (
        <Page>
          <Navbar title="No account" backLink />
          <div style={{ textAlign: 'center' }}>Please create an account</div>
        </Page>
      );
    }

    return (
      <Page name="books">
        <Navbar title="Details" backLink></Navbar>
        <Card className="demo-card-header-pic" title={request.book_title}>
          <CardHeader
            className="no-border"
            valign="bottom"
            style={{
              backgroundImage:
                request.book_image_url && `url(${request.book_image_url})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundColor: '#010101',
              height: 120,
              backgroundSize: 'contain',
            }}
          ></CardHeader>
          <CardContent>
            <Block>
              <List
                simpleList
                style={{ paddingTop: 12, paddingBottom: 12 }}
                noHairlinesBetween
                form
              >
                <ListItem style={{ paddingLeft: 0 }}>
                  {request.owner_name}
                </ListItem>
                <ListItem style={detailListItemStyle}>
                  {request.requester_name}
                </ListItem>
              </List>
            </Block>

            <p>{request.book_author}</p>

            <Block>
              <List>
                {messages.messages.map(message => (
                  <ListItem>{message.text}</ListItem>
                ))}
              </List>
            </Block>

            <Block>
              <List form>
                <ListInput
                  onInput={e => this.setState({ messageInput: e.target.value })}
                  value={this.state.messageInput}
                  label="message"
                  type="text"
                  placeholder="Your message"
                />
                <ListItem>
                  <Button
                    type="submit"
                    onClick={event => this.sendMessage(event)}
                  >
                    Send
                  </Button>
                </ListItem>
              </List>
            </Block>
          </CardContent>
          <CardFooter style={{ display: 'flex', justifyContent: 'center' }}>
            {/* <Link>Close</Link> */}
          </CardFooter>
        </Card>
      </Page>
    );
  }
}

export default RequestContainer = withTracker(props => {
  const currentUser = Meteor.user();
  const requestId = props.request._id;
  // Requests && Meteor.subscribe('request', requestId);
  const request = Requests && Requests.findOne(requestId);

  // Messages && Meteor.subscribe('messages', requestId);
  const messages = Messages && Messages.findOne({ req_id: requestId });
  return {
    currentUser,
    request,
    messages,
  };
})(Request);
