$.fn.contentTabs = function() {
    var tabs = this.find('ul li');
    return tabs.each(function() {
        var index = tabs.index(this);
        var tabItem = $('.items div');

        $(this).on('click', function() {
            tabItem.hide();
            tabItem.eq(index).show();
        });
    });
};
