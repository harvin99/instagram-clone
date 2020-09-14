import React, {useState} from 'react'
import firebase from 'firebase'
import {Button} from '@material-ui/core'

import {storage, db} from '../firebase'

import './ImageUpload.css';

function ImageUpload({username, postId}) {
    const [image, setImage] = useState(null)
    const [caption, setCaption] = useState('')
    const [progress, setProgress] = useState(0)

    const handleChange = (event) => {
        if(event.target.files[0]){
            setImage(event.target.files[0])
        }
            
    }
    const handleUpload = (event) => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //Progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress)
            },
            (error) => {
                //Error function...
                console.log(error);
                alert(error.message)
            },
            () => {
                //Complete function...
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //post image inside db
                        db.collection("posts").add({
                            timestamp : firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username : username
                        })
                        
                        setProgress(0)
                        setCaption('')
                        setImage(null)
                    })
            }
        )
    }
    return (
      <div className="container__upload">
        <div className="upload__image">
          <div className="post__area">
            <input
              className="input__text"
              type="text"
              value={caption}
              placeholder="Enter a caption..."
              onChange={(event) => setCaption(event.target.value)}
            />
            <div className="post__upload">
              <div className="input__file">
                <button className="btn__image">Images</button>
                <input
                  className="upload__file"
                  type="file"
                  onChange={handleChange}
                />
              </div>
              <Button color="primary" onClick={handleUpload}>
                Post
              </Button>
            </div>
            <progress
              className="prog-bar"
              value={progress}
              max="100"
            ></progress>
          </div>
        </div>
      </div>
    );
}

export default ImageUpload
