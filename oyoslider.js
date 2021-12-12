/*!
 * oyoslider.js 1.0
 * tested with jQuery 3.4.0
 * http://www.oyoweb.nl
 *
 * © 2021 oYoSoftware
 * MIT License
 *
 * oyoslider is a tool to define an alternative slider element which is browser independant
 */

var scriptfolder;

(function () {
    var src = $("script").last().attr("src");
    scriptfolder = src.substring(0, src.lastIndexOf("/") + 1);
    var link = document.createElement("link");
    $(link).attr("rel", "stylesheet");
    var href = src.substring(0, src.length - 3) + ".css";
    $(link).attr("href", href);
    $("head").append(link);
})();

function oyoSlider(sliderWidth, sliderHeight, sliderBorderRadius, trackWidth, trackHeight, trackBorderRadius, thumbWidth, thumbHeight, thumbBorderRadius) {

    var defaultBeforeColor = "#527FC3";
    var defaultAfterColor = "#B3CEB3";
    var trackMin = 0;
    var trackMax = 100;
    var trackStep = 1;
    var trackValue = 0;

    var slider = document.createElement("div");
    $(slider).addClass("oyoslider");
    $(slider).attr("tabindex", 0);
    $(slider).width(300);
    $(slider).height(12);
    $(slider).css("outline", "none");
    slider.disabled = false;

    var track = document.createElement("div");
    $(track).attr("class", "oyotrack");
    $(track).width(288);
    $(track).height(4);
    $(slider).append(track);

    var thumb = document.createElement("div");
    $(thumb).attr("class", "oyothumb");
    $(thumb).width(12);
    $(thumb).height(12);
    $(track).append(thumb);

    var trackRange = document.createElement("div");
    $(trackRange).attr("class", "oyotrackrange");
    $(trackRange).width(288);
    $(trackRange).height(4);
    $(track).append(trackRange);

    var trackBefore = document.createElement("div");
    $(trackBefore).attr("class", "oyotrackbefore");
    $(trackBefore).height(4);
    $(trackRange).append(trackBefore);

    var trackAfter = document.createElement("div");
    $(trackAfter).attr("class", "oyotrackafter");
    $(trackAfter).width(288);
    $(trackAfter).height(4);
    $(trackRange).append(trackAfter);

    if (sliderWidth !== undefined) {
        $(slider).width(sliderWidth);
    }
    if (sliderHeight !== undefined) {
        $(slider).height(sliderHeight);
    }
    if (sliderBorderRadius !== undefined) {
        $(slider).css("border-radius", sliderBorderRadius);
    }
    if (trackWidth !== undefined) {
        $(track).width(trackWidth);
        $(trackRange).width(trackWidth);
        $(trackAfter).width(trackWidth);
    }
    if (trackHeight !== undefined) {
        $(track).height(trackHeight);
        $(trackRange).height(trackHeight);
        $(trackBefore).height(trackHeight);
        $(trackAfter).height(trackHeight);
    }
    if (trackBorderRadius !== undefined) {
        $(track).css("border-radius", trackBorderRadius);
        $(trackBefore).css("border-radius", trackBorderRadius);
        $(trackAfter).css("border-radius", trackBorderRadius);
    }
    if (thumbWidth !== undefined) {
        $(thumb).width(thumbWidth);
    }
    if (thumbHeight !== undefined) {
        $(thumb).height(thumbHeight);
    }
    if (thumbBorderRadius !== undefined) {
        $(thumb).css("border-radius", thumbBorderRadius);
    }

    $(slider).on("mouseover", mouseOver);
    $(slider).on("mouseout", mouseOut);
    $(slider).on("mousedown", mouseDown);
    $(document).on("mousemove", mouseMove);
    $(document).on("mouseup", mouseUp);
    $(slider).on("click", click);
    $(slider).on("keydown", keydown);

    function mouseOver(event) {
        if (!slider.disabled) {
            $(thumb).css("display", "block");
            $("body").css("cursor", "pointer");
        }
    }

    function mouseOut(event) {
        if (!slider.disabled) {
            var mousedown = (event.buttons === 1);
            if (mousedown && $(thumb).hasClass("oyoactive")) {
                $(thumb).css("display", "block");
                $("body").css("cursor", "pointer");
            } else {
                $(thumb).removeClass("oyoactive");
                $(thumb).css("display", "none");
                $("body").css("cursor", "default");
            }
        }
    }

    function mouseDown(event) {
        if (!slider.disabled) {
            $(thumb).addClass("oyoactive");
        }
    }

    function mouseMove(event) {
        if (!slider.disabled) {
            var mousedown = (event.buttons === 1);
            if (mousedown && $(thumb).hasClass("oyoactive")) {
                var offsetX = $(track).offset().left + parseInt($(track).css("border-left-width"));
                trackValue = trackMin + (trackMax - trackMin) * (event.pageX - offsetX) / $(track).width();
                changeThumbPosition();
                document.getSelection().removeAllRanges();
            } else {
                var elements = $(slider).add($(slider).find("*")).toArray();
                if (elements.indexOf(event.target) === -1 && $(thumb).hasClass("oyoactive")) {
                    $(thumb).removeClass("oyoactive");
                    $(thumb).css("display", "none");
                    $("body").css("cursor", "default");
                }
            }
        }
    }

    function mouseUp(event) {
        if (!slider.disabled) {
            var elements = $(slider).add($(slider).find("*")).toArray();
            if (elements.indexOf(event.target) === -1 && $(thumb).hasClass("oyoactive")) {
                $(thumb).removeClass("oyoactive");
                $(thumb).css("display", "none");
                $("body").css("cursor", "default");
            }
        }
    }

    function click(event) {
        if (!slider.disabled) {
            var offsetX = $(track).offset().left + parseInt($(track).css("border-left-width"));
            trackValue = trackMin + (trackMax - trackMin) * (event.pageX - offsetX) / $(track).width();
            changeThumbPosition();
        }
    }

    function keydown(event) {
        if (!slider.disabled) {
            if (event.keyCode === 37) {
                trackValue -= trackStep;
            }
            if (event.keyCode === 39) {
                trackValue += trackStep;
            }
            if (event.keyCode === 37 || event.keyCode === 39) {
                changeThumbPosition();
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }

    function checkThumbValue() {
        if (trackValue < trackMin) {
            trackValue = trackMin;
        }
        if (trackValue > trackMax) {
            trackValue = trackMax;
        }
    }

    function changeThumbPosition() {
        checkThumbValue();
        var left = (trackValue - trackMin) / (trackMax - trackMin) * $(track).width() - $(thumb).width() / 2;
        $(thumb).css("left", left);
        var width = left + $(thumb).width() / 2;
        $(trackBefore).width(width);
    }

    slider.reset = function () {
        trackValue = trackMin;
        changeThumbPosition();
        $(thumb).removeClass("oyoactive");
    };

    slider.setKeyControlElement = function (element, active) {
        if (active === undefined) {
            active = true;
        }
        $(slider).off("keydown", keydown);
        if (active) {
            $(element).on("keydown", keydown);
        } else {
            $(element).off("keydown", keydown);
        }
    };

    Object.defineProperty(slider, "active", {
        get: function () {
            return $(thumb).hasClass("oyoactive");
        }
    });

    Object.defineProperty(slider, "min", {
        get: function () {
            return trackMin;
        },
        set: function (value) {
            trackMin = value;
        }
    });

    Object.defineProperty(slider, "max", {
        get: function () {
            return trackMax;
        },
        set: function (value) {
            trackMax = value;
        }
    });

    Object.defineProperty(slider, "step", {
        get: function () {
            return trackStep;
        },
        set: function (value) {
            trackStep = value;
        }
    });

    Object.defineProperty(slider, "value", {
        get: function () {
            return trackValue;
        },
        set: function (value) {
            trackValue = value;
            changeThumbPosition();
        }
    });

    slider.enable = function () {
        slider.disabled = false;
        $(slider).css("opacity", 1);
    };

    slider.disable = function () {
        slider.disabled = true;
        $(slider).css("opacity", 0.5);
        $(thumb).removeClass("oyoactive");
        $(thumb).css("display", "none");
        $("body").css("cursor", "default");
    };

    slider.changeColor = function (color) {
        $(slider).css("background-color", color);
    };

    slider.changeThumbColor = function (color) {
        $(thumb).css("background-color", color);
    };

    slider.changeTrackColors = function (beforeColor, afterColor) {
        if (afterColor === undefined) {
            afterColor = beforeColor;
        }
        $(trackBefore).css("background-color", beforeColor);
        $(trackAfter).css("background-color", afterColor);
    };

    slider.resetColors = function () {
        $(slider).css("background-color", "black");
        $(thumb).css("background-color", "white");
        $(trackBefore).css("background-color", defaultBeforeColor);
        $(trackAfter).css("background-color", defaultAfterColor);
    };

    slider.change = function (width, height, borderRadius, color) {
        if (width !== undefined) {
            var oldSliderWidth = $(slider).width();
            $(slider).width(width);
            var sliderWidthChange = $(slider).width() - oldSliderWidth;
            var trackWidth = $(track).width() + sliderWidthChange;
            slider.changeTrack(trackWidth);
        }
        if (height !== undefined) {
            $(slider).height(height);
        }
        if (borderRadius !== undefined) {
            $(slider).css("border-radius", borderRadius);
        }
        if (color !== undefined) {
            $(slider).css("background-color", color);
        }
    };

    slider.changeThumb = function (width, height, borderRadius, color) {
        if (width !== undefined) {
            $(thumb).width(width);
        }
        if (height !== undefined) {
            $(thumb).height(height);
        }
        if (borderRadius !== undefined) {
            $(thumb).css("border-radius", borderRadius);
        }
        if (color !== undefined) {
            $(thumb).css("background-color", color);
        }
    };

    slider.changeTrack = function (width, height, borderRadius, beforeColor, afterColor) {
        if (width !== undefined) {
            $(track).width(width);
            $(trackRange).width(width);
            $(trackAfter).width(width);
        }
        if (height !== undefined) {
            $(track).height(height);
            $(trackRange).height(height);
            $(trackBefore).height(height);
            $(trackAfter).height(height);
        }
        if (borderRadius !== undefined) {
            $(track).css("border-radius", borderRadius);
            $(trackBefore).css("border-radius", borderRadius);
            $(trackAfter).css("border-radius", borderRadius);
        }
        if (beforeColor !== undefined) {
            $(trackBefore).css("background-color", beforeColor);
        }
        if (afterColor !== undefined) {
            $(trackAfter).css("background-color", afterColor);
        }
    };

    return slider;
}
