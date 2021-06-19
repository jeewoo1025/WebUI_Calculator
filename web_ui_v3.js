let WebUI = {}

WebUI.WidgetTypes = {
    UNDEFINED:      "undefind",
    TEXT:           "text",
    IMAGE:          "image",
    PUSH_BUTTON:    "push_button",
    TEXT_FIELD:     "text_field",
    SWITCH:         "switch",
    
    CONTAINER: "container",
    ROW: "row",
    COLUMN: "column",

    GridView: "GRIDVIEW",
    RADIOBUTTON: "radiobutton"
};

WebUI.Alignment = {
    CENTER: "center",
    LEFT: "left",
    RIGHT: "right",
    TOP: "top",
    BOTTOM: "bottom"
};

WebUI.widgets = [];
WebUI.focused_widget = null;
WebUI.dragged_widget = null;
WebUI.hovered_widget = null;

WebUI.is_mouse_dragging = false;       
WebUI.mouse_drag_start = {x:0, y:0};
WebUI.mouse_drag_prev = {x:0, y:0};

WebUI.app = null;
WebUI.parser = math.parser();
WebUI.p_index = 0;
WebUI.bbi_audio = new Audio('resources/bbi.mp3');
WebUI.diring_audio = new Audio('resources/diring.mp3');
WebUI.bbong_audio = new Audio('resources/bbong.mp3');
WebUI.memory = [];   // M (M+, M-, MR, MC) 기능에 저장하는 값들

WebUI.initialize = function() {
    this.canvas = new fabric.Canvas("c", {
        backgroundColor: "#000",
        hoverCursor: "default",
        selection: false,
        width: 450,
        height: 690
    });

    //
    $(document).keypress(function(event) {
        WebUI.handleKeyPress(event);
    });
    $(document).mousedown(function(event) {
        let p = {x: event.pageX, y: event.pageY};
        WebUI.handleMouseDown(p);
    });
    $(document).mouseup(function(event) {
        let p = {x: event.pageX, y: event.pageY};
        WebUI.handleMouseUp(p);
    });
    $(document).mousemove(function(event) {
        let p = {x: event.pageX, y: event.pageY};
        WebUI.handleMouseMove(p);
    });

    //
    WebUI.initWidgets();
    WebUI.initVisualItems();
    WebUI.layoutWhenResourceReady();
}

WebUI.initWidgets = function() {
    // result 
    displayValue = '0';
    displayText = new WebUI.Text(displayValue, {desired_size:{width:405, height:40}, font_size:16});

    // 라디오 그룹
    WebUI.radioButtons = [
        new WebUI.RadioButton('일반용 계산기', 'common', true, {width:120, height:50}),
        new WebUI.RadioButton('공학용 계산기', 'engineering', false, {width:120, height:50})
    ];

    // 하위 그리드
    WebUI.subFunctions = [
        new WebUI.CalcButton("M+", {width:80, height:25}, false, {fill_color: '#dafafd', opacity: 0}),
        new WebUI.CalcButton("M-", {width:80, height:25}, false, {fill_color: '#dafafd', opacity: 0}),
        new WebUI.CalcButton("MR", {width:80, height:25}, false, {fill_color: '#dafafd', opacity: 0}),
        new WebUI.CalcButton("MC", {width:80, height:25}, false, {fill_color: '#dafafd', opacity: 0}),
        new WebUI.CalcButton("BIN", {width:80, height:25}, false, {fill_color: 'gold', opacity: 0}),
        new WebUI.CalcButton("QUA", {width:80, height:25}, false, {fill_color: 'gold', opacity: 0}),
        new WebUI.CalcButton("OCT", {width:80, height:25}, false, {fill_color: 'gold', opacity: 0}),
        new WebUI.CalcButton("HEX", {width:80, height:25}, false, {fill_color: 'gold', opacity: 0}),
    ];

    WebUI.subCalcButtons = [
        new WebUI.CalcButton("sin", {width:45 , height:30}, false, {fill_color: '#fff', opacity: 0}),
        new WebUI.CalcButton("log", {width: 45, height:30}, false, {fill_color: '#fff', opacity: 0}),
        new WebUI.CalcButton("i", {width: 45, height:30}, false, {fill_color: '#dafafd', opacity: 0}),
        new WebUI.CalcButton("==", {width: 45, height:30}, false, {fill_color: '#fff', opacity: 0}),
        new WebUI.CalcButton("!=", {width: 45, height:30}, false, {fill_color: '#fff', opacity: 0}),
        new WebUI.CalcButton("f", {width: 45, height:30}, false, {fill_color: '#ffc0cb', opacity: 0}),
        new WebUI.CalcButton("x", {width: 45, height:30}, false, {fill_color: '#ffc0cb', opacity: 0}),
        new WebUI.CalcButton("cos", {width:45 , height:30}, false, {fill_color: '#fff', opacity: 0}),
        new WebUI.CalcButton("sqrt", {width: 45, height:30}, false, {fill_color: '#fff', opacity: 0}),
        new WebUI.CalcButton("e", {width: 45, height:30}, false, {fill_color: '#dafafd', opacity: 0}),
        new WebUI.CalcButton("<=", {width: 45, height:30}, false, {fill_color: '#fff', opacity: 0}),
        new WebUI.CalcButton(">=", {width: 45, height:30}, false, {fill_color: '#fff', opacity: 0}),
        new WebUI.CalcButton("g", {width: 45, height:30}, false, {fill_color: '#ffc0cb', opacity: 0}),
        new WebUI.CalcButton("y", {width: 45, height:30}, false, {fill_color: '#ffc0cb', opacity: 0}),
        new WebUI.CalcButton("tan", {width:45 , height:30}, false, {fill_color: '#fff', opacity: 0}),
        new WebUI.CalcButton("exp", {width: 45, height:30}, false, {fill_color: '#fff', opacity: 0}),
        new WebUI.CalcButton("pi", {width: 45, height:30}, false, {fill_color: '#dafafd', opacity: 0}),
        new WebUI.CalcButton("<", {width: 45, height:30}, false, {fill_color: '#fff', opacity: 0}),
        new WebUI.CalcButton(">", {width: 45, height:30}, false, {fill_color: '#fff', opacity: 0}),
        new WebUI.CalcButton("w", {width: 45, height:30}, false, {fill_color: '#ffc0cb', opacity: 0}),
        new WebUI.CalcButton("z", {width: 45, height:30}, false, {fill_color: '#ffc0cb', opacity: 0}),
        new WebUI.CalcButton("cross", {width:45 , height:30}, false, {fill_color: '#fff', opacity: 0}),
        new WebUI.CalcButton("det", {width: 45, height:30}, false, {fill_color: '#fff', opacity: 0}),
        new WebUI.CalcButton(";", {width: 45, height:30}, false, {fill_color: '#fff', opacity: 0}),
        new WebUI.CalcButton("[", {width: 45, height:30}, false, {fill_color: '#fff', opacity: 0}),
        new WebUI.CalcButton("]", {width: 45, height:30}, false, {fill_color: '#fff', opacity: 0}),
        new WebUI.CalcButton(":", {width: 45, height:30}, false, {fill_color: '#fff', opacity: 0}),
        new WebUI.CalcButton("=", {width: 45, height:30}, false, {fill_color: '#ffc0cb', opacity: 0}),
    ];
    

    WebUI.app = new WebUI.Row({
        position: {left: 20, top: 10},
        children: [
            new WebUI.Container({
                desired_size: {width: 400, height: 50},
                horizontal_alignment: WebUI.Alignment.CENTER,
                vertical_alignment: WebUI.Alignment.CENTER,
                children: [ new WebUI.Text('WebUI Calculator', {font_size:30, text_color: 'yellow', font_weight:800}) ]
            }),
            new WebUI.Container({
                desired_size: {width: 400, height: 50},
                horizontal_alignment: WebUI.Alignment.CENTER,
                vertical_alignment: WebUI.Alignment.CENTER,
                children: [ displayText ]
            }),
            new WebUI.Column({
                children: [
                    new WebUI.Container({
                        desired_size: {width: 180, height: 50},
                        horizontal_alignment: WebUI.Alignment.CENTER,
                        vertical_alignment: WebUI.Alignment.CENTER,
                        children: [WebUI.radioButtons[0]]
                    }),
                    new WebUI.Container({
                        desired_size: {width: 180, height: 50},
                        horizontal_alignment: WebUI.Alignment.CENTER,
                        vertical_alignment: WebUI.Alignment.CENTER,
                        children: [WebUI.radioButtons[1]]
                    }),
                ]
            }),
            new WebUI.Row({
                children: [
                    new WebUI.Column({
                        desired_size: {width: 400, height: 30},
                        children: [ new WebUI.GridView(4, 2, { children: WebUI.subFunctions }) ]
                    }),
                    new WebUI.Column({
                        desired_size: {width: 400, height: 255},
                        children: [
                            new WebUI.GridView(3, 4, {
                                children: [
                                    new WebUI.CalcButton("7", {width:50, height:50}, true, {fill_color: '#333333', text_color: '#ffffff'}),
                                    new WebUI.CalcButton("8", {width:50, height:50}, true, {fill_color: '#333333', text_color: '#ffffff'}),
                                    new WebUI.CalcButton("9", {width:50, height:50}, true, {fill_color: '#333333', text_color: '#ffffff'}),
                                    new WebUI.CalcButton("4", {width:50, height:50}, true, {fill_color: '#333333', text_color: '#ffffff'}),
                                    new WebUI.CalcButton("5", {width:50, height:50}, true, {fill_color: '#333333', text_color: '#ffffff'}),
                                    new WebUI.CalcButton("6", {width:50, height:50}, true, {fill_color: '#333333', text_color: '#ffffff'}),
                                    new WebUI.CalcButton("1", {width:50, height:50}, true, {fill_color: '#333333', text_color: '#ffffff'}),
                                    new WebUI.CalcButton("2", {width:50, height:50}, true, {fill_color: '#333333', text_color: '#ffffff'}),
                                    new WebUI.CalcButton("3", {width:50, height:50}, true, {fill_color: '#333333', text_color: '#ffffff'}),
                                    new WebUI.CalcButton(".", {width:50, height:50}, true, {fill_color: '#333333', text_color: '#ffffff'}),
                                    new WebUI.CalcButton("0", {width:50, height:50}, true, {fill_color: '#333333', text_color: '#ffffff'}),
                                    new WebUI.CalcButton(",", {width:50, height:50}, true, {fill_color: '#333333', text_color: '#ffffff'})
                                ]
                            }),
                            new WebUI.GridView(2, 4, {
                                children: [
                                    new WebUI.CalcButton("+", {width:50, height:50}, true, {fill_color: '#FE9E09', text_color: '#ffffff'}),
                                    new WebUI.CalcButton("%", {width:50, height:50}, true, {fill_color: '#FE9E09', text_color: '#ffffff'}),
                                    new WebUI.CalcButton("-", {width:50, height:50}, true, {fill_color: '#FE9E09', text_color: '#ffffff'}),
                                    new WebUI.CalcButton("^", {width:50, height:50}, true, {fill_color: '#FE9E09', text_color: '#ffffff'}),
                                    new WebUI.CalcButton("*", {width:50, height:50}, true, {fill_color: '#FE9E09', text_color: '#ffffff'}),
                                    new WebUI.CalcButton("(", {width:50, height:50}, true, {fill_color: '#FE9E09', text_color: '#ffffff'}),
                                    new WebUI.CalcButton("/", {width:50, height:50}, true, {fill_color: '#FE9E09', text_color: '#ffffff'}),
                                    new WebUI.CalcButton(")", {width:50, height:50}, true, {fill_color: '#FE9E09', text_color: '#ffffff'})
                                ]
                            }),
                            new WebUI.GridView(1, 3, {
                                children: [
                                    new WebUI.CalcButton("←", {width:50, height:50}, true, {fill_color: '#A5A5A5', text_color: '#ffffff'}),
                                    new WebUI.CalcButton("CL", {width:50, height:50}, true, {fill_color: '#A5A5A5', text_color: '#ffffff'}),
                                    new WebUI.CalcButton("EV", {width:50, height:110}, true, {fill_color: '#A5A5A5', text_color: '#ffffff'})
                                ]
                            }),
                        ]
                    }),
                    new WebUI.Column({
                        desired_size: {width: 400, height: 40},
                        children: [ new WebUI.GridView(7, 4, { children: WebUI.subCalcButtons }) ]
                    }),
                ]
            })
        ]
    })
}

//
WebUI.initVisualItems = function() {
    WebUI.widgets.forEach(widget => {
        widget.initVisualItems();
    });
}

WebUI.layoutWhenResourceReady = function() {
    let is_resource_loaded = true;
    for (let i in WebUI.widgets) {
        let widget = WebUI.widgets[i];
        if (!widget.is_resource_ready) {
            is_resource_loaded = false;
            break;
        }
    }

    if (!is_resource_loaded) {
        setTimeout(arguments.callee, 50);
    }
    else {
        WebUI.app.layout();
        WebUI.canvas.requestRenderAll();
    }
}

WebUI.handleKeyPress = function(event) {
    let is_handled = false;

    if (WebUI.focused_widget) {
        is_handled = WebUI.focused_widget.handleKeyPress(event) || is_handled;
    }

    if (is_handled) {
        WebUI.canvas.requestRenderAll();
    }
}

WebUI.handleMouseDown = function(window_p) {
    let is_handled = false;

    if (WebUI.isInCanvas(window_p)) {
        let canvas_p = WebUI.transformToCanvasCoords(window_p);        

        WebUI.is_mouse_dragging = true;
        WebUI.mouse_drag_start = canvas_p;
        WebUI.mouse_drag_prev = canvas_p;

        let widget = WebUI.findWidgetOn(canvas_p);
        if (widget) {
            WebUI.focused_widget = widget;    

            if (widget.is_draggable) {
                WebUI.dragged_widget = widget;
            }
            else {
                WebUI.dragged_widget = null;
            }

            is_handled = widget.handleMouseDown(canvas_p) || is_handled;
        }
        else {
            WebUI.focused_widget = null;
            WebUI.dragged_widget = null;
        }
    }
    else {
        WebUI.is_mouse_dragging = false;
        WebUI.mouse_drag_start = {x:0, y:0};
        WebUI.mouse_drag_prev = {x:0, y:0};

        WebUI.focused_widget = null;
        WebUI.dragged_widget = null;
    }

    if (is_handled) {
        WebUI.canvas.requestRenderAll();
    }
}

WebUI.handleMouseMove = function(window_p) {
    let canvas_p = WebUI.transformToCanvasCoords(window_p);
    let is_handled = false;

    let widget = WebUI.findWidgetOn(canvas_p);
    if (widget != WebUI.hovered_widget) {
        if (WebUI.hovered_widget != null) {
            is_handled = WebUI.hovered_widget.handleMouseExit(canvas_p) || is_handled;
        }
        if (widget != null) {
            is_handled = widget.handleMouseEnter(canvas_p) || is_handled;
        }
        WebUI.hovered_widget = widget;
    }
    else {
        if (widget) {
            is_handled = widget.handleMouseMove(canvas_p) || is_handled;
        }
    }

    if (WebUI.is_mouse_dragging) {
        if (WebUI.dragged_widget != null) {
            let tx = canvas_p.x - WebUI.mouse_drag_prev.x;
            let ty = canvas_p.y - WebUI.mouse_drag_prev.y;
            WebUI.dragged_widget.translate({x: tx, y: ty});

            is_handled = true;
        }
        WebUI.mouse_drag_prev = canvas_p;
    }

    if (is_handled) {
        WebUI.canvas.requestRenderAll();
    }
}

WebUI.handleMouseUp = function(window_p) {
    let is_handled = false;
    let canvas_p = WebUI.transformToCanvasCoords(window_p);

    let widget  = WebUI.findWidgetOn(canvas_p);
    if (widget) {
        is_handled = widget.handleMouseUp(canvas_p) || is_handled;
    }

    if (WebUI.is_mouse_dragging) {
        WebUI.is_mouse_dragging = false;
        WebUI.mouse_drag_start = {x:0, y:0};
        WebUI.mouse_drag_prev = {x:0, y:0};

        WebUI.dragged_widget = null;
        
        is_handled = true;
    }

    if (is_handled) {
        WebUI.canvas.requestRenderAll();
    }
}

WebUI.transformToCanvasCoords = function(window_p) {
    let rect = WebUI.canvas.getElement().getBoundingClientRect();
    let canvas_p = {
        x : window_p.x - rect.left,
        y : window_p.y - rect.top
    };
    return canvas_p;
}

WebUI.isInCanvas = function(window_p) {
    let rect = WebUI.canvas.getElement().getBoundingClientRect();
    if (window_p.x >= rect.left && 
        window_p.x < rect.left + rect.width &&
        window_p.y >= rect.top && 
        window_p.y < rect.top + rect.height) {
        return true;
    }
    else {
        return false;
    }
}

WebUI.findWidgetOn = function(canvas_p) {
    let x = canvas_p.x;
    let y = canvas_p.y;

    for (let i=0; i < this.widgets.length; i++) {
        let widget = this.widgets[i];

        if (x >= widget.position.left &&
            x <= widget.position.left + widget.size.width &&
            y >= widget.position.top &&
            y <= widget.position.top + widget.size.height) {
            return widget;
        }               
    }
    return null;
}

WebUI.maxSize = function(size1, size2) {
    let max_size = {width: 0, height: 0};
    max_size.width = (size1.width > size2.width) ? size1.width:size2.width;
    max_size.height = (size1.height > size2.height) ? size1.height:size2.height;
    return max_size;
}

WebUI.minSize = function(size1, size2) {
    let min_size = {width:0, height:0};
    min_size.width = (size1.width > size2.width) ? size1.width:size2.width;
    min_size.height = (size1.height > size2.height) ? size1.height:size2.height;
    return min_size;
}


//
WebUI.Widget = function(properties) {
    this.type = WebUI.WidgetTypes.UNDEFINED;
    
    this.is_draggable = false;
    this.is_movable = true;

    //
    this.parent = null;
    this.children = [];
    
    //
    this.position = {left: 0, top: 0};
    this.size = {width: 0, height: 0};

    //
    this.visual_items = [];
    this.is_resource_ready = false;

    //
    WebUI.widgets.push(this);

    if(properties != undefined) {
        for(let name in properties) {
            let value = properties[name];
            if(name == 'children') {
                value.forEach(child => {
                    child.parent = this;
                    this.children.push(child);
                });
            } else {
                this[name] = value;
            }
        }
    }

    //
    this.setDefaultProperty('desired_size', {width: 0, height: 0});
    this.setDefaultProperty('horizontal_alignment', WebUI.Alignment.CENTER);
    this.setDefaultProperty('vertical_alignment', WebUI.Alignment.TOP);
    this.setDefaultProperty('fill_color', 'white');
    this.setDefaultProperty('stroke_color', 'black');
    this.setDefaultProperty('stroke_width', 1);
    this.setDefaultProperty('text_align', 'left');
    this.setDefaultProperty('text_color', 'black');
    this.setDefaultProperty('font_family', 'System');
    this.setDefaultProperty('font_size', 20);
    this.setDefaultProperty('font_weight', 'normal');
    this.setDefaultProperty('padding', 5);
    this.setDefaultProperty('margin', 10);
    this.setDefaultProperty('opacity', 1);   // 불투명함 : 1, 투명함 : 0
}

WebUI.Widget.prototype.setDefaultProperty = function(name, value) {
    if (this[name] == undefined) {
        this[name] = value;
    }
}

WebUI.Widget.prototype.getBoundingRect = function() {
    return {
        left:   this.position.left, 
        top:    this.position.top,
        width:  this.size.width,
        height: this.size.height
    };
}

WebUI.Widget.prototype.layout = function() {
    this.measure();  // 크기 측정, Bottom-up

    this.arrange(this.position);  // 자식 배치, Top-down
}

WebUI.Widget.prototype.measure = function() {
    if(this.children.length > 0) {
        this.size_children = {width: 0, height: 0};
        this.children.forEach(child => {
            let size_child = child.measure();
            this.size_children = this.extendSizeChildren(this.size_children, size_child);
        });
        this.size = WebUI.maxSize(this.desired_size, this.size_children);
    } else {
        this.size.width += this.padding*2;
        this.size.height += this.padding*2;
    }
    return this.size;
}
 
WebUI.Widget.prototype.arrange = function(position) {
    this.moveTo(position);
    this.visual_items.forEach(item => { WebUI.canvas.add(item) });

    if(this.children.length > 0) {
        let left_spacing = 0, top_spacing = 0;

        if(this.size.width > this.size_children.width) {
            let room_width = this.size.width - this.size_children.width;

            if(this.horizontal_alignment == WebUI.Alignment.LEFT) {
                left_spacing = this.padding;
            } else if(this.horizontal_alignment == WebUI.Alignment.CENTER) {
                left_spacing = this.padding + room_width/2.0;
            } else if(this.horizontal_alignment == WebUI.Alignment.RIGHT) {
                left_spacing = this.padding + room_width;
            }
        }

        if(this.size.height > this.size_children.height) {
            let room_height = this.size.height - this.size_children.height;

            if(this.vertical_alignment == WebUI.Alignment.TOP) {
                top_spacing = this.padding;
            } else if(this.vertical_alignment == WebUI.Alignment.CENTER) {
                top_spacing = this.padding + room_height/2.0;
            } else if(this.vertical_alignment == WebUI.Alignment.BOTTOM) {
                top_spacing = this.padding + room_height;
            }
        }

        let next_position = {left: position.left + left_spacing, top: position.top + top_spacing};
        this.children.forEach(child => {
            child.arrange(next_position);
            next_position = this.calcNextPosition(next_position, child.size);
        });
    }
}

// default implementation that is expected to be overridden
WebUI.Widget.prototype.extendSizeChildren = function(size, child_size) {
    if (size.width < child_size.width)      size.width = child_size.width;
    if (size.height < child_size.height)    size.height = child_size.height;

    return size;
}

// default implementation that is expected to be overridden
WebUI.Widget.prototype.calcNextPosition = function(position, size) {
    let next_left = position.left + size.width;
    let next_top = position.top;

    return {left: next_left, top: next_top};
}


WebUI.Widget.prototype.initVisualItems = function() {
    this.is_resource_ready = true;
    return true;
}

WebUI.Widget.prototype.moveTo = function(p) {
    if(!this.is_movable)
    {
        return;
    }

    let tx = p.left - this.position.left;
    let ty = p.top - this.position.top;

    this.translate({x: tx, y: ty});
}

WebUI.Widget.prototype.translate = function(v) {
    if(!this.is_movable)
    {
        return;
    }

    this.position.left += v.x;
    this.position.top += v.y;

    this.visual_items.forEach(item => {
        item.left += v.x;
        item.top += v.y;
    });

    this.children.forEach(child_widget => {
        child_widget.translate(v);
    });
}

WebUI.Widget.prototype.destroy = function() {
    if (this == WebUI.focused_widget) WebUI.focused_widget = null;
    if (this == WebUI.dragged_widget) WebUI.dragged_widget = null;
    if (this == WebUI.hovered_widget) WebUI.hovered_widget = null;

    this.visual_items.forEach(item => {
        WebUI.canvas.remove(item);
    });
    this.visual_items = [];
    
    let index = WebUI.widgets.indexOf(this);
    if(index > -1)
    {
        WebUI.widgets.splice(index, 1);
    }

    this.children.forEach(child_widget => {
        child_widget.destroy();
    });
    this.children = [];
}

WebUI.Widget.prototype.handleKeyPress = function(event) {
    return false;
}

WebUI.Widget.prototype.handleMouseDown = function(canvas_p) {
    return false;
}

WebUI.Widget.prototype.handleMouseMove = function(canvas_p) {
    return false;
}

WebUI.Widget.prototype.handleMouseUp = function(canvas_p) {
    return false;
}

WebUI.Widget.prototype.handleMouseEnter = function(canvas_p) {
    return false;
}

WebUI.Widget.prototype.handleMouseExit = function(canvas_p) {
    return false;
}

WebUI.Widget.prototype.handleResize = function() {
    return false;
}


//
WebUI.Container = function(properties) {
    WebUI.Widget.call(this, properties);
    this.type = WebUI.WidgetTypes.CONTAINER;
}

WebUI.Container.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Container.prototype.constructor = WebUI.Container;

WebUI.Container.prototype.extendSizeChildren = function(size, child_size) {
    if(size.width < child_size.width) size.width = child_size.width;
    if(size.height < child_size.height) size.height = child_size.height;
    return size;
}

WebUI.Container.prototype.calcNextPosition = function(position, size) {
    let next_left = position.left;
    let next_top = position.top;
    return {left:next_left, top:next_top};
}

//
WebUI.Column = function(properties) {
    WebUI.Widget.call(this, properties);

    this.type = WebUI.WidgetTypes.COLUMN;
}

WebUI.Column.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Column.prototype.constructor = WebUI.Column;

WebUI.Column.prototype.extendSizeChildren = function(size, child_size) {
    size.width += child_size.width;
    if(size.height < child_size.height) size.height = child_size.height;
    return size;
}

WebUI.Column.prototype.calcNextPosition = function(position, size) {
    let next_left = position.left + size.width;
    let next_top = position.top;
    return {left:next_left, top:next_top};
}


//
WebUI.Row = function(properties) {
    WebUI.Widget.call(this, properties);
    this.type = WebUI.WidgetTypes.ROW;
}

WebUI.Row.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Row.prototype.constructor = WebUI.Row;

WebUI.Row.prototype.extendSizeChildren = function(size, child_size) {
    if(size.width < child_size.width) size.width = child_size.width;
    size.height += child_size.height;
    return size;
}

WebUI.Row.prototype.calcNextPosition = function(position, size) {
    let next_left = position.left;
    let next_top = position.top + size.height;
    return {left: next_left, top:next_top};
}


// Text widget
WebUI.Text = function(label, properties) {
    WebUI.Widget.call(this, properties);

    this.type = WebUI.WidgetTypes.TEXT;
    this.label = label;
}

WebUI.Text.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Text.prototype.constructor = WebUI.Text;

WebUI.Text.prototype.initVisualItems = function() {
    let background = new fabric.Rect({
        left: this.position.left,
        top: this.position.top,
        width: this.desired_size.width,
        height: this.desired_size.height,
        fill: this.fill_color,
        stroke: this.stroke_color,
        strokeWidth: 1,
        selectable: false
    });

    let text = new fabric.Text(this.label, {
        left: this.position.left,
        top: this.position.top,
        selectable: false,
        fontFamily: this.font_family,
        fontSize:   this.font_size,
        fontWeight: this.font_weight,
        textAlign:  this.text_align,
        stroke:     this.text_color,
        fill:       this.text_color,
    });

    let bound = text.getBoundingRect();

    if(this.desired_size.width != 0) {
        text.left = this.position.left + this.padding*2;
        text.top = this.position.top + this.desired_size.height/2 - bound.height/2;
    } else {
        text.left = this.position.left + this.desired_size.width/2 - bound.width/2;
        text.top = this.position.top + this.desired_size.height/2 - bound.height/2;
    }

    this.size = this.desired_size;

    //
    this.visual_items.push(background);
    this.visual_items.push(text);
    this.is_resource_ready = true;
}

// Image widget
WebUI.Image = function(path, desired_size) {
    WebUI.Widget.call(this);

    this.type = WebUI.WidgetTypes.IMAGE;
    this.path = path;
    this.desired_size = desired_size;
}

WebUI.Image.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Image.prototype.constructor = WebUI.Image;

WebUI.Image.prototype.initVisualItems = function() {
    let widget = this;

    fabric.Image.fromURL(this.path, function(img) {
        if(widget.desired_size != undefined) {
            img.scaleToWidth(widget.desired_size.width);
            img.scaleToHeight(widget.desired_size.height);
            widget.size = widget.desired_size;
        } else {
            widget.size = {width: img.width, height:img.height};
        }

        img.set({left:widget.position.left, top:widget.position.top, selectable:false});

        widget.visual_items.push(img);
        widget.is_resource_ready = true;
    });
}


// PushButton widget
WebUI.PushButton = function(label, desired_size, properties) {
    WebUI.Widget.call(this, properties);

    this.type = WebUI.WidgetTypes.PUSH_BUTTON;
    this.label = label;       
    this.desired_size = desired_size;
    this.is_pushed = false;
    this.is_showing = true;   // default는 true

    this.font_size = 15;
    this.text_align = 'center';
}

WebUI.PushButton.prototype = Object.create(WebUI.Widget.prototype);
WebUI.PushButton.prototype.constructor = WebUI.PushButton;

WebUI.PushButton.prototype.initVisualItems = function() {
    let background = new fabric.Rect({
        left: this.position.left,
        top: this.position.top,
        width: this.desired_size.width,
        height: this.desired_size.height,
        fill: this.fill_color,
        stroke: this.stroke_color,
        strokeWidth: 1,
        selectable: false,
        opacity: this.opacity
    });

    let text = new fabric.Text(this.label, {
        left: this.position.left,
        top: this.position.top,
        selectable: false,
        fontFamily: this.font_family,
        fontSize:   this.font_size,
        fontWeight: this.font_weight,
        textAlign:  this.text_align,
        stroke:     this.text_color,
        fill:       this.text_color,
        opacity: this.opacity
    });

    let bound = text.getBoundingRect();
    text.left = this.position.left + this.desired_size.width/2 - bound.width/2;
    text.top = this.position.top + this.desired_size.height/2 - bound.height/2;
    this.size = this.desired_size;

    //
    this.visual_items.push(background);
    this.visual_items.push(text);
    this.is_resource_ready = true;
}

WebUI.PushButton.prototype.handleMouseDown = function() {
    if(!this.is_pushed && this.is_showing) {
        this.translate({x:0, y:5});
        this.is_pushed = true;

        if(this.onPushed != undefined) {
            this.onPushed.call(this);
        }
        return true;
    } else {
        return false;
    }
}

WebUI.PushButton.prototype.handleMouseUp = function() {
    if(this.is_pushed && this.is_showing) {
        this.translate({x:0, y:-5});
        this.is_pushed = false;

        return true;
    } else {
        return false;
    }
}

WebUI.PushButton.prototype.handleMouseEnter = function() {
    if(this.is_showing) {
        // this.visual_items[0].set('strokeWidth', 3);
        this.visual_items[0].set('opacity', 0.8);
        return true;
    }
}

WebUI.PushButton.prototype.handleMouseExit = function() {
    if(this.is_showing) {
        // this.visual_items[0].set('strokeWidth', 1);
        this.visual_items[0].set('opacity', 1);

        if(this.is_pushed) {
            this.translate({x:0, y:-5});
            this.is_pushed = false;
        }
        return true;
    }
}


// TextField widget
WebUI.TextField = function(label, desired_size) {
    WebUI.Widget.call(this);

    this.type = WebUI.WidgetTypes.TEXT_FIELD;
    this.label = label;
    this.desired_size = desired_size;
    this.margin = 10;

    this.stroke_color = 'black';
    this.fill_color = 'white';
    this.stroke_width = 5;    

    this.font_family = 'System';
    this.font_size = 20;
    this.font_weight = 'normal';
    this.text_align = 'left';
    this.text_color = 'black';
}

WebUI.TextField.prototype = Object.create(WebUI.Widget.prototype);
WebUI.TextField.prototype.constructor = WebUI.TextField;

WebUI.TextField.prototype.initVisualItems = function() {
    let boundary = new fabric.Rect({
        left: this.position.left,
        top: this.position.top,
        width: this.desired_size.width,
        height: this.desired_size.height,
        fill: this.fill_color,
        stroke: this.stroke_color,
        strokeWidth: this.stroke_width,
        selectable: false
    });

    let textbox = new fabric.Textbox(this.label, {
        left: this.position.left + this.margin,
        fontFamily: this.font_family,
        fontSize: this.font_size,
        fontWeight: this.font_weight,
        textAlign: this.text_align,
        stroke: this.text_color,
        fill: this.text_color,
        selectable: false
    });

    let bound = textbox.getBoundingRect();
    textbox.top = this.position.top + (this.desired_size.height - bound.height)/2;
    this.size = this.desired_size;

    this.visual_items.push(boundary);
    this.visual_items.push(textbox);

    this.is_resource_ready = true;
}

WebUI.TextField.prototype.handleMouseDown = function(canvas_p) {
    let textbox = this.visual_items[1];        
    textbox.enterEditing();

    return true;
}

WebUI.TextField.prototype.handleKeyPress = function(event) {
    let boundary = this.visual_items[0];
    let textbox = this.visual_items[1];        

    let new_label = textbox.text;
    let old_label = this.label;
    this.label = new_label;

    if (event.keyCode == 13) {
        let text_enter_removed = new_label.replace(/(\r\n|\n|\r)/gm, "");
        textbox.text = text_enter_removed;
        this.label = text_enter_removed;
        
        if (textbox.hiddenTextarea != null) {
            textbox.hiddenTextarea.value = text_enter_removed;
        }

        textbox.exitEditing();

        return true;    
    }

    if (old_label != new_label && old_label.length < new_label.length) {
        let canvas = document.getElementById("c");
        let context = canvas.getContext("2d");
        context.font = this.font_size.toString() + "px " + this.font_family;

        let boundary_right = boundary.left + boundary.width - this.margin;
        let text_bound = textbox.getBoundingRect();
        let text_width = context.measureText(new_label).width;
        let text_right = text_bound.left + text_width;

        if (boundary_right < text_right) {
            textbox.text = old_label;
            this.label = old_label;
            
            if (textbox.hiddenTextarea != null) {
                textbox.hiddenTextarea.value = old_label;
            }

            return true;
        }
    }
    
    return false;
}


// Switch widget
WebUI.Switch = function(is_on, desired_size) {
    WebUI.Widget.call(this);

    this.type = WebUI.WidgetTypes.SWITCH;
    this.is_on = is_on;
    this.desired_size = desired_size;

    this.stroke_color = 'rgb(142,142,147)';
    this.fill_color = 'rgb(142,142,147)';
}

WebUI.Switch.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Switch.prototype.constructor = WebUI.Switch;

WebUI.Switch.prototype.initVisualItems = function() {
    r = this.desired_size.width/4;

    let c1 = new fabric.Circle({
        radius: r,
        fill: this.fill_color,
        left: this.position.left,
        top: this.position.top-r*0.1,
        selectable: false
    });

    let rect = new fabric.Rect({
        left: this.position.left+r,
        top: this.position.top-r*0.1,
        width: 2*r,
        height: this.desired_size.height,
        fill: this.fill_color,
        selectable: false
    });

    let c2 = new fabric.Circle({
        radius: r,
        fill: this.fill_color,
        left: this.position.left+2*r,
        top: this.position.top-r*0.1,
        selectable: false
    });

    let circle = new fabric.Circle({
        radius: r*0.9,
        fill: 'rgb(255,255,255)',
        stroke: this.stroke_color,
        left: this.position.left+r*0.1,
        top: this.position.top,
        selectable: false
    });

    this.size = this.desired_size;

    this.visual_items.push(c1);
    this.visual_items.push(rect);
    this.visual_items.push(c2);
    this.visual_items.push(circle);
    this.is_resource_ready = true;
}

WebUI.Switch.prototype.handleMouseDown = function() {
    let gray = 'rgb(142,142,147)';
    let green = 'rgb(48,209,88)';

    if(this.is_on) {  // 꺼진 상태로 전환
        for(var i=0; i<3; i++) {
            this.visual_items[i].set('fill', gray);
        }

        this.visual_items[i].set('stroke', gray);
        this.visual_items[i].animate('left', '-=50', {
            onChange: WebUI.canvas.renderAll.bind(WebUI.canvas),
            duration: 100
        });
        this.is_on = false;
    } else {  // 켜진 상태로 전환
        for(var i=0; i<3; i++) {
            this.visual_items[i].set('fill', green);
        }

        this.visual_items[i].set('stroke', green);
        this.visual_items[i].animate('left', "+=50", {
            onChange: WebUI.canvas.renderAll.bind(WebUI.canvas),
            duration: 100
        });

        this.is_on = true;
    }
    return true;
}

// CalcButton
WebUI.CalcButton = function(label, desired_size, is_showing, properties) {
    WebUI.PushButton.call(this, label, desired_size, properties);

    this.onPushed = this.handleButtonPushed;
    this.is_showing = is_showing;
}

WebUI.CalcButton.prototype = Object.create(WebUI.PushButton.prototype);
WebUI.CalcButton.prototype.constructor = WebUI.CalcButton;

WebUI.CalcButton.prototype.addRecords = function(msg) {
    // jQuery를 이용한 p 태그 동적으로 추가
    WebUI.p_index += 1;
    $('#div_records').append('<p><strong>'+WebUI.p_index+')</strong> '+msg+'</p>');
    $('#div_records').scrollTop($('#div_records')[0].scrollHeight);  // 스크롤 이동

    WebUI.diring_audio.play();   // 성공 효과음 출력
} 

WebUI.CalcButton.prototype.handleButtonPushed = function() {
    if(!this.is_showing)
        return;

    // 수식, CL, EV, backspace 처리
    if(displayValue == '0')
        displayValue = '';

    if(this.label == 'EV') {
        try {
            let op = displayValue; // 전체식

            displayValue = WebUI.parser.eval(displayValue).toString();
            var tokens = displayValue.split(' ');
            if(tokens[0] == 'function') {
                displayValue = tokens[0];
            } else { // function 아닌 식들
                op += ('&nbsp;&nbsp;<i>is</i>&nbsp;&nbsp;' + displayValue);
            }

            // jQuery를 이용한 p 태그 동적으로 추가
            this.addRecords(op);

            displayText.visual_items[1].set('text', displayValue);
            displayValue = '0';
        } catch(e) {
            displayValue = '0';
            if(displayValue != 'function') {   // 에러 메시지
                WebUI.bbi_audio.play();  // 에러 효과음 출력
                displayText.visual_items[1].set('text', e.name + ' - ' + e.message);
            }
        }
    } else if(this.label == 'BIN' || this.label == 'QUA' || this.label == 'OCT' || this.label == 'HEX') {
        if(displayValue == '')
            return;
        
        let num = Number(displayValue);
        if(isNaN(num)) {
            WebUI.bbi_audio.play();  // 에러 효과음 출력
            displayText.visual_items[1].set('text', this.label + ' 계산은 불가능합니다.');
            displayValue = '0';
            return;
        }
        
        if(this.label == 'BIN')  //10진수 --> 2진수
            displayValue = num.toString(2);
        else if(this.label == 'QUA')        // 10진수 --> 4진수
            displayValue = num.toString(4);
        else if(this.label == 'OCT')        // 10진수 --> 8진수
            displayValue = num.toString(8);
        else
            displayValue = num.toString(16);

        // jQuery를 이용한 p 태그 동적으로 추가
        this.addRecords(this.label+'('+num+') <i>is</i> '+displayValue);

        displayText.visual_items[1].set('text', displayValue);
        displayValue = '0';
    } else if(this.label == 'M+' || this.label == 'M-') {  // M plus/M minus 저장
        if(displayValue == '' || displayValue == '0')
                return;

        try {
            displayValue = WebUI.parser.eval(displayValue).toString();
            var tokens = displayValue.split(' ');
            if(tokens[0] == 'function') {
                console.log('function이라서 안됨');
                return;
            }

            let num = Number(displayValue);
            if(this.label == 'M-')
                num *= -1;

            console.log('M+/- 기능 num : ', num);
            WebUI.memory.push(num);

            // jQuery를 이용한 p 태그 동적으로 추가
            this.addRecords(num.toString() + ' ' + this.label);
        } catch(e) {
            WebUI.bbi_audio.play();  // 에러 효과음 출력
            displayText.visual_items[1].set('text', e.name + ' - ' + e.message);
        }

        displayValue = '0';   // 초기화
    } else if(this.label == 'MR') {   // Memory Recall, 메모리 리콜
        let result = 0;
        if(WebUI.memory.length > 0) {   // 배열 총합 구하기
            for(let i=0; i<WebUI.memory.length; i++) 
                result += WebUI.memory[i];

            displayValue = result.toString();

            // jQuery를 이용한 p 태그 동적으로 추가
            this.addRecords(displayValue + " " + this.label);
        } else {
            displayValue = 'Memory에 아무것도 없습니다!';
        }

        displayText.visual_items[1].set('text', displayValue);
        displayValue = '0';
    } else if(this.label == 'MC') {
        WebUI.memory = [];
        displayText.visual_items[1].set('text', 'Memory를 비웠습니다!');
    } else {
        if(this.label == 'CL') {
            displayValue = '0';
            displayText.visual_items[1].set('text', displayValue);
        } else if(this.label == '←') {
            displayValue = displayValue.slice(0, -1);
            displayText.visual_items[1].set('text', displayValue);
        } else {
            displayValue += this.label;
            displayText.visual_items[1].set('text', displayValue);
        }
    }
}

// GridView 위젯
WebUI.GridView = function(col, row, properties) {
    WebUI.Widget.call(this, properties);
    this.type = WebUI.WidgetTypes.GRIDVIEW;

    this.total = 0;   // 전체 갯수
    this.col = col;
    this.row = row;
}

WebUI.GridView.prototype = Object.create(WebUI.Widget.prototype);
WebUI.GridView.prototype.constructor = WebUI.GridView;

WebUI.GridView.prototype.extendSizeChildren = function(size, child_size) {
    size.width += child_size.width/this.children.length*this.col;
    size.height += child_size.height/this.children.length*this.row;
    return size;
}

WebUI.GridView.prototype.calcNextPosition = function(position, size) {
    let next_left = position.left + size.width;
    let next_top = position.top;
    this.total += 1;   // 전체 갯수 추가

    if(this.total % this.col == 0) {  // 최대 col(열) 갯수 참. 다음 줄로 넘어감
        next_left -= (size.width*this.col);
        next_top += size.height;
    }
    return {left: next_left, top: next_top};
}

// RadioButton 위젯
WebUI.RadioButton = function(label, id, is_checked, desired_size) {
    WebUI.Widget.call(this);

    this.type = WebUI.WidgetTypes.RADIOBUTTON;
    this.label = label;
    this.id = id;
    this.is_checked = is_checked;
    this.desired_size = desired_size;

    this.fill_color = '#000';
    this.stroke_color = '#55c57a';
    this.text_color = 'white';
    this.font_size = '16';
    this.font_weight = 100;
}

WebUI.RadioButton.prototype = Object.create(WebUI.Widget.prototype);
WebUI.RadioButton.prototype.constructor = WebUI.RadioButton;

WebUI.RadioButton.prototype.initVisualItems = function() {
    r = this.desired_size.width/8;

    // 원
    let big_circle = new fabric.Circle({
        radius: r,
        fill: this.fill_color,
        stroke: this.stroke_color,
        strokeWidth: 2,
        left: this.position.left,
        top: this.position.top,
        selectable: false
    });

    small_color = this.fill_color;
    if(this.is_checked) // true이면 
        small_color = this.stroke_color;

    // 작은 원
    let small_circle = new fabric.Circle({
        radius: r*0.5,
        fill: small_color,
        stroke: small_color,
        strokeWidth: 2,
        left: this.position.left+r*0.5,
        top: this.position.top+r*0.5,
        selectable: false
    });

    // 텍스트
    let text = new fabric.Text(this.label, {
        left: this.position.left + r*2 + 10,
        top: this.position.top + r*0.5,
        selectable: false,
        fontFamily: this.font_family,
        fontSize:   this.font_size,
        fontWeight: this.font_weight,
        textAlign:  this.text_align,
        stroke:     this.text_color,
        fill:       this.text_color,
    });

    this.size = this.desired_size;

    this.visual_items.push(big_circle);
    this.visual_items.push(small_circle);
    this.visual_items.push(text);
    this.is_resource_ready = true;
}

WebUI.RadioButton.prototype.handleMouseDown = function() {
    let black = '#000';
    let green = '#55c57a';

    if(!this.is_checked) {  
        // 현재 작은원 색깔 변경
        this.visual_items[1].set('fill', green);
        this.visual_items[1].set('stroke', green);

        // 현재 작은원 animate
        this.visual_items[1].radius = this.visual_items[0].radius;
        this.visual_items[1].left = this.visual_items[0].left;
        this.visual_items[1].top = this.visual_items[0].top;

        this.visual_items[1].animate('radius', '-=7', {
            onChange: WebUI.canvas.renderAll.bind(WebUI.canvas),
            duration: 100
        });
        this.visual_items[1].animate('left', '+=7', {
            onChange: WebUI.canvas.renderAll.bind(WebUI.canvas),
            duration: 100
        });
        this.visual_items[1].animate('top', '+=7', {
            onChange: WebUI.canvas.renderAll.bind(WebUI.canvas),
            duration: 100
        });

        this.is_checked = true;

        // 다른 RadioButton 상태 변환
        let change_id = -1;
        if(this.id == 'common') {  
            // 현재 선택 : 일반용 계산기
            change_id = 1;

            // subCalcButtons를 숨기기
            WebUI.subCalcButtons.forEach(item => {
                item.is_showing = false;
                item.visual_items[0].set('opacity', 0);
                item.visual_items[1].set('opacity', 0);
            });

            // subFunctions를 숨기기
            WebUI.subFunctions.forEach(item => {
                item.is_showing = false;
                item.visual_items[0].set('opacity', 0);
                item.visual_items[1].set('opacity', 0);
            });
        } else if(this.id == 'engineering') { 
            // 현재 선택 : 공학용 계산기
            change_id = 0;
            
            // subCalcButtons를 보이기
            WebUI.subCalcButtons.forEach(item => {
                item.is_showing = true;
                item.visual_items[0].set('opacity', 1);
                item.visual_items[1].set('opacity', 1);
            });

            // subFunctions를 보이기
            WebUI.subFunctions.forEach(item => {
                item.is_showing = true;
                item.visual_items[0].set('opacity', 1);
                item.visual_items[1].set('opacity', 1);
            });
        }

        // 작은 원 색깔 바꾸기
        WebUI.radioButtons[change_id].is_checked = false;
        WebUI.radioButtons[change_id].visual_items[1].set('fill', black);
        WebUI.radioButtons[change_id].visual_items[1].set('stroke', black);

        WebUI.bbong_audio.play();   // 뿅 효과음 출력
    }
    return true;
}

//
$(document).ready(function() {    
    WebUI.initialize();
});

