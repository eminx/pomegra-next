import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {
  AccordionContent,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Appbar,
  Block,
  Page,
  Navbar,
  Toolbar,
  Button,
  Link,
  List,
  ListItem,
  LoginScreen,
  LoginScreenTitle,
  BlockFooter,
  ListButton,
  ListInput,
} from 'framework7-react';

class MyBook extends Component {
  state = {};

  render() {
    const { currentUser, myBook } = this.props;

    const detailListItemStyle = {
      justifyContent: 'flex-end',
      height: 18,
      fontSize: 12,
    };

    if (!myBook) {
      return;
    }

    return (
      <Page name="books">
        <Navbar title="Details" backLink></Navbar>
        <Card className="demo-card-header-pic" title={myBook.b_title}>
          <CardHeader
            className="no-border"
            valign="bottom"
            style={{
              backgroundImage: myBook.image_url && `url(${myBook.image_url})`,
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
                  {myBook.b_author}
                </ListItem>
                <ListItem style={detailListItemStyle}>
                  {myBook.b_lang.toUpperCase()},{' '}
                </ListItem>
                <ListItem style={detailListItemStyle}>{myBook.b_cat}</ListItem>
              </List>
            </Block>
            <p>{myBook.b_description}</p>
          </CardContent>
          <CardFooter style={{ display: 'flex', justifyContent: 'center' }}>
            {/* <Link>Close</Link> */}
            <Link>Edit</Link>
          </CardFooter>
        </Card>
        {/* <Toolbar position="bottom">
          <Link>Add to my Wishlist</Link>
          <Link>Yes I do</Link>
        </Toolbar> */}
      </Page>
    );
  }
}

export default MyBookContainer = withTracker(props => {
  const currentUser = Meteor.user();
  return {
    currentUser,
  };
})(MyBook);
