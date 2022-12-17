import { createStore } from '@stencil/store';

function getBaseUrl() {
  if(location.hostname === 'localhost' && location.port === '3333') {
    return 'http://localhost:3000/';
  }
  return '';
}

function getTimeManagementApiPerEnvironment() {
  return `${getBaseUrl()}bookmark-api`;
}

const { state, onChange } = createStore({
  baseUrl: getBaseUrl(),
  bookmarkApi: getTimeManagementApiPerEnvironment(),
  taskItemList: [],
  user: {
    email: ''
  }
});

onChange('user', value => {
  console.log(`user change detected [${value}]`);
});

export default state;