import React, { useEffect as useAztecEffect } from 'react';
import { useNavigation as useAztecNav } from '@react-navigation/native';
import {
	Image as AztecImage,
	View as AztecRootView,
	Animated as AztecAnimated,
	Dimensions as AztecDimensions,
	TouchableOpacity as AzTouchable,
	Image as Skiresimage
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UNDERVIEW_PERSIST_KEY = 'underview-persist-aztec-0091';
const UNDERVIEW_FIRST_RUN_KEY = 'underview-firstrun-aztec-77x';

const FiresUnderTheAztecSkyLoading: React.FC = () => {
	const { width: aztskywid, height: azundehei } = AztecDimensions.get('window');
	const aztecNavigator = useAztecNav();

	// Added: grant daily ember gift (coins +1, redGems +3) and store last-ember timestamp
	useAztecEffect(() => {
		let mounted = true;
		const grantDaily = async () => {
			try {
				const [coinsRaw, redRaw] = await Promise.all([
					AsyncStorage.getItem('coins'),
					AsyncStorage.getItem('redGems'),
				]);
				if (!mounted) return;
				const updatedCoins = (Number(coinsRaw) || 0) + 1;    // +1 coin
				const updatedRed = (Number(redRaw) || 0) + 3;        // +3 redGems
				await Promise.all([
					AsyncStorage.setItem('coins', String(updatedCoins)),
					AsyncStorage.setItem('redGems', String(updatedRed)),
					AsyncStorage.setItem('underview-last-ember', String(Date.now())),
				]);
			} catch (err) {
				if (__DEV__) console.warn('EmberDailyGiftPage:grantDaily', err);
			}
		};
		grantDaily();
		return () => { mounted = false; };
	}, []);

	// Animated image for pulsing text

	return (
		<AztecRootView style={{
			justifyContent: 'center',
			height: azundehei,
			alignItems: 'center',
			backgroundColor: 'rgba(0, 79, 47, 1)',
			width: aztskywid,
			flex: 1,
		}}>
			<AztecImage
				style={{
					position: 'absolute',
					resizeMode: 'cover',
					height: azundehei * 1.01,
					width: aztskywid,
				}}
				source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/loadingFires.png')}
			/>
			<Skiresimage
				style={{
					height: azundehei * 0.8,
					width: aztskywid * 0.93,
					resizeMode: 'contain',
				}}
				source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/emberGift.png')}
			/>

			<AzTouchable activeOpacity={0.8}  style={{
				width: aztskywid * 0.116, height: aztskywid * 0.016, justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
				position: 'absolute', bottom: azundehei * 0.05002438,
			}} onPress={() => { 
				aztecNavigator.replace('RitualfireazteSkyContaiapp');
			 }}>
				<Skiresimage source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/playImg.png')} style={{ width: aztskywid * 0.16, height: aztskywid * 0.16, resizeMode: 'contain' }} />
			</AzTouchable>
		</AztecRootView>
	);
};
export default FiresUnderTheAztecSkyLoading;