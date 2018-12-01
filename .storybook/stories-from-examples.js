import React from 'react';
import {storiesOf, addDecorator} from '@storybook/react';
import * as Polaris from '../src';

// eslint-disable-next-line shopify/strict-component-boundaries
import {components} from '../src/components/README.md';

addDecorator((story) => <Polaris.AppProvider>{story()}</Polaris.AppProvider>);

components.forEach((component) => {
  component.examples.forEach((example) => {
    const StoryComponent = example.code({React, ...Polaris});
    storiesOf(component.name, module).add(example.name, () => (
      <StoryComponent />
    ));
  });
});
