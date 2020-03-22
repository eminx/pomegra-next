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
  WhiteSpace,
  Progress
} from 'antd-mobile';
import { createForm } from 'rc-form';
import Resizer from 'react-image-file-resizer';
import Dropzone from 'react-dropzone';

import allLanguages from '../allLanguages';
import { dataURLtoFile } from '../functions';

const Item = List.Item;

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

class EditProfileUI extends Component {
  state = {
    languages: [],
    openTab: 0,
    coverImages: [],
    avatarImage: [],
    parsedAvatarImage: [],
    uploadingImages: false,
    progress: 0,
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
      languages: currentUser.languages || [],
      coverImages: currentUser.coverImages || []
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

  handleCoverImagePick = pickedImages => {
    const { coverImages } = this.state;
    const imageSet = pickedImages.map(image => ({
      file: image,
      dataUrl: URL.createObjectURL(image),
      isNewImage: true
    }));
    this.setState({
      coverImages: [...coverImages, ...imageSet]
    });
  };

  handleRemoveImage = imageIndex => {
    const { coverImages } = this.state;

    this.setState({
      coverImages: coverImages.filter((image, index) => imageIndex !== index)
    });
  };

  handleAvatarImagePick = (images, type, index) => {
    this.setState({
      avatarImage: images
    });
  };

  handleSaveImages = () => {
    this.resizeImages();
  };

  resizeImages = () => {
    const { coverImages, progress } = this.state;
    this.setState({
      uploadingImages: true,
      progress: 5
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
              this.setState({ uploadedImages }, () => this.setNewCoverImages());
          });
        },
        'base64'
      );
    });
  };

  setNewCoverImages = () => {
    const { uploadedImages, coverImages } = this.state;
    const newImageSet = coverImages
      .filter(image => !image.file)
      .concat(uploadedImages);

    Meteor.call('setNewCoverImages', newImageSet, (error, respond) => {
      if (error) {
        console.log(error);
        return;
      }
      this.setState({
        progress: 100,
        uploadingImages: false
      });
    });
  };

  render() {
    const { currentUser, isAnyValueChanged } = this.props;
    const { getFieldProps, getFieldError } = this.props.form;
    const {
      languages,
      openTab,
      coverImages,
      avatarImage,
      uploadingImages,
      progress
    } = this.state;

    return (
      <div>
        <Progress percent={progress} />
        <Tabs
          tabs={[{ title: 'Images' }, { title: 'Info' }]}
          page={openTab}
          onTabClick={(tab, index) => {
            this.setState({ openTab: index });
          }}
        >
          <div>
            {uploadingImages && 'resizing cover images...'}
            <h2>Manage Your Images</h2>
            <h3>Cover Images</h3>
            {coverImages.map(image => (
              <img
                key={image.url}
                width={80}
                height={60}
                src={image.dataUrl || image.url}
              />
            ))}

            <Dropzone
              onDrop={this.handleCoverImagePick}
              accepted={['image/jpeg', 'image/jpg', 'image/png']}
              multiple
              noDrag
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Button>Select Images</Button>
                  </div>
                </section>
              )}
            </Dropzone>

            <WhiteSpace size="lg" />

            <h3>Avatar</h3>
            <ImagePicker
              files={avatarImage}
              onChange={this.handleAvatarImagePick}
              selectable={avatarImage && avatarImage.length < 1}
              accept="image/jpeg,image/jpg,image/png"
            />

            <WhiteSpace size="lg" />

            <Item>
              <Button type="parimary" onClick={this.handleSaveImages}>
                Upload & Save
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
        <WhiteSpace size={100} />
      </div>
    );
  }
}

const EditProfile = createForm()(EditProfileUI);

export default EditProfile;
