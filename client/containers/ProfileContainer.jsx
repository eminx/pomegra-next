import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Fragment, PureComponent } from 'react';
import {
  Carousel,
  Flex,
  Button,
  WhiteSpace,
  WingBlank,
  Modal,
  NavBar
} from 'antd-mobile';

import EditProfile from '../reusables/EditProfile';
import { errorDialog, successDialog } from '../functions';

class Profile extends PureComponent {
  state = {
    isEditDialogOpen: false,
    isAnyValueChanged: false
  };

  openEditDialog = () => {
    this.setState({
      isEditDialogOpen: true
    });
  };

  closeEditDialog = () => {
    const closeEditDialog = () => {
      this.setState({
        isEditDialogOpen: false
      });
    };

    if (this.state.isAnyValueChanged) {
      Modal.alert(
        'You have unsaved changes',
        'Are you sure you want to skip them?',
        [
          { text: 'Cancel', onPress: () => console.log('cancel') },
          {
            text: 'Yes',
            onPress: () => closeEditDialog()
          }
        ]
      );
    } else {
      closeEditDialog();
    }
  };

  isAnyValueChanged = () => {
    if (!this.state.isAnyValueChanged) {
      this.setState({
        isAnyValueChanged: true
      });
    }
  };

  updateProfile = (values, languages) => {
    Meteor.call('updateProfile', values, languages, (error, respond) => {
      if (error) {
        console.log(error);
        errorDialog(error.reason);
      } else {
        this.setState({
          isEditDialogOpen: false
        });
        successDialog('Your profile is successfully updated');
      }
    });
  };

  render() {
    const { currentUser } = this.props;
    const { isEditDialogOpen } = this.state;

    if (!currentUser) {
      return null;
    }

    return (
      <div style={{ height: '100%', marginBottom: 80 }}>
        <NavBar mode="light">
          <h3>{currentUser.username}</h3>
        </NavBar>

        <Fragment>
          <Carousel
            autoplay={false}
            // infinite
            style={{ minHeight: 180 }}
          >
            {currentUser.coverImages &&
              currentUser.coverImages.map(image => (
                <div key={image.url} style={slideStyle(image.url)} />
              ))}
          </Carousel>

          <WingBlank>
            <Flex>
              <div
                style={avatarStyle(
                  'https://pomegra-profile-images.s3-eu-central-1.amazonaws.com/emin/emin.jpeg'
                )}
              />
              <div>
                <h4>{currentUser.firstName + ' ' + currentUser.lastName}</h4>
              </div>
            </Flex>
            <WingBlank>
              <p style={{ textAlign: 'center' }}>{currentUser.bio}</p>
            </WingBlank>

            <WhiteSpace />
            <Button onClick={this.openEditDialog}>Edit</Button>
          </WingBlank>
        </Fragment>

        <Modal
          visible={currentUser && isEditDialogOpen}
          // position="top"
          closable
          onClose={this.closeEditDialog}
          title="Edit Your Profile"
        >
          <EditProfile
            currentUser={currentUser}
            onSubmit={this.updateProfile}
            isAnyValueChanged={() => this.isAnyValueChanged()}
          />
        </Modal>
      </div>
    );
  }
}

const slideStyle = backgroundImage => ({
  width: '100%',
  height: '40vh',
  minHeight: 180,
  backgroundImage: `url('${backgroundImage}')`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  touchAction: 'none'
});

const avatarStyle = backgroundImage => ({
  width: 80,
  height: 80,
  margin: 12,
  flexBasis: 80,
  flexGrow: 0,
  flexShrink: 0,
  backgroundImage: `url('${backgroundImage}')`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  borderRadius: '50%',
  boxShadow: '0 0 5px'
});

export default ProfileContainer = withTracker(props => {
  const currentUser = Meteor.user();

  return {
    currentUser
  };
})(Profile);
