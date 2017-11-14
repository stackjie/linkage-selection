(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.LinkageSelection = factory());
}(this, (function () { 'use strict';

function mergeOption(target) {
  for (var _len = arguments.length, object = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    object[_key - 1] = arguments[_key];
  }

  for (var i = 0; i < object.length; i++) {
    var currObj = object[i];
    for (var key in currObj) {
      target[key] = currObj[key];
    }
  }

  return target;
}

function triggerEvent(eventName, dom) {
  var evt = document.createEvent('Events');

  for (var _len2 = arguments.length, opts = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    opts[_key2 - 2] = arguments[_key2];
  }

  evt.initEvent.apply(evt, [eventName].concat(opts));
  dom.dispatchEvent(evt);
}

var _this = undefined;

var DEFAULT_OPTS = {
  data: [],
  selected: [],
  tipText: '请选择',
  labelKey: 'label',
  valueKey: 'value',
  childrenKey: 'children'
};

var LinkageSelection$1 = function LinkageSelection(el) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  this.wrapperEl = typeof el !== 'string' ? el : document.querySelectorAll(el);
  this.selectEls = this.wrapperEl.querySelectorAll('select');
  this.opts = mergeOption(opts, DEFAULT_OPTS);
  this._init();
};

var p = LinkageSelection$1.prototype;

p._init = function () {
  this._bindEvent();
  this._renderOptions(this.selectEls.eq(0), this.opts.data);
  this.selectEls.eq(0).trigger('change');

  if (this.selected !== [] && Array.isArray(this.selected)) {
    this._selectDefaultOption();
  }
};

p._findOption = function (data, findVal) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].value === findVal) {
      return data[i];
    }
  }

  return {};
};

p._renderOptions = function (selectEl) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var html = '';
  for (var i = 0; i < data.length; i++) {
    html += i === 0 ? '<option>' + this.opts.tipText + '</option>' : '';
    html += '<option value="' + data[i].value + '">' + data[i].label + '</option>';
  }
  selectEl.innerHTML = html;
};

p._selectDefaultOption = function () {
  var elems = this.selectEls;
  for (var i = 0; i < elems.length; i++) {
    var selectOpt = elems[i].querySelector('option[value="' + this.selected[i] + '"]');
    selectOpt.selected = true;

    triggerEvent('change', elems[i]);
  }
};

p._switchDisabled = function () {
  this.wrapperEl.querySelector('select:disabled').disabled = false;
  this.wrapperEl.querySelector('select:empty').disabled = true;
};

p._handleChangeOptions = function (event) {
  var currentSelection = event.target;
  var currentSelectorIndex = _this.selectEls.indexOf(currentSelection);
  var prevSelectorIndex = currentSelectorIndex - 1;
  var nextSelectorIndex = currentSelectorIndex + 1;

  if (nextSelectorIndex < _this.selectEls.length) {
    var findData = currentSelectorIndex === 0 ? _this.data : _this.opts.selected[prevSelectorIndex].children ? _this.opts.selected[prevSelectorIndex].children : [];

    _this.opts.selected[currentSelectorIndex] = _this._findOption(findData, currentSelection.value);

    var isChildren = _this.opts.selected[currentSelectorIndex].hasOwnProperty('children');
    var renderData = isChildren ? _this.opts.selected[currentSelectorIndex].children : [];
    _this._renderOptions(_this.selectEls[nextSelectorIndex], renderData);

    _this._switchDisabled();

    // 手动触发change事件递归获取和渲染相应的数据
    triggerEvent('change', _this.selectEls[nextSelectorIndex]);
  }
};

p._bindEvent = function () {
  this.wrapperEl.addEventListener('change', this._handleChangeOptions);
};

p._unbindEvent = function () {
  this.wrapperEl.removeEventListener('change');
};

p.reset = function () {
  this.selected = [];
  var selectedOptEls = this.wrapperEl.querySelectorAll('option[selected="selected"]');
  selectedOptEls.forEach(function (el) {
    return el.selected = false;
  });
};

p.disable = function () {
  this._unbindEvent();
  this.selectEls.forEach(function (el) {
    return el.disabled = true;
  });
};

p.enable = function () {
  this._bindEvent();
  this.selectEls.forEach(function (el) {
    return el.disabled = false;
  });
};

module.exports = exports['default'];

module.exports = exports['default'];

return LinkageSelection$1;

})));
