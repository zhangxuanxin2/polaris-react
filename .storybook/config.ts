import {configure} from '@storybook/react';

// automatically import all files ending in *.stories.{js,jsx,ts,tsx}
const req = require.context('../stories', true, /.stories.(js|ts)x?$/);
function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
