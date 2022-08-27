
import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import UploadAdapter from "./UploadAdapter";


const Content = () => {


    function MyCustomUploadAdapterPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            const newUpload = new UploadAdapter(loader);
			// newUpload.upload();

			return newUpload;
        }
    }

    return (
        <>
        <h1>컨텐츠</h1>
        <div>
        <CKEditor
            editor={ClassicEditor}
            data='<p>Hello from CKEditor 5!</p>'
            // config={editor => {
            //     plugins: [ MyCustomUploadAdapterPlugin(editor) ]
            // }}
            config={{
                extraPlugins: [ MyCustomUploadAdapterPlugin],
				// mediaEmbed: {
				// 	previewsInData: true
				// }
            } }
            onInit={editor => {
                // You can store the "editor" and use when it is needed.
                console.log( 'Editor is ready to use!', editor );
            } }
            onChange={(event, editor) => {
            const data = editor.getData();
            console.log(data);
            }}
            onBlur={editor => {
                console.log('Blur.', editor );
            } }
            onFocus={editor => {
                console.log('Focus.', editor );
            } }
        />
        </div>
        </>
    );
};

export default Content;

