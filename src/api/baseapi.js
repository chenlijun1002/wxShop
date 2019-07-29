import wepy from 'wepy';
import http from '../utils/http'

export default class base {
  static get = http.get.bind(http);
  static postForm = http.postForm.bind(http);
  static postJson = http.postJson.bind(http);
}