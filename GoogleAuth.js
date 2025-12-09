// GoogleAuth.js
import React, { useEffect, useState } from 'react';
import { Button, View, Text, ActivityIndicator, Platform } from 'react-native';
import {
  makeRedirectUri,
  useAuthRequest,
  exchangeCodeAsync,
} from "expo-auth-session";


const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://accounts.google.com/o/oauth2/revoke",
};

const CLIENT_ID = Platform.OS === "ios"
  ? process.env.EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID
  : process.env.EXPO_PUBLIC_GOOGLE_OAUTH_ANDROID_CLIENT_ID;
const SCOPES = ["openid", "https://www.googleapis.com/auth/userinfo.email"];
const REDIRECT_URI = makeRedirectUri({
  scheme: "com.yourapp.mobile",
});

//Important:

//In your app.json/app.config.ts, ensure scheme, ios bundleIdentifier and android package all match (eg com.yourapp.mobile)

//For Android, ensure you tick "Enable custom URI scheme" when creating the client in the Google Cloud console

export default function GoogleSignIn() {


  const [request, response, promptAsync] =useAuthRequest(
  {
    clientId: CLIENT_ID,
    scopes: SCOPES,
    redirectUri: REDIRECT_URI,
  },
  discovery
);


    const handleGoogleLoginPress = async () => {
  

const result = await promptAsync();

  if (result?.type !== "success") {
    console.warn("Sign in prompt was not successful, perhaps user cancelled sign in?");
    return;
  }

  const { code } = result.params; 
  try {
    const tokenResponse = await exchangeCodeAsync(
      {
        clientId: CLIENT_ID, 
        code: code, 
        redirectUri: REDIRECT_URI, 
        extraParams: {
            code_verifier: request?.codeVerifier || undefined,
        },
      },
      discovery
    );

    const accessToken = tokenResponse.accessToken;
    const idToken = tokenResponse.idToken;
    const refreshToken = tokenResponse.refreshToken;


    // this if you want get user Info
    const userInfoResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    
    const user = await userInfoResponse.json();
    console.log("userInfo", user);

    


  } catch (error) {
  }
  };


  return (

        <Button
          title="Sign in with Google"
          onPress={handleGoogleLoginPress}
        />
     
  );
}



  
