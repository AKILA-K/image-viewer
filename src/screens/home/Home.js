import React, {Component} from 'react';
import './Home.css';
import Header from '../../common/header/Header';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
//import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import moment from "moment";
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Favorite from '@material-ui/icons/Favorite';
import { withStyles } from "@material-ui/styles";
//import hearticon from '../../assets/hearticon.svg';
const styles = theme => ({
    profileAvatar: {
        margin: 10,
        width: 60,
        height: 60,
        boxShadow: '1px 2px 2px grey'
    }
});

class Home extends Component {
    constructor() {
        super();
      //  this.addCommentOnClickHandler = this.addCommentOnClickHandler.bind(this);
        this.state = {
            userphotos:null,
            matchingsearch:null,
            searched:"NO",
            username:"",
           /* ownerInfo:{
                username: ""
                },*/
            comment:"",
            addComment:"dispComment",
            loggedIn:'false',
            hasError:false,
            accessToken:'',
        }
        this.singleUserUrl = "https://api.instagram.com/v1/users/self/?access_token=";
        this.access_token=sessionStorage.getItem("access-token")
    }
    searchboxfunction = (e) => {

        const searchkey = (e.target.value).toLowerCase();
        let posts = this.state.userphotos;
        let matchingsearch = [];
        if(posts !== null && posts.length > 0){
        matchingsearch = posts.filter((post) => 
        (post.caption.text.split(/#/)[0].toLowerCase()).indexOf(searchkey) > -1 );
        this.setState({
                   matchingsearch: matchingsearch,
                   searched:"YES"
        });
       }


}

redirecting =()=>{
//do nothing
}
loginredirect=()=>{
sessionStorage.removeItem("access-token");
this.setState({
    loggedIn: false
});
this.props.history.push({pathname:'/'});
}
profileredirect=()=>{
let accessToken = sessionStorage.getItem("access-token");
this.props.history.push({pathname:'/profile/',state:{accessToken: accessToken
    , loggedIn:'true'}});
}

heartClickHandler = (photoId, photoLikeIndex) => {

let photolistlike = this.state.userphotos;
let matchingsearchlike = this.state.matchingsearch;


if(photolistlike !== null && photolistlike.length > 0){


    // Updating main array
    let postWithLike =  photolistlike.map((photoPostlike,photoIndex) => {
        if(photoPostlike.id === photoId){
            if (photoPostlike.user_has_liked) {
                photoPostlike.user_has_liked = false;
                photoPostlike.likes.count = (photoPostlike.likes.count) + 1;

            } else {
                photoPostlike.user_has_liked = true;
                photoPostlike.likes.count = (photoPostlike.likes.count) - 1;
            }
        } else {}
        return photoPostlike;
    });
    
        //  Search key matching array
    if(matchingsearchlike !== null && matchingsearchlike.length > 0) {
//Logic to be reversed if search function is triggered. Otherwise it overwrites it's own values
if(this.state.searched==="NO"){
        if(matchingsearchlike[photoLikeIndex].user_has_liked ) {
            
            matchingsearchlike[photoLikeIndex].user_has_liked = false;
            matchingsearchlike[photoLikeIndex].likes.count = (matchingsearchlike[photoLikeIndex].likes.count) + 1;
        } else {
            matchingsearchlike[photoLikeIndex].user_has_liked = true;
            matchingsearchlike[photoLikeIndex].likes.count = (matchingsearchlike[photoLikeIndex].likes.count) - 1;
        }
    } else {
        if(matchingsearchlike[photoLikeIndex].user_has_liked===false) {
            
            matchingsearchlike[photoLikeIndex].user_has_liked = false;
         //   matchingsearchlike[photoLikeIndex].likes.count = (matchingsearchlike[photoLikeIndex].likes.count);
        } else {
            matchingsearchlike[photoLikeIndex].user_has_liked = true;
         // matchingsearchlike[photoLikeIndex].likes.count = (matchingsearchlike[photoLikeIndex].likes.count);
        }
    }
    }
    this.setState({
        userphotos: postWithLike,
        matchingsearch:matchingsearchlike
    });
}
}

addCommentOnClickHandler = (photoId, photoIndex) => {
//  alert((this.title).childNodes[0].value);
const inputcomment = document.getElementById('comment'+photoId).value;

if (inputcomment === '') {
    return;
} else {
    let photolist = this.state.userphotos;
    if(photolist !== null && photolist.length > 0){
    
//    alert(photolist);
//  Main array update
    let postsWithComment =  photolist.map((photoPost,index) => {
        if(photoPost.id === photoId){
            photoPost.comments['data'] = photoPost.comments['data'] || [];
            photoPost.comments['data'].push({
                id: (photoPost.comments['data'].length + 1),
                commentUser: this.state.username,
                commentInput: inputcomment
            });
        }
        return photoPost;
    });

//  Search key matching array
    let matchingsearch = this.state.matchingsearch;
//No need to run this if search function is triggered. Otherwise it creates duplicate entries
if(this.state.searched==="NO"){
if(matchingsearch!==null && matchingsearch.length>0){
        matchingsearch[photoIndex].comments['data'] = matchingsearch[photoIndex].comments['data'] || [];
        matchingsearch[photoIndex].comments['data'].push({
                id: (matchingsearch[photoIndex].comments['data'].length + 1) ,
                commentUser: this.state.username,
                commentInput: inputcomment
        });
} }else {
    
}

                this.setState({
                    userphotos: postsWithComment,
                    matchingsearch:matchingsearch
                });
//   alert(this.state.userphotos);
//    innerspan.innerText= innerspan.innerText + "\n"+ "\n"+ username+": "+inputcomment.value;
document.getElementById('comment'+photoId).value="";
}
}
}

componentDidMount(){
    this.mounted=true;
}

componentWillMount() {
    this.mounted = false;
let data = null;
let baseUrl=this.props.baseUrl;
let xhr = new XMLHttpRequest();
let that = this;
let access_token = this.access_token;
let accessToken = '';
let loggedIn = false;

// Redirecting to login page if not logged in    
try{
accessToken = this.props.history.location.state.accessToken;
loggedIn = this.props.history.location.state.loggedIn;
} catch(exception){
this.props.history.push({pathname:'/'});
}




// Getting data from API if logged in
if(this.access_token===accessToken && loggedIn===true){
that.setState({
    loggedIn: 'true'

    });
// Calling first API

let xhrprofiledata = new XMLHttpRequest();
xhrprofiledata.addEventListener("readystatechange", function () {
if (this.readyState === 4) {
that.setState({
    username: JSON.parse(this.responseText).data.username,
}); 
}
});
xhrprofiledata.open("GET", this.singleUserUrl + this.access_token);
//xhrUserProfile.setRequestHeader("Cache-Control", "no-cache");
xhrprofiledata.send(xhrprofiledata);

// Calling second API
xhr.addEventListener("readystatechange", function () {
if (this.readyState === 4) {
that.setState({
userphotos: JSON.parse(this.responseText).data,
matchingsearch: JSON.parse(this.responseText).data
});
}
});
xhr.open("GET", baseUrl+access_token);
xhr.setRequestHeader("Cache-Control", "no-cache");
xhr.send(data);        
} else {
this.props.history.push({pathname:'/'});
}
}

render(){
const { classes } = this.props;
return(this.mounted===true ? <div>
        <div>
            <Header heading="Image Viewer" noSearchBox="box" baseUrl={this.props.baseUrl}
        loggedIn={this.state.loggedIn} searchenable={this.searchboxfunction}accc={this.access_token} prof={this.singleUserUrl}
        searchDisplay="dispSearch" iconDisplay="dispBlock" homeredirect={this.redirecting} profileredirect={this.profileredirect} logoutHandler={this.loginredirect}/></div>

<div className= "homeBody">
<GridList className="HomeGridListRoot" cellHeight={"auto"}  cols={2}>
{(this.state.matchingsearch || []).map((photo,index)=>(
    <GridListTile className="HomeGridListTile" key={"grid" + photo.id} cols={photo.cols|| 1}>
        <Grid className="gridContainerRoot" container className={classes.root} spacing={10}>
            <Grid className="gridItemRoot"item>
            <Card className="cardRoot">
            <CardHeader 
                        avatar={
                            
                            <Avatar className={classes.profileAvatar} src={photo.user.profile_picture} alt="User-Profile-logo">
                            </Avatar>
                        }
                        title={photo.caption.from.username}
                        //   subheader={ moment(photo.caption.created_time,"x").format("DD MMM YYYY hh:mm a")}
                        subheader={moment.unix(photo.caption.created_time).format("DD/MM/YYYY HH:mm:ss")}
            />
            <CardContent className="cardContentRoot">
                    <img src={photo.images.low_resolution.url} alt={photo.caption.text} className="imageProp" />
                    <hr/>
                    <Typography variant="h6">{(photo.caption.text).split(/#/)[0]}</Typography>
                    {photo.tags.map((tag,index)=><span key={"span"+photo.id+index} className="hash-tags">#{tag} </span>)}
                    <br></br>
                    <br></br>
                    <div className="likesProp">
                        <Typography variant="h5" >
                        {photo.user_has_liked ? 
                            <FavoriteBorder className="noLike" 
                            onClick={this.heartClickHandler.bind(this, photo.id, index)}/>
                                :
                            <Favorite className="Liked" 
                            onClick={this.heartClickHandler.bind(this, photo.id, index)}/>                                                                                                       
                        }
                        </Typography>
                                <div className="likeCount">
                                         <span >{(photo.likes.count)} likes</span>
                                            </div>
                                    </div>
                                    <div >
                    <Grid>
                        <Grid >
                            {(photo.comments.data || []).map((comment) => {
                                return<div> <Typography className="commentTypography" key={comment.id}>
                                   <span className="userNameSpan"><b>{comment.commentUser}:</b></span>
                                    <span className="commenttext"> {comment.commentInput}</span>
                                </Typography></div>
                            })}
                        </Grid>
                    </Grid>
                    <div className="innercommentbox">
                    <FormControl >
                        <FormHelperText id={'formhelper' + photo.id} className={this.state.addComment}>
                            <span id={"innerspan" + photo.id} ></span>
                        </FormHelperText>
                    </FormControl> <br></br>  <br></br>
                    <FormControl className="commentinputbox">
                        <InputLabel htmlFor={"comment"+photo.id}>Add a Comment</InputLabel>
                        <Input id={"comment"+photo.id} type="text"  />
                    </FormControl>
                    <Button className="addcommentbutton" id={"addcomment" + photo.id} variant="contained" color="primary" 
                        onClick={this.addCommentOnClickHandler.bind(this, photo.id, index)}>ADD
                    </Button>
                    </div>
                    </div>
            </CardContent>
            </Card>
            </Grid>
        </Grid>         
        
    )</GridListTile> ))}
    </GridList>
</div>              
</div>
:
""); 
}
}
export default withStyles(styles)(Home);
