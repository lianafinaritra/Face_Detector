import AWS from 'aws-sdk';

function AnonLog(){   
    AWS.config.region = process.env.REACT_APP_REGION
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: process.env.REACT_APP_IDENTITYPOOLID as string
    })
    AWS.config.getCredentials(function () {
      var accessKeyId = AWS.config.credentials?.accessKeyId;
      var secretAccessKey = AWS.config.credentials?.secretAccessKey;
      var sessionToken = AWS.config.credentials?.sessionToken;
    });
  }

export default AnonLog