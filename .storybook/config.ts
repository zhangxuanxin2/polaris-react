import {configure, addDecorator} from '@storybook/react';
import {setConsoleOptions} from '@storybook/addon-console';
import {withNotes} from '@storybook/addon-notes';

import {
  addPlaygroundStory,
  generateStories,
  hydrateExecutableExamples,
} from './stories-from-readme';

// addon-notes
addDecorator(withNotes);

// addon-console
setConsoleOptions((opts) => {
  // When transpiling TS using isolatedModules, the compiler doesn't strip
  // out exported types as it doesn't know if an item is a type or not.
  // Ignore those warnings as we don't care about them.
  // ignore color because the addon doesn't handle colored logs properly
  opts.panelExclude = [
    ...opts.panelExclude,
    /export .* was not found in/,
    /color: #999933;/,
  ];
  return opts;
});

// import all README.md files within component folders
const readmeReq = require.context(
  '../src/components',
  true,
  /\/.+\/README.md$/,
);
function loadStories() {
  addPlaygroundStory();

  readmeReq.keys().forEach((filename) => {
    const readme = readmeReq(filename).component;
    generateStories(hydrateExecutableExamples(readme));
  });
}

configure(loadStories, module);
