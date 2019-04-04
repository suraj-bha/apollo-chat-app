import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import gql from 'graphql-tag';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { Email, VisibilityOff, Visibility } from '@material-ui/icons/';
import { Query } from 'react-apollo';

const GET_USER = gql`
  query($email: String! ) {
    getUser(email: $email){
      name
      email
      password
    }
  }`

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
  },
});
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: '',
      name: '',
      email: '',
      password: '',
      showPassword: false,
      login: false,
      error: false,
    };
  }

  handleClickShowPassword = () => {
    const { showPassword } = this.state;
    this.setState({
      showPassword: !showPassword });
  };

  handleChange = field => (event) => {
    this.setState({
      [field]: event.target.value,
    });
  };

  handleAuth = (data) => {
    const {  getUser } = data;
    const { email, password } = this.state;
    if(!getUser.length) {
      this.setState({
        error: true,
      })
      return null;
    }
    if (getUser && email) {
      if(getUser[0].email === email && getUser[0].password === password) {
        this.setState({
          login: true,
          error: false,
          name: getUser[0].name
        });
      } else {
        this.setState({
          error: true,
        })
      }
    }
  }

  render() {
    const { classes } = this.props;
    const { name, email, password, showPassword, login, error } = this.state;
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper elevation={20} className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <TextField
            id="outlined-email"
            label="Email"
            className="email"
            value={email}
            onChange={this.handleChange('email')}
            margin="normal"
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="outlined-password"
            label="Password"
            className="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={this.handleChange('password')}
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={this.handleClickShowPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {
            login
            ? ( <Link to={{ pathname: '/loggedIn', state: { user: {email: email,name: name}} }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                  Login
                  </Button>
                </Link>)
            : (
              <Query query={GET_USER} variables={{email: email}}>
              {({ data }) => (
                <Button
                fullWidth
                variant="contained"
                color="primary"
                loading="true"
                onClick={() => this.handleAuth(data)}
                className={classes.submit}
                >
                  verify
                </Button>
              )}
              </Query>
            )
            }
          <p>© Successive Technologies</p>
          { error? <p style={{ color: "red"}}>Please enter valid details!</p>: ''}
        </Paper>
      </main>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default withStyles(styles)(Login);
