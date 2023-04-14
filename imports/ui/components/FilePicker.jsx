import React from 'react';
import Dropzone from 'react-dropzone';
import { Box, Center, Image, Text } from '@chakra-ui/react';
import { AddOutline } from 'antd-mobile-icons';

const containerStyle = {
  borderWidth: 1,
  borderStyle: 'dashed',
  cursor: 'pointer',
};

function FilePicker({
  height = '100%',
  imageFit = 'contain',
  imageUrl,
  round = false,
  width = '100%',
  uploadableImageLocal,
  setUploadableImage,
  isMultiple = false,
  ...otherProps
}) {
  if (round) {
    containerStyle.borderRadius = '50%';
    containerStyle.overflow = 'hidden';
  }

  return (
    <Dropzone onDrop={setUploadableImage}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <Box
          {...getRootProps()}
          bg={isDragActive ? 'gray.300' : 'gray.100'}
          h={height}
          w={width}
          style={containerStyle}
          {...otherProps}
        >
          {uploadableImageLocal || imageUrl ? (
            <Image
              fit={imageFit}
              width="100%"
              height="100%"
              src={uploadableImageLocal || imageUrl}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <Center p="8">
              <AddOutline color="#aaa" fontSize={48} />
            </Center>
          )}
          <input {...getInputProps()} />
        </Box>
      )}
    </Dropzone>
  );
}

export default FilePicker;
