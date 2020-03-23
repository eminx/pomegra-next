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
  WingBlank
} from 'antd-mobile';
import { createForm } from 'rc-form';
import Dropzone from 'react-dropzone';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';

import allLanguages from '../allLanguages';

const Item = List.Item;

class EditProfileUI extends Component {
  state = {
    languages: []
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

    this.props.setUnSavedInfoChange();
  };

  handleRemoveLanguage = languageValue => {
    const { languages } = this.state;
    const newLanguages = languages.filter(
      language => languageValue !== language.value
    );
    this.setState({
      languages: newLanguages
    });

    this.props.setUnSavedInfoChange();
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

  render() {
    const {
      currentUser,
      coverImages,
      avatarImage,
      uploadingImages,
      unSavedImageChange,
      unSavedInfoChange,
      setUnSavedInfoChange,
      onSortEnd,
      handleCoverImagePick,
      handleRemoveImage,
      handleAvatarImagePick,
      handleSaveImages,
      handleTabClick,
      openTab
    } = this.props;
    const { getFieldProps, getFieldError } = this.props.form;
    const { languages } = this.state;

    return (
      <div>
        <Tabs
          tabs={[{ title: 'Images' }, { title: 'Info' }]}
          page={openTab}
          onTabClick={handleTabClick}
          swipeable={false}
          animated={false}
        >
          <div style={{ marginBottom: 80 }}>
            {uploadingImages && 'uploading images...'}
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
                  handleRemoveImage={() => handleRemoveImage(index)}
                />
              ))}
            </SortableContainer>

            <WingBlank>
              <Dropzone
                onDrop={handleCoverImagePick}
                accepted={['image/jpeg', 'image/jpg', 'image/png']}
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
                      ''
                    )}
                  </div>
                )}
              </Dropzone>
            </WingBlank>

            <WhiteSpace size="lg" />

            <h3>Avatar</h3>
            <WingBlank>
              <ImagePicker
                files={avatarImage || []}
                onChange={handleAvatarImagePick}
                selectable={avatarImage && avatarImage.length < 1}
                accept="image/jpeg,image/jpg,image/png"
              />
            </WingBlank>

            <WhiteSpace size="lg" />

            <Item>
              <Button
                type="primary"
                onClick={handleSaveImages}
                disabled={!unSavedImageChange}
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
                  onChange: setUnSavedInfoChange
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
                  onChange: setUnSavedInfoChange
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
                  onChange: setUnSavedInfoChange
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
        </Tabs>
        <WhiteSpace size={100} />
      </div>
    );
  }
}

const SortableItem = sortableElement(({ image, index, handleRemoveImage }) => {
  const handleRemoveClick = event => {
    console.log(event);
    event.stopPropagation();
    event.preventDefault();
    handleRemoveImage();
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
  width: '100%',
  backgroundColor: '#fff',
  padding: 12,
  marginTop: 24,
  borderRadius: 5,
  border: '#108ee9 1px solid',
  color: '#108ee9'
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
  float: 'right',
  margin: 2,
  color: '#1b1b1b',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, .3)',
  cursor: 'pointer'
};

const EditProfile = createForm()(EditProfileUI);

export default EditProfile;
