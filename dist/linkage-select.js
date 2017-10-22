(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('babel-runtime/helpers/classCallCheck'), require('babel-runtime/helpers/createClass')) :
	typeof define === 'function' && define.amd ? define(['babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass'], factory) :
	(global.LinkageSelect = factory(global._classCallCheck,global._createClass));
}(this, (function (_classCallCheck,_createClass) { 'use strict';

_classCallCheck = _classCallCheck && _classCallCheck.hasOwnProperty('default') ? _classCallCheck['default'] : _classCallCheck;
_createClass = _createClass && _createClass.hasOwnProperty('default') ? _createClass['default'] : _createClass;

var LinkageSelector = function () {
  function LinkageSelector(selector, data) {
    var selectedData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    _classCallCheck(this, LinkageSelector);

    this.$selectors = $(selector);
    this.data = data;
    this.selectDatas = [];
    this.selectedData = selectedData;

    this._bindEvents();
    this._initSelector();
  }

  _createClass(LinkageSelector, [{
    key: '_initSelector',
    value: function _initSelector() {
      this._renderOptions(this.$selectors.eq(0), this.data);
      this.$selectors.eq(0).trigger('change');

      if (this.selectDatas !== [] && $.isArray(this.selectDatas)) {
        this._selectDefaultOption();
      }
    }
  }, {
    key: '_findOptionData',
    value: function _findOptionData(data, findVal) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].value === findVal) {
          return data[i];
        }
      }

      return {};
    }
  }, {
    key: '_renderOptions',
    value: function _renderOptions($selector) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      var html = '';
      for (var i = 0; i < data.length; i++) {
        html += i === 0 ? '<option>请选择</option>' : '';
        html += '<option value="' + data[i].value + '">' + data[i].label + '</option>';
      }
      $selector.html(html);
    }
  }, {
    key: '_selectDefaultOption',
    value: function _selectDefaultOption() {
      var _this = this;

      this.$selectors.each(function (i) {
        _this.$selectors.eq(i).find('option[value="' + _this.selectedData[i] + '"]').attr('selected', true);

        _this.$selectors.eq(i).trigger('change');
      });
    }
  }, {
    key: '_switchDisabled',
    value: function _switchDisabled() {
      this.$selectors.parent().find('select:disabled').removeAttr('disabled');

      this.$selectors.parent().find('select:empty').attr('disabled', true);
    }
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this2 = this;

      var handleChangeOptions = function handleChangeOptions(event) {
        var $currentSelector = $(event.target);
        var currentSelectorIndex = _this2.$selectors.index($currentSelector);
        var prevSelectorIndex = currentSelectorIndex - 1;
        var nextSelectorIndex = currentSelectorIndex + 1;

        if (nextSelectorIndex < _this2.$selectors.length) {
          var findData = currentSelectorIndex === 0 ? _this2.data : _this2.selectDatas[prevSelectorIndex].children ? _this2.selectDatas[prevSelectorIndex].children : [];

          _this2.selectDatas[currentSelectorIndex] = _this2._findOptionData(findData, $currentSelector.val());

          var isChildren = _this2.selectDatas[currentSelectorIndex].hasOwnProperty('children');
          var renderData = isChildren ? _this2.selectDatas[currentSelectorIndex].children : [];
          _this2._renderOptions(_this2.$selectors.eq(nextSelectorIndex), renderData);

          _this2._switchDisabled();

          // 手动触发change事件递归获取和渲染相应的数据
          _this2.$selectors.eq(nextSelectorIndex).trigger('change');
        }
      };

      this.$selectors.parent().on('change', handleChangeOptions);
    }
  }]);

  return LinkageSelector;
}();

module.exports = exports['default'];

module.exports = exports['default'];

return LinkageSelector;

})));
