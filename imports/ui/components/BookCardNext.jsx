import React, { PureComponent } from "react";
import { Title, Subtitle, Container, Heading, Button } from "bloomer";
import { Flex } from "@chakra-ui/react";

import { parseUrlForSSL, parseAuthors } from "../../api/_utils/functions";
import allLanguages from "../../api/_utils/langs/allLanguages";

const imageContainerStyle = {
  flexBasis: "20vw",
  flexGrow: 0,
  flexShrink: 1,
  minWidth: 120,
  marginLeft: 24,
};

const containerStyle = {
  padding: 12,
  width: "100vw",
  marginBottom: 24,
  boxShadow: "0 0 12px rgba(120, 120, 120, 0.6)",
  overflowY: "hidden",
  transition: "max-height .2s ease",
};

class BookCardNext extends PureComponent {
  state = {
    hiddenHeight: 400,
    visibleHeight: 155,
    imageLoaded: false,
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
      publishText = "";
    }

    return publishText;
  };

  render() {
    const {
      volumeInfo,
      onClickBook,
      isOpen,
      onButtonClick,
      buttonText,
      isIntro,
      isDark,
    } = this.props;
    const { visibleHeight, hiddenHeight } = this.state;

    const language = allLanguages.find(
      (language) => language && language.value === volumeInfo.language
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

    if (isDark) {
      cardContainerStyle.backgroundColor = "#3E3E3E";
    } else {
      cardContainerStyle.backgroundColor = "whitesmoke";
    }

    if (isIntro) {
      (cardContainerStyle.marginLeft = -24),
        (cardContainerStyle.marginRight = -24);
    }

    const publishText = this.getPublishText();

    return (
      <div style={cardContainerStyle}>
        <div ref={(element) => (this.visible = element)}>
          <Flex
            justify="between"
            align="stretch"
            onClick={onClickBook}
            style={{ cursor: "pointer" }}
          >
            <Flex
              direction="column"
              justify="between"
              align="start"
              style={{ flexGrow: 1 }}
            >
              <div style={{ flexGrow: 1 }}>
                <Title
                  hasTextColor={isDark ? "light" : "dark"}
                  isSize={5}
                  // style={{ fontFamily: "'Georgia', serif" }}
                >
                  {volumeInfo.title}
                </Title>
                <Subtitle hasTextColor={isDark ? "light" : "dark"} isSize={6}>
                  {parseAuthors(volumeInfo.authors)}
                </Subtitle>
              </div>
              <div style={{ flexGrow: 0 }}>
                <Heading
                  style={{
                    paddingTop: 12,
                    paddingBottom: 12,
                    color: "#ababab",
                  }}
                >
                  <b>{volumeInfo.printType}</b> in {}{" "}
                  <b>{language && language.label}</b>
                  {category && (
                    <span>
                      {" "}
                      about <b>{category}</b>
                    </span>
                  )}
                  {publishText}
                </Heading>
              </div>
            </Flex>

            <div style={imageContainerStyle}>
              <img
                src={
                  volumeInfo.imageLinks &&
                  parseUrlForSSL(volumeInfo.imageLinks.thumbnail)
                }
                width={120}
                alt={volumeInfo.title}
                style={{
                  marginRight: 12,
                  backgroundColor: "coral",
                  maxHeight: 180,
                }}
                onLoad={() => this.setMaxHeight()}
              />
            </div>
          </Flex>
        </div>

        <div
          ref={(element) => (this.hidden = element)}
          style={{ paddingTop: 12 }}
        >
          <Flex justify="center" direction="column">
            <Subtitle
              isSize={6}
              hasTextColor={isDark ? "light" : "dark"}
              style={{ marginBottom: 5 }}
            >
              Have this book?
            </Subtitle>
            <Button
              isColor={isDark ? "light" : "dark"}
              isOutlined
              onClick={onButtonClick}
            >
              {buttonText}
            </Button>
          </Flex>

          <Container hasTextColor={isDark ? "light" : "dark"}>
            <p style={{ fontWeight: 500 }}>
              {volumeInfo && volumeInfo.description}
            </p>
          </Container>
        </div>
      </div>
    );
  }
}

export default BookCardNext;
