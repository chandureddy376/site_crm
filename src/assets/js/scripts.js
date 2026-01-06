tinymce.init({
  selector: 'textarea#basic-example',
  plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount autosave ',
  // autosave_ask_before_unload: false,
  toolbar: 'undo redo styleselect bold italic alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
  autosave_restore_when_empty: false,
  autosave_prefix: 'blog-autosave-',
  autosave_interval: '3s',

  paste_preprocess: function (plugin, args) {
    console.log(args.content);
    args.content = '';
  },
  cleanup: true,
});