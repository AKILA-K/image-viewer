import React, { Component } from "react";
import "./Profile.css";
import Header from "../../common/header/Header";
import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import Create from "@material-ui/icons/Create";
import Favorite from "@material-ui/icons/Favorite";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';


const styles = theme => ({
  bigAvatar: {
    margin: 10,
    width: 50,
    height: 50
  },

  paper_big: {
    position: "absolute",
    width: 600,
    backgroundColor: "white",
    padding: 16,
    outline: "none",
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`
  },
  fab: {
    margin: 8
  },
  paper: {
    position: "absolute",
    width: 250,
    backgroundColor: "white",
    padding: 16,
    outline: "none",
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`
  }
});

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile_picture: "",
      username: "",
      media: 0,
      follows: 0,
      followed_by: 0,
      full_name: "",
      userPosts: null,
     // access_token: sessionStorage.getItem("access-token"),
      editNameOpen: false,
      fullnameRequired: "dispNone",
      selectedPost: null,
      selectedIndex: -1,
      newComment: "",
      updateFullName: "",
      postOpen: false


    }
    this.singleUserUrl = "https://api.instagram.com/v1/users/self/?access_token=";
    //  this.access_token=sessionStorage.getItem("access-token")
  };


  //On component load - Get user profile data
  componentWillMount() {
    // Gets User Profile
    let data_UserProfile = null;
    //let baseUrl=this.props.baseUrl;
    let xhr_UserProfile = new XMLHttpRequest();
    let that = this;
    let access_token = sessionStorage.getItem("access-token");
    let loggedIn = '';
    let accessToken = '';
    // Redirecting to login page if not logged in        
    try {
      accessToken = this.props.history.location.state.accessToken;
      loggedIn = this.props.history.location.state.loggedIn;
    } catch (exception) {
      this.props.history.push({ pathname: '/' });
    }
    // Getting data from API if logged in
    if (access_token === accessToken && loggedIn === 'true') {
      xhr_UserProfile.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          const data = JSON.parse(this.responseText).data;
          that.setState({
            // userprofile: JSON.parse(this.responseText).data
            profile_picture: data.profile_picture,
            username: data.username,
            media: data.counts.media,
            follows: data.counts.follows,
            followed_by: data.counts.followed_by,
            full_name: data.full_name
          });

        }
      });
      xhr_UserProfile.open("GET", this.singleUserUrl + access_token);
      xhr_UserProfile.setRequestHeader("Cache-Control", "no-cache");
      xhr_UserProfile.send(data_UserProfile);

      //Gets User Posts
      let data_UserPosts = null;
      let xhr_UserPosts = new XMLHttpRequest();
      xhr_UserPosts.addEventListener("readystatechange", function () {

        if (this.readyState === 4) {
          that.setState({
            userPosts: JSON.parse(this.responseText).data
          });

        }
      });
      xhr_UserPosts.open("GET", this.props.baseUrl + access_token);
      //xhrUserPosts.setRequestHeader("Cache-Control", "no-cache");
      xhr_UserPosts.send(data_UserPosts);
    }
    else {
      this.props.history.push({ pathname: '/' });
    }
  }


  
  //To open edit modal
  EditFullNameModalOpenHandler = () => {
    this.setState({
      updateFullName: this.state.full_name,
      editNameOpen: true
    });
  };

  //To close edit modal
  EditFullNameModalCloseHandler = () => {
    this.setState({
      editNameOpen: false,
      fullnameRequired: "dispNone"
    });
  };

  

  //to update  full name modal - onClick
  ClickUpdateNameHandler = () => {
    this.state.updateFullName === ""
      ? this.setState({ fullnameRequired: "dispBlock" })
      : this.setState({ fullnameRequired: "dispNone" });
    if (this.state.updateFullName === "") {
      return;
    } else {
      this.setState({ full_name: this.state.updateFullName });
    }
    this.setState({
      editNameOpen: false
    });
  };

  //update full name - onChange()
  ChangeFullNameHandler = e => {
    this.setState({ updateFullName: e.target.value });
  };

  //post image  open modal with details -onClick()
  ClickPostImageHandler = (_id, _index) => {
    let _userPostItems = this.state.userPosts;
    this.setState({
      selectedPost: _userPostItems[_index],
      selectedIndex: _index,
      postOpen: true,
      newComment: ""
    });
  };

  //to close post image Modal - onClick()
  ClickPostImageCloseHandler = () => {
    this.setState({
      selectedPost: null,
      postOpen: false,
      selectedIndex: -1
    });
  };

  // Like function 
  ClickLikesHandler = () => {
    let _selectedPostItem = this.state.selectedPost;
    let _userPosts = this.state.userPosts;
    const _selectedIndex = this.state.selectedIndex;
    if (_selectedPostItem.user_has_liked) {
      _selectedPostItem.user_has_liked = false;
      _selectedPostItem.likes.count = _selectedPostItem.likes.count + 1;
    } else {
      _selectedPostItem.user_has_liked = true;
      _selectedPostItem.likes.count = _selectedPostItem.likes.count - 1;
    }

    _userPosts[_selectedIndex] = _selectedPostItem;

    this.setState({
      selectedPost: _selectedPostItem,
      userPosts: _userPosts
    });
  };

  
  //Redirecting to home page when ImageViewer is clicked
  redirecting = () => {
    let accessToken = sessionStorage.getItem("access-token");
    //Route to home here  
    this.props.history.push({
      pathname: '/home/', state: {
        accessToken: accessToken
        , loggedIn: true
      }
    });
  }

  // If not LoggedIn, Routes to Login page
  loginredirect = () => {
    sessionStorage.removeItem("access-token");
    this.setState({
      loggedIn: false
    });
    this.props.history.push({ pathname: '/' });
  }


  // input comment field - onChange Method()
  inputAddCommentHandler = e => {
    this.setState({ newComment: e.target.value });
  };

  // To add comments - onClick() Method
  AddCommentHandler = () => {
    if (this.state.newComment === "") {
      return;
    } else {
      let _selectedPostItem = this.state.selectedPost;
      _selectedPostItem.comments["data"] =
        _selectedPostItem.comments["data"] || [];
      _selectedPostItem.comments["data"].push({
        id: _selectedPostItem.comments["data"].length + 1,
        comment_by: this.state.username,
        comment_value: this.state.newComment
      });

      let _userPosts = this.state.userPosts;
      const _selectedIndex = this.state.selectedIndex;
      _userPosts[_selectedIndex] = _selectedPostItem;

      this.setState({
        selectedPost: _selectedPostItem,
        userPosts: _userPosts,
        newComment: "",

      });
    }
  };


  render() {
    const { classes } = this.props;
    return (
      <div>
        {/* Header for profile.js  */}
        <div>
          <Header heading="Image Viewer"
            loggedIn={this.state.loggedIn}
            accc={this.state.access_token}
            prof={this.singleUserUrl}
            noSearchBox="dispNone"
            searchDisplay="dispSearch"
            iconDisplay="dispBlock"
            logoutHandler={this.loginredirect}
            homeredirect={this.redirecting}
          />

        </div>
        {this.state.userprofile.map(profile =>
          (<span key={"grid" + profile.id}>
            <p><img src={profile.images.low_resolution.url} alt={profile.images.standard_resolution.url}></img></p></span>))}

        <Container fixed>
          <Grid
            container
            spacing={5}
            style={{ justifyContent: "center" }}
            alignItems="center"
          >
            <Grid item>
              <Avatar
                alt={this.state.username}
                src={this.state.profile_picture}
                className={classes.bigAvatar}
              />
            </Grid>
            <Grid item>
              <Typography variant="h6" component="h6">
                {this.state.username}
              </Typography>
              <Grid
                container
                spacing={3}
                justify="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="subtitle2">
                    Posts: {this.state.media}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2">
                    Follows: {this.state.follows}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2">
                    Followed By: {this.state.followed_by}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                justify="flex-start"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="h6">{this.state.full_name}</Typography>
                </Grid>
                <Grid item>
                  <Fab
                    color="secondary"
                    aria-label="Edit"
                    className={classes.fab}
                    onClick={this.EditFullNameModalOpenHandler}
                  >
                    <Create />
                  </Fab>
                  <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.editNameOpen}
                    onClose={this.EditFullNameModalCloseHandler}
                  >
                    <div className={classes.paper}>
                      <Typography
                        variant="h6"
                        id="modal-title"
                        className="modal-heading"
                      >
                        Edit
                      </Typography>
                      <FormControl required className="formControl">
                        <InputLabel htmlFor="username">Full Name </InputLabel>
                        <Input
                          id="userfullname"
                          type="text"
                          onChange={this.ChangeFullNameHandler}
                          value={this.state.updateFullName}
                        />
                        <FormHelperText className={this.state.fullnameRequired}>
                          <span className="red">Required</span>
                        </FormHelperText>
                      </FormControl>
                      <br />
                      <br />
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ width: 10 }}
                        onClick={this.ClickUpdateNameHandler}
                      >
                        UPDATE
                      </Button>
                    </div>
                  </Modal>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
           {/* Gridlist for post Image from Api */}
          <GridList cellHeight={320} cols={3}>
            {(this.state.userPosts || []).map((post, index) => (
              <GridListTile
                key={post.id}
                className="grid-content"
                onClick={() => this.ClickPostImageHandler(post.id, index)}
              >
                <img
                  src={post.images.low_resolution.url}
                  alt={post.caption.text}
                />
              </GridListTile>
            ))}
          </GridList>
          {this.state.selectedPost !== null ? (
            <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={this.state.postOpen}
              onClose={this.ClickPostImageCloseHandler}
            >
              <div className={classes.paper_big}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <img
                      src={
                        this.state.selectedPost.images.standard_resolution.url
                      }
                      width="100%"
                      alt={this.state.selectedPost.caption.text.split("\n")[0]}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Grid
                      container
                      spacing={3}
                      justify="flex-start"
                      alignItems="center"
                    >
                      <Grid item>
                        <Avatar
                          src={this.state.selectedPost.user.profile_picture}
                          alt={this.state.selectedPost.user.username}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle2">
                          {this.state.selectedPost.user.username}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider light />
                    <Grid
                      container
                      spacing={3}
                      justify="flex-start"
                      alignItems="center"
                    >
                      <Grid item>
                        <Typography variant="caption">
                          {this.state.selectedPost.caption.text.split("\n")[0]}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={3}
                      justify="flex-start"
                      alignItems="center"
                    >
                      <Grid item>
                        {(this.state.selectedPost.tags || []).map((tag, i) => {
                          return (
                            <Typography
                              key={tag}
                              variant="caption"
                              color="primary"
                            >
                              {" "}
                              #{tag}
                            </Typography>
                          );
                        })}
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      spacing={1}
                      justify="flex-start"
                      alignItems="center"
                    >
                      <Grid item className="min-height-comments-box">
                        {(this.state.selectedPost.comments.data || []).map(
                          (comment, i) => {
                            return (
                              <Typography
                                key={comment.id}
                                variant="caption"
                                display="block"
                              >
                                <strong>{comment.comment_by} :</strong>{" "}
                                {comment.comment_value}
                              </Typography>
                            );
                          }
                        )}
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      spacing={1}
                      justify="flex-start"
                      alignItems="center"
                    >
                      <Grid item>

                        {this.state.selectedPost.user_has_liked ?
                          <FavoriteBorder className={'greyLike'}
                            onClick={this.ClickLikesHandler}
                          />
                          :
                          <Favorite className={'redLike'}
                            onClick={this.ClickLikesHandler}
                          />
                        }
                       </Grid>
                      <Grid item>
                        <Typography variant="caption">
                          {this.state.selectedPost.likes.count} likes
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      spacing={2}
                      justify="flex-start"
                      alignItems="center"
                    >
                      <Grid item>
                        <FormControl className="formControl">
                          <InputLabel htmlFor="addcomment">
                            Add a comment{" "}
                          </InputLabel>
                          <Input
                            id="addcomment"
                            type="text"
                            onChange={this.inputAddCommentHandler}
                            value={this.state.newComment}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.AddCommentHandler }
                         >
                          ADD
                        </Button>
                      </Grid>
                    </Grid>

                  </Grid>
                </Grid>
              </div>
            </Modal>
          ) : (
              ""
            )}


        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(Profile);
