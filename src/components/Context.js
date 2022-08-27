import ContextBase from '@ckeditor/ckeditor5-core/src/context';
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

// Import the watchdog for the context:
import ContextWatchdog from '@ckeditor/ckeditor5-watchdog/src/contextwatchdog';

// Editor plugins:
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';

// Real-time collaboration plugins are editor plugins:
import RealTimeCollaborativeEditing from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativeediting';
import RealTimeCollaborativeComments from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativecomments';
import RealTimeCollaborativeTrackChanges from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativetrackchanges';

// Context plugins:
import CloudServicesCommentsAdapter from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativecomments/cloudservicescommentsadapter';
import CommentsRepository from '@ckeditor/ckeditor5-comments/src/comments/commentsrepository';
import NarrowSidebar from '@ckeditor/ckeditor5-comments/src/annotations/narrowsidebar';
import WideSidebar from '@ckeditor/ckeditor5-comments/src/annotations/widesidebar';
import PresenceList from '@ckeditor/ckeditor5-real-time-collaboration/src/presencelist';

class Context extends ContextBase {}

// Plugins to include in the context.
Context.builtinPlugins = [
    CloudServicesCommentsAdapter,
    CommentsRepository,
    NarrowSidebar,
    WideSidebar,
    PresenceList
];

Context.defaultConfig = {
    // Default configuration for the context plugins:
    sidebar: {
        container: document.querySelector( '#sidebar' )
    },
    presenceList: {
        container: document.querySelector( '#presence-list-container' )
    },
    // The configuration shared between the editors:
    language: 'en',
    toolbar: {
        items: [
            'bold', 'italic', '|', 'undo', 'redo', '|',
            'comment', 'trackChanges'
        ]
    },
    comments: {
        editorConfig: {
            plugins: [ Essentials, Paragraph, Bold, Italic ]
        }
    }
};

class ClassicEditor extends ClassicEditorBase {}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
    Essentials, Paragraph, Bold, Italic, Heading,
    // Real-time collaboration plugins are editor plugins:
    RealTimeCollaborativeEditing, RealTimeCollaborativeComments, RealTimeCollaborativeTrackChanges
];

export default { ClassicEditor, Context, ContextWatchdog };