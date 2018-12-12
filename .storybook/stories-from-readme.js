import React from 'react';
import {storiesOf, addDecorator} from '@storybook/react';
import Playground from '../playground/Playground';
import * as Polaris from '@shopify/polaris';

export function generateStories(readme) {
  // Only generate stories if there are examples
  if (readme.examples.length === 0) {
    return;
  }

  storiesOf(readme.name, module)
    .addDecorator(AppProviderDecorator)
    .add('All Examples', () => AllExamplesStoryForReadme(readme));

  readme.examples.forEach((example) => {
    storiesOf(readme.name, module)
      .addDecorator(AppProviderDecorator)
      .add(example.name, () => <example.Component />, {
        // TODO links use styleguide-style URLs. It'd be neat to mutate them
        // to deeplink to examples in storybook.
        // TODO remove content-for android/ios blocks from the description
        notes: {markdown: example.description},
      });
  });
}

export function hydrateExecutableExamples(readme) {
  readme.examples = readme.examples.map((example) => {
    example.Component = example.code({React, ...Polaris});
    return example;
  });

  return readme;
}

export function addPlaygroundStory() {
  storiesOf('Playground', module)
    .addDecorator(AppProviderDecorator)
    .add('Playground', () => <Playground />);
}

function AppProviderDecorator(story) {
  return <Polaris.AppProvider>{story()}</Polaris.AppProvider>;
}

/**
 * A React component that renders all examples for a given component
 * We only screenshot this with Percy instead of every example individually to
 * keep the costs down as they charge per screenshot.
 */
function AllExamplesStoryForReadme(readme) {
  // Prevent false positives in visual regression testing.
  // Set a minimum height so that examples don't shift and triger
  // a failure if an example above them changes height
  const containerStyle = {minHeight: '720px'};

  return (
    <React.Fragment>
      {readme.examples.map((example) => (
        <React.Fragment key={example.name}>
          <div style={containerStyle}>
            <example.Component />
          </div>
          <hr />
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}
