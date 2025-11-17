import RNFS from 'react-native-fs';

const signaturePath = RNFS.MainBundlePath + '/FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSky_signature.dat';
RNFS.readFile(signaturePath).then(data => {
}).catch(() => {
});
