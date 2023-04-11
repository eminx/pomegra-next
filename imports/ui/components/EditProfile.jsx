import React, { Component, Fragment } from "react";
import {
  List,
  Flex,
  Icon,
  ImagePicker,
  Button,
  InputItem,
  Tag,
  Picker,
  TextareaItem,
  Tabs,
  WhiteSpace,
  WingBlank,
} from "antd-mobile";
import { createForm } from "rc-form";
import { Subtitle } from "bloomer";
import Dropzone from "react-dropzone";
import { sortableContainer, sortableElement } from "react-sortable-hoc";

import allLanguages from "../../api/_utils/langs/allLanguages";

const Item = List.Item;

class EditProfileUI extends Component {
  state = {
    languages: [],
  };

  componentDidMount() {
    const { currentUser } = this.props;
    if (!currentUser) {
      return;
    }
    this.setState({
      languages: currentUser.languages || [],
    });
  }

  handleLanguageSelect = (selectedLanguages) => {
    const selectedLanguageValue = selectedLanguages[0];
    const { languages } = this.state;

    if (
      languages.some((language) => language.value === selectedLanguageValue)
    ) {
      return;
    }

    const selectedLanguage = allLanguages.find(
      (language) => language && language.value === selectedLanguageValue
    );

    const newLanguages = [...languages, selectedLanguage];
    this.setState({
      languages: newLanguages,
    });

    this.props.setUnSavedInfoChange();
  };

  handleRemoveLanguage = (languageValue) => {
    const { languages } = this.state;
    const newLanguages = languages.filter(
      (language) => languageValue !== language.value
    );
    this.setState({
      languages: newLanguages,
    });

    this.props.setUnSavedInfoChange();
  };

  handleDetailsFormSubmit = () => {
    const { languages } = this.state;
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        const values = this.props.form.getFieldsValue();
        this.props.onSubmit(values, languages);
      } else {
        alert("Validation failed");
      }
    });
  };

  onReset = () => {
    this.props.form.resetFields();
  };

  validateAccount = (rule, value, callback) => {
    if (value && value.length > 3) {
      callback();
    } else {
      callback(new Error("At least four characters for account"));
    }
  };

  render() {
    const {
      currentUser,
      avatar,
      coverImages,
      uploadingImages,
      unSavedAvatarChange,
      unSavedCoverChange,
      unSavedInfoChange,
      setUnSavedInfoChange,
      onSortEnd,
      handleCoverPick,
      handleRemoveCover,
      handleAvatarPick,
      handleSaveAvatar,
      handleSaveCovers,
      handleTabClick,
      openTab,
      setGeoLocationCoords,
      savingAvatar,
      savingCover,
    } = this.props;
    const { getFieldProps, getFieldError } = this.props.form;
    const { languages } = this.state;

    const getGeoLocation = () => {
      const geolocation = navigator.geolocation;
      geolocation &&
        geolocation.getCurrentPosition((position) => {
          setGeoLocationCoords(position.coords);
        });
    };

    return (
      <div>
        <Tabs
          tabs={[{ title: "Images" }, { title: "Info" }, { title: "Location" }]}
          page={openTab}
          onTabClick={handleTabClick}
          swipeable={false}
          animated={false}
        >
          <div>
            <h3>Avatar</h3>
            <WingBlank>
              <Flex align="stretch" direction="column">
                <Flex justify="center">
                  <ImagePicker
                    files={avatar ? [avatar] : []}
                    onChange={handleAvatarPick}
                    selectable={!avatar}
                    accept="image/jpeg,image/jpg,image/png"
                    multiple={false}
                    length={1}
                    style={{
                      width: 120,
                    }}
                  />
                </Flex>
                <Button
                  type="primary"
                  onClick={handleSaveAvatar}
                  disabled={!unSavedAvatarChange}
                  loading={savingAvatar}
                >
                  Save Avatar
                </Button>
              </Flex>
            </WingBlank>

            <WhiteSpace size="xl" />

            <h3>Cover Images</h3>

            <SortableContainer
              onSortEnd={onSortEnd}
              axis="xy"
              helperClass="sortableHelper"
              pressDelay={250}
            >
              {coverImages.map((image, index) => (
                <SortableItem
                  key={image.url}
                  index={index}
                  image={image}
                  handleRemoveCover={() => handleRemoveCover(index)}
                />
              ))}
            </SortableContainer>

            <WingBlank>
              <Dropzone
                onDrop={handleCoverPick}
                accepted={["image/jpeg", "image/jpg", "image/png"]}
                multiple
                noDrag
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} style={pickerStyle}>
                    {!uploadingImages ? (
                      <div>
                        <input {...getInputProps()} />
                        Select images from your device
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </Dropzone>
            </WingBlank>

            <WhiteSpace size="lg" />

            <Item>
              <Button
                type="primary"
                onClick={handleSaveCovers}
                disabled={!unSavedCoverChange}
                loading={savingCover}
              >
                Save Cover Images
              </Button>
            </Item>
          </div>
          <div>
            <List renderHeader={() => "Edit your details"}>
              <InputItem value={currentUser.username} editable={false} disabled>
                Username
              </InputItem>

              <InputItem
                {...getFieldProps("firstName", {
                  rules: [
                    {
                      required: false,
                      message: "please enter your first name",
                    },
                  ],
                  initialValue: currentUser.firstName,
                  onChange: setUnSavedInfoChange,
                })}
                clear
                // error={!!getFieldError('firstName')}
                placeholder="first name"
              >
                First name
              </InputItem>

              <InputItem
                {...getFieldProps("lastName", {
                  initialValue: currentUser.lastName,
                  onChange: setUnSavedInfoChange,
                })}
                clear
                // error={!!getFieldError('lastName')}
                placeholder="last name"
              >
                Last name
              </InputItem>

              <TextareaItem
                {...getFieldProps("bio", {
                  initialValue: currentUser.bio,
                  onChange: setUnSavedInfoChange,
                })}
                title="Bio"
                placeholder="bio"
                rows={5}
              />

              <Picker
                {...getFieldProps("language")}
                data={allLanguages}
                cols={1}
                okText="Confirm"
                dismissText="Cancel"
                extra="add language"
                onOk={this.handleLanguageSelect}
              >
                <Item arrow="horizontal">Languages</Item>
              </Picker>

              <WhiteSpace />

              <div>
                {languages.map((language) => (
                  <Tag
                    key={language.value}
                    style={{ margin: 8, color: "#000" }}
                    closable
                    onClose={() => this.handleRemoveLanguage(language.value)}
                  >
                    {language.label}
                  </Tag>
                ))}
              </div>

              <WhiteSpace size="lg" />

              <Item>
                <Button
                  type="primary"
                  onClick={this.handleDetailsFormSubmit}
                  disabled={!unSavedInfoChange}
                >
                  Save
                </Button>
              </Item>
            </List>
          </div>

          <div>
            <WingBlank>
              <WhiteSpace />
              <p>
                We will use your location in order to find books that are
                located close to you so you can go pick them up.
              </p>
              <WhiteSpace />
              {currentUser.geoLocationCoords ? (
                <Fragment>
                  <Subtitle isSize={6}>Your location is set</Subtitle>
                  <WhiteSpace size="lg" />
                  <Button onClick={() => getGeoLocation()}>
                    Update Your Location
                  </Button>
                </Fragment>
              ) : (
                <Button type="primary" onClick={() => getGeoLocation()}>
                  Set Your Location
                </Button>
              )}
            </WingBlank>
          </div>
        </Tabs>
        <WhiteSpace size={100} />
      </div>
    );
  }
}

const SortableItem = sortableElement(({ image, index, handleRemoveCover }) => {
  const handleRemoveClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    handleRemoveCover();
  };

  return (
    <div key={image.url} style={thumbStyle(image.url)}>
      <Icon type="cross" style={thumbIconStyle} onClick={handleRemoveClick} />
    </div>
  );
});

const SortableContainer = sortableContainer(({ children }) => {
  return (
    <Flex justify="center" wrap="wrap">
      {children}
    </Flex>
  );
});

const pickerStyle = {
  width: "100%",
  height: 48,
  backgroundColor: "#fff",
  padding: 12,
  marginTop: 12,
  borderRadius: 5,
  border: "#108ee9 1px solid",
  color: "#108ee9",
};

const thumbStyle = (backgroundImage) => ({
  flexBasis: 120,
  height: 80,
  margin: 8,
  backgroundImage: `url('${backgroundImage}')`,
  backgroundPosition: "center",
  backgroundSize: "cover",
  borderRadius: 5,
  border: "1px solid #fff",
});

const thumbIconStyle = {
  width: 24,
  height: 24,
  float: "right",
  margin: 2,
  color: "#1b1b1b",
  borderRadius: "50%",
  backgroundColor: "rgba(255, 255, 255, .3)",
  cursor: "pointer",
};

const EditProfile = createForm()(EditProfileUI);

export default EditProfile;
