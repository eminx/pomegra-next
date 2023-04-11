import React, { Fragment, PureComponent } from "react";
import { Button, Modal, ProgressBar, Swiper } from "antd-mobile";
import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react";
import { Tag } from "bloomer";
import arrayMove from "array-move";

import EditProfile from "../components/EditProfile";
import {
  errorDialog,
  successDialog,
  resizeImage,
  uploadImage,
  call,
} from "../../api/_utils/functions";

import { UserContext } from "../Layout";

class Profile extends PureComponent {
  state = {
    avatar: null,
    coverImages: [],
    parsedAvatarImage: [],
    isEditDialogOpen: false,
    uploadingImages: false,
    progress: null,
    uploadingCoverImages: false,
    uploadingAvatarImage: false,
    unSavedAvatarChange: false,
    unSavedCoverChange: false,
    unSavedInfoChange: false,
    savingAvatar: false,
    savingCover: false,
  };

  openEditDialog = () => {
    const { currentUser } = this.context;
    if (!currentUser) {
      return;
    }

    this.setState({
      isEditDialogOpen: true,
      coverImages:
        currentUser?.coverImages?.map((cover) => ({
          url: cover,
          isNewImage: false,
        })) || [],
      avatar: currentUser.avatar,
    });
  };

  closeEditDialog = () => {
    const { unSavedInfoChange, unSavedAvatarChange, unSavedCoverChange } =
      this.state;

    const closeEditDialog = () => {
      this.setState({
        isEditDialogOpen: false,
        coverImages: [],
        avatar: null,
        unSavedAvatarChange: false,
        unSavedCoverChange: false,
        uploadingImages: false,
        unSavedInfoChange: false,
      });
    };

    let changedTab = false;
    if (unSavedInfoChange && unSavedAvatarChange && unSavedCoverChange) {
      changedTab = "images and info sections";
    } else if (unSavedInfoChange) {
      changedTab = "info section";
    } else if (unSavedAvatarChange || unSavedCoverChange) {
      changedTab = "images section";
    }

    if (changedTab) {
      Modal.alert(
        `You have unsaved changes in your ${changedTab}`,
        "Are you sure you want to skip them?",
        [
          { text: "Cancel", onPress: () => null },
          {
            text: "Yes",
            onPress: () => closeEditDialog(),
          },
        ]
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
    try {
      call("updateProfile", values, languages);
      successDialog("Your profile is successfully updated");
      this.setState({
        unSavedInfoChange: false,
      });
    } catch (error) {
      console.log(error);
      errorDialog(error.reason);
    }
  };

  handleAvatarPick = (images, type, index) => {
    if (type === "remove") {
      this.setState({
        avatar: null,
        unSavedAvatarChange: true,
      });
      return;
    }
    this.setState({
      avatar: images[0],
      unSavedAvatarChange: true,
    });
  };

  saveAvatar = async () => {
    const { avatar } = this.state;

    this.setState({
      savingAvatar: true,
    });

    try {
      const resizedAvatar = await resizeImage(avatar.file, 300);
      const uploadedAvatar = await uploadImage(
        resizedAvatar,
        "profileImageUpload"
      );
      const avatarToSave = {
        name: avatar.file.name,
        url: uploadedAvatar,
        uploadDate: new Date(),
      };
      await call("setNewAvatar", avatarToSave);
      successDialog("Your avatar is successfully updated");
    } catch (error) {
      console.log(error);
      errorDialog(error.reason);
    } finally {
      this.setState({
        savingAvatar: false,
        unSavedAvatarChange: false,
      });
    }
  };

  handleCoverPick = (pickedImages) => {
    const { coverImages } = this.state;

    const imageSet = pickedImages?.map((image) => ({
      file: image,
      url: URL.createObjectURL(image),
      isNewImage: true,
    }));

    this.setState({
      coverImages: [...coverImages, ...imageSet],
      unSavedCoverChange: true,
    });
  };

  handleRemoveCover = (imageIndex) => {
    const { coverImages } = this.state;
    this.setState({
      coverImages: coverImages.filter((image, index) => imageIndex !== index),
      unSavedCoverChange: true,
    });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) {
      return;
    }

    this.setState(({ coverImages }) => ({
      coverImages: arrayMove(coverImages, oldIndex, newIndex),
      unSavedCoverChange: true,
      coverChange: true,
    }));
  };

  saveCoverImages = async () => {
    this.setState({
      savingCover: true,
    });

    const { coverImages } = this.state;

    try {
      const imagesReadyToSave = await Promise.all(
        coverImages?.map(async (cover, index) => {
          if (!cover.isNewImage) {
            return cover.url;
          }
          const resizedImage = await resizeImage(cover.file, 1200);
          const uploadedImageUrl = await uploadImage(
            resizedImage,
            "coverUpload"
          );
          return uploadedImageUrl;
        })
      );
      await call("setNewCoverImages", imagesReadyToSave);
      successDialog("Your cover images are successfully updated");
    } catch (error) {
      console.error("Error uploading:", error);
      errorDialog(error.reason);
    } finally {
      this.setState({
        savingCover: false,
        unSavedCoverChange: false,
      });
    }
  };

  handleAvatarImageRemove = (images, type, index) => {
    this.setState({
      avatarImage: null,
      unSavedAvatarChange: true,
      avatarChange: true,
    });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) {
      return;
    }

    this.setState(({ coverImages }) => ({
      coverImages: arrayMove(coverImages, oldIndex, newIndex),
      unSavedCoverChange: true,
    }));
  };

  setGeoLocationCoords = (coords) => {
    const theCoords = {
      latitude: coords.latitude.toString(),
      longitude: coords.longitude.toString(),
      accuracy: coords.accuracy.toString(),
    };

    try {
      call("setGeoLocationCoords", theCoords);
      successDialog("Your location is successfully set");
    } catch (error) {
      console.log(error);
      errorDialog(error.reason);
    }
  };

  render() {
    const { currentUser } = this.context;
    const {
      isEditDialogOpen,
      avatar,
      coverImages,
      unSavedAvatarChange,
      unSavedCoverChange,
      unSavedInfoChange,
      uploadingImages,
      progress,
      savingAvatar,
      savingCover,
    } = this.state;

    if (!currentUser) {
      return null;
    }

    return (
      <div style={{ height: "100%", marginBottom: 80 }}>
        {progress && <ProgressBar percent={progress} />}

        {/* {progress && (
          <ActivityIndicator
            toast
            text="Proccesing your changes..."
            animating={this.state.animating}
          />
        )} */}

        <Fragment>
          <Swiper autoplay={false} infinite style={{ minHeight: 180 }}>
            {currentUser?.coverImages &&
              currentUser.coverImages
                .map((cover) => ({ url: cover }))
                .map((image) => (
                  <div key={image.url} style={slideStyle(image.url)} />
                ))}
          </Swiper>

          <div>
            {/* <WhiteSpace size="md" /> */}
            <Flex>
              <Box>
                <Flex direction="column" align="center">
                  <Avatar
                    size="xl"
                    name={currentUser.username}
                    src={currentUser.avatar && currentUser.avatar.url}
                  />
                  <Text fontSize="xl">{currentUser.username}</Text>
                </Flex>
              </Box>
              {/* <WhiteSpace size="md" /> */}
              <Box>
                <Text fontSize="lg">
                  {currentUser.firstName + " " + currentUser.lastName}
                </Text>
                <Text fontSize="md">{currentUser.bio}</Text>
              </Box>
            </Flex>
            {/* <WhiteSpace size="md" /> */}

            <Stack direction="row" justify="center" wrap="wrap">
              {currentUser?.languages?.map((language) => (
                <Tag key={language.value} isColor="warning" isSize="small">
                  {language.label.toUpperCase()}{" "}
                </Tag>
              ))}
            </Stack>

            {/* <WhiteSpace size="lg" /> */}

            <Button onClick={this.openEditDialog}>Edit</Button>
          </div>
        </Fragment>

        <Modal
          visible={currentUser && isEditDialogOpen}
          closable
          onClose={this.closeEditDialog}
          title="Edit Your Profile"
        >
          <EditProfile
            currentUser={currentUser}
            onSubmit={this.updateProfile}
            coverImages={coverImages}
            avatar={avatar}
            savingAvatar={savingAvatar}
            savingCover={savingCover}
            uploadingImages={uploadingImages}
            unSavedAvatarChange={unSavedAvatarChange}
            unSavedCoverChange={unSavedCoverChange}
            unSavedInfoChange={unSavedInfoChange}
            setUnSavedInfoChange={this.setUnSavedInfoChange}
            onSortEnd={this.onSortEnd}
            handleAvatarPick={this.handleAvatarPick}
            handleCoverPick={this.handleCoverPick}
            handleRemoveCover={this.handleRemoveCover}
            handleSaveAvatar={this.saveAvatar}
            handleSaveCovers={this.saveCoverImages}
            handleTabClick={(tab, index) => this.setState({ openTab: index })}
            setGeoLocationCoords={this.setGeoLocationCoords}
          />
        </Modal>
      </div>
    );
  }
}

const slideStyle = (backgroundImage) => ({
  width: "100%",
  height: "40vh",
  minHeight: 180,
  backgroundImage: `url('${backgroundImage}')`,
  backgroundPosition: "center",
  backgroundSize: "cover",
  touchAction: "none",
});

Profile.contextType = UserContext;

export default Profile;
