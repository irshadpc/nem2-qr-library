/**
 * Copyright 2019 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *limitations under the License.
 */
import {
    Address,
    Account,
    PublicAccount,
} from "nem2-sdk";

// internal dependencies
import {
    QRCodeDataSchema,
    QRCode,
    QRCodeType,
    ContactQR
} from '../../index';

/**
 * Class `AddContactDataSchema` describes a contact
 * add QR code data schema.
 *
 * @since 0.3.0
 */
export class AddContactDataSchema extends QRCodeDataSchema {

    constructor() {
        super();
    }

    /**
     * The `getData()` method returns an object
     * that will be stored in the `data` field of
     * the underlying QR Code JSON content.
     *
     * @return {any}
     */
    public getData(qr: ContactQR): any {
        return {
            "name": qr.name,
            "publicKey": qr.account.publicKey.toString(),
        };
    }

    /**
     * Parse a JSON QR code content into a ContactQR
     * object.
     *
     * @param   json    {string}
     * @return  {ContactQR}
     * @throws  {Error}     On empty `json` given.
     * @throws  {Error}     On missing `type` field value.
     * @throws  {Error}     On unrecognized QR code `type` field value.
     */
    static parse(
        json: string
    ): ContactQR {
        if (! json.length) {
            throw Error('JSON argument cannot be empty.');
        }

        const jsonObj = JSON.parse(json);
        if (!jsonObj.type || jsonObj.type !== QRCodeType.AddContact) {
            throw Error('Invalid type field value for ContactQR.');
        }

        // read contact data
        const name = jsonObj.data.name;
        const network = jsonObj.network_id;
        const account = PublicAccount.createFromPublicKey(jsonObj.data.publicKey, network);
        const generationHash = jsonObj.chain_id;

        return new ContactQR(name, account, network, generationHash);
    }
}
