import {mergeOption, triggerEvent} from './util';

const DEFAULT_OPTS = {
  data: [],
  selected: [],
  tipText: '请选择',
  labelKey: 'label',
  valueKey: 'value',
  childrenKey: 'children'
};

const LinkageSelection = function (el, opts = {}) {
  this.wrapperEl = typeof el !== 'string' ? el : document.querySelectorAll(el);
  this.selectEls = this.wrapperEl.querySelectorAll('select');
  this.opts = mergeOption(opts, DEFAULT_OPTS);
  this._init();
};

const p = LinkageSelection.prototype;

p._init = function () {
  this._bindEvent();
  this._renderOptions(this.selectEls.eq(0), this.opts.data);
  this.selectEls.eq(0).trigger('change');

  if (this.selected !== [] && Array.isArray(this.selected)) {
    this._selectDefaultOption();
  }
};

p._findOption = function (data, findVal) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].value === findVal) {
      return data[i];
    }
  }

  return {};
};

p._renderOptions = function (selectEl, data = []) {
  let html = '';
  for (let i = 0; i < data.length; i++) {
    html += i === 0 ? `<option>${this.opts.tipText}</option>` : '';
    html += `<option value="${data[i].value}">${data[i].label}</option>`;
  }
  selectEl.innerHTML = html;
};

p._selectDefaultOption = function () {
  const elems = this.selectEls;
  for (let i = 0; i < elems.length; i++) {
    const selectOpt = elems[i].querySelector(`option[value="${this.selected[i]}"]`);
    selectOpt.selected = true;

    triggerEvent('change', elems[i]);
  }
};

p._switchDisabled = function () {
  this.wrapperEl.querySelector('select:disabled').disabled = false;
  this.wrapperEl.querySelector('select:empty').disabled = true;
};

p._handleChangeOptions = (event) => {
  const currentSelection = event.target;
  const currentSelectorIndex = this.selectEls.indexOf(currentSelection);
  const prevSelectorIndex = currentSelectorIndex - 1;
  const nextSelectorIndex = currentSelectorIndex + 1;

  if (nextSelectorIndex < this.selectEls.length) {
    const findData = currentSelectorIndex === 0
      ? this.data
      : this.opts.selected[prevSelectorIndex].children ? this.opts.selected[prevSelectorIndex].children : [];

    this.opts.selected[currentSelectorIndex] = this._findOption(findData, currentSelection.value);

    const isChildren = this.opts.selected[currentSelectorIndex].hasOwnProperty('children');
    const renderData = isChildren
      ? this.opts.selected[currentSelectorIndex].children
      : [];
    this._renderOptions(this.selectEls[nextSelectorIndex], renderData);

    this._switchDisabled();

    // 手动触发change事件递归获取和渲染相应的数据
    triggerEvent('change', this.selectEls[nextSelectorIndex]);
  }
};

p._bindEvent = function () {
  this.wrapperEl.addEventListener('change', this._handleChangeOptions);
};

p._unbindEvent = function() {
  this.wrapperEl.removeEventListener('change');
};

p.reset = function () {
  this.selected = [];
  const selectedOptEls = this.wrapperEl.querySelectorAll('option[selected="selected"]');
  selectedOptEls.forEach((el) => (el.selected = false));
};

p.disable = function () {
  this._unbindEvent();
  this.selectEls.forEach((el) => (el.disabled = true));
};

p.enable = function() {
  this._bindEvent();
  this.selectEls.forEach((el) => (el.disabled = false));
};

export default LinkageSelection;
