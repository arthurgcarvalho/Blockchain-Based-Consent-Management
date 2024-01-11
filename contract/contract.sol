// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract HIE { 

    struct Provider {
        address id;
        string  name;
        string  street;
        string  state;
        string  phone;
        string  consent_info;
    }
   
    address public administrator = 0xbdB61Ada027eF27ef0709D3848Db1Dd13c96F970; // user who can add providers
    mapping(address => Provider) public providers_info;           // info about providers
    mapping(address => address[]) private patient_provider_map;   // info about consent previously granted

    
    /**
     * Function that grants or revoke consent
     * @param _provider provider's address
     * @param _consent true/false grant/revoke consent
     */
    function change_consent (address _provider, bool _consent) public {

        bool    found_provider = false;
        uint256 array_length   = patient_provider_map[msg.sender].length;

        //for all providers who have the consent to access the patient's data
        for (uint256 index = 0; index < array_length; index++) {

            // if the provider matches what came from the UI
            if(patient_provider_map[msg.sender][index] == _provider)   {

                if(_consent == false) { //revoke consent                    
                    patient_provider_map[msg.sender][index] = patient_provider_map[msg.sender][array_length -1];
                    patient_provider_map[msg.sender].pop();
                }
                found_provider = true;
                break;
            }
        }

        // adding a new provider to the list
        if(found_provider == false && _consent == true) {              
            patient_provider_map[msg.sender].push(_provider);
        }
        
    }

    /**
     * Function that reports consent status
     * @param _provider provider's address
     * @return true/false granted/revoked consent
     */
    function consent_status (address _provider) public view returns(bool) {

        address[] memory providers = patient_provider_map[msg.sender];

        //for all providers who have the consent to access the patient's data
        for (uint256 index = 0; index < providers.length; index++) {
            if(providers[index] == _provider) { //_provider is in the list of providers
                return true;
            }
        }

        return false;
    }


    /**
     * Function that lists all providers linked to a patient
     * @return list of providers who can access a patient's data
     */
    function list_providers () public view returns(Provider[] memory){

        address[]  memory  providers  = patient_provider_map[msg.sender];
        Provider[] memory  result     = new Provider[](providers.length); //empty array of providers

        //for all providers who have the consent to share the patient's data
        for (uint256 index = 0; index < providers.length; index++) {
            result[index] = providers_info[providers[index]];
        }

        return result;
    }


    /**
     * Function to create a provider. 
     *  @param _provider provider's address
     */
    function add_provider(address _provider, string memory  _name, string memory  _street, string memory  _state, 
                           string memory  _phone, string memory  _providers_consent_info) public {
        require(msg.sender == administrator); //only administrator can add providers
        providers_info[_provider] = Provider(_provider,_name, _street, _state, _phone, _providers_consent_info);
    }

}