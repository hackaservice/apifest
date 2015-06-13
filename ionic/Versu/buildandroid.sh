 cordova build --release android
 jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore tools/my-release-key.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk alias_name
 tools/zipalign -f -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk platforms/android/build/outputs/apk/android-release.apk
 cp platforms/android/build/outputs/apk/android-release.apk dist/android-release.apk