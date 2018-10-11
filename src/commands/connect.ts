import { AsynchronousCode } from '../codes'
import { ResponseMessage } from '../message'
import { AbstractCommandBase } from './abstractCommand'

export interface ConnectionInfoResponse {
    ProtocolVersion: number
    Model: string
}

// Purpose of this is to emit the connect event with the connectionInfo
export class DummyConnectCommand extends AbstractCommandBase<ConnectionInfoResponse> {
    expectedResponseCode = AsynchronousCode.ConnectionInfo

    deserialize (msg: ResponseMessage) {
        if (msg.Code === this.expectedResponseCode) {
            this.resolve({
                ProtocolVersion: parseFloat(msg.Params['protocol version']),
                Model: msg.Params['model'],
            })
        } else { 
            this.reject(msg)
        }
    }
    serialize () {
        // Nothing to send
        return null
    }
}