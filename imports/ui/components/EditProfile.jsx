import React, { useState, Fragment } from 'react';
import { Button, Form, Input, ImageUploader, Picker, Tabs, TextArea } from 'antd-mobile';
import { Box, Center, Flex, Stack, Tag, TagCloseButton, Text } from '@chakra-ui/react';
import { Subtitle } from 'bloomer';
import { shallowEqualArrays } from 'shallow-equal';

import allLanguages from '../../api/_utils/langs/allLanguages';
import {
  errorDialog,
  successDialog,
  resizeImage,
  uploadImage,
  call,
} from '../../api/_utils/functions';
import FilePicker from './FilePicker';

const { Tab } = Tabs;

const imageModel = {
  uploadableImage: null,
  uploadableImageLocal: null,
};

function EditProfile({ currentUser, updateUser }) {
  const [image, setImage] = useState(imageModel);
  const [user, setUser] = useState(currentUser);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form] = Form.useForm();

  const setUploadableImage = (files) => {
    if (files.length > 1) {
      message.error('Please select only one file');
      return;
    }
    const uploadableImage = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(uploadableImage);
    reader.addEventListener(
      'load',
      () => {
        setImage({
          uploadableImage,
          uploadableImageLocal: reader.result,
        });
      },
      false
    );
  };

  const handleUploadImage = async () => {
    setIsSaving(true);
    const { uploadableImage } = image;
    try {
      const resizedImage = await resizeImage(uploadableImage, 600);
      const uploadedImage = await uploadImage(resizedImage, 'profileImageUpload');
      await call('setProfileImage', uploadedImage);
      updateUser();
      successDialog('Your new image is set');
    } catch (error) {
      console.log('Error uploading:', error);
      errorDialog(error.reason);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateProfile = () => {
    setIsSaving(true);
    const values = form.getFieldsValue();

    try {
      call('updateProfile', values);
      updateUser();
      successDialog('Your profile is successfully updated');
      setUser({
        ...user,
        values,
      });
    } catch (error) {
      console.log(error);
      errorDialog(error.reason);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLanguageSelect = (selectedLanguages) => {
    const selectedLanguageValue = selectedLanguages[0];
    const { languages } = user;
    if (languages && languages.some((language) => language.value === selectedLanguageValue)) {
      return;
    }

    const selectedLanguage = allLanguages.find(
      (language) => language && language.value === selectedLanguageValue
    );

    const newLanguages = languages ? [...languages, selectedLanguage] : [selectedLanguage];

    setUser({
      ...user,
      languages: newLanguages,
    });
  };

  const handleRemoveLanguage = (languageValue) => {
    const { languages } = user;
    const newLanguages = languages.filter((language) => languageValue !== language.value);
    setUser({
      ...user,
      languages: newLanguages,
    });
  };

  const handleUpdateLanguages = () => {
    setIsSaving(true);
    const { languages } = user;
    try {
      call('updateLanguages', languages);
      updateUser();
      successDialog('Your languages successfully updated');
    } catch (error) {
      console.log(error);
      errorDialog(error.reason);
    } finally {
      setIsSaving(false);
    }
  };

  const getGeoLocation = () => {
    const geolocation = navigator.geolocation;
    geolocation &&
      geolocation.getCurrentPosition((position) => {
        setGeoLocationCoords(position.coords);
      });
  };

  const setGeoLocationCoords = (coords) => {
    setIsSaving(true);
    const theCoords = {
      latitude: coords.latitude.toString(),
      longitude: coords.longitude.toString(),
      accuracy: coords.accuracy.toString(),
    };

    try {
      call('setGeoLocationCoords', theCoords);
      successDialog('Your location is successfully set');
    } catch (error) {
      console.log(error);
      errorDialog(error.reason);
    } finally {
      setIsSaving(false);
    }
  };

  const { images, languages } = user;

  return (
    <>
      <Tabs>
        <Tab title="Image" key="image">
          <Center mb="8">
            <FilePicker
              imageUrl={images && images[0]}
              height="120px"
              width="120px"
              uploadableImageLocal={image?.uploadableImageLocal}
              setUploadableImage={setUploadableImage}
            />
          </Center>

          <Button
            block
            color="primary"
            onClick={handleUploadImage}
            // disabled={!unSavedAvatarChange}
            loading={isSaving}
          >
            Save
          </Button>
        </Tab>

        <Tab title="Info" key="info">
          <Form
            initialValues={currentUser}
            form={form}
            layout="horizontal"
            footer={
              <Button block color="primary" type="submit" onClick={handleUpdateProfile}>
                Save
              </Button>
            }
          >
            {/* <Form.Header></Form.Header> */}

            <Form.Item label="Username">
              <Input value={user.username} disabled />
            </Form.Item>

            <Form.Item
              name="firstName"
              label="First name"
              rules={[{ required: true, message: 'First name is required' }]}
            >
              <Input placeholder="Franz" />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last name"
              rules={[{ required: true, message: 'Last name is required' }]}
            >
              <Input placeholder="Kafka" />
            </Form.Item>

            <Form.Item name="bio" label="About me">
              <TextArea rows={4} placeholder="I love to read..." />
            </Form.Item>
          </Form>
        </Tab>

        <Tab title="Languages" key="languages">
          <Form>
            <Form.Item
              name="language"
              label="Pick language"
              rules={[{ required: true, message: 'Language is required' }]}
              onClick={() => setPickerVisible(true)}
            >
              <Picker
                columns={[allLanguages]}
                confirmText="Confirm"
                cancelText="Cancel"
                visible={pickerVisible}
                onClose={() => setPickerVisible(false)}
                onConfirm={handleLanguageSelect}
              />
            </Form.Item>
          </Form>

          <Stack direction="row" justify="center" py="2" wrap="wrap">
            {languages?.map((language) => (
              <Tag key={language.value} onClose={() => handleRemoveLanguage(language.value)}>
                {language.label}
                <TagCloseButton onClick={() => handleRemoveLanguage(language.value)} />
              </Tag>
            ))}
          </Stack>

          <Box my="4">
            <Button
              block
              color="primary"
              disabled={shallowEqualArrays(currentUser.languages, user.languages)}
              onClick={() => handleUpdateLanguages()}
            >
              Save
            </Button>
          </Box>
        </Tab>

        <Tab title="Location" key="location">
          <Text mt="2" mb="6">
            We will use your location in order to find books that are located close to you so you
            can go pick them up.
          </Text>
          {currentUser.geoLocationCoords ? (
            <Fragment>
              <Subtitle isSize={6}>Your location is set</Subtitle>
              <Box my="4">
                <Button block onClick={() => getGeoLocation()}>
                  Update Your Location
                </Button>
              </Box>
            </Fragment>
          ) : (
            <Box my="4">
              <Button block color="primary" onClick={() => getGeoLocation()}>
                Set Your Location
              </Button>
            </Box>
          )}
        </Tab>
      </Tabs>
    </>
  );
}

export default EditProfile;
