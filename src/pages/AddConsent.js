import React, { Component } from "react"
import { Button, Form, Input, PageHeader, Spin} from "antd"
import Provider from "../components/Provider"
const Web3 = require("web3");

class AddConsent extends Component {

    state = {
        result: null,
        provider_id:null,
        consent_status:null,
        loading: null
    }

    /**
     * Searching for provider's info
     *  
     */
    provider_search = async e => {
        e.preventDefault();

        try {
            this.setState({feedbackMessage: null});
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(JSON.parse(process.env.REACT_APP_ABI), 
                                                   process.env.REACT_APP_CONTRACT_ADDR);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            //calling mapping providers_info
            await contract.methods.providers_info(this.state.provider_id).call({}, (error, result) => {                                        
                this.setState(  { result: 
                                    { provider_id:this.state.provider_id,
                                      name:  result['name'],
                                      address: result['street'],
                                      phone:   result['phone'],
                                      consentInfo: result['consent_info'],      
                                    }
                                } );
            });
            
            //if the 'from' key is removed from the call function, then nothing works because the smart contract will not know who user.sender is
            await contract.methods.consent_status(this.state.provider_id).call({from:accounts[0]}, (error, result) => {          
                this.setState({consent_status:result});
            });
        }
        catch (error) {
            this.setState({result:null});
            this.setState({feedbackMessage: "Error: "+ error.message});
        }
    }

    /**
     * Changing the consent status of the provider
     * 
     */
    change_consent = async e => {
        e.preventDefault();

        const new_consent = !this.state.consent_status
        
        this.setState({loading:true});     
        this.setState({feedbackMessage: null});
       
        try {
            const web3 = new Web3(window.ethereum);  
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });          
            const contract = new web3.eth.Contract(JSON.parse(process.env.REACT_APP_ABI), 
                                                   process.env.REACT_APP_CONTRACT_ADDR);

            await contract.methods.change_consent(this.state.provider_id, new_consent).send({
                from:accounts[0],
                to: process.env.REACT_APP_CONTRACT_ADDR,
                chainId: 5, //Goerli
            })
            this.setState({consent_status:new_consent});
            
            if(new_consent){
                this.setState({feedbackMessage: "Sucessfully granted consent"});
            }
            else {
                this.setState({feedbackMessage: "Sucessfully revoked consent"});
            }
        }
        catch (error) { //code error
            this.setState({feedbackMessage: "Error: "+ error.message});         
        }
        finally {
            this.setState({loading:false});       
        }
    }

    /**
     * Rendering
     * @returns 
     */
    render() {
        return (
            <div>
                <PageHeader className="header-container" title="Search for Provider" />
                <Form className="container" onSubmit={this.provider_search}>
                    <Input.Group compact className="container">
                        <Input
                            style={{ width: 400, textAlign: "center", borderRight: 0}}
                            placeholder="Provider's Identifier"
                            onChange={e => this.setState({ provider_id: e.target.value })}
                        />
                        <Button icon="search" type="primary" onClick={this.provider_search} >Search</Button>
                        <br /><br />
                    </Input.Group>
                    {this.state.result && ( <Provider contract={this.state.result} /> )}
                    <br /><br />
                    {this.state.result && !this.state.consent_status &&  (<Button icon="user-add" type="primary" onClick={this.change_consent} > Consent  </Button>)}
                    {this.state.result && this.state.consent_status && (<Button icon="user-delete" type="primary" onClick={this.change_consent} > Revoke  </Button>)}
                    <br/><br/><br/>
                    {this.state.loading && <center> <Spin tip = "Blockchain is processing the transaction" size="large" /> </center>  }
                    <br/><br/><br/>
                    {this.state.feedbackMessage && <center><h3 className="error"> { this.state.feedbackMessage } </h3> </center>}
                </Form>
            </div>
        )
    }
}

export default AddConsent
