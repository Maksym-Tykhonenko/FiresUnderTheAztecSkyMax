import {
    View as UnderView,
    Image as UnderImage,
    TouchableOpacity as UnderTouchable,
    useWindowDimensions as useUnderWnd,
} from 'react-native';
import TrailFramesSet from '../UnderDataAzteksfiund/learniatraiGret'
import React, { useState as useUnderState } from 'react';
import UnderFiresAztecButtn from '../FiresUnderTheAztecSkyComponents/UnderFiresAztecButtn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation as useUnderNav } from '@react-navigation/native';

const UNDERVIEW_FIRST_RUN_KEY = 'underview-firstrun-aztec-77x';

const FiresUnderTheAztecSkyOnboarding: React.FC = () => {
    const { width: vistaW, height: vistaH } = useUnderWnd();
    const underNavigator = useUnderNav();
    const [slideIndexUnder, setSlideIndexUnder] = useUnderState(0);

    const advanceTrailStep = async () => {
        const last = TrailFramesSet.length - 1;
        if (slideIndexUnder < last) {
            setSlideIndexUnder(prev => prev + 1);
        } else {
            try {
                // ensure same first-launch flag is set as on loading
                await AsyncStorage.setItem(UNDERVIEW_FIRST_RUN_KEY, 'true');
            } catch (err) {
                if (__DEV__) console.warn('Onboarding:advanceTrailStep', err);
            }
            underNavigator.replace?.('EmberDailyGiftPage');
        }
    };

    return (
        <UnderView style={{ height: vistaH, alignItems: 'center', width: vistaW, flex: 1 }}>
            <UnderImage
                source={TrailFramesSet[slideIndexUnder]}
                resizeMode="cover"
                style={{ width: vistaW, height: vistaH * 1.0201035 }}
            />

            <UnderTouchable
                style={{
                    bottom: vistaH * 0.021,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    position: 'absolute',
                    alignItems: 'center',
                }}
                activeOpacity={0.8}
                onPress={advanceTrailStep}
            >
                <UnderView style={{
                    alignSelf: 'center',
                }}>
                    <UnderFiresAztecButtn
                        fireswidth={vistaW * 0.59}
                        onPress={() => advanceTrailStep()}
                        underSizeOfFont={vistaW * 0.08}
                        aztecSkyheight={vistaH * 0.08}
                        propaztButtLbl={slideIndexUnder < TrailFramesSet.length - 1 ? 'Next' : 'Begin the Journey'}
                    />
                </UnderView>
            </UnderTouchable>
        </UnderView>
    );
};

export default FiresUnderTheAztecSkyOnboarding;