import AsyncStorage from '@react-native-async-storage/async-storage';
import UnderFiresAztecButtn from '../FiresUnderTheAztecSkyComponents/UnderFiresAztecButtn';
// replace ScrollView import with gesture-handler ScrollView
import { ScrollView as AzScroll } from 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
    TouchableOpacity as AzTouchable,
    Dimensions as Undimser,
    Image as Skiresimage,
    ImageBackground as FiunderesImgBg,
    Text as TheskyazteresText,
    Share,
    View as UntheViewfires,
    Linking,
} from 'react-native';


export default function ChantsAndSetaztes({ setFirztecScen, istesireMusOn, setTesireMusOn }: { setFirztecScen: (value: string) => void, istesireMusOn: boolean, setTesireMusOn: (value: boolean) => void }) {
    const { width: aztskywid, height: azundehei } = Undimser.get('window');

    // switch images (adjust filenames if different)
    const switchOnImg = require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/switchOn.png');
    const switchOffImg = require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/switchOff.png');

    // за замовчуванням обидва true; фактичний стан завантажується з AsyncStorage в useEffect
    const [notifOn, setNotifOn] = useState(true);

    useEffect(() => {
        let mounted = true;
        const loadSettings = async () => {
            try {
                const m = await AsyncStorage.getItem('musicOn');
                const n = await AsyncStorage.getItem('notifOn');
                if (!mounted) return;
                if (m !== null) setTesireMusOn(JSON.parse(m));
                else setTesireMusOn(true);
                if (n !== null) setNotifOn(JSON.parse(n));
                else setNotifOn(true);
            } catch (e) {
                // ignore
            }
        };
        loadSettings();
        return () => { mounted = false; };
    }, []);

    const toggleMusic = async () => {
        const newVal = !istesireMusOn;
        setTesireMusOn(newVal);
        try { await AsyncStorage.setItem('musicOn', JSON.stringify(newVal)); } catch (e) {}
    };
    const toggleNotif = async () => {
        const newVal = !notifOn;
        setNotifOn(newVal);
        try { await AsyncStorage.setItem('notifOn', JSON.stringify(newVal)); } catch (e) {}
    };

    // local assets (adjust paths if needed)
    const rockButtImg = require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/rockbuttimg.png');


    return (
        <UntheViewfires style={{ flex: 1, position: 'relative', alignItems: 'center' }}>
            {/* Top row: back button (left), title image centered, placeholder (right) to balance */}
            <UntheViewfires
                style={{
                    alignItems: 'center',
                    paddingHorizontal: aztskywid * 0.04,
                    marginTop: azundehei * 0.04,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    width: aztskywid,
                }}
            >
                <AzTouchable
                    onPress={() => setFirztecScen('Local Screen Aztec')}
                    activeOpacity={0.8}
                    style={{
                        justifyContent: 'center',
                        width: aztskywid * 0.12,
                        height: azundehei * 0.06,
                    }}
                >
                    <Skiresimage
                        source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/firback.png')}
                        style={{
                            width: aztskywid * 0.16,
                            height: aztskywid * 0.16,
                            resizeMode: 'contain',
                        }}
                    />
                </AzTouchable>

                <UntheViewfires style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <FiunderesImgBg
                        source={rockButtImg}
                        style={{
                            alignItems: 'center',
                            height: azundehei * 0.085,
                            justifyContent: 'center',
                            width: aztskywid * 0.6,
                        }}
                        resizeMode="stretch"
                    >
                        <TheskyazteresText
                            style={{
                                textAlign: 'center',
                                fontWeight: '700',
                                color: '#ffd96a',
                                fontSize: aztskywid * 0.05,
                            }}
                        >
                            Chants & Settings
                        </TheskyazteresText>
                    </FiunderesImgBg>
                </UntheViewfires>

                {/* right placeholder to keep title visually centered */}
                <UntheViewfires style={{ width: aztskywid * 0.12, height: azundehei * 0.06 }} />
            </UntheViewfires>

            {/* scrollable content for options */}
            <AzScroll
                contentContainerStyle={{
                    alignItems: 'center',
                    paddingTop: azundehei * 0.03,
                    paddingBottom: azundehei * 0.06,
                }}
                style={{ width: aztskywid }}
            >
                {/* Background Music row (rock background with left label and right switch image) */}
                <FiunderesImgBg
                    source={rockButtImg}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: aztskywid * 0.88,
                        marginBottom: azundehei * 0.03,
                        justifyContent: 'center',
                        paddingHorizontal: aztskywid * 0.079,
                        height: azundehei * 0.084,
                    }}
                    resizeMode="stretch"
                >
                    <UntheViewfires style={{ flex: 1, justifyContent: 'center' }}>
                        <TheskyazteresText
                            style={{
                                color: '#FFA100',
                                fontWeight: '700',
                                fontSize: aztskywid * 0.05,
                            }}
                        >
                            Background Music
                        </TheskyazteresText>
                    </UntheViewfires>

                    <AzTouchable
                        activeOpacity={0.8}
                        onPress={toggleMusic}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: aztskywid * 0.14,
                            height: azundehei * 0.07,
                        }}
                    >
                        <Skiresimage
                            source={istesireMusOn ? switchOnImg : switchOffImg}
                            style={{
                                width: aztskywid * 0.12,
                                height: azundehei * 0.06,
                                resizeMode: 'contain',
                            }}
                        />
                    </AzTouchable>
                </FiunderesImgBg>

                {/* Notifications row */}
                <FiunderesImgBg
                    source={rockButtImg}
                    style={{
                        flexDirection: 'row',
                        height: azundehei * 0.084,
                        alignItems: 'center',
                        marginBottom: azundehei * 0.03,
                        justifyContent: 'center',
                        paddingHorizontal: aztskywid * 0.079,
                        width: aztskywid * 0.88,
                    }}
                    resizeMode="stretch"
                >
                    <UntheViewfires style={{ flex: 1, justifyContent: 'center' }}>
                        <TheskyazteresText
                            style={{
                                color: '#FFA100',
                                fontWeight: '700',
                                fontSize: aztskywid * 0.05,
                            }}
                        >
                            Notifications
                        </TheskyazteresText>
                    </UntheViewfires>

                    <AzTouchable
                        activeOpacity={0.8}
                        onPress={toggleNotif}
                        style={{
                            alignItems: 'center',
                            height: azundehei * 0.07,
                            justifyContent: 'center',
                            width: aztskywid * 0.14,
                        }}
                    >
                        <Skiresimage
                            source={notifOn ? switchOnImg : switchOffImg}
                            style={{
                                width: aztskywid * 0.12,
                                height: azundehei * 0.06,
                                resizeMode: 'contain',
                            }}
                        />
                    </AzTouchable>
                </FiunderesImgBg>

                {/* Action buttons implemented using UnderFiresAztecButtn */}
                <UntheViewfires style={{ marginTop: azundehei * 0.01, alignItems: 'center' }}>
                    <UnderFiresAztecButtn
                        aztecSkyheight={azundehei * 0.084}
                        fireswidth={aztskywid * 0.88}
                        underSizeOfFont={aztskywid * 0.05}
                        propaztButtLbl={'Share the App'}
                        onPress={() => {
                            Share.share({
                                message: `You don't know how amazing Fires Under The Aztec Sky is? Download it now and embark on an unforgettable journey!`
                            })
                        }}
                    />
                </UntheViewfires>

                <UntheViewfires style={{ marginTop: azundehei * 0.02, alignItems: 'center' }}>
                    <UnderFiresAztecButtn
                        onPress={() => {
                            Linking.openURL('https://www.termsfeed.com/live/9d6821cb-87cd-4561-a600-186414ec2f39'); // replace with actual URL
                        }}
                        aztecSkyheight={azundehei * 0.084}
                        fireswidth={aztskywid * 0.88}
                        underSizeOfFont={aztskywid * 0.05}
                        propaztButtLbl={'Terms and Conditions'}
                    />
                </UntheViewfires>
            </AzScroll>
        </UntheViewfires>
    );
}