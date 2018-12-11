import React from 'react';
import {storiesOf, addDecorator} from '@storybook/react';
import * as Polaris from '../src';

// eslint-disable-next-line shopify/strict-component-boundaries
import {components as componentsFromReadMe} from '../src/components/README.md';

const components = hydrateExecutableExamples(componentsFromReadMe);
components.forEach(generateStoriesForComponent);

function generateStoriesForComponent(component) {
  storiesOf(component.name, module)
    .addDecorator(AppProviderDecorator)
    .add('All Examples', () => AllExamplesStoryForComponent(component));

  component.examples.forEach((example) => {
    storiesOf(component.name, module)
      .addDecorator(AppProviderDecorator)
      .add(example.name, () => <example.Component />);
  });
}

function hydrateExecutableExamples(components) {
  return components.map((component) => {
    component.examples = component.examples.map((example) => {
      example.Component = example.code({React, ...Polaris});
      return example;
    });

    return component;
  });
}

function AppProviderDecorator(story) {
  return <Polaris.AppProvider>{story()}</Polaris.AppProvider>;
}

/**
 * A React component that renders all examples for a given component
 * We only screenshot this with Percy instead of every example individually to
 * keep the costs down as they charge per screenshot.
 */
function AllExamplesStoryForComponent(component) {
  // Prevent false positives in visual regression testing.
  // Set a minimum height so that examples don't shift and triger
  // a failure if an example above them changes height
  const containerStyle = {minHeight: '720px'};

  return (
    <React.Fragment>
      {component.examples.map((example) => (
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
