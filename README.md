Persistent sortable jQuery Tabs extension
========================

Small JavaScript snippet to enable jQuery UI tabs to save its order and last clicked item in localStorage.

Usage
-
Just create div and ul and li structure as usually, reference jQ and jQ UI + CSS and call helper:

```javascript
persistentSortablejQTabs('tabs','myCustomName');
```

First parameter is for ID of div container, second for custom localStorage var name. If you don't specify any property name, it will be constructed, but this requires the page to have title specified. In this case, error will be thrown. If you need other behaviour, feel free to modify.

Snippets of usage are in HtmlPage1.html, code itself is in jqtabs.js. Tested with jQuery 1.10.2, jQuery UI 1.10.3.

Enjoy. 
