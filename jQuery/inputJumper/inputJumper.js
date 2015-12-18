/* Usage:
  Define form and inputs with maxlengths:
  <form id="your-form-id">
    <input type="text" maxlength="1">
    <input type="text" maxlength="2">
    <input type="text" maxlength="3">
  </form>
  
  Target your form as such: 
  $('#your-form-id').inputJumper();
*/

$.fn.inputJumper = function() {
  var form = this;
  return form.find(':input').each(function() {
    $(this).on('keyup', function(e) {
      var max = parseInt($(this).attr('maxlength')),
        valueLength = $(this).val().length,
        field = form.find(':input'),
        index = field.index(this);
      if (valueLength === max) {
        field.eq(index + 1).focus();
      } else if (index > 0 && e.keyCode === 8 && valueLength === 0) {
        field.eq(index - 1).focus();
      }
    });
  });
};
