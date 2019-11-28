import React, {Component} from 'react';
import './Login.css';
import Header from '../../common/header/Header';


//Materal UI components
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';


class Login extends Component {

constructor() {
	super();
	this.state = {
		loggedIn:false,
		usernameRequired:"dispNone",
		loginPasswordRequired:"dispNone",
		successful:"dispNone",
		failure:"dispNone",
		username:"",
		loginPassword:""
	}
}

inputUsernameChangeHandler = (e) => {
	this.setState({ username: e.target.value });
}

inputLoginPasswordChangeHandler = (e) => {
	this.setState({ loginPassword: e.target.value });
}

loginClickHandler = () => {

	let accessToken = "8661035776.d0fcd39.39f63ab2f88d4f9c92b0862729ee2784";
//	let username="validuser";
//	let password="validpassword";
	let username="s";
	let password="s";
	let that = this;
	if(that.state.username===username &&  that.state.loginPassword===password ){  
			sessionStorage.setItem("access-token", accessToken);
			//Route to home here  
				this.props.history.push({pathname:'/home/',state:{ accessToken: accessToken
				, loggedIn:true}});
		} else {
			sessionStorage.setItem("access-token", "null");
			if(that.state.username==="" || that.state.loginPassword===""){
				this.state.username === "" ? this.setState({ usernameRequired: "dispBlock" }) : this.setState({ usernameRequired: "dispNone" });
				this.state.loginPassword === "" ? this.setState({ loginPasswordRequired: "dispBlock" }) : this.setState({ loginPasswordRequired: "dispNone" });
				
					that.setState({
						loggedIn: false,
						failure:"dispNone",
					});			
			} else {
				this.state.username === "" ? this.setState({ usernameRequired: "dispBlock" }) : this.setState({ usernameRequired: "dispNone" });
				this.state.loginPassword === "" ? this.setState({ loginPasswordRequired: "dispBlock" }) : this.setState({ loginPasswordRequired: "dispNone" });
			that.setState({
				loggedIn: false,
				failure:"dispBlock",
			});
		}	
		}
}
render(){
return(

<div >
<div className="header-container">
<Header heading="Image Viewer" searchDisplay="dispNone" iconDisplay="dispNone"/><br />
</div>
<div className="card-container">
<Card className="cardStyle">
<CardContent>
	<Typography variant="h3" >
	LOGIN
	</Typography>
	<FormControl required>
		<InputLabel htmlFor="username">Username</InputLabel>
		<Input id="username" type="text" username={this.state.username} onChange={this.inputUsernameChangeHandler} />
		<FormHelperText className={this.state.usernameRequired}>
			<span className="red">required</span>
		</FormHelperText>
	</FormControl>
	<br /><br />
	<FormControl required>
		<InputLabel htmlFor="loginPassword">Password</InputLabel>
		<Input id="loginPassword" type="password" loginpassword={this.state.loginPassword} onChange={this.inputLoginPasswordChangeHandler} />
		<FormHelperText className={this.state.loginPasswordRequired}>
			<span className="red">required</span>
		</FormHelperText>
	</FormControl>
	<br /><br />
	{this.state.loggedIn === false &&
		<FormControl>
			<span className={this.state.failure}>
				<span className="red">Incorrect username and/or password</span>
			</span>
		</FormControl>
	}

	<br /><br />
	<Button variant="contained" color="primary" onClick={this.loginClickHandler}>LOGIN</Button>
</CardContent>
</Card>
</div>
</div>)
}
}
export default Login;

