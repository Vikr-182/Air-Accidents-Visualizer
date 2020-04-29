(function($) {
    jQuery.fn.rangeControl = function(options){
        return this.each(function(){

            if ($(this).data('rangeControl')) {
                var thisData = $(this).data('rangeControl');

                if (options == 'destroy') {
                    thisData.destroy();
                }
                // set new options
                else if (typeof options == 'object') {
                    thisData.opt = $.extend(thisData.opt, options);
                }

            } else {
                $(this).data('rangeControl', new RangeControl (this, options));
            }
        });
    };

    var RangeControl = function (el, options) {

        this.$el = $(el);

        this.opt = $.extend(true,{
            min: 0,
            max: 100,
            step: 1,
            delim: ',',
            orientation: 'horizontal',
            disabled: false,
            rangeType: 'single',
            minHandles: 1,
            maxHandles: 1,
            allowPaging: true,
            stepsPerPage: 10,
            currentValue: {
                position: 'top'
            },
            scale: {
                position: 'bottom',
                labels: false,
                interval: 10
            },
            className: ''
        }, this.$el.data("options"), options);

        this.normalizeOptions();

        this.init();

        return this;
    };

    var RangeHandle = function (contextRange, val) {

        this.$handle = $('<span class="range-control-handle" tabindex="0"></span>').appendTo(contextRange.$range);

        this.settings = {
            isVertical: contextRange.isVertical,
            handleSize: (contextRange.isVertical) ? this.$handle.outerHeight() : this.$handle.outerWidth(),
            rangeOffset: contextRange.rangeOffset,
            rangeSize: contextRange.rangeSize,
            min: contextRange.opt.min,
            max: contextRange.opt.max,
            minBound: contextRange.opt.min,
            maxBound: contextRange.opt.max,
            step: contextRange.opt.step,
            allowPaging: contextRange.opt.allowPaging,
            stepsPerPage: contextRange.opt.stepsPerPage
        };

        this.settings.rangeOffset -= this.settings.handleSize / 2;

        this.value = this.normalizeValueToStep(val);
        this.setPositionFromValue(this.value);

        if (contextRange.opt.disabled) {
            contextRange.$range.addClass('range-control-disabled');
            this.$handle.focus(function () {this.blur()});
            return;
        }

        var contextHandle = this;

        this.$handle.on({
           'focus.rangeControlFocus': function () {

               contextRange.currentHandle = contextHandle;
               $(this).addClass('range-control-handle-active');
               contextRange.displayCurrentValue();

               $(document).on({
                   'keydown.rangeControlKeyDown': function (event) {

                       if ((event.which >= 33) && (event.which <= 40)) {
                           event.preventDefault();
                           if (contextRange.slideStarted && !contextRange.slideAllowed) return false;

                           if (!contextRange.slideStarted) {
                               contextRange.slideStarted = true;
                               contextRange.slideStart();
                               if (!contextRange.slideAllowed) return false;
                           }

                           switch (event.which) {
                               //page up
                               case 33:
                                   if (!contextHandle.settings.allowPaging) return false;
                                   contextHandle.value -= contextHandle.settings.stepsPerPage * contextHandle.settings.step;
                                   if (contextHandle.value < contextHandle.settings.minBound) contextHandle.value = contextHandle.settings.minBound;
                                   break;
                               //page down
                               case 34:
                                   if (!contextHandle.settings.allowPaging) return false;
                                   contextHandle.value += contextHandle.settings.stepsPerPage * contextHandle.settings.step;
                                   if (contextHandle.value > contextHandle.settings.maxBound) contextHandle.value = contextHandle.settings.maxBound;
                                   break;
                               //end
                               case 35:
                                   if (!contextHandle.settings.allowPaging) return false;
                                   contextHandle.value = contextHandle.settings.maxBound;
                                   break;
                               //home
                               case 36:
                                   if (!contextHandle.settings.allowPaging) return false;
                                   contextHandle.value = contextHandle.settings.minBound;
                                   break;
                               //left, up
                               case 37:
                               case 38:
                                   contextHandle.value -= contextHandle.settings.step;
                                   if (contextHandle.value < contextHandle.settings.minBound) contextHandle.value = contextHandle.settings.minBound;
                                   break;
                               //right, down
                               case 39:
                               case 40:
                                   contextHandle.value += contextHandle.settings.step;
                                   if (contextHandle.value > contextHandle.settings.maxBound) contextHandle.value = contextHandle.settings.maxBound;
                                   break;
                           }
                           contextRange.slide();
                       }
                   },
                   'keyup.rangeControlKeyUp': function () {
                       if ((event.which >= 33) && (event.which <= 40)) {
                           if (contextRange.slideAllowed) {
                               contextRange.slideStarted = false;
                               contextRange.$el.triggerHandler('rangeControlSlideStop');
                               contextRange.setNewValue();
                           }
                       }
                   }
               });
            },
            'blur.rangeControlBlur': function() {
                $(this).removeClass('range-control-handle-active');
                contextRange.hideCurrentValue();
                $(document).off('keydown.rangeControlKeyDown keyup.rangeControlKeyUp');
            }
        });

        return this;
    };

    $.extend(RangeControl.prototype, {

        init: function () {
            var context = this;

            this.$el.change(function () {context.changeInputValue()});

            this.isVertical = +(this.opt.orientation == 'vertical');
            this.currentValPos = +((this.opt.currentValue.position == 'bottom') || (this.opt.currentValue.position == 'right'));

            this.$range = $('<div class="range-control"></div>').insertAfter(this.$el)
                .wrap('<div class="range-control-widget range-control-widget-' + this.opt.orientation + '"></div>')
                .addClass(this.opt.className);

            this.rangeOffset = (this.isVertical) ? this.$range.offset().top : this.$range.offset().left;
            this.rangeSize = (this.isVertical) ? this.$range.outerHeight() : this.$range.outerWidth();

            if (this.opt.scale) this.renderScale();

            if (this.opt.rangeType == 'range') {
                this.$track = $('<div class="range-control-track"></div>').appendTo(this.$range);
            }

            if (this.opt.currentValue) {
                this.$currentVal = $('<span class="range-control-current-value"></span>').insertAfter(this.$range)
                    .addClass('range-control-current-value-' + this.opt.currentValue.position);
            }

            this.handlesArr = [];

            if (!this.$el.val()) {
                switch (this.opt.rangeType) {
                    case "single":
                        this.$el.val(0);
                        break;
                    case "range":
                        this.$el.val('0' + this.opt.delim + '0');
                        break;
                    case "multiple":
                        var valStr = '';
                        for (var i = 0; i < this.opt.minHandles; i++) {
                            valStr += '0' + ((i != this.opt.minHandles - 1) ? this.opt.delim : '');
                        }
                        this.$el.val(valStr);
                        break;
                }
            }

            var values = this.parseValue();

            for (var i = 0; i < values.length; i++) {
                this.handlesArr.push(new RangeHandle(this, values[i]));
            }

            this.renderRangeTrack();

            if (this.opt.disabled) {
                this.$range.addClass('range-control-disabled');
                return;
            }

            this.$range.on('mousedown.rangeControlMouseDown',function(event) {
                event.preventDefault();

                var isTargetHandle = $(event.target).hasClass('range-control-handle'),
                    currentIndex = 0;

                if ((isTargetHandle && event.shiftKey && !event.ctrlKey) || (!isTargetHandle && event.shiftKey)) {
                    //add new handle
                    if (context.opt.rangeType != 'multiple') return;
                    if (context.handlesArr.length == context.opt.maxHandles) return;
                    context.currentHandle = new RangeHandle(context, 0);
                    context.handlesArr.push(context.currentHandle);
                    context.currentHandle.setValueFromPosition((context.isVertical) ? event.pageY : event.pageX);
                    context.currentHandle.setPositionFromValue(context.currentHandle.value);
                    context.setNewValue();
                    context.$el.triggerHandler('rangeControlAddHandle');
                }

                if (isTargetHandle && event.ctrlKey) {
                    //remove handle
                    if (context.opt.rangeType != 'multiple') return;
                    if (context.handlesArr.length == context.opt.minHandles) return;
                    if ($(event.target).hasClass('range-control-handle-active')) context.hideCurrentValue();
                    currentIndex = context.$range.children('.range-control-handle').index(event.target);
                    context.handlesArr[currentIndex].$handle.remove();
                    context.handlesArr.splice(currentIndex,1);
                    context.setNewValue();
                    context.$el.triggerHandler('rangeControlRemoveHandle');
                    return;
                }

                if (isTargetHandle && !event.shiftKey && !event.ctrlKey) {
                    //move currentIndex handle
                    context.slideStart();
                    if (!context.slideAllowed) return false;
                    context.slideStarted = true;
                    currentIndex = context.$range.children('.range-control-handle').index(event.target);
                    context.currentHandle = context.handlesArr[currentIndex];
                }

                if (!isTargetHandle && !event.shiftKey && !event.ctrlKey) {
                    //move closest handle
                    if (context.handlesArr.length == 0) return;
                    currentIndex = (context.opt.rangeType == 'single') ? 0 : context.findClosestHandle(event.pageX, event.pageY);
                    context.currentHandle = context.handlesArr[currentIndex];
                    context.currentHandle.setValueFromPosition((context.isVertical) ? event.pageY : event.pageX);
                    context.slide();
                }

                if (!isTargetHandle && event.ctrlKey) {
                    //do nothing
                    return;
                }

                $(document).on({
                    'mouseup.rangeControlMouseUp': function() {
                        $(document).off('.rangeControlMouseMove .rangeControlMouseUp');
                        if (context.slideAllowed) {
                            context.slideStarted = false;
                            context.$el.triggerHandler('rangeControlSlideStop');
                            context.setNewValue();
                        }
                    },
                    'mousemove.rangeControlMouseMove': function(event) {
                        context.currentHandle.setValueFromPosition((context.isVertical) ? event.pageY : event.pageX);
                        context.slide();
                    }
                });

                context.currentHandle.$handle.focus();
            });

        },

        slide: function () {
            if (!this.slideStarted) {
                this.slideStarted = true;
                this.slideStart();
                if (!this.slideAllowed) return false;
            }
            if (this.$el.triggerHandler('rangeControlSlide',this.currentHandle.value) !== false) {
                this.currentHandle.setPositionFromValue(this.currentHandle.value);
                this.renderRangeTrack();
                this.displayCurrentValue();
            }
        },

        slideStart: function () {
            this.slideAllowed = (this.$el.triggerHandler('rangeControlSlideStart') !== false);
        },

        findClosestHandle: function (x, y) {

            if (this.rangeOffset < 0) this.rangeOffset = (this.isVertical) ? this.$range.offset().top : this.$range.offset().left;
            if (this.rangeSize < 0) this.rangeSize = (this.isVertical) ? this.$range.outerHeight() : this.$range.outerWidth();

            var currElem, index = 0, distLeft = 0, distRight = 0, found = false,
                maxDistLeft = ((this.isVertical) ? y : x) - this.rangeOffset,
                maxDistRight = this.rangeOffset + this.rangeSize - ((this.isVertical) ? y : x);

            x -= $(document).scrollLeft();
            y -= $(document).scrollTop();
            var currX = x, currY = y;

            while (distLeft <= maxDistLeft) {
                if (this.isVertical) {
                    currY = y - distLeft;
                } else {
                    currX = x - distLeft;
                }
                currElem = document.elementFromPoint(currX, currY);
                if (currElem && $(currElem).hasClass('range-control-handle')) {
                    index = this.$range.children('.range-control-handle').index(currElem);
                    found = true;
                    break;
                }
                distLeft++;
            }
            while (distRight <= maxDistRight) {
                if (this.isVertical) {
                    currY = y + distRight;
                } else {
                    currX = x + distRight;
                }
                currElem = document.elementFromPoint(currX, currY);
                if (currElem && $(currElem).hasClass('range-control-handle')) {
                    if (found && (distRight < distLeft)) {
                        index = this.$range.children('.range-control-handle').index(currElem);
                        break;
                    }
                }
                distRight++;
            }
            return index;
        },

        renderRangeTrack: function () {
            if (this.opt.rangeType == 'range') {
                if (this.isVertical) {
                    this.$track.css({
                        "top": this.handlesArr[0].$handle.position().top,
                        "bottom": this.$range.height() - this.handlesArr[1].$handle.position().top
                    });
                } else {
                    this.$track.css({
                        "left": this.handlesArr[0].$handle.position().left,
                        "right": this.$range.width() - this.handlesArr[1].$handle.position().left
                    });
                }
                this.handlesArr[0].settings.maxBound = this.handlesArr[1].value;
                this.handlesArr[1].settings.minBound = this.handlesArr[0].value;
            }
        },

        setNewValue: function () {
            var newValues = [], valueStr;
            for (var i = 0; i < this.handlesArr.length; i++) {
                newValues.push(this.handlesArr[i].value);
            }
            valueStr = newValues.sort(function(a, b) {return a - b;}).join(this.opt.delim);
            if (this.$el.val() != valueStr) {
                this.$el.val(valueStr).triggerHandler('rangeControlChange');
            }
        },

        changeInputValue: function () {
            if (!this.$el.val()) {
                this.$el.val((this.opt.rangeType == 'range') ? '0' + this.opt.delim + '0' : 0);
            }

            var values = this.parseValue(), handle;
            if (this.opt.rangeType == 'multiple') {
                while (this.handlesArr.length < values.length) {
                    this.handlesArr.push(new RangeHandle(this, 0));
                    //this.hideCurrentValue();
                }
                while (this.handlesArr.length > values.length) {
                    this.handlesArr[this.handlesArr.length - 1].$handle.remove();
                    this.handlesArr.pop();
                }
            }
            for (var i = 0; i < values.length; i++) {
                handle = this.handlesArr[i];
                values[i] = handle.normalizeValueToStep(values[i]);
                handle.value = values[i];
                handle.setPositionFromValue(handle.value);
            }
            this.renderRangeTrack();

            this.$el.val(values.join(this.opt.delim)).triggerHandler('rangeControlChange');
        },

        displayCurrentValue: function () {
            if (this.opt.currentValue) {
                this.$currentVal.text(this.currentHandle.value);
                var handleOffset = this.currentHandle.$handle.offset(),
                    currentValSize = {
                        width: this.$currentVal.outerWidth(true),
                        height: this.$currentVal.outerHeight(true)
                    },
                    currentValMargin = {
                        top: this.isVertical * (Math.floor((currentValSize.height - this.currentHandle.settings.handleSize) / 2)),
                        left: (!this.isVertical) * (Math.floor((currentValSize.width - this.currentHandle.settings.handleSize) / 2))
                    };
                this.$currentVal.offset({
                    left: handleOffset.left + this.isVertical * (this.currentValPos * this.currentHandle.$handle.outerWidth() - (!this.currentValPos) * currentValSize.width) - currentValMargin.left,
                    top: handleOffset.top + (!this.isVertical) * (this.currentValPos * this.currentHandle.$handle.outerHeight() - (!this.currentValPos) * currentValSize.height) - currentValMargin.top
                });
            }
        },

        hideCurrentValue: function () {
            if (this.opt.currentValue) {
                this.$currentVal.offset({left: -10000});
            }
        },

        renderScale: function () {

            this.$scale = $('<ul class="range-control-scale"></ul>').addClass('range-control-scale-' + this.opt.scale.position);

            if ((this.opt.scale.position == 'top') || (this.opt.scale.position == 'left')) {
                this.$scale.insertBefore(this.$range);
            } else {
                this.$scale.insertAfter(this.$range);
            }

            var offset = 0, $label, scaleWidth = 0,
                labelValues = this.getScaleLabelValues();

            for (var i = 0; i < labelValues.length; i++) {
                $label = $('<li>' + labelValues[i] + '</li>').appendTo(this.$scale);
                if (this.isVertical) {
                    $label.css({
                        "top": offset + '%',
                        "margin-top": -$label.outerHeight() / 2
                    });
                    scaleWidth = Math.max(scaleWidth, $label.outerWidth(true));
                } else {
                    $label.css({
                        "left": offset + '%',
                        "margin-left": -$label.outerWidth() / 2
                    });
                }
                offset += 100 / (labelValues.length - 1);
            }

            if (this.opt.scale.position == 'left') this.$scale.width(scaleWidth);
        },

        getScaleLabelValues: function () {
            var labelsCount = Math.floor((this.opt.max - this.opt.min) / this.opt.scale.interval) + 1,
                labels = [];

            if (!this.opt.scale.labels) {
                for (var i = 0; i < labelsCount; i++) labels.push('&nbsp;');
                return labels;
            }

            if ($.isArray(this.opt.scale.labels)) {
                labels = this.opt.scale.labels.slice(0,labelsCount);
                for (var i = labels.length; i < labelsCount; i++) labels.push('&nbsp;');
                return labels;
            }

            var val = this.opt.min;
            for (var i = 0; i < labelsCount - 1; i++) {
                labels.push(val);
                val += this.opt.scale.interval;
            }
            labels.push(this.opt.max);
            return labels;
        },

        normalizeOptions: function () {
            if (this.opt.max < this.opt.min) this.opt.max = this.opt.min;
            this.opt.max = Math.floor((this.opt.max - this.opt.min) / this.opt.step) * this.opt.step;

            if ((this.opt.disabled !== false)) this.opt.disabled = true;
            if ((this.opt.allowPaging !== false)) this.opt.allowPaging = true;

            this.opt.orientation = (this.opt.orientation == 'vertical') ? 'vertical' : 'horizontal';

            if (this.opt.currentValue) {
                if (this.opt.orientation == 'vertical') {
                    this.opt.currentValue.position = ((this.opt.currentValue.position == 'right') || (this.opt.currentValue.position == 'bottom')) ? 'right' : 'left';
                } else {
                    this.opt.currentValue.position = ((this.opt.currentValue.position == 'bottom') || (this.opt.currentValue.position == 'right')) ? 'bottom' : 'top';
                }
            }

            if (this.opt.scale) {
                if (this.opt.orientation == 'vertical') {
                    this.opt.scale.position = ((this.opt.scale.position == 'left') || (this.opt.scale.position == 'top')) ? 'left' : 'right';
                } else {
                    this.opt.scale.position = ((this.opt.scale.position == 'top') || (this.opt.scale.position == 'left')) ? 'top' : 'bottom';
                }

                if (this.opt.scale.interval < this.opt.step) this.opt.scale.interval = this.opt.step;
                this.opt.scale.interval -= this.opt.scale.interval % this.opt.step;
            }

            switch (this.opt.rangeType) {
                case 'range':
                    this.opt.maxHandles = 2;
                    break;
                case 'multiple':
                    var maxHandlesByStep = Math.floor((this.opt.max - this.opt.min) / this.opt.step);
                    if ((this.opt.maxHandles <= 1) || (this.opt.maxHandles > maxHandlesByStep)) this.opt.maxHandles = maxHandlesByStep;
                    break;
                default:
                    this.opt.rangeType = 'single';
                    this.opt.maxHandles = 1;
                    break;
            }
        },

        parseValue: function () {
            if (!this.$el.val()) return [];
            return this.$el.val().toString().split(this.opt.delim).slice(0,this.opt.maxHandles).sort(function(a, b) {return a - b;});
        },

        destroy: function(){
            this.$el.off('.rangeControlEvent').data('rangeControl',null);
            this.$range.parent().remove();
        }
    });

    $.extend(RangeHandle.prototype, {

        normalizeValueToStep: function (val) {
            if (val < this.settings.minBound) return this.settings.minBound;
            if (val > this.settings.maxBound) return this.settings.maxBound;
            var mod = val % this.settings.step,
                newVal = (mod < this.settings.step / 2) ? (val - mod) : (val - mod + this.settings.step);
            return parseFloat(newVal.toFixed(5));
        },

        setPositionFromValue: function (val) {
            var newCoord = Math.round(100 * (val - this.settings.min) / (this.settings.max - this.settings.min)) + '%';
            if (this.settings.isVertical) {
                this.$handle.css({"top": newCoord});
            } else {
                this.$handle.css({"left": newCoord});
            }
        },

        setValueFromPosition: function (coord) {
            this.value = this.normalizeValueToStep((coord - Math.round(this.settings.handleSize / 2) - this.settings.rangeOffset) * (this.settings.max - this.settings.min) / this.settings.rangeSize + this.settings.min);
        }

    });

})(jQuery);