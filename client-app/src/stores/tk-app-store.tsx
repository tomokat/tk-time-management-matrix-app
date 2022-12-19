import { createStore } from '@stencil/store';

function getBaseUrl() {
  if(location.hostname === 'localhost' && location.port === '3333') {
    return 'http://localhost:3000/';
  }
  return '';
}

function getTimeManagementApiPerEnvironment() {
  return `${getBaseUrl()}time-management-matrix-api`;
}

function getValueFromLocalStorage(key, defaultValue) {
  let targetValue = localStorage.getItem(key);
  if(targetValue) {
    return targetValue;
  }
  return defaultValue;
}

const { state, onChange } = createStore({
  baseUrl: getBaseUrl(),
  timeManagementMatrixApi: getTimeManagementApiPerEnvironment(),
  taskItemList: [],
  theme: getValueFromLocalStorage('theme', 'night'),
  user: {
    email: ''
  }
});

onChange('theme', value => {
  console.log(`theme change detected [${value}]`);
  localStorage.setItem('theme', value);
});

export default state;