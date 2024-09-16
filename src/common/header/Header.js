import React, {Component} from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import ReactDOM from 'react-dom';
import './Header.css';
import Profile from '../../screens/profile/Profile';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import { classes } from 'istanbul-lib-coverage';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

function name(parameter1, parameter2, parameter3) {
      // code to be executed
    }


const styles = theme => (
      {
grow: {
flexGrow: 1,
},
title: {
color: 'initial',
},
bigAvatar: {
margin: 10,
width: 60,
height: 60,
},
search: {
position: 'relative',
borderRadius: '4px',
backgroundColor: '#c0c0c0',
marginLeft: '70%',
width: '300px',
verticalAlign: 'center',
},
searchIcon: {
height: '100%',
color: 'black',
position: 'absolute',
pointerEvents: 'none',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
},
inputRoot: {
color: 'inherit',
},
inputInput: {
transition: theme.transitions.create('width'),
width: '100%',
[theme.breakpoints.up('md')]: {
width: 200,
},
},

});

class Header extends Component {

constructor() {
super();
this.state = {
menuIsOpen: false,
ownerInfo_self: [],
loggedIn: sessionStorage.getItem("access-token") == null ? false : true
}
this.searchData='';
}
serachInputHandler = (e) => {
      this.searchData= e.target.value;
}

  openMenuHandler = () => {
     
      this.setState({
          menuIsOpen: true,
      });
 
  }

  closeMenuHandler = () => {
      this.setState({
          menuIsOpen: false
      });
  }

componentWillMount() {
// Get owner info after authenticating the  accessToken generated 
    try{
let ownerData = null;
let xhr = new XMLHttpRequest();
let that = this;
xhr.addEventListener("readystatechange", function () {
if (this.readyState === 4) {
that.setState({
ownerInfo_self: JSON.parse(this.responseText).data
});
}
})
xhr.open("GET", this.props.prof+this.props.accc);
xhr.send(ownerData);} catch (exception) {
    // do nothing
}
}

render(){
return (<div className='header'>

<span className="header-text">
{this.props.iconDisplay==="dispNone"?<span>{this.props.heading}</span>:
<span onClick={this.props.homeredirect}>{this.props.heading}</span>
}
    </span>

<div className={this.props.searchDisplay}>
<span className={this.props.noSearchBox}>
<span className="searchcIcon">
<IconButton className="iconButton" >
            <SearchIcon />
          </IconButton>
</span>
<InputBase id="testing" placeholder="Search…"  onChange={this.props.searchenable} />
</span>
      </div>
<div className={this.props.iconDisplay}>
<div className="image">
<Avatar aria-controls="simple-menu" aria-haspopup="true" onClick={this.openMenuHandler} src={this.state.ownerInfo_self.profile_picture} alt="profile-icon">
</Avatar>
<div >
                <Menu 
                    id="simple-menu"
                    keepMounted
                    open={this.state.menuIsOpen}
                    onClose={this.closeMenuHandler}
                    anchorReference="anchorPosition"
                    anchorPosition={{ top: 62, left:2000}}
                >
                    {this.props.noSearchBox ==="box" ?
                    
                       <span> <MenuItem onClick={this.props.profileredirect}>My Account</MenuItem><hr/></span>:""}
                        <MenuItem onClick={this.props.logoutHandler}>Logout</MenuItem>
                </Menu>
            </div>
</div>
</div>

</div>);  
}

}

export default Header;