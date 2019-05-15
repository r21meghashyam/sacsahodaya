// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
/*
const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage')();
const spawn = require('child-process-promise').spawn;
const mkdirp = require('mkdirp-promise');
const path = require('path');
const os = require('os');
const fs = require('fs');
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDWUlD7yY7eTndRatrsWbnnrbob5IlKS4Y",
    authDomain: "sac-sahodaya.firebaseapp.com",
    databaseURL: "https://sac-sahodaya.firebaseio.com",
    projectId: "sac-sahodaya",
    storageBucket: "sac-sahodaya.appspot.com",
    credential: admin.credential.cert(serviceAccount),
    messagingSenderId: "1010182875716"
};
admin.initializeApp(config);
var storage = admin.storage();



// // Create and Deploy Your First Cloud Functions
exports.optimizeImages= functions.storage.object().onFinalize((image)=>compress(image));
const compress=(data) => {
    // File and directory paths.
    console.log("data",data);
    const filePath = data.name;
    const tempLocalFile = path.join(os.tmpdir(), filePath);
    const tempLocalDir = path.dirname(tempLocalFile);

    var size;
    var crop;

    // Exit if this is triggered on a file that is not an image.
    if (!data.contentType.startsWith('image/')) {
        console.log('This is not an image.');
        return null;
    }

    // Exit if this is a move or deletion event.
    if (data.resourceState === 'not_exists') {
        console.log('This is a deletion event.');
        return null;
    }

    // Exit if file exists but is not new and is only being triggered
    // because of a metadata change.
    if (data.resourceState === 'exists' && data.metageneration > 1) {
        console.log('This is a metadata change event.');
        return null;
    }

    // In my case i determine the size of the image based on the extension, 
    // but you can ignore this part or  use a custom rule.
    if (data.contentType === 'image/jpeg') {
        size = "1500x650^";
        crop = "1500x650+0+0";
    } else {
        size = "200x200^";
        crop = "200x200+0+0";
    }

    // Cloud Storage files.
    const bucket = gcs.bucket(data.bucket);
    console.log("bucket",bucket);
    const file = bucket.file(filePath);

    return file.getMetadata()
        .then(([metadata]) => {
            if (metadata.metadata && metadata.metadata.optimized) {
                return Promise.reject(Error('Image has been already optimized'));
            }
            return Promise.resolve();
        })
        .then(() => mkdirp(tempLocalDir))
        .then(() => file.download({ destination: tempLocalFile }))
        .then(() => {
            console.log('Resize to: ' + size);
            return spawn('convert', [tempLocalFile, '-geometry', size, '-gravity', 'center', '-crop', crop, tempLocalFile]);
        })
        .then(() => {
            console.log('The file has been downloaded to', tempLocalFile);
            return spawn('convert', [tempLocalFile, '-strip', '-interlace', 'Plane', '-quality', '90', tempLocalFile]);
        })
        .then(() => {
            console.log('Optimized image created at', tempLocalFile);
            // Uploading the Optimized image.
            return bucket.upload(tempLocalFile, {
                destination: file,
                metadata: {
                    metadata: {
                        optimized: true
                    }
                }
            });
        })
        .then(() => {
            console.log('Optimized image uploaded to Storage at', file);
            console.log(file.getDownloadURL());
            // Once the image has been uploaded delete the local files to free up disk space.
            fs.unlinkSync(tempLocalFile);
            return null;
        });
}
*/