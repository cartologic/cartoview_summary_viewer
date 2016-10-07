from django.templatetags.static import static

widgets = [{
    'title': 'Summary Viewer',
    'name': 'SummaryViewer',

    'config': {
        'directive': 'summary-viewer-config',
        'js': [
            static("summary_viewer/js/config/summary-viewer-directive.js"),
        ],
        "css": [
            static("summary_viewer/css/config.css"),
        ]
    },
    'view': {
        'directive': 'summary-viewer',
        'js': [
            static("summary_viewer/js/view/app.js"),
            static("summary_viewer/js/view/main-controller.js"),
            static("summary_viewer/js/view/summary-viewer-service.js"),
            static("summary_viewer/js/view/summary-viewer-directive.js"),
        ],
        "css": [
            static("summary_viewer/css/view.css"),
        ]
    },
}]