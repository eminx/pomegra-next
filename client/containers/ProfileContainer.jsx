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
  NavBar,
  Progress
} from 'antd-mobile';
import Resizer from 'react-image-file-resizer';
import arrayMove from 'array-move';

import EditProfile from '../reusables/EditProfile';
import { errorDialog, successDialog, dataURLtoFile } from '../functions';

const resizedImageWidth = 800;

function uploadProfileImage(image, callback) {
  const upload = new Slingshot.Upload('profileImageUpload');

  upload.send(image, (error, downloadUrl) => {
    if (error) {
      callback(error);
    } else {
      callback(error, downloadUrl);
    }
  });
}

class Profile extends PureComponent {
  state = {
    coverImages: [],
    avatarImage: [],
    parsedAvatarImage: [],
    isEditDialogOpen: false,
    uploadingImages: false,
    progress: null,
    uploadingCoverImages: false,
    uploadingAvatarImage: false,
    unSavedImageChange: false,
    unSavedInfoChange: false
  };

  openEditDialog = () => {
    const { currentUser } = this.props;

    this.setState({
      isEditDialogOpen: true,
      coverImages: currentUser && currentUser.coverImages
    });
  };

  closeEditDialog = () => {
    const { unSavedInfoChange, unSavedImageChange } = this.state;
    const closeEditDialog = () => {
      this.setState({
        isEditDialogOpen: false,
        coverImages: [],
        avatarImage: [],
        unSavedImageChange: false,
        uploadingImages: false,
        unSavedInfoChange: false
      });
    };

    let changedTab = false;
    if (unSavedInfoChange && unSavedImageChange) {
      changedTab = 'images and info sections';
    } else if (unSavedInfoChange) {
      changedTab = 'info section';
    } else if (unSavedImageChange) {
      changedTab = 'images section';
    }

    if (changedTab) {
      Modal.alert(
        `You have unsaved changes in your ${changedTab}`,
        'Are you sure you want to skip them?',
        [
          { text: 'Cancel', onPress: () => null },
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

  setUnSavedInfoChange = () => {
    this.setState({
      unSavedInfoChange: true
    });
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

  handleCoverImagePick = pickedImages => {
    const { coverImages } = this.state;
    const imageSet = pickedImages.map(image => ({
      file: image,
      url: URL.createObjectURL(image),
      isNewImage: true
    }));
    this.setState({
      coverImages: [...coverImages, ...imageSet],
      unSavedImageChange: true,
      coverChange: true
    });
  };

  handleRemoveImage = imageIndex => {
    console.log(imageIndex);
    const { coverImages } = this.state;
    this.setState({
      coverImages: coverImages.filter((image, index) => imageIndex !== index),
      unSavedImageChange: true,
      coverChange: true
    });
  };

  handleAvatarImagePick = (images, type, index) => {
    this.setState({
      avatarImage: images,
      unSavedImageChange: true,
      avatarChange: true
    });
  };

  handleAvatarImageRemove = (images, type, index) => {
    this.setState({
      avatarImage: [],
      unSavedImageChange: true,
      avatarChange: true
    });
  };

  resizeImages = () => {
    const { coverImages, progress } = this.state;
    this.setState({
      uploadingImages: true
    });

    const uploadedImages = [];

    const uploadableCoverImages = coverImages.filter(
      image => image.isNewImage && image.file
    );

    let progressCounter = progress;
    uploadableCoverImages.forEach((image, index) => {
      Resizer.imageFileResizer(
        image.file,
        resizedImageWidth,
        (resizedImageWidth * image.height) / image.width,
        'JPEG',
        95,
        0,
        uri => {
          const uploadableImage = dataURLtoFile(uri, image.file.name);
          uploadProfileImage(uploadableImage, (error, respond) => {
            if (error) {
              console.log('error!', error);
              return;
            }
            uploadedImages.push({
              url: respond,
              name: image.file.name,
              uploadDate: new Date()
            });
            progressCounter =
              (80 * uploadedImages.length) / uploadableCoverImages.length;
            this.setState({
              progress: progressCounter
            });
            uploadedImages.length === uploadableCoverImages.length &&
              this.setState({ uploadedImages }, () => this.setNewImages());
          });
        },
        'base64'
      );
    });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) {
      return;
    }

    this.setState(({ coverImages }) => ({
      coverImages: arrayMove(coverImages, oldIndex, newIndex),
      unSavedImageChange: true,
      coverChange: true
    }));
  };

  handleSaveImages = () => {
    const { coverImages } = this.state;

    this.setState({
      progress: 5
    });

    const isThereNewImage = coverImages.some(image => image.isNewImage);
    if (isThereNewImage) {
      this.resizeImages();
    } else {
      this.setNewImages();
    }
  };

  setNewImages = () => {
    const {
      uploadedImages,
      coverImages,
      avatarImage,
      avatarChange
    } = this.state;

    let newImageSet;

    if (!uploadedImages) {
      newImageSet = coverImages;
    } else {
      newImageSet = coverImages
        .filter(image => !image.file)
        .concat(uploadedImages);
    }

    Meteor.call('setNewCoverImages', newImageSet, (error, respond) => {
      if (error) {
        console.log(error);
        errorDialog(error.reason);
        return;
      }
      if (avatarChange) {
        Meteor.call('setNewAvatarImage', avatarImage[0], (error, respond) => {
          if (error) {
            console.log(error);
            errorDialog(error.reason);
            return;
          }
        });
      }

      this.setState({
        progress: 100,
        uploadingImages: false,
        unSavedImageChange: false
      });

      successDialog('Your images are successfully  saved');
      setTimeout(() => this.setState({ progress: null }), 2000);
    });
  };

  render() {
    const { currentUser } = this.props;
    const {
      isEditDialogOpen,
      coverImages,
      avatarImage,
      unSavedImageChange,
      unSavedInfoChange,
      uploadingImages,
      progress
    } = this.state;

    if (!currentUser) {
      return null;
    }

    return (
      <div style={{ height: '100%', marginBottom: 80 }}>
        {progress && <Progress percent={progress} />}
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
            coverImages={coverImages}
            avatarImage={avatarImage}
            uploadingImages={uploadingImages}
            unSavedImageChange={unSavedImageChange}
            unSavedInfoChange={unSavedInfoChange}
            setUnSavedInfoChange={this.setUnSavedInfoChange}
            onSortEnd={this.onSortEnd}
            handleCoverImagePick={this.handleCoverImagePick}
            handleRemoveImage={index => this.handleRemoveImage(index)}
            handleAvatarImagePick={this.handleAvatarImagePick}
            handleSaveImages={this.handleSaveImages}
            handleTabClick={(tab, index) => this.setState({ openTab: index })}
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
