import PageWhichHelpsUserToNav from './PageWhichHelpsUserToNav';
import React, { useEffect as useUndecEfft, useState as useAuroraState, useRef as useAnchorRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';
type TitlesOfAssialPgs =
    | 'Local Screen Aztec'
    | 'Enter the Trials'
    | 'Temple of Trade'
    | 'Chants & Settings'
    | 'The Ritual of Words';
import {
    Dimensions as SkyDimensions,
    Image as HearthImage,
    View as HollowRootView,
    Keyboard,
    Easing as PulseEasing,
    SafeAreaView as NativeSafeOrb,
    TouchableWithoutFeedback as QuietTap,
    Animated as EmberAnimated,
} from 'react-native';
import TempleOfTrade from './TempleOfTrade';
import TheRitualOfWords from './TheRitualOfWords';
import EnterTheTrials from './EnterTheTrials';
const { width: arcWidth, height: arcHeight } = SkyDimensions.get('window');

import ChantsAndSetaztes from './ChantsAndSetaztes';

const AztecUnderRealmContainer: React.FC = () => {
    const [fiderNowScen, setFiderNowScen] = useAuroraState<TitlesOfAssialPgs>('Local Screen Aztec');
    const [revealDetails, setRevealDetails] = useAuroraState<boolean>(false);

    // local ticking time state (keeps original functionality)
    const [currentTick, setCurrentTick] = useAuroraState<Date>(new Date());
    useUndecEfft(() => {
        const tickInterval = setInterval(() => setCurrentTick(new Date()), 1000);
        return () => clearInterval(tickInterval);
    }, []);

    // animated value for header/buttons crossfade
    const controlAnim = useAnchorRef(new EmberAnimated.Value(0)).current;
    useUndecEfft(() => {
        EmberAnimated.timing(controlAnim, {
            toValue: revealDetails ? 1 : 0,
            duration: 300,
            easing: PulseEasing.out(PulseEasing.cubic),
            useNativeDriver: true,
        }).start();
    }, [revealDetails]);

    // --- added: music state and effects for dwarfs background music ---
    const [istesireMusOn, setTesireMusOn] = useAuroraState<boolean>(false);
    const [undekyMusiPlayer, setUndekyMusiPlayer] = useAuroraState<any | null>(null);

    // load persisted setting on mount (default true when not set)
    useUndecEfft(() => {
        AsyncStorage.getItem('musicOn').then((val) => {
            if (val === null) {
                AsyncStorage.setItem('musicOn', 'true');
                setTesireMusOn(true);
            } else {
                setTesireMusOn(val === 'true');
            }
        });
    }, []);

    // start/stop looping music when istesireMusOn changes; clean up player on unmount
    useUndecEfft(() => {
        if (istesireMusOn) {
            const musicInstance = new Sound(
                'backFiresAztecmelod.wav',
                Sound.MAIN_BUNDLE,
                (error: any) => {
                    if (!error) {
                        musicInstance.setNumberOfLoops(-1);
                        musicInstance.play();
                    }
                }
            );
            setUndekyMusiPlayer(musicInstance);
        } else {
            if (undekyMusiPlayer) {
                undekyMusiPlayer.stop(() => {
                    undekyMusiPlayer.release();
                });
                setUndekyMusiPlayer(null);
            }
        }

        return () => {
            if (undekyMusiPlayer) {
                undekyMusiPlayer.stop(() => {
                    undekyMusiPlayer.release();
                });
                setUndekyMusiPlayer(null);
            }
        };
    }, [istesireMusOn]);

    const rendaztecSkypg = () => {
        switch (fiderNowScen) {
            case 'Local Screen Aztec':
                return <PageWhichHelpsUserToNav setFirztecScen={setFiderNowScen} />;
            case 'The Ritual of Words':
                return <TheRitualOfWords setFirztecScen={setFiderNowScen} />;
            case 'Chants & Settings':
                return <ChantsAndSetaztes setFirztecScen={setFiderNowScen} istesireMusOn={istesireMusOn} setTesireMusOn={setTesireMusOn} />;
            case 'Temple of Trade':
                return <TempleOfTrade setFirztecScen={setFiderNowScen} />;
            case 'Enter the Trials':
                return <EnterTheTrials setFirztecScen={setFiderNowScen} />;
            default:
                return null;
        }
    };

    return (
        <QuietTap onPress={() => Keyboard.dismiss()}>
            <HollowRootView style={{
                height: arcHeight,
                width: arcWidth,
                flex: 1,
            }}>
                <HearthImage
                    source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/groundOfApp.png')}
                    style={{
                        height: arcHeight * 1.0111,
                        width: arcWidth,
                        position: 'absolute',
                        resizeMode: 'cover',
                    }}
                />
                <NativeSafeOrb />
                {rendaztecSkypg()}
            </HollowRootView>
        </QuietTap>
    );
};

export default AztecUnderRealmContainer;