import axios from 'axios';
import config from './config';

const backendCall = async (path, data, method, options) => {
  try {
    let auth;
    if (options) {
      auth = options.token ? `Bearer ${options.token}` : undefined;
    }
    const { data: responseData } = await axios({
      url: path,
      method: method,
      baseURL: config.BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth,
      },
      data: method === 'GET' ? undefined : JSON.stringify(data),
    });

    return responseData;
  } catch (error) {
    const response = error.response;
    if (response) {
      const errMsg = { message: response.data.error || `Error: status code ${response.status}` };
      throw errMsg;
    }
    throw error;
  }
}

export default backendCall;
