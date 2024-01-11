import React, { Component } from "react"
import { Card, Descriptions } from "antd"

class Provider extends Component {
    render() {
        const {
            provider_id,
            name,
            address,
            phone,
            consentInfo
        } = this.props.contract
        return (
            <Card title= {"Provider's Identifier: " + provider_id} >
                <Descriptions layout="vertical" bordered>
                    <Descriptions.Item label="Name">{name}</Descriptions.Item>
                    <Descriptions.Item label="Address">{address}</Descriptions.Item>
                    <Descriptions.Item label="Phone number">{phone}</Descriptions.Item>
                </Descriptions>
                <Card style={{ marginTop: 16 }}  type="inner" title="Consent Information" >
                {consentInfo}
                </Card>
            </Card>
        )
    }
}

export default Provider
