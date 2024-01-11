import React, { Component } from "react"
import { HashRouter as Router, Link, Route, Switch, Redirect } from "react-router-dom"
import { Icon, Menu, Button}        from "antd" //list of items available at https://3x.ant.design/components/icon/
import AddConsent          from "./pages/AddConsent"
import ListConsent       from "./pages/ListConsent"
import "./App.css"
import detectEthereumProvider from '@metamask/detect-provider';

class App extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            logged_in: null,
        };
    
        this.login = this.login.bind(this);
        
    }

    componentDidMount() {
        document.title = 'Online Consent Management';
    }

    async login(){

        const provider = await detectEthereumProvider();

        if (typeof window.ethereum !== 'undefined') {
            console.log('Wallet is installed!');
        }
        else{
            console.log("Wallet is not installed")
        }

        if (provider) {
            // From now on, this should always be true: provider === window.ethereum
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const chainId  = await window.ethereum.request({ method: 'eth_chainId' });

            if (chainId != 0x5) {
                alert('Please change the network to Goerli');
            }
            else {
                console.log("Login successful");
                console.log("User id: " + accounts[0]);
                console.log("Chain id: " + chainId);
                this.setState({ logged_in: true }); 
            }
        } 
        else {
            alert('Please install MetaMask!');
        }
    }

    render() {
        return (
            <Router>
                <div className="nav-container">
                    <h1 style={{textAlign: "center", margin: 0, color: "#1890ff", fontSize: 32}}>
                        Online Consent Management
                    </h1>
                     {this.state.logged_in &&   <Menu mode="horizontal" style={{position: 'relative', display: 'flex', justifyContent: 'center'}} className="nav">
                                                    <Menu.Item key="search">
                                                        <Link to="/add">
                                                            <Icon type="search" />
                                                            Search for Provider
                                                        </Link>
                                                    </Menu.Item>                                                    
                                                    <Menu.Item key="retrieve">
                                                        <Link to="/list">
                                                            <Icon type="unordered-list" />
                                                            List Providers
                                                        </Link>
                                                    </Menu.Item>
                                                </Menu>}
                </div>
                <Switch>
                    <Route exact path ="/">
                        {this.state.logged_in ? <Redirect to="/add" />:<div>
                                                                            <br />
                                                                            <center><Button icon="deployment-unit" type="primary" onClick={this.login} >Connect</Button> <br /><br /></center>
                                                                            <Link to="/remove" />
                                                                        </div>
                        }
                    </Route>
                    {this.state.logged_in &&  //route is only valid if logged in
                        <Route
                            path="/add"
                            render={() => (<AddConsent />)}
                        />
                    }
                    {this.state.logged_in && //route is only valid if logged in
                        <Route
                            path="/list"
                            render={() => (<ListConsent />)}
                        />
                    }          
                </Switch>
            </Router>
        )
    }
}

export default App