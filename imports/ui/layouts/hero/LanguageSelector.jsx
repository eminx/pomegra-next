import React from 'react';
import { Field, Control, Button, Label, Select, Tag, Delete } from 'bloomer';
import { Center } from '@chakra-ui/react';

import HeroSlide from '../../components/HeroSlide';

import allLanguages from '../../../api/_utils/langs/allLanguages';

function LanguageSelector({
  languages,
  onLanguageSelect,
  onDeleteClick,
  onButtonClick,
  profileUnchanged,
  onSkip,
}) {
  return (
    <HeroSlide isSkip subtitle="What languages can you read in?" isColor="dark">
      <Field>
        <Label
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
          }}
        >
          Select:
        </Label>
        <Control style={{ display: 'flex', justifyContent: 'center' }}>
          <Select onChange={onLanguageSelect}>
            {allLanguages.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </Select>
        </Control>
      </Field>
      <Field>
        <Center>
          {languages &&
            languages.map((language) => (
              <Tag
                key={language.value}
                value={language.value}
                isColor="warning"
                isSize="small"
                style={{ marginTop: 12, marginRight: 12 }}
              >
                {language.label.toUpperCase()}{' '}
                <Delete isSize="medium" onClick={() => onDeleteClick(language)} />
              </Tag>
            ))}
        </Center>
      </Field>
      <Field>
        <Control style={{ paddingTop: 24 }}>
          <Button
            disabled={languages.length === 0}
            onClick={onButtonClick}
            className="is-rounded"
            isPulled="right"
          >
            {profileUnchanged ? 'Continue' : 'Save and Continue'}
          </Button>
        </Control>
      </Field>
    </HeroSlide>
  );
}

export default LanguageSelector;
