#!/bin/bash

cd platforms/android/cordova/
./build --release
cd ../../..
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore hln-release-key.keystore platforms/android/ant-build/IceClient-release-unsigned.apk alias_name
zipalign -f -v 4 platforms/android/ant-build/IceClient-release-unsigned.apk IceClient.apk
