import React from 'react';
import {
  Field,
  Control,
  Button,
  Flex,
  Label,
  Select,
  Tag,
  Delete
} from 'bloomer';

import HeroSlide from '../../reusables/HeroSlide';

import allLanguages from '../allLanguages';

const LanguageSelector = ({
  currentUser,
  languages,
  onLanguageSelect,
  onDeleteClick,
  onButtonClick
}) => (
  <HeroSlide subtitle="What languages do you speak?" isColor="dark">
    {currentUser && (
      <Field>
        <Label
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center'
          }}
        >
          Select:
        </Label>
        <Control style={{ display: 'flex', justifyContent: 'center' }}>
          <Select onChange={onLanguageSelect}>
            {allLanguages.map(language => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </Select>
        </Control>
        <Flex wrap="wrap">
          {languages &&
            languages.map(language => (
              <Tag
                key={language.value}
                value={language.value}
                isColor="warning"
                isSize="small"
                style={{ marginTop: 12, marginRight: 12 }}
              >
                {language.label}{' '}
                <Delete
                  isSize="medium"
                  onClick={() => onDeleteClick(language)}
                />
              </Tag>
            ))}
        </Flex>

        <Control style={{ paddingTop: 24 }}>
          <Button
            disabled={languages.length === 0}
            onClick={onButtonClick}
            className="is-rounded"
            isPulled="right"
          >
            Save and Continue{' '}
          </Button>
        </Control>
      </Field>
    )}
  </HeroSlide>
);

export default LanguageSelector;
