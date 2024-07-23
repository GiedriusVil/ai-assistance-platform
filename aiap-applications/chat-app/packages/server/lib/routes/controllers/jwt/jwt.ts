/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  getConfiguration
} from '@ibm-aiap/aiap-chat-app-configuration';

import {
  jwt
} from '@ibm-aca/aca-wrapper-jsonwebtoken';

const config = getConfiguration();

const verifyToken = token => {
  let cert = config?.jwt?.pem;
  if (cert) {
    const buffer = Buffer.from(cert, 'base64');
    cert = buffer.toString('utf8');
  }

  return new Promise(resolve => {
    jwt.verify(token, cert, (error, decoded) => {
      if (error) {
        resolve(undefined);
      } else {
        resolve(decoded);
      }
    });
  });
};

const verify = async (req, res) => {
  const decoded = await verifyToken(req.body.jwt);
  res.status(200).json(decoded);
};

export default {
  verify,
};
