class UploadAdapter {

    //생성자 클래스 정의
    constructor(loader) {
        this.loader = loader;
    }

    // Starts the upload process.
    upload() {
        return this.loader.file.then( file => new Promise(((resolve, reject) => {
			console.log(file);

			let attachmentUrl = "";
        
            const attachmentRef = storageService
                .ref()
                .child(`${file.name}/${uuidv4()}`);
            const response = await attachmentRef.putString(file.name, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
            console.log(attachmentUrl);

            this._initRequest();
            this._initListeners( resolve, reject, file );
            this._sendRequest( file );
        })))
    }

    // Aborts the upload process.
    abort() {
        if ( this.xhr ) {
            this.xhr.abort();
        }
    }

    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();
		console.log(xhr);
		console.log(xhr.response);
		console.log(xhr.responseText);
        xhr.open('POST', 'http://localhost:3000/#/users', true);
		xhr.setRequestHeader('Content-type', 'application/json');
        // xhr.responseType = 'json';
    }

    _initListeners(resolve, reject, file) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = '파일을 업로드 할 수 없습니다.'

        xhr.addEventListener('error', () => {reject(genericErrorText)})
        xhr.addEventListener('abort', () => reject())
        xhr.addEventListener('load', () => {
            const response = xhr.response
            if(!response || response.error) {
                return reject( response && response.error ? response.error.message : genericErrorText );
            }

            resolve({
                default: response.url //업로드된 파일 주소
            })
        })
		console.log(xhr.response);
    }

    _sendRequest(file) {
        const data = new FormData()
        data.append('upload',file)
        this.xhr.send(data)
		console.log(data);
    }
}

export default UploadAdapter;