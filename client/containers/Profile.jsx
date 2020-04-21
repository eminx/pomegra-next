import { Meteor } from 'meteor/meteor';
import React, { Fragment, PureComponent } from 'react';
import {
  ActivityIndicator,
  Carousel,
  Flex,
  Button,
  WhiteSpace,
  WingBlank,
  Modal,
  NavBar,
  Progress,
} from 'antd-mobile';
import arrayMove from 'array-move';

import EditProfile from '../reusables/EditProfile';
import {
  errorDialog,
  successDialog,
  dataURLtoFile,
  resizeImage,
} from '../functions';

import { uploadProfileImage } from './HeroHelpers';
import { UserContext } from './Layout';

class Profile extends PureComponent {
  state = {
    coverImages: [],
    avatarImage: null,
    parsedAvatarImage: [],
    isEditDialogOpen: false,
    uploadingImages: false,
    progress: null,
    uploadingCoverImages: false,
    uploadingAvatarImage: false,
    unSavedImageChange: false,
    unSavedInfoChange: false,
  };

  openEditDialog = () => {
    const { currentUser } = this.context;

    this.setState({
      isEditDialogOpen: true,
      coverImages: (currentUser && currentUser.coverImages) || [],
      avatarImage: currentUser && currentUser.avatar,
    });
  };

  closeEditDialog = () => {
    const { unSavedInfoChange, unSavedImageChange } = this.state;
    const closeEditDialog = () => {
      this.setState({
        isEditDialogOpen: false,
        coverImages: [],
        avatarImage: null,
        unSavedImageChange: false,
        uploadingImages: false,
        unSavedInfoChange: false,
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
            onPress: () => closeEditDialog(),
          },
        ],
      );
    } else {
      closeEditDialog();
    }
  };

  setUnSavedInfoChange = () => {
    this.setState({
      unSavedInfoChange: true,
    });
  };

  updateProfile = (values, languages) => {
    Meteor.call(
      'updateProfile',
      values,
      languages,
      (error, respond) => {
        if (error) {
          console.log(error);
          errorDialog(error.reason);
        } else {
          this.setState({
            isEditDialogOpen: false,
          });
          successDialog('Your profile is successfully updated');
        }
      },
    );
  };

  handleCoverImagePick = (pickedImages) => {
    const { coverImages } = this.state;
    const imageSet = pickedImages.map((image) => ({
      file: image,
      url: URL.createObjectURL(image),
      isNewImage: true,
    }));
    this.setState({
      coverImages: [...coverImages, ...imageSet],
      unSavedImageChange: true,
      coverChange: true,
    });
  };

  handleRemoveImage = (imageIndex) => {
    const { coverImages } = this.state;
    this.setState({
      coverImages: coverImages.filter(
        (image, index) => imageIndex !== index,
      ),
      unSavedImageChange: true,
      coverChange: true,
    });
  };

  handleAvatarImagePick = (images, type, index) => {
    this.setState({
      avatarImage: images[0],
      unSavedImageChange: true,
      avatarChange: true,
    });
  };

  handleAvatarImageRemove = (images, type, index) => {
    this.setState({
      avatarImage: null,
      unSavedImageChange: true,
      avatarChange: true,
    });
  };

  resizeImages = () => {
    const { coverImages, progress } = this.state;
    this.setState({
      uploadingImages: true,
    });

    const uploadedImages = [];

    const uploadableCoverImages = coverImages.filter(
      (image) => image.isNewImage && image.file,
    );

    let progressCounter = progress;
    uploadableCoverImages.forEach((image, index) => {
      resizeImage(image, 500, (uri) => {
        const uploadableImage = dataURLtoFile(uri, image.file.name);
        uploadProfileImage(uploadableImage, (error, respond) => {
          if (error) {
            console.log('error!', error);
            return;
          }
          uploadedImages.push({
            url: respond,
            name: image.file.name,
            uploadDate: new Date(),
          });
          progressCounter =
            (80 * uploadedImages.length) /
            uploadableCoverImages.length;
          this.setState({
            progress: progressCounter,
          });
          uploadedImages.length === uploadableCoverImages.length &&
            this.setState({ uploadedImages }, () =>
              this.setNewImages(),
            );
        });
      });
    });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) {
      return;
    }

    this.setState(({ coverImages }) => ({
      coverImages: arrayMove(coverImages, oldIndex, newIndex),
      unSavedImageChange: true,
      coverChange: true,
    }));
  };

  handleSaveImages = () => {
    const { coverImages } = this.state;

    this.setState({
      progress: 5,
    });

    const isThereNewImage = coverImages.some(
      (image) => image.isNewImage,
    );
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
      avatarChange,
    } = this.state;

    let newImageSet;

    if (!uploadedImages) {
      newImageSet = coverImages;
    } else {
      newImageSet = coverImages
        .filter((image) => !image.file)
        .concat(uploadedImages);
    }

    Meteor.call(
      'setNewCoverImages',
      newImageSet,
      (error, respond) => {
        if (error) {
          console.log(error);
          errorDialog(error.reason);
          return;
        }
        if (avatarChange && avatarImage) {
          resizeImage(avatarImage, 180, (uri) => {
            const uploadableImage = dataURLtoFile(
              uri,
              avatarImage.file.name,
            );
            uploadProfileImage(uploadableImage, (error, respond) => {
              if (error) {
                console.log('error!', error);
                errorDialog(error.reason);
                return;
              }
              const avatar = {
                name: avatarImage.file.name,
                url: respond,
                uploadDate: new Date(),
              };
              Meteor.call(
                'setNewAvatar',
                avatar,
                (error, respond) => {
                  if (error) {
                    console.log(error);
                    errorDialog(error.reason);
                    return;
                  }
                },
              );
            });
          });
        } else if (avatarChange && !avatarImage) {
          Meteor.call('setAvatarEmpty', (error, respond) => {
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
          unSavedImageChange: false,
        });

        successDialog('Your images are successfully  saved');
        setTimeout(
          () =>
            this.setState({
              progress: null,
              isEditDialogOpen: false,
            }),
          2000,
        );
      },
    );
  };

  setGeoLocationCoords = (coords) => {
    console.log(coords);
    const theCoords = {
      latitude: coords.latitude.toString(),
      longitude: coords.longitude.toString(),
      accuracy: coords.accuracy.toString(),
    };
    Meteor.call(
      'setGeoLocationCoords',
      theCoords,
      (error, respond) => {
        if (error) {
          console.log(error);
          errorDialog(error.reason);
          return;
        }
      },
    );
  };

  render() {
    const { currentUser } = this.context;
    const {
      isEditDialogOpen,
      coverImages,
      avatarImage,
      unSavedImageChange,
      unSavedInfoChange,
      uploadingImages,
      progress,
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

        {progress && (
          <ActivityIndicator
            toast
            text="Proccesing your changes..."
            animating={this.state.animating}
          />
        )}

        <Fragment>
          <Carousel
            autoplay={false}
            // infinite
            style={{ minHeight: 180 }}
          >
            {currentUser.coverImages &&
              currentUser.coverImages.map((image) => (
                <div key={image.url} style={slideStyle(image.url)} />
              ))}
          </Carousel>

          <WingBlank>
            <Flex>
              <div
                style={avatarStyle(
                  currentUser &&
                    currentUser.avatar &&
                    currentUser.avatar.url,
                )}
              />
              <div>
                <h4>
                  {currentUser.firstName + ' ' + currentUser.lastName}
                </h4>
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
            handleRemoveImage={(index) =>
              this.handleRemoveImage(index)
            }
            handleAvatarImagePick={this.handleAvatarImagePick}
            handleSaveImages={this.handleSaveImages}
            handleTabClick={(tab, index) =>
              this.setState({ openTab: index })
            }
            setGeoLocationCoords={this.setGeoLocationCoords}
          />
        </Modal>
      </div>
    );
  }
}

const slideStyle = (backgroundImage) => ({
  width: '100%',
  height: '40vh',
  minHeight: 180,
  backgroundImage: `url('${backgroundImage}')`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  touchAction: 'none',
});

const avatarStyle = (backgroundImage) => ({
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
  boxShadow: '0 0 5px',
});

Profile.contextType = UserContext;

export default Profile;
