import React, { Component } from 'react';
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
  Progress,
  WingBlank
} from 'antd-mobile';
import { createForm } from 'rc-form';
import Resizer from 'react-image-file-resizer';
import Dropzone from 'react-dropzone';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

import allLanguages from '../allLanguages';
import { dataURLtoFile, successDialog } from '../functions';

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
    uploadingAvatarImage: false,
    isImagesUpdated: false
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
      url: URL.createObjectURL(image),
      isNewImage: true
    }));
    this.setState({
      coverImages: [...coverImages, ...imageSet],
      isImagesUpdated: true
    });
  };

  handleRemoveImage = imageIndex => {
    console.log(imageIndex);
    const { coverImages } = this.state;

    this.setState({
      coverImages: coverImages.filter((image, index) => imageIndex !== index),
      isImagesUpdated: true
    });
  };

  handleAvatarImagePick = (images, type, index) => {
    this.setState({
      avatarImage: images,
      isImagesUpdated: true
    });
  };

  handleAvatarImageRemove = (images, type, index) => {
    this.setState({
      avatarImage: images,
      isImagesUpdated: true
    });
  };

  handleSaveImages = () => {
    const { coverImages } = this.state;

    this.setState({
      progress: 5
    });

    isThereNewImage = coverImages.some(image => image.isNewImage);
    if (isThereNewImage) {
      this.resizeImages();
    } else {
      this.setNewCoverImages();
    }

    this.resizeImages();
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
              this.setState({ uploadedImages }, () => this.setNewCoverImages());
          });
        },
        'base64'
      );
    });
  };

  setNewCoverImages = () => {
    const { uploadedImages, coverImages } = this.state;

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
        return;
      }
      this.setState({
        progress: 100,
        uploadingImages: false
      });
      successDialog('Your images are successfully  saved');
    });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ coverImages }) => ({
      coverImages: arrayMove(coverImages, oldIndex, newIndex),
      isImagesUpdated: true
    }));
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
      progress,
      isImagesUpdated
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
          swipeable={false}
          animated={false}
        >
          <div style={{ marginBottom: 80 }}>
            {uploadingImages && 'uploading images...'}
            <h3>Cover Images</h3>

            <SortableContainer
              onSortEnd={this.onSortEnd}
              axis="xy"
              helperClass="sortableHelper"
            >
              {coverImages.map((image, index) => (
                <SortableItem
                  key={image.url}
                  index={index}
                  image={image}
                  handleRemoveImage={() => this.handleRemoveImage(index)}
                />
              ))}
            </SortableContainer>

            <WingBlank>
              <Dropzone
                onDrop={this.handleCoverImagePick}
                accepted={['image/jpeg', 'image/jpg', 'image/png']}
                multiple
                noDrag
              >
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()} style={pickerStyle}>
                      <input {...getInputProps()} />
                      Select images from your device
                    </div>
                  </section>
                )}
              </Dropzone>
            </WingBlank>

            <WhiteSpace size="lg" />

            <h3>Avatar</h3>
            <WingBlank>
              <ImagePicker
                files={avatarImage || []}
                onChange={this.handleAvatarImagePick}
                selectable={avatarImage && avatarImage.length < 1}
                accept="image/jpeg,image/jpg,image/png"
              />
            </WingBlank>

            <WhiteSpace size="lg" />

            <Item>
              <Button
                type="primary"
                onClick={this.handleSaveImages}
                disabled={!isImagesUpdated}
              >
                Save
              </Button>
            </Item>
          </div>
          <div style={{ marginBottom: 80 }}>
            <List renderHeader={() => 'Edit your details'}>
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
                <Button type="primary" onClick={this.handleDetailsFormSubmit}>
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

const SortableItem = sortableElement(({ image, index, handleRemoveImage }) => {
  return (
    <div key={image.url} style={thumbStyle(image.url)}>
      <Icon type="cross" style={thumbIconStyle} onClick={handleRemoveImage} />
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
  width: '100%',
  backgroundColor: '#108ee9',
  padding: 12,
  marginTop: 24,
  borderRadius: 5,
  color: 'white'
};

const thumbStyle = backgroundImage => ({
  flexBasis: 120,
  height: 80,
  margin: 8,
  backgroundImage: `url('${backgroundImage}')`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  borderRadius: 5,
  border: '1px solid #fff'
});

const thumbIconStyle = {
  width: 24,
  height: 24,
  margin: 2,
  float: 'right',
  color: '#1b1b1b',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, .3)'
};

const EditProfile = createForm()(EditProfileUI);

export default EditProfile;
