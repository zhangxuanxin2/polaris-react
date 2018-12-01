import {configure} from '@storybook/react';

// automatically import all files ending in *.stories.{js,jsx,ts,tsx}
// const req = require.context('../stories', true, /.stories.(js|ts)x?$/);
function loadStories() {
  // req.keys().forEach((filename) => req(filename));

  require('./stories-from-examples');
}

configure(loadStories, module);
