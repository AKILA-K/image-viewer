import React, {Component} from 'react';
import './Header.css';
import Input from '@material-ui/core/Input';
import Search from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

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

// Opening menu that contains the profile and logout link
  openMenuHandler = () => {
      this.setState({
          menuIsOpen: true,
      });
  }

// Opening menu that contains the profile and logout link
  closeMenuHandler = () => {
      this.setState({
          menuIsOpen: false
      });
  }

componentWillMount() {
// Get owner info after authenticating the  accessToken generated
/*Session Validation is already done in Home and Profile page try 
block is to avoid exception on Login page
*/
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
            <Search />
          </IconButton>
</span>
<Input id="testing" placeholder="Search…" disableUnderline={true} onChange={this.props.searchenable} />
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
                    
                       <span> <MenuItem onClick={this.props.profileredirect}>My Account</MenuItem><hr className="menuRule"/></span>:""}
                        <MenuItem onClick={this.props.logoutHandler}>Logout</MenuItem>
                </Menu>
            </div>
</div>
</div>

</div>);  
}

}

export default Header;