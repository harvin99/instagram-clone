import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'

import Avatar from '@material-ui/core/Avatar'
import {Modal} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles';
import {db} from '../firebase'
import './Post.css';

function getModalStyle(){
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'relative',
    width: 600,
    height: 500,
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    outline: 'none',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: '3px',
  },
}));


function Post({ postId, user, username, avatarUrl, imageUrl , caption}) {
  //Modal
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [openTimeLine, setOpenTimeLine] = useState(false)
  //
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const [canLike, setCanLike] = useState(true)
  const [likes , setLikes] = useState([])
  const [allPostOfUser, setAllPostOfUser] = useState([])

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  useEffect(() => {
    let likeData;
    if (postId) {
      likeData = db
        .collection("posts")
        .doc(postId)
        .collection("likes")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                setLikes(doc.data())
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }
    return () => {
      likeData();
    };
  }, [postId]);

  const postComment = (event) => {
      event.preventDefault()
      db.collection("posts").doc(postId).collection("comments").add({
        text: comment,
        username: user.displayName,
        timestamp : firebase.firestore.FieldValue.serverTimestamp(),

      })
      setComment('')
  }
  const likePost = (event) => {
    event.preventDefault()
    // if(canLike){
    //   //Increase likeNumb + 1
    //   //Write likeNumb into Database
      
    //   db.collection("posts").doc(postId).collection("likes").update({
    //     peopleLike: firebase.firestore.FieldValue.arrayUnion(user.displayName),
    //     likeNumb: firebase.firestore.FieldValue.increment(1)
    //   })
    //   //setState canlike -> false
    //   setCanLike(false)
    // }
    // else {
    //   //Descrease likeNumb - 1
    //   //Write likeNumb
      
    //   db.collection("posts").doc(postId).collection("likes").update({
    //     peopleLike: firebase.firestore.FieldValue.arrayRemove(user.displayName),
    //     likeNumb: firebase.firestore.FieldValue.increment(-1)
    //   })
    //   //setState canlike -> true
    //   setCanLike(true)
    // }
  }
  useEffect(() => {
    //debugger;
    db.collection("posts")
                        .where("username", "==",  username )
                        .get()
                        .then(function (querySnapshot) {
                          let arrData = []
                          querySnapshot.forEach(function (doc) {
                            // doc.data() is never undefined for query doc snapshots
                            //console.log(doc.id, " => ", doc.data());
                            arrData.push(doc.data())
                          });
                          setAllPostOfUser(arrData)
                        })
                        .catch(function (error) {
                          console.log("Error getting documents: ", error);
                        });
                        console.log(allPostOfUser);
   
  }, [])
    return (
      <div className="post">
        <div className="post__header">
          <Avatar className="post__avatar" alt="" src={avatarUrl} />
          <h3 className="username" onClick={() => setOpenTimeLine(true)}>
            {username}
          </h3>
          <Modal open={openTimeLine} onClose={() => setOpenTimeLine(false)}>
            <div style={modalStyle} className={classes.paper}>
              <form action="" className="App__signup">
                <center>
                  <div class="container__timeline">
                    <div class="timeline__header">
                    <Avatar className="post__avatar" alt="" src={avatarUrl} />
                      <h3>{username}</h3>
                    </div>
                    <div class="timeline__images">
                    {allPostOfUser.map((post) => (
                      <img
                        src={post.imageUrl}
                        alt="image"
                      />
                    ))}
                    </div>
                  </div>
                </center>
              </form>
            </div>
          </Modal>
        </div>
        <img className="post__image" src={imageUrl} alt="" />

        {canLike ? (
          <div
            className="btn__like"
            onClick={user ? likePost : () => alert("You need to sign in !")}
          >
            <i class="far fa-heart"></i>
          </div>
        ) : (
          <div
            className="btn__like"
            onClick={user ? likePost : () => alert("You need to sign in !")}
          >
            <i class="fas fa-heart heart"></i>
          </div>
        )}
        <h4 className="post__like">{likes.likeNumb} likes</h4>
        <h4 className="post__text">
          <strong> {username} </strong> {caption}
        </h4>
        <div className="post__comments">
          {comments.map((comment) => (
            <p>
              <strong>{comment.username}</strong> {comment.text}
            </p>
          ))}
        </div>
        <form className="form__comment">
          <input
            className="input__textComment"
            type="text"
            value={comment}
            placeholder="Add a comment..."
            onChange={(event) => setComment(event.target.value)}
          />
          <button
            className="btn__post"
            type="submit"
            disabled={!comment}
            onClick={user ? postComment : () => alert("You need to sign in !")}
          >
            Post
          </button>
        </form>
      </div>
    );
}

Post.propTypes = {
    postId : PropTypes.string,
    username : PropTypes.string,
    avatarUrl : PropTypes.string,
    caption: PropTypes.string,
    imageUrl : PropTypes.string,
    likeNumb : PropTypes.number
}

export default Post



