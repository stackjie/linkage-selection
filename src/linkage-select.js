class LinkageSelector {

  constructor(selector, data, selectedData = []) {
    this.$selectors = $(selector);
    this.data = data;
    this.selectDatas = [];
    this.selectedData = selectedData;

    this._bindEvents();
    this._initSelector();
  }

  _initSelector() {
    this._renderOptions(this.$selectors.eq(0), this.data);
    this.$selectors.eq(0).trigger('change');

    if (this.selectDatas !== [] && $.isArray(this.selectDatas)) {
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

  _renderOptions($selector, data = []) {
    let html = '';
    for (let i = 0; i < data.length; i++) {
      html += i === 0 ? '<option>请选择</option>' : '';
      html += `<option value="${data[i].value}">${data[i].label}</option>`;
    }
    $selector.html(html);
  }

  _selectDefaultOption() {
    this.$selectors.each((i) => {
      this.$selectors
        .eq(i)
        .find(`option[value="${this.selectedData[i]}"]`)
        .attr('selected', true);

      this.$selectors.eq(i).trigger('change');
    });
  }

  _switchDisabled() {
    this.$selectors
      .parent()
      .find('select:disabled')
      .removeAttr('disabled');

    this.$selectors
      .parent().find('select:empty')
      .attr('disabled', true);
  }

  _bindEvents() {
    const handleChangeOptions = (event) => {
      const $currentSelector = $(event.target);
      const currentSelectorIndex = this.$selectors.index($currentSelector);
      const prevSelectorIndex = currentSelectorIndex - 1;
      const nextSelectorIndex = currentSelectorIndex + 1;

      if (nextSelectorIndex < this.$selectors.length) {
        const findData = currentSelectorIndex === 0
          ? this.data
          : this.selectDatas[prevSelectorIndex].children ? this.selectDatas[prevSelectorIndex].children : [];

        this.selectDatas[currentSelectorIndex] = this._findOptionData(findData, $currentSelector.val());

        const isChildren = this.selectDatas[currentSelectorIndex].hasOwnProperty('children');
        const renderData = isChildren
          ? this.selectDatas[currentSelectorIndex].children
          : [];
        this._renderOptions(this.$selectors.eq(nextSelectorIndex), renderData);

        this._switchDisabled();

        // 手动触发change事件递归获取和渲染相应的数据
        this.$selectors.eq(nextSelectorIndex).trigger('change');
      }
    };

    this.$selectors
      .parent()
      .on('change', handleChangeOptions);
  }

}

export default LinkageSelector;
