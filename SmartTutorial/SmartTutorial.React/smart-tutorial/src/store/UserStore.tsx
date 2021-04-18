


const UserContext = React.createContext();

class UserStore extends React.Component {
    state = {
      user: {
        avatar:
          "https://www.gravatar.com/avatar/5c3dd2d257ff0e14dbd2583485dbd44b",
        name: "Dave",
        followers: 1234,
        following: 123
      }
    };
  
    render() {
      return (
        <UserContext.Provider value={this.state.user}>
          {this.props.children}
        </UserContext.Provider>
      );
    }
  }