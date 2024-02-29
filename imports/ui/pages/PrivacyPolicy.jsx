import React from 'react';
import renderHTML from 'react-render-html';

import { policyEn } from './policies';

export default function PrivacyPolicy({ lang }) {
  return <div style={{ padding: 24 }}>{renderHTML(policyEn)}</div>;
}
