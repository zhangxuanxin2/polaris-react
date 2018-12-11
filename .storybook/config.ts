import {configure} from '@storybook/react';
import {
  generateStoriesForComponent,
  hydrateExecutableExamples,
} from './stories-from-examples';

// automatically import all files ending in *.stories.{js,jsx,ts,tsx}
// const req = require.context('../stories', true, /.stories.(js|ts)x?$/);
function loadStories() {
  // req.keys().forEach((filename) => req(filename));

  // At the moment the loader pulls in ALL component READMEs based upon a glob
  // The filename here has no effect. we just need something that triggers using
  // the markdown loader
  const components: any = require('../src/components/README.md').components;
  hydrateExecutableExamples(components).forEach(generateStoriesForComponent);
}

configure(loadStories, module);
