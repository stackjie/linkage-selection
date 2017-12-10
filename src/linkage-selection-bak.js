import {mergeOption, triggerEvent} from './util';

const DEFAULT_OPTS = {
  data: [],
  selected: [],
  tipText: '请选择',
  labelKey: 'label',
  valueKey: 'value',
  childrenKey: 'children'
};

export default class LinkageSelection {
  wrapperEl = {};
  selectEls = {};
  opts = {};

  constructor(el, opts = {}) {
    this.wrapperEl = typeof el !== 'string' ? el : document.querySelectorAll(el);
    this.selectEls = this.wrapperEl.querySelectorAll('select');
    this.opts = mergeOption(opts, DEFAULT_OPTS);
    this._init();
  }

  _init() {
    this._bindEvent();
    this._renderOptions(this.selectEls.eq(0), this.opts.data);
    this.selectEls.eq(0).trigger('change');

    if (this.selected !== [] && Array.isArray(this.selected)) {
      this._selectDefaultOption();
    }
  }

  _findOption(data, findVal) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].value === findVal) {
        return data[i];
      }
    }

    return {};
  }

  _renderOptions(selectEl, data = []) {
    let html = '';
    for (let i = 0; i < data.length; i++) {
      html += i === 0 ? `<option>${this.opts.tipText}</option>` : '';
      html += `<option value="${data[i].value}">${data[i].label}</option>`;
    }
    selectEl.innerHTML = html;
  }

  _selectDefaultOption() {
    // this.selectors.each((i) => {
    //   this.selectors
    //     .eq(i)
    //     .find(`option[value="${this.selected[i]}"]`)
    //     .attr('selected', true);
    //
    //   this.selectors.eq(i).trigger('change');
    // });
    //
    const elems = this.selectEls;
    for (let i = 0; i < elems.length; i++) {
      const selectOpt = elems[i].querySelector(`option[value="${this.selected[i]}"]`);
      selectOpt.selected = true;

      triggerEvent('change', elems[i]);
    }
  }

  _switchDisabled() {
    this.wrapperEl.querySelector('select:disabled').disabled = false;
    this.wrapperEl.querySelector('select:empty').disabled = true;
    // this.selectors
    //   .parent()
    //   .find('select:disabled')
    //   .removeAttr('disabled');
    //
    // this.selectors
    //   .parent().find('select:empty')
    //   .attr('disabled', true);
  }

  _handleChangeOptions = (event) => {
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
      // this.selectEls[nextSelectorIndex].trigger('change');
      triggerEvent('change', this.selectEls[nextSelectorIndex]);
    }
  };

  _bindEvent() {
    this.wrapperEl.addEventListener('change', this._handleChangeOptions);
  }

  _unbindEvent() {
    this.wrapperEl.removeEventListener('change');
  }

  reset() {
    this.selected = [];
    const selectedOptEls = this.wrapperEl.querySelectorAll('option[selected="selected"]');
    selectedOptEls.forEach((el) => (el.selected = false));
    // for (let i = 0; i < selectedOpts; i++) {
    //   selectedOpts[i].selected = false;
    // }
  }

  disable() {
    this._unbindEvent();
    this.selectEls.forEach((el) => (el.disabled = true));
  }

  enable() {
    this._bindEvent();
    this.selectEls.forEach((el) => (el.disabled = false));
  }
}
