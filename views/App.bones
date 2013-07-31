// Add `route()` method for handling normally linked paths into hash paths.
// Because IE7 provides an absolute URL for `attr('href')`, regex out the
// internal path and use it as the fragment.
Backbone.View.prototype.events = { 'click a.route': 'route' };
Backbone.View.prototype.href = function(el) {
    var href = $(el).get(0).getAttribute('href', 2);
    if ($.browser.msie && $.browser.version < 8) {
        return /^([a-z]+:\/\/.+?)?(\/.*?)$/.exec(href)[2];
    } else {
        return href;
    }
};
Backbone.View.prototype.route = function(ev) {
    var fragment = _(ev).isString() ? ev : this.href(ev.currentTarget);
    if (fragment.charAt(0) === '/') {
        // Remove the basepath from the fragment, but leave a /.
        fragment = fragment.substr(req.query.basepath.length - 1);
        var matched = _.any(Backbone.history.handlers, function(handler) {
            if (handler.route.test(fragment)) {
                handler.callback(fragment);
                return true;
            }
        });
        if (matched) {
            Backbone.history.saveLocation(fragment);
            return false;
        }
    }
    return true;
};
Backbone.View.prototype.toError = function(xhr) {
    try {
        var err = JSON.parse(xhr.responseText);
        return err.message || (err.error && err.error.message) || '';
    } catch(err) {
        return '';
    }
};

// App
// ---
// View representing the entire app viewport. The view that should "fill" the
// viewport should be passed as `options.view`. When the View's element has
// been successfully added to the DOM a `ready` event will be triggered on that
// view.
view = Backbone.View.extend({
    initialize: function(options) {
        _.bindAll(this, 'render');
        this.render().trigger('attach');
    },
    render: function() {
        $('body').attr('class', '');
        $('#app').html(this.options.view.el);
        this.options.view.trigger('ready');
        return this;
    }
});
