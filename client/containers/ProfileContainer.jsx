import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Fragment, PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import {
  WhiteSpace,
  WingBlank,
  Modal,
  NavBar,
  Icon,
  Result
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
      <div>
        <NavBar mode="light">My Profile</NavBar>

        <Fragment>
          <WhiteSpace size="lg" />
          <WingBlank>
            <Result
              imgUrl="https://pomegra-profile-images.s3-eu-central-1.amazonaws.com/emin/emin.jpeg"
              title={
                <div>
                  <h3>{currentUser.username}</h3>
                  <p>{currentUser.firstName + ' ' + currentUser.lastName}</p>
                </div>
              }
              message={currentUser.bio}
              buttonText="Edit"
              buttonType="ghost"
              onButtonClick={this.openEditDialog}
            />
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

export default ProfileContainer = withTracker(props => {
  const currentUser = Meteor.user();

  return {
    currentUser
  };
})(Profile);
