from django.templatetags.static import static
from . import APP_NAME

widgets = [{
    'title': 'Summary Viewer',
    'name': 'SummaryViewer',

    'config': {
        'directive': 'summary-viewer-config',
        'js': [
            static("%s/js/config/summary-viewer-directive.js" % APP_NAME),
        ],
        "css": [
            static("%s/css/config.css" % APP_NAME),
        ]
    },
    'view': {
        'directive': 'summary-viewer',
        'js': [
            static("%s/js/view/app.js" % APP_NAME),
            static("%s/js/view/main-controller.js" % APP_NAME),
            static("%s/js/view/summary-viewer-service.js" % APP_NAME),
            static("%s/js/view/summary-viewer-directive.js" % APP_NAME),
        ],
        "css": [
            static("%s/css/view.css" % APP_NAME),
        ]
    },
}]