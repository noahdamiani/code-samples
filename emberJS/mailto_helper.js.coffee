Em.Handlebars.registerBoundHelper 'mail-to', (email, label) ->
  email = Em.Handlebars.Utils.escapeExpression(email)
  label = (if (arguments.length is 2) then email else Em.Handlebars.Utils.escapeExpression(label))
  link = '<a href="mailto:' + email + '">' + label + '</a>'
  new Em.Handlebars.SafeString(link)
