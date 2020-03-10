import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {
  Block,
  Page,
  Navbar,
  NavRight,
  Link,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  List,
  ListItem,
  Popup,
  Progressbar
} from 'framework7-react';

// import BookCard from '../../imports/ui/BookCard'

const detailListItemStyle = {
  justifyContent: 'flex-end',
  height: 18,
  fontSize: 12
};

class BookDetailTobeRequested extends Component {
  state = {
    requestPopupOpened: false,
    progressOn: false,
    requestSuccess: false
  };

  requestBook = () => {
    const self = this;
    const app = self.$f7;
    const { bookInfo } = this.props;
    Meteor.call('makeRequest', bookInfo._id, (error, respond) => {
      if (error) {
        app.dialog.alert(`${error.reason}, please try again`, 'Error', () => {
          console.log(error);
        });
      } else if (respond.error) {
        app.dialog.alert(`${respond.error}, please try again`, 'Error', () => {
          console.log(respond);
        });
      } else {
        const notification = app.notification.create({
          icon: '<i class="icon success"></i>',
          title: 'Success!',
          subtitle: 'You have successfully sent your lending request',
          closeButton: true,
          closeTimeout: 6000,
          opened: true
        });
        notification.open();
        self.$f7router.navigate(`/request/${respond}`);
      }
    });
  };

  render() {
    const { requestPopupOpened, progressOn, requestSuccess } = this.state;
    const { bookInfo } = this.props;

    if (!bookInfo) {
      return;
    }

    return (
      <Page name="books">
        <Navbar title="Request to Borrow" backLink />

        <Card className="demo-card-header-pic" title={bookInfo.b_title}>
          <CardHeader
            className="no-border"
            valign="bottom"
            style={
              bookInfo.image_url && {
                backgroundImage: `url(${bookInfo.image_url})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundColor: '#010101',
                height: 120,
                backgroundSize: 'contain'
              }
            }
          />

          <CardContent>
            <Block>
              <List
                simpleList
                style={{ paddingTop: 12, paddingBottom: 12 }}
                noHairlinesBetween
              >
                <ListItem style={{ paddingLeft: 0 }}>
                  {bookInfo.b_author}
                </ListItem>
                <ListItem style={detailListItemStyle}>
                  {' '}
                  {bookInfo.b_lang.toUpperCase()},{' '}
                </ListItem>
                <ListItem style={detailListItemStyle}>
                  {bookInfo.b_cat}
                </ListItem>
              </List>
            </Block>
            <p>{bookInfo.b_description}</p>
          </CardContent>
          <CardFooter style={{ display: 'flex', justifyContent: 'center' }}>
            <Link onClick={() => this.requestBook()}>Borrow from owner</Link>
          </CardFooter>
        </Card>

        <Popup opened={requestPopupOpened}>
          <Navbar title="Request Handling">
            <NavRight>
              <Link
                onClick={() => this.setState({ requestPopupOpened: false })}
              >
                Close
              </Link>
            </NavRight>
          </Navbar>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            {progressOn && <Progressbar infinite />}
            {requestSuccess && 'Your request is successfully sent'}
          </div>
        </Popup>
      </Page>
    );
  }
}

export default BookDetailTobeRequestedContainer = withTracker(props => {
  const currentUser = Meteor.user();
  return {
    currentUser
  };
})(BookDetailTobeRequested);
