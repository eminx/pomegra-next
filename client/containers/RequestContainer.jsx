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
  Link,
  List,
  ListItem,
} from 'framework7-react';
import { Requests } from '../../imports/api/collections';

class Request extends Component {
  state = {};

  render() {
    const { currentUser, request } = this.props;

    const detailListItemStyle = {
      justifyContent: 'flex-end',
      height: 18,
      fontSize: 12,
    };

    if (!request) {
      return;
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
          </CardContent>
          <CardFooter style={{ display: 'flex', justifyContent: 'center' }}>
            {/* <Link>Close</Link> */}
            <Link>Edit</Link>
          </CardFooter>
        </Card>
      </Page>
    );
  }
}

export default RequestContainer = withTracker(props => {
  const currentUser = Meteor.user();
  const requestId = props.request._id;
  // Requests && Meteor.subscribe('', requestId);
  const request = Requests && Requests.findOne();
  return {
    currentUser,
    request,
  };
})(Request);
