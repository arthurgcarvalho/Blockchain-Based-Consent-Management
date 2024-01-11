import React, { Component } from "react"
import { Button, Form} from "antd"
import Provider from "../components/Provider"
const Web3 = require("web3");

class ListConsent extends Component {

    constructor(props) {
        super(props);
        this.state = { values: [],
                       provider_id: [],
                       name: [],
                       address:[],
                       phone: [],
                       consentInfo:[],
                       timestamp:[],
                       feedbackMessage:null
                    };
    }
    
    createUI(){
        return this.state.values.map((el, i) => 
            <div key={i}>                 
                <Provider contract={{ provider_id:this.state.provider_id[i], 
                                      name: this.state.name[i], 
                                      address: this.state.address[i], 
                                      phone: this.state.phone[i], 
                                      consentInfo: this.state.consentInfo[i]}} />
                <br /><br /> 
             </div>          
         )
      }
         
    retrieve = async e => {
        try{
            const web3 = new Web3(window.ethereum);
            var contract = new web3.eth.Contract(JSON.parse(process.env.REACT_APP_ABI), 
                                                 process.env.REACT_APP_CONTRACT_ADDR);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            //if the 'from' key is removed from the call function, then nothing works because the smart contract will not know who user.sender is
            await contract.methods.list_providers().call({from:accounts[0]}, (error, result) => {    
                this.setState({values: [],  provider_id: [], name: [],  address:[], phone: [], consentInfo:[], timestamp:[]});      
              
                if (result.length == 0) {
                    this.setState({feedbackMessage:true});
                }
                else {
                    this.setState({feedbackMessage:false});
                    for (var i = 0; i < result.length; i++) {    
                        this.setState(prevState => ({ values: [...prevState.values, '']}));
                        this.setState(prevState => ({ provider_id: [...prevState.provider_id,  result[i].id]}));
                        this.setState(prevState => ({ name: [...prevState.name,  result[i].name]}));
                        this.setState(prevState => ({ address: [...prevState.address,  result[i].street]}));
                        this.setState(prevState => ({ phone: [...prevState.phone,  result[i].phone]}));
                        this.setState(prevState => ({ consentInfo: [...prevState.consentInfo,  result[i].consent_info]}));
                    }
                }
            });
        }
        catch (error) {
          console.log(error)
        }
    }      
         
    render() {
        return (
            <div>
                <Form className="container">
                    <center>   
                    <br />                       
                    <Button icon="bars" type="primary" onClick={this.retrieve.bind(this)} > Retrieve Providers  </Button>
                    <br /><br />
                    </center>
                    {this.createUI()}        
                    <br/><br/>
                    {this.state.feedbackMessage &&  <center><h3 className="error"> No provider has been granted consent. </h3></center> }
                </Form>
            </div>
        );
    }
}

export default ListConsent
