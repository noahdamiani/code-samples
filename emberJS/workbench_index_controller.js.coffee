App.WorkbenchIndexController = Em.ArrayController.extend
  needs: ['workbench']

  include_closed_projects: false

  show_box: ->
    $('.link-modal').appendTo 'body'
    $('.link-modal').css
      position: 'absolute'
      left: ($(window).width() - $('.link-modal').outerWidth()) / 2
      top: ($(window).height() - $('.link-modal').outerHeight()) / 2
    $('.modal-overlay').fadeIn()
    $('.link-modal').fadeIn()
    $('#link_url').focus()
    MyWork.GoogleAnalytics.event 'Workbench', 'started Add Link'

  hide_box: ->
    @set 'new_link_name', ''
    @set 'new_url', ''
    $('.modal-overlay').fadeOut()
    $('.link-modal').fadeOut()

  addExistingLink: (type, raw_link) ->
    text = raw_link.get('text')
    text = text.split('sites/')[1] unless text.indexOf('sites/') is -1
    @store.find(type, raw_link.id).then (link) ->
      link.deleteRecord()
    @store.createRecord('user_link', url: raw_link.get('url'), text: text).save()
    MyWork.GoogleAnalytics.event 'Workbench', 'clicked "Add to My Links" on a link'

  displayPrograms: Em.computed 'include_closed_projects', 'programs', 'projects', ->
    programs = @get('programs').map (program) =>
      if @get 'include_closed_projects'
        Em.set program, 'mapped_projects', program.original_projects
      else
        Em.set program, 'mapped_projects', program.original_projects.filterBy('status', 'open')
      program
    unless @get 'include_closed_projects'
      programs = programs.filter (program) ->
        program.mapped_projects.length > 0
    programs

  collaborationEnabled: Em.computed 'displayPrograms', ->
    show = false
    @get('displayPrograms').map (program) ->
      if program.mapped_projects.filterBy('workbench_enabled', false).length > 0
        show = true
    show

  actions:
    addLink: ->
      @show_box()

    addSuggestedLink: (raw_link) ->
      @addExistingLink('suggested_link', raw_link)

    addRecentLink: (raw_link) ->
      @addExistingLink('recent_link', raw_link)

    editLink: (excerpt, url)->
      $('#edit-link').foundation 'reveal', 'open'
      $('#edit-url').val url
      $('#edit-link-name').val excerpt

    saveLink: ->
      if @get('new_url') isnt '' and @get('new_link_name')?
        @set 'error', false
        url = @get 'new_url'
        unless url.match /http|https/
          url = 'http://' + url
        data = text: @get('new_link_name'), url: url
        @store.createRecord('user_link', data).save().then => @hide_box()
        MyWork.GoogleAnalytics.event 'Workbench', 'added link'
      else
        @set 'error', true

    removeLink: (id) ->
      @store.find('user_link', id).then (link) =>
        link.deleteRecord()
        unless link.get('url').indexOf('teamspace.merck.com') is -1
          @store.createRecord 'recent_link', id: link.get('url'), url: link.get('url'), text: link.get('text')
        link.save()
      MyWork.GoogleAnalytics.event 'Workbench', 'clicked "Remove" on a link'

    hide_box: ->
      @hide_box()
