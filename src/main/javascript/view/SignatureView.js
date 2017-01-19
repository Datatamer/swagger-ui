'use strict';

function fetchTamrSample(el, modelClass) {
  if (!modelClass) {
    return setContents(el, 'No model class detected');
  }
  if (modelClass.indexOf('inline_model') > -1) {
    return setContents(el, 'Not supported for inline models');
  }
  $.ajax({
    url: '//api/service/examples/' + modelClass,
    type: 'GET',
    success: function(response) {
      setContents(el, JSON.stringify(response, null, 2));
    },
    error: function(response) {
      var respJson = JSON.parse(response.responseText);
      setContents(el, JSON.stringify(respJson, null, 2));
    }
  });
}

function setContents(el, contents) {
  $(el).find('.tamr-sample-json .sample-contents').text(contents);
}

SwaggerUi.Views.SignatureView = Backbone.View.extend({
  events: {
    'click a.description-link'       : 'switchToDescription',
    'click a.snippet-link'           : 'switchToSnippet',
    'click a.tamr-sample'           : 'switchToTamrSample',
    'mousedown .snippet_json'          : 'jsonSnippetMouseDown',
    'mousedown .snippet_xml'          : 'xmlSnippetMouseDown'
  },

  initialize: function () {
  },

  render: function(){

    $(this.el).html(Handlebars.templates.signature(this.model));

    if (this.model.defaultRendering === 'model') {
      this.switchToDescription();
    } else {
      this.switchToSnippet();
    }

    return this;
  },

  // handler for show signature
  switchToDescription: function(e){
    if (e) { e.preventDefault(); }

    $('.snippet', $(this.el)).hide();
    $('.tamr-sample-json', $(this.el)).hide();
    $('.description', $(this.el)).show();

    $('.signature-nav a', $(this.el)).removeClass('selected');
    $('.description-link', $(this.el)).addClass('selected');
  },

  // handler for show sample
  switchToSnippet: function(e){
    if (e) { e.preventDefault(); }

    $('.snippet', $(this.el)).show();
    $('.description', $(this.el)).hide();
    $('.tamr-sample-json', $(this.el)).hide();

    $('.signature-nav a', $(this.el)).removeClass('selected');
    $('.snippet-link', $(this.el)).addClass('selected');
  },

  switchToTamrSample: function(e) {
    if (e) { e.preventDefault(); }

    $('.snippet', $(this.el)).hide();
    $('.description', $(this.el)).hide();
    $('.tamr-sample-json', $(this.el)).show();

    if ($(this.el).find('.tamr-sample-json .sample-contents').html() === '') {
      fetchTamrSample(this.el, this.model.type);
    }

    $('.signature-nav a', $(this.el)).removeClass('selected');
    $('.tamr-sample').addClass('selected');
  },

  // handler for snippet to text area
  snippetToTextArea: function(val) {
    var textArea = $('textarea', $(this.el.parentNode.parentNode.parentNode));

    // Fix for bug in IE 10/11 which causes placeholder text to be copied to "value"
    if ($.trim(textArea.val()) === '' || textArea.prop('placeholder') === textArea.val()) {
      textArea.val(val);
      // TODO move this code outside of the view and expose an event instead
      if( this.model.jsonEditor && this.model.jsonEditor.isEnabled()){
        this.model.jsonEditor.setValue(JSON.parse(this.model.sampleJSON));
      }
    }
  },

  jsonSnippetMouseDown: function (e) {
    if (this.model.isParam) {
      if (e) { e.preventDefault(); }

      this.snippetToTextArea(this.model.sampleJSON);
    }
  },

  xmlSnippetMouseDown: function (e) {
    if (this.model.isParam) {
      if (e) { e.preventDefault(); }

      this.snippetToTextArea(this.model.sampleXML);
    }
  }
});
