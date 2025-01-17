# nem2-qr-library

[![npm version](https://badge.fury.io/js/nem2-qr-library.svg)](https://badge.fury.io/js/nem2-qr-library)
[![Build Status](https://travis-ci.org/anthonylaw/nem2-qr-library.svg?branch=master)](https://travis-ci.org/anthonylaw/nem2-qr-library)
[![Slack](https://img.shields.io/badge/chat-on%20slack-green.svg)](https://nem2.slack.com/messages/CB0UU89GS//)

:warning: **This package is currently still in development, please do not use in production.** *The author of this package cannot be held responsible for any loss of money or any malintentioned usage forms of this package. Please use this package with caution.*

NEM2 QR Library generator to generate QR codes for Catapult (NEM2) accounts and transactions.

This is a PoC to validate the proposed [NIP 7 QR Library Standard Definition](https://github.com/nemtech/NIP/issues/3). When stable, the repository will be moved to the [nemtech](https://github.com/nemtech) organization.

## Installation

`npm install nem2-qr-library`

## Usage

### Generate QRCode for a Transaction Request

```typescript
import { QRCodeGenerator } from 'nem2-qr-library';

// (Optional) create transfer transaction (or read from network)
const transfer = TransferTransaction.create(
  Deadline.create(),
  Address.createFromPublicKey(
    'C5C55181284607954E56CD46DE85F4F3EF4CC713CC2B95000FA741998558D268',
    NetworkType.MIJIN_TEST
  ),
  [new Mosaic(new NamespaceId('cat.currency'), UInt64.fromUint(10000000))],
  new PlainMessage('Welcome to NEM!'),
  NetworkType.MIJIN_TEST
);

// create QR Code base64
const request = QRCodeGenerator.createTransactionRequest(transfer);

// get base64 notation for <img> HTML attribute
const base64 = request.toBase64();
```

### Generate QRCode for a custom object

```typescript
import { QRCodeGenerator } from 'nem2-qr-library';

// define custom object to suit your application use case.
const object = {"obj": "test"};

// create QR Code base64
const request = QRCodeGenerator.createExportObject(object, NetworkType.TEST_NET);

// get base64 notation for <img> HTML attribute
const base64 = request.toBase64();

```

### Generate ContactQR code

```typescript
import {
    PublicAccount,
    NetworkType,
} from 'nem2-sdk';

const name = 'test-contact-1';
const account = PublicAccount.createFromPublicKey(
                'C5C55181284607954E56CD46DE85F4F3EF4CC713CC2B95000FA741998558D268',
                NetworkType.TEST_NET
            );

// create QR Code base64
  const request = QRCodeGenerator.createAddContact(name, account);

// get base64 notation for <img> HTML attribute
const base64 = request.toBase64();

```

### Generate QRCode for a Mnemonic data

```typescript
import {
    Account,
    NetworkType,
    Password,
} from 'nem2-sdk';
import { MnemonicPassPhrase } from 'nem2-hd-wallets';

// create a mnemonic and password.
const mnemonic = MnemonicPassPhrase.createRandom();
const password = new Password('password');


// create QR Code base64
const exportMnemonic = new MnemonicQR(mnemonic, password, NetworkType.MIJIN_TEST, 'no-chain-id');

// get base64 notation for <img> HTML attribute
const base64 = exportMnemonic.toBase64();

```




The produced Base64 encoded payload can be used to display the QR Code. An example of display can be done easily with HTML, as follows:

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" alt="Transfer Transaction QR code" />
```

## Changelog

Important versions listed below. Refer to the [Changelog](CHANGELOG.md) for a full history of the project.

- [0.3.0](CHANGELOG.md) - 2019-05-27
- [0.2.0](CHANGELOG.md) - 2019-05-01
- [0.1.0](CHANGELOG.md) - 2019-04-20

## License

Licensed under the [Apache License](LICENSE.md), Version 2.
