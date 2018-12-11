import {configure, addDecorator} from '@storybook/react';
import {withNotes} from '@storybook/addon-notes';
import {
  addPlaygroundStory,
  generateStoriesForComponent,
  hydrateExecutableExamples,
} from './stories-from-examples';

addDecorator(withNotes);

// automatically import all files ending in *.stories.{js,jsx,ts,tsx}
// const req = require.context('../stories', true, /.stories.(js|ts)x?$/);
function loadStories() {
  // req.keys().forEach((filename) => req(filename));

  addPlaygroundStory();

  // At the moment the loader pulls in ALL component READMEs based upon a glob
  // The filename here has no effect. we just need something that triggers using
  // the markdown loader
  const components: any = require('../src/components/README.md').components;
  hydrateExecutableExamples(components).forEach(generateStoriesForComponent);
}

configure(loadStories, module);
