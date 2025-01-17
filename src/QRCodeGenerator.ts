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
    NetworkType,
    Transaction,
    TransactionMapping,
    Account,
    PublicAccount,
    Password
} from "nem2-sdk";
import { MnemonicPassPhrase } from 'nem2-hd-wallets';

// internal dependencies
import {
    QRCodeInterface,
    QRCodeType,
    QRCode,
    AccountQR,
    ContactQR,
    ObjectQR,
    TransactionQR,
    CosignatureQR,
    MnemonicQR,
} from '../index';

/**
 * Class `QRCodeGenerator` describes a NIP-7 compliant QR Code
 * generator (factory).
 *
 * @since 0.2.0
 */
export class QRCodeGenerator {

    /**
     * Factory/Singleton pattern, constructor is private.
     *
     * @access private
     */
    private constructor() {}

    /**
     * Create a JSON object QR Code from a JSON object.
     *
     * @see {ObjectQR}
     * @param   object          {Object}
     * @param   networkType     {NetworkType}
     * @param   chainId         {string}
     */
    public static createExportObject(
        object: Object,
        networkType: NetworkType = NetworkType.MIJIN_TEST,
        chainId: string = 'E2A9F95E129283EF47B92A62FD748DBA4D32AA718AE6F8AC99C105CFA9F27A31'
    ): ObjectQR {
        return new ObjectQR(object, networkType, chainId);
    }

    /**
     * Create a Contact QR Code from a contact name
     * and account.
     *
     * @see {ContactQR}
     * @param   transaction     {Transaction}
     * @param   networkType     {NetworkType}
     * @param   chainId         {string}
     */
    public static createAddContact(
        name: string,
        account: Account | PublicAccount,
        networkType: NetworkType = NetworkType.MIJIN_TEST,
        chainId: string = 'E2A9F95E129283EF47B92A62FD748DBA4D32AA718AE6F8AC99C105CFA9F27A31'
    ): ContactQR {
        return new ContactQR(name, account, networkType, chainId);
    }

    /**
     * Create an Account Export QR Code from an Account
     * instance, encrypted with given password.
     *
     * @see {AccountQR}
     * @param   account         {Account}
     * @param   password        {Password}
     * @param   networkType     {NetworkType}
     * @param   chainId         {string}
     */
    public static createExportAccount(
        account: Account,
        password: Password,
        networkType: NetworkType = NetworkType.MIJIN_TEST,
        chainId: string = 'E2A9F95E129283EF47B92A62FD748DBA4D32AA718AE6F8AC99C105CFA9F27A31'
    ): AccountQR {
        return new AccountQR(account, password, networkType, chainId);
    }

    /**
     * Create a Transaction Request QR Code from a Transaction
     * instance.
     *
     * @see {TransactionQR}
     * @param   transaction     {Transaction}
     * @param   networkType     {NetworkType}
     * @param   chainId         {string}
     */
    public static createTransactionRequest(
        transaction: Transaction,
        networkType: NetworkType = NetworkType.MIJIN_TEST,
        chainId: string = 'E2A9F95E129283EF47B92A62FD748DBA4D32AA718AE6F8AC99C105CFA9F27A31'
    ): TransactionQR {
        return new TransactionQR(transaction, networkType, chainId);
    }

    /**
     * Create a Mnemonic Export QR Code from a MnemonicPassPhrase
     * instance, encrypted with given password.
     *
     * @see {MnemonicQR}
     * @param   mnemonic        {MnemonicPassPhrase}
     * @param   password        {Password}
     * @param   networkType     {NetworkType}
     * @param   chainId         {string}
     */
    public static createExportMnemonic(
        mnemonic: MnemonicPassPhrase,
        password: Password,
        networkType: NetworkType = NetworkType.MIJIN_TEST,
        chainId: string = 'E2A9F95E129283EF47B92A62FD748DBA4D32AA718AE6F8AC99C105CFA9F27A31'
    ): MnemonicQR {
        return new MnemonicQR(mnemonic, password, networkType, chainId);
    }

    /**
     * Parse a JSON QR code content into a sub-class
     * of QRCode.
     *
     * @param   json    {string}
     * @return  {QRCode}
     * @throws  {Error}     On empty `json` given.
     * @throws  {Error}     On missing `type` field value.
     * @throws  {Error}     On unrecognized QR code `type` field value.
     */
    static fromJSON(
        json: string,
        password: Password | undefined = undefined
    ): QRCode {

        if (! json.length) {
            throw new Error('JSON argument cannot be empty.');
        }

        let jsonObject: any;
        try {
            jsonObject = JSON.parse(json);
            if (!jsonObject.type) {
                throw new Error('Missing mandatory field with name "type".');
            }
        }
        catch(e) {
            // Invalid JSON provided, forward error
            throw new Error(e);
        }

        // We will use the `fromJSON` static implementation
        // of specialized QRCode classes (child classes).
        // An error will be thrown if the QRCodeType is not
        // recognized or invalid.

        switch (jsonObject.type) {

        // create a ContactQR from JSON
        case QRCodeType.AddContact:
            return ContactQR.fromJSON(json);

        // create an AccountQR from JSON
        case QRCodeType.ExportAccount:

            // password obligatory for encryption
            if (! password) {
                throw new Error('Missing password to decrypt AccountQR QR code.');
            }

            return AccountQR.fromJSON(json, password);

        // create a ObjectQR from JSON
        case QRCodeType.ExportObject:
            return ObjectQR.fromJSON(json);

        // create a CosignatureQR from JSON
        case QRCodeType.RequestCosignature:
            return CosignatureQR.fromJSON(json);

        // create a TransactionQR from JSON
        case QRCodeType.RequestTransaction:
            return TransactionQR.fromJSON(json);

        // create an MnemonicQR from JSON
        case QRCodeType.ExportMnemonic:

            // password obligatory for encryption
            if (! password) {
                throw new Error('Missing password to decrypt MnemonicQR QR code.');
            }

            return MnemonicQR.fromJSON(json, password);

        default:
            break;
        }

        throw new Error("Unrecognized QR Code 'type': '" + jsonObject.type + "'.");
    }
}
