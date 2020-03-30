import React, { PureComponent } from 'react';
import { Title, Subtitle, Heading, Button } from 'bloomer';
import { Flex, WhiteSpace } from 'antd-mobile';

const imageContainerStyle = {
  flexBasis: '20vw',
  flexGrow: 0,
  flexShrink: 1,
  minWidth: 120,
  marginLeft: 24
};

const containerStyle = {
  backgroundColor: '#3E3E3E',
  padding: 12,
  width: '100vw',
  marginLeft: -24,
  marginRight: -24,
  boxShadow: '0 0 12px rgba(78, 78, 78, 0.6)',

  overflowY: 'hidden',
  transition: 'max-height .2s ease'
};

const parseAuthors = authors => {
  if (!authors) {
    return <span>unknown authors</span>;
  }
  return authors.map((author, index) => (
    <span key={author}>
      {author + (authors.length !== index + 1 ? ', ' : '')}
    </span>
  ));
};

class BookCardNext extends PureComponent {
  state = {
    hiddenHeight: 400,
    visibleHeight: 155,
    imageLoaded: false
  };

  setMaxHeight = () => {
    const hiddenHeight = this.hidden && this.hidden.clientHeight;
    const visibleHeight = this.visible && this.visible.clientHeight;

    this.setState({ visibleHeight, hiddenHeight });
  };

  getPublishText = () => {
    const { volumeInfo } = this.props;
    const r = volumeInfo.publisher,
      e = volumeInfo.publishedDate;
    let publishText;
    if (r && e) {
      publishText = (
        <span>
          , published by <b>{r}</b> on <b>{e}</b>
        </span>
      );
    } else if (r) {
      publishText = (
        <span>
          , published by <b>{r}</b>
        </span>
      );
    } else if (e) {
      publishText = (
        <span>
          , published on <b>{e}</b>
        </span>
      );
    } else {
      publishText = '';
    }

    return publishText;
  };

  render() {
    const { volumeInfo, openBook, isOpen, handleButtonClick } = this.props;
    const { visibleHeight, hiddenHeight } = this.state;

    const language = allLanguages.find(
      language => language && language.value === volumeInfo.language
    );

    const category = volumeInfo.categories && volumeInfo.categories[0];

    const openedHeight = visibleHeight + hiddenHeight + 30;

    const cardContainerStyle = { ...containerStyle };

    if (isOpen && openedHeight) {
      cardContainerStyle.maxHeight = openedHeight;
    } else if (visibleHeight) {
      cardContainerStyle.maxHeight = visibleHeight + 10;
    } else {
      cardContainerStyle.maxHeight = 200;
    }

    const publishText = this.getPublishText();

    return (
      <div style={cardContainerStyle}>
        <div ref={element => (this.visible = element)}>
          <Flex
            justify="between"
            align="stretch"
            onClick={openBook}
            style={{ cursor: 'pointer' }}
          >
            <Flex
              direction="column"
              justify="between"
              align="start"
              style={{ flexGrow: 1 }}
            >
              <div style={{ flexGrow: 1 }}>
                <Title hasTextColor="light" isSize={5}>
                  {volumeInfo.title}
                </Title>
                <Subtitle hasTextColor="light" isSize={6}>
                  {parseAuthors(volumeInfo.authors)}
                </Subtitle>
              </div>
              <div style={{ flexGrow: 0 }}>
                <Heading
                  // isSize={5}
                  style={{
                    paddingTop: 12,
                    paddingBottom: 12,
                    color: '#ababab'
                  }}
                >
                  <b>{volumeInfo.printType}</b> in {}{' '}
                  <b>{language && language.label}</b>
                  {category && (
                    <span>
                      {' '}
                      about <b>{category}</b>
                    </span>
                  )}
                  {publishText}
                </Heading>
              </div>
            </Flex>

            <div style={imageContainerStyle}>
              <img
                src={volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail}
                width={120}
                alt={volumeInfo.title}
                style={{
                  marginRight: 12,
                  backgroundColor: 'coral',
                  maxHeight: 180
                }}
                onLoad={() => this.setMaxHeight()}
              />
            </div>
          </Flex>
        </div>

        <div
          ref={element => (this.hidden = element)}
          style={{ padding: 12, paddingTop: 24 }}
        >
          <Flex justify="center" direction="column">
            <Subtitle
              isSize={6}
              hasTextColor="light"
              style={{ marginBottom: 5 }}
            >
              Have this book?
            </Subtitle>
            <Button isColor="light" isOutlined onClick={handleButtonClick}>
              Add to your virtual shelf
            </Button>
          </Flex>
          <WhiteSpace size="lg" />
          <p>{volumeInfo && volumeInfo.description}</p>
        </div>
      </div>
    );
  }
}

export default BookCardNext;
