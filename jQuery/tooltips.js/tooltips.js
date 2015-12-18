$.fn.toolTip = function() {
  this.find('span').hover(function(){
    $(this).parent().find('div').fadeToggle(400);
  });
};
