import React from 'react';
import {FormControl, Input} from '@mui/material';

function FileUpload({
                      onChange,
                      onError = (msg => console.error(msg)),
                      allowedExtensions = [".json"],
                      maxNumFiles = 2
                    }) {

  const uploadRef = React.useRef(null);

  function handleFileChange() {
    let fileList = uploadRef.current.files;
    let keys = Object.keys(fileList);
    let files = keys.map(k => {
      return {
        name: fileList[k].name,
        fileObj: fileList[k]
      }
    });

    if (files.length > maxNumFiles) {
      uploadRef.current.value = null; // Clear selected images
      onError("Exceeded maximum number of files to upload! (" + maxNumFiles + ")");
    }
    else {
      onChange(files);
    }
  }

  return (
    <div>
      <FormControl variant="outlined">
        <Input
          inputRef={uploadRef}
          type="file"
          onChange={handleFileChange}
          onClick={event => event.target.value = null}
          inputProps={{multiple: true, accept: allowedExtensions.join(',')}}>
        </Input>
      </FormControl>
    </div>
  );
}

export default FileUpload;
