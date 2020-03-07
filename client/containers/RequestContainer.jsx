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
  Messagebar,
  MessagebarAttachment,
  MessagebarAttachments,
  MessagebarSheet,
  MessagebarSheetImage,
  MessagesTitle,
  Messages as Messages7,
  Message,
  Button,
  Link,
  List,
  ListItem,
  ListInput
} from 'framework7-react';

import { Requests } from '../../imports/api/collections';

class Request extends Component {
  state = {
    messageInput: '',
    attachments: [],
    sheetVisible: false,
    typingMessage: null
  };

  componentDidMount() {
    const self = this;
    self.$f7ready(() => {
      self.messagebar = self.messagebarComponent.f7Messagebar;
      self.messages = self.messagesComponent.f7Messages;
    });
  }

  sendMessage = event => {
    event.preventDefault();
    const { request } = this.props;

    const self = this;
    const messageInput = self.messagebar
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
    self.messagebar.clear();

    // Focus area
    if (messageInput.length) self.messagebar.focus();
  };

  render() {
    const { currentUser, request, messages } = this.props;
    const { sheetVisible } = this.state;

    const detailListItemStyle = {
      justifyContent: 'flex-end',
      height: 18,
      fontSize: 12
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
        <Navbar title="Messages" backLink></Navbar>
        {/* <Card className="demo-card-header-pic" title={request.book_title}> */}
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
            backgroundSize: 'contain'
          }}
        ></CardHeader>

        <Block>
          <List
            simpleList
            style={{ paddingTop: 12, paddingBottom: 12 }}
            noHairlinesBetween
            form
          >
            <ListItem style={{ paddingLeft: 0 }}>{request.owner_name}</ListItem>
            <ListItem style={detailListItemStyle}>
              {request.requester_name}
            </ListItem>
          </List>
        </Block>

        <p>{request.book_author}</p>

        <Messagebar
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
              </MessagebarSheet> */}
        </Messagebar>

        <Messages7
          ref={el => {
            this.messagesComponent = el;
          }}
        >
          <MessagesTitle>
            <b>Sunday, Feb 9,</b> 12:58
          </MessagesTitle>

          {messages.messages.map((message, index) => (
            <Message
              key={index}
              // type={message.type}
              // image={message.image}
              name={message.name}
              // avatar={message.avatar}
              // first={this.isFirstMessage(message, index)}
              // last={this.isLastMessage(message, index)}
              // tail={this.isTailMessage(message, index)}
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
        </Messages7>

        {/* <Block>
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
            </Block> */}
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
    messages
  };
})(Request);
