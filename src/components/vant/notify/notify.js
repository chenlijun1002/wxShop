import { isObj } from '../common/utils';
var defaultOptions = {
  selector: '#van-notify',
  duration: 3000
};

function parseOptions(text) {
  return isObj(text) ? text : {
    text: text
  };
}

function getContext() {
  var pages = getCurrentPages();
  return pages[pages.length - 1];
}

export default function Notify(options) {
  if (options === void 0) {
    options = {};
  }

  options = Object.assign({}, defaultOptions, parseOptions(options));
  var context = options.context || getContext();
  var notify = context.selectComponent(options.selector);

  delete options.selector;

  if (!notify) {
    var xkdmaster = context.selectComponent("#xkdmaster");
    if (xkdmaster) {
      notify = xkdmaster.selectNotify();
    }
  }

  if (notify) {
    notify.setData(options);
    notify.show();
  } else {


    console.warn('未找到 van-notify/xkd-master 节点，请确认 selector 及 context 是否正确');

  }
}