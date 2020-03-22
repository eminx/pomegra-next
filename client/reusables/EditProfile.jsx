import React, { Component } from 'react';
import {
  List,
  ImagePicker,
  Button,
  InputItem,
  Tag,
  Picker,
  TextareaItem,
  Tabs,
  WhiteSpace
} from 'antd-mobile';
import { createForm } from 'rc-form';
import Resizer from 'react-image-file-resizer';

import allLanguages from '../allLanguages';
import { dataURLtoFile } from '../functions';

const Item = List.Item;

const resizedImageWidth = 800;

function uploadProfileImage(image, callback) {
  const upload = new Slingshot.Upload('groupImageUpload');

  upload.send(image, (error, downloadUrl) => {
    if (error) {
      callback(error);
    } else {
      callback(error, downloadUrl);
    }
  });
}

class EditProfileUI extends Component {
  state = {
    languages: [],
    openTab: 0,
    coverImages: [],
    avatarImage: [],
    newCoverImages: [],
    parsedAvatarImage: [],
    resizingCoverImages: false,
    resizingAvatarImage: false,
    uploadingCoverImages: false,
    uploadingAvatarImage: false
  };

  componentDidMount() {
    const { currentUser } = this.props;
    if (!currentUser) {
      return;
    }
    this.setState({
      languages: currentUser.languages || []
    });
  }

  handleLanguageSelect = selectedLanguages => {
    const selectedLanguageValue = selectedLanguages[0];
    const { languages } = this.state;

    if (languages.some(language => language.value === selectedLanguageValue)) {
      return;
    }

    const selectedLanguage = allLanguages.find(
      language => language && language.value === selectedLanguageValue
    );

    const newLanguages = [...languages, selectedLanguage];
    this.setState({
      languages: newLanguages
    });

    this.props.isAnyValueChanged();
  };

  handleRemoveLanguage = languageValue => {
    const { languages } = this.state;
    const newLanguages = languages.filter(
      language => languageValue !== language.value
    );
    this.setState({
      languages: newLanguages
    });

    this.props.isAnyValueChanged();
  };

  handleDetailsFormSubmit = () => {
    const { languages } = this.state;
    this.props.form.validateFields({ force: true }, error => {
      if (!error) {
        const values = this.props.form.getFieldsValue();
        this.props.onSubmit(values, languages);
      } else {
        alert('Validation failed');
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
      callback(new Error('At least four characters for account'));
    }
  };

  handleCoverImagePick = (images, type, index) => {
    console.log(images, type, index);
    this.setState({
      coverImages: images
    });
  };

  handleAvatarImagePick = (images, type, index) => {
    console.log(images, type, index);
    this.setState({
      avatarImage: images
    });
  };

  handleSaveImages = () => {
    this.resizeImages();
  };

  resizeImages = () => {
    const { coverImages } = this.state;
    this.setState({
      resizingCoverImages: true
    });

    const uploadedImages = [];

    coverImages.forEach((image, index) => {
      Resizer.imageFileResizer(
        image.file,
        resizedImageWidth,
        (resizedImageWidth * image.height) / image.width,
        'JPEG',
        95,
        0,
        uri => {
          const uploadableImage = dataURLtoFile(uri, image.file.name);
          console.log(uploadableImage);
          uploadProfileImage(uploadableImage, (error, respond) => {
            if (error) {
              console.log('error!', error);
            }
            console.log(respond);
            uploadedImages.push({
              imageUrl: respond,
              name: image.file.name
            });
            coverImages.length === index + 1 &&
              this.setState(
                {
                  resizingCoverImages: false,
                  uploadedImages
                },
                () => this.addImageToProfile()
              );
          });
        },
        'base64'
      );
    });
  };

  addImageToProfile = () => {
    const { uploadedImages } = this.state;

    Meteor.call(
      'setUploadedImagesToProfile',
      uploadedImages,
      (error, respond) => {
        if (error) {
          console.log(error);
        }
        console.log(respond);
      }
    );
  };

  uploadNewImages = () => {
    const { newCoverImages } = this.state;
    newCoverImages.forEach(image => {
      uploadProfileImage(image, (error, respond) => {
        if (error) {
          console.log('error!', error);
        }
        console.log(respond);
      });
    });
  };

  parseCoverImagesTogether = () => {
    const { currentUser } = this.props;
    const { newCoverImages } = this.state;
    if (!currentUser.coverImages) {
      return newCoverImages;
    }
  };

  render() {
    const { currentUser, isAnyValueChanged } = this.props;
    const { getFieldProps, getFieldError } = this.props.form;
    const {
      languages,
      openTab,
      coverImages,
      avatarImage,
      resizingCoverImages
    } = this.state;

    return (
      <div>
        <Tabs
          tabs={[{ title: 'Images' }, { title: 'Info' }]}
          page={openTab}
          onTabClick={(tab, index) => {
            this.setState({ openTab: index });
          }}
        >
          <div>
            {resizingCoverImages && 'resizing cover images...'}
            <h2>Manage Your Images</h2>
            <h3>Cover Images</h3>
            <h4>Current Cover Images</h4>
            {}

            <h4>New Cover Images</h4>
            <ImagePicker
              files={coverImages.map(file => ({ url: file.url }))}
              onChange={this.handleCoverImagePick}
              onImageClick={(index, fs) => console.log(index, fs)}
              selectable={coverImages.length < 8}
              accept="image/jpeg,image/jpg,image/png"
              multiple
            />

            <WhiteSpace size="lg" />

            <h3>Avatar</h3>
            <ImagePicker
              files={avatarImage}
              onChange={this.handleAvatarImagePick}
              onImageClick={(index, fs) => console.log(index, fs)}
              selectable={avatarImage.length < 1}
              accept="image/jpeg,image/jpg,image/png"
            />

            <WhiteSpace size="lg" />

            <Item>
              <Button type="ghost" onClick={this.handleSaveImages}>
                Save
              </Button>
            </Item>
          </div>
          <div>
            <List
              renderHeader={() => 'Edit your details'}
              renderFooter={() =>
                getFieldError('account') && getFieldError('account').join(',')
              }
            >
              <InputItem value={currentUser.username} editable={false}>
                username
              </InputItem>

              <InputItem
                {...getFieldProps('firstName', {
                  rules: [
                    { required: false, message: 'please enter your first name' }
                  ],
                  initialValue: currentUser.firstName,
                  onChange: isAnyValueChanged
                })}
                clear
                // error={!!getFieldError('firstName')}
                placeholder="first name"
              >
                first name
              </InputItem>

              <InputItem
                {...getFieldProps('lastName', {
                  initialValue: currentUser.lastName,
                  onChange: isAnyValueChanged
                })}
                clear
                // error={!!getFieldError('lastName')}
                placeholder="last name"
              >
                last name
              </InputItem>

              <TextareaItem
                {...getFieldProps('bio', {
                  initialValue: currentUser.bio,
                  onChange: isAnyValueChanged
                })}
                title="bio"
                placeholder="bio"
                rows={5}
              />

              <Picker
                {...getFieldProps('language')}
                data={allLanguages}
                cols={1}
                okText="Confirm"
                dismissText="Cancel"
                extra="add language"
                onOk={this.handleLanguageSelect}
              >
                <Item arrow="horizontal">spoken languages</Item>
              </Picker>

              <WhiteSpace />

              <div>
                {languages.map(language => (
                  <Tag
                    key={language.value}
                    style={{ margin: 8 }}
                    closable
                    onClose={() => this.handleRemoveLanguage(language.value)}
                  >
                    {language.label}
                  </Tag>
                ))}
              </div>

              <Item>
                <Button type="ghost" onClick={this.handleDetailsFormSubmit}>
                  Save
                </Button>
              </Item>
            </List>
          </div>
        </Tabs>
        <WhiteSpace size={30} />
      </div>
    );
  }
}

const EditProfile = createForm()(EditProfileUI);

export default EditProfile;
