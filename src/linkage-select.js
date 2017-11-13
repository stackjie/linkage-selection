import { mergeOption, triggerEvent } from './util';

const DEFAULT_OPTS = {
  tipText: '请选择',
  labelKey: 'label',
  valueKey: 'value',
  childrenKey: 'children'
};

class LinkageSelector {
  wrapperEl = {};
  selectEls = {};
  data = [];
  selectedData = [];
  opts = {};

  constructor(el, opts = {}) {
    this.wrapperEl = typeof el !== 'string' ? el : document.querySelectorAll(el);
    this.selectEls = this.wrapperEl.querySelectorAll('select');
    this.data = opts.data;
    this.selectedData = opts.selectedData;
    this.tipText = opts.tipText;
    mergeOption(this.opts, DEFAULT_OPTS);
    this._init();
  }

  _init() {
    this._bindEvent();
    this._renderOptions(this.selectEls.eq(0), this.data);
    this.selectEls.eq(0).trigger('change');

    if (this.selectDatas !== [] && Array.isArray(this.selectDatas)) {
      this._selectDefaultOption();
    }
  }

  _findOptionData(data, findVal) {
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
      html += i === 0 ? `<option>${this.tipText}</option>` : '';
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
      const selectOpt = elems[i].querySelector(`option[value="${this.selectedData[i]}"]`);
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
        : this.selectDatas[prevSelectorIndex].children ? this.selectDatas[prevSelectorIndex].children : [];

      this.selectDatas[currentSelectorIndex] = this._findOptionData(findData, currentSelection.value);

      const isChildren = this.selectDatas[currentSelectorIndex].hasOwnProperty('children');
      const renderData = isChildren
        ? this.selectDatas[currentSelectorIndex].children
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

  reset() {
    this.selectedData = [];
    const selectedOpts = this.wrapperEl.querySelectorAll('option[selected="selected"]');
    for (let i = 0; i < selectedOpts; i++) {
      selectedOpts[i].selected = false;
    }
  }

  _unbindEvent() {
    this.wrapperEl.removeEventListener('change');
  }

  disable() {
    this.selectEls.forEach((el) => el.disabled = true);
  }

  enable() {
    this.selectEls.forEach((el) => el.disabled = false);
  }
}

export default LinkageSelector;
