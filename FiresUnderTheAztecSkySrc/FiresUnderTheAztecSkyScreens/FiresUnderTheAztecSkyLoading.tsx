import React, { useEffect as useAztecEffect } from 'react';
import { useNavigation as useAztecNav } from '@react-navigation/native';
import {
    Image as AztecImage,
    View as AztecRootView,
    Animated as AztecAnimated,
    Dimensions as AztecDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UNDERVIEW_PERSIST_KEY = 'underview-persist-aztec-0091';
const UNDERVIEW_FIRST_RUN_KEY = 'underview-firstrun-aztec-77x';

const FiresUnderTheAztecSkyLoading: React.FC = () => {
	const { width: vistaWidth, height: vistaHeight } = AztecDimensions.get('window');
	const aztecNavigator = useAztecNav();

	// Animated image for pulsing text
	const PulsingTitleImage = (AztecAnimated as any)?.createAnimatedComponent ? (AztecAnimated as any).createAnimatedComponent(AztecImage) : AztecImage;
	const pulseScale = React.useRef(new (AztecAnimated as any).Value(1)).current;
	const pulseLoopRef = React.useRef<any>(null);

	useAztecEffect(() => {
		// start pulsing loop
		const up = (AztecAnimated as any).timing(pulseScale, { toValue: 1.08, duration: 700, useNativeDriver: true });
		const down = (AztecAnimated as any).timing(pulseScale, { toValue: 1.0, duration: 700, useNativeDriver: true });
		pulseLoopRef.current = (AztecAnimated as any).loop((AztecAnimated as any).sequence([up, down]));
		pulseLoopRef.current.start();
		return () => { try { pulseLoopRef.current && pulseLoopRef.current.stop(); } catch (e) {} };
	}, [pulseScale]);

	useAztecEffect(() => {
		let shouldShowOnboarding = false;
		const startBootSequence = async () => {
			try {
				const [firstRunValue, storedProfile, lastEmberRaw] = await Promise.all([
					AsyncStorage.getItem(UNDERVIEW_FIRST_RUN_KEY),
					AsyncStorage.getItem(UNDERVIEW_PERSIST_KEY),
					AsyncStorage.getItem('underview-last-ember'),
				]);

				if (!firstRunValue && !storedProfile) {
					shouldShowOnboarding = true;
					await AsyncStorage.setItem(UNDERVIEW_FIRST_RUN_KEY, 'true');
				}

				// if onboarding is required, go to onboarding (keep original behavior)
				if (shouldShowOnboarding) {
					setTimeout(() => {
						aztecNavigator.replace('FiresUnderTheAztecSkyOnboarding');
					}, 3805);
					return;
				}

				// otherwise, decide between EmberDailyGiftPage and main container based on 15-hour rule
				const now = Date.now();
				const fifteenHoursMs = 15 * 60 * 60 * 1000;
				const lastEmberTs = lastEmberRaw ? Number(lastEmberRaw) : 0;

				const navigateTarget = (!lastEmberRaw || (now - lastEmberTs) >= fifteenHoursMs)
					? 'EmberDailyGiftPage'
					: 'RitualfireazteSkyContaiapp';

				setTimeout(() => {
					aztecNavigator.replace(navigateTarget);
				}, 3805);

			} catch (err) {
				if (__DEV__) console.warn('FiresUnderTheAztecSkyLoading:startBootSequence', err);
				// fallback to main container on error
				setTimeout(() => {
					aztecNavigator.replace('RitualfireazteSkyContaiapp');
				}, 3805);
			}
		};

		startBootSequence();
	}, [aztecNavigator, vistaWidth]);

	return (
		<AztecRootView style={{
			justifyContent: 'center',
			height: vistaHeight,
			alignItems: 'center',
			backgroundColor: 'rgba(0, 79, 47, 1)',
			width: vistaWidth,
			flex: 1,
		}}>
			<AztecImage
				style={{
					position: 'absolute',
					resizeMode: 'cover',
					height: vistaHeight * 1.01,
					width: vistaWidth,
				}}
				source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/loadingFires.png')}
			/>
			<PulsingTitleImage
				style={{
					height: vistaWidth * 0.70534,
					transform: [{ scale: pulseScale }],
					resizeMode: 'cover',
					width: vistaWidth * 0.70534,
				}}
				source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/firesUnderText.png')}
			/>
		</AztecRootView>
	);
};
export default FiresUnderTheAztecSkyLoading;