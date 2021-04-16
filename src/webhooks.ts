import fetch from "node-fetch";
import {Contract} from "./ContractManager";
import {IClientEvent} from "./NodeManager";

export const executeWebhook = async (data : IClientEvent, contract : Contract) => {
    const {requestTimeoutID, connectionTTLID, ...cleanedContract} = contract
    console.log(`fetching at ${contract.callbackURL}`)
    if (!contract.callbackURL) return
    await fetch(contract.callbackURL,{
        method : "POST",
        body : JSON.stringify({...cleanedContract, event: data.event})
    })
}
