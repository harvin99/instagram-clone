import React, { useState, useEffect } from "react";
import InstagramEmbed from 'react-instagram-embed';

import Post from './components/Post'; 
import ImageUpload from './components/ImageUpload';
import {Modal} from '@material-ui/core'
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';

import "./App.css";

import {db, auth} from './firebase'
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
    width: 400,
    height: 450,
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    outline: 'none',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: '3px',
  },
}));

function App() {

  const classes = useStyles();

  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false)
  const [openSignIn, setOpenSignIn] = useState(false)
  const [openResetPwd, setOpenResetPwd] = useState(false)

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [emailToResetPwd, setEmailToResetPwd] = useState('')

  useEffect(()=> {
    const unsubcribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //User has logged in...
        console.log(authUser)
        setUser(authUser)
      } else {
        //User has logged out ...
        setUser(null)
      }
    })
    return () => {
      //perform some cleanup actions
      unsubcribe()
    }
  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => (
        {
          id: doc.id,
          post: doc.data()
        }
      )))
    })
  }, [])
  const signUp = (event) => {
      event.preventDefault()
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
          return authUser.user.updateProfile({
            displayName : username
          })
        })
        .catch((error) => alert(error.message))
        setOpen(false)
  }
  const signIn = (event) => {
    event.preventDefault()
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
      setOpenSignIn(false)
  }
  const resetPwd = (event) => {
    event.preventDefault()
    debugger;
    auth.sendPasswordResetEmail(emailToResetPwd)
      .then(function () {
        // Email sent.
        alert("An Email has been sent. Please check your inbox and verify !")
      })
      .catch(function (error) {
        // An error happened.
      });
      setOpenResetPwd(false)
      setOpenSignIn(false)
  }
  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form action="" className="App__signup">
            <center>
              <div className="form__login">
                <div className="logo">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png"
                    alt=""
                  />
                </div>
                <div className="form__input">
                  <input
                    className="input__text"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <input
                    className="input__text"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    className="input__text"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn__signup" onClick={signUp}>
                  Sign Up
                </button>
              </div>
            </center>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form action="" className="App__signup">
            <center>
              <div className="form__login">
                <div className="logo">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png"
                    alt=""
                  />
                </div>
                <div className="form__input">
                  <input
                    className="input__text"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    className="input__text"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn__signup" onClick={signIn}>
                  Sign In
                </button>
                <a
                  className="forgot__pwd"
                  href="#forgot__pwd"
                  onClick={() => setOpenResetPwd(true)}
                >
                  Forgot password ?
                </a>
                <div className="register">
                  <h4>
                    Don't have a account ?{" "}
                    <strong>
                      <a href="#register">Register</a>
                    </strong>
                  </h4>
                </div>
              </div>
            </center>
          </form>
        </div>
      </Modal>

      <Modal open={openResetPwd} onClose={() => setOpenResetPwd(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form action="" className="App__signup">
            <center>
              <div className="form__resetpwd">
                <div className="logo">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png"
                    alt=""
                  />
                </div>
                <input
                  className="input__text"
                  type="text"
                  placeholder="Enter a email..."
                  onChange = {(event) => setEmailToResetPwd(event.target.value)}
                />
                <button
                  type="submit"
                  className="btn__signup"
                  onClick={resetPwd}
                >
                  Reset Password
                </button>
              </div>
            </center>
          </form>
        </div>
      </Modal>
      
      <div className="App__header">
        <img
          className="App__headerImage"
          src="https://tattoome.eu/themes/theme059/img/instagram_topic.png"
          alt="logo"
        />
        {user ? (
          <Button className="btn__login" onClick={() => auth.signOut()}>
            Log Out
          </Button>
        ) : (
          <div className="App__loginContainer">
            <Button className="btn__login" onClick={() => setOpenSignIn(true)}>
              Sign In
            </Button>
            <Button className="btn__login" onClick={() => setOpen(true)}>
              Sign Up
            </Button>
          </div>
        )}
      </div>
      <center>
        <h1>Tran Van Hung clone instagram</h1>
      </center>
      <div className="App__post">
        <div className="App__postLeft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              avatarUrl={post.avatarUrl}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        <div className="App__postRight">
          <InstagramEmbed
            url="https://instagr.am/p/Zw9o4/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <center>
          <h3>Sign In to Upload</h3>
        </center>
      )}
    </div>
  );
}

export default App;
