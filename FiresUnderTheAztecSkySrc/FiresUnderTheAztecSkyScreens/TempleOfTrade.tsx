import React, { useState as usetheskazkyState, useEffect as useAztecEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    TouchableOpacity as AzTouchable,
    View as UntheViewfires,
    Image as Skiresimage,
    ImageBackground as FiunderesImgBg,
    Text as TheskyazteresText,
    Animated as AzAnimated,
    Dimensions as Undimser,
} from 'react-native';
import UnderFiresAztecButtn from '../FiresUnderTheAztecSkyComponents/UnderFiresAztecButtn';
// replace ScrollView import with gesture-handler ScrollView

export default function TempleOfTrade({ setFirztecScen }: { setFirztecScen: (value: string) => void }) {
    const { width: aztskywid, height: azundehei } = Undimser.get('window');

    // local assets (adjust paths if needed)
    const rockButtImg = require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/rockWithLeavesBgs.png');
    // coin amount background used on the right side of rockButtImg
    const gemsAmountBg = require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/gemsAmountBg.png');
    const firBackImg = require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/firback.png');
    const coinIcon = require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/goldCoin.png');
    // arrow icons and rock-with-leaves backgrounds (update filenames if different)
    const arrowLeft = require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/prevarro.png');
    const arrowRight = require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/nextfireaztec.png');
    const rockWithLeavesBgs = [
        require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/groundOfApp.png'),
        require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/secondGround.png'),
        require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/thirdFiregro.png'),
        require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/lastBgdfi.png'),
    ];

    const [coins, setCoins] = usetheskazkyState<number>(0); // start with stored value
    const [selectedBg, setSelectedBg] = usetheskazkyState<number>(0);
    const [previewBg, setPreviewBg] = usetheskazkyState<number>(0); // <-- preview for arrows
    const [purchased, setPurchased] = usetheskazkyState<boolean[]>([true, false, false, false]);

    // animated top alert for insufficient coins
    const alertStartY = -azundehei * 0.22;
    const alertEndY = azundehei * 0.02;
    const [showLowCoins, setShowLowCoins] = usetheskazkyState<boolean>(false);
    const alertAnim = usetheskazkyState<AzAnimated.Value>(() => new AzAnimated.Value(alertStartY))[0];

    // load coins + purchased from AsyncStorage
    useAztecEffect(() => {
        let mounted = true;
        async function loadAll() {
            try {
                const [c, p] = await Promise.all([
                    AsyncStorage.getItem('coins'),
                    AsyncStorage.getItem('purchasedBackgrounds'),
                ]);
                if (!mounted) return;
                setCoins(Number(c) || 0);
                if (p) {
                    const parsed = JSON.parse(p);
                    if (Array.isArray(parsed)) {
                        // ensure first background is always owned
                        parsed[0] = true;
                        setPurchased(parsed);
                    }
                }
            } catch (e) {
                // ignore
            }
        }
        loadAll();
        return () => { mounted = false; };
    }, []);

    const saveState = async (newCoins: number, newPurchased: boolean[]) => {
        try {
            // ensure first background saved as owned
            const copy = [...newPurchased];
            copy[0] = true;
            await AsyncStorage.setItem('coins', String(newCoins));
            await AsyncStorage.setItem('purchasedBackgrounds', JSON.stringify(copy));
        } catch (e) {
            // ignore write errors
        }
    };

    const showLowCoinsAlert = () => {
        setShowLowCoins(true);
        alertAnim.setValue(alertStartY);
        AzAnimated.timing(alertAnim, { toValue: alertEndY, duration: 300, useNativeDriver: true }).start(() => {
            setTimeout(() => {
                AzAnimated.timing(alertAnim, { toValue: alertStartY, duration: 300, useNativeDriver: true }).start(() => setShowLowCoins(false));
            }, 1500);
        });
    };

    const handleUnlock = async () => {
        const price = 40;
        // first background cannot be unlocked (always owned)
        if (previewBg === 0) return;
        // if already owned -> set as selected
        if (purchased[previewBg]) {
            setSelectedBg(previewBg);
            return;
        }
        if (coins >= price) {
            const newCoins = coins - price;
            const copy = [...purchased];
            copy[previewBg] = true;
            setCoins(newCoins);
            setPurchased(copy);
            setSelectedBg(previewBg);
            await saveState(newCoins, copy);
        } else {
            // show animated alert
            showLowCoinsAlert();
        }
    };

    return (
        <UntheViewfires style={{ flex: 1, position: 'relative', alignItems: 'center' }}>
            {/* Top row: left back image + center rockButtImg with left text and right coin panel */}
            <UntheViewfires
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: aztskywid,
                    paddingHorizontal: aztskywid * 0.04,
                    justifyContent: 'flex-start',
                    marginTop: azundehei * 0.04,
                }}
            >
                <AzTouchable
                    activeOpacity={0.8}
                    onPress={() => setFirztecScen('Local Screen Aztec')}
                    style={{
                        justifyContent: 'center',
                        width: aztskywid * 0.12,
                        height: azundehei * 0.06,
                    }}
                >
                    <Skiresimage
                        source={firBackImg}
                        style={{
                            width: aztskywid * 0.12,
                            height: aztskywid * 0.12,
                            resizeMode: 'contain',
                        }}
                    />
                </AzTouchable>

                <FiunderesImgBg
                    source={rockButtImg}
                    style={{
                        height: azundehei * 0.085,
                        // use row inside to place text left and coin panel right
                        marginLeft: aztskywid * 0.03,
                        width: aztskywid * 0.74,
                        alignItems: 'center',
                        paddingHorizontal: aztskywid * 0.03,
                        justifyContent: 'center',
                    }}
                    resizeMode="stretch"
                >
                    <UntheViewfires style={{ width: '92%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <TheskyazteresText
                            style={{
                                flex: 1,
                                color: '#ffd96a',
                                textAlign: 'left',
                                fontSize: aztskywid * 0.044,
                                fontWeight: '700',
                            }}
                            numberOfLines={2}
                            adjustsFontSizeToFit
                        >
                            Temple of {'\n'}Trade
                        </TheskyazteresText>

                        <UntheViewfires style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            {/* left: coin icon inside a small square frame */}
                            <UntheViewfires style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: aztskywid * 0.02,
                            }}>
                                <Skiresimage source={coinIcon} style={{ width: aztskywid * 0.091, height: aztskywid * 0.091, resizeMode: 'contain' }} />
                            </UntheViewfires>

                            {/* right: gemsAmountBg - only the amount text inside */}
                            <FiunderesImgBg
                                source={gemsAmountBg}
                                style={{
                                    paddingHorizontal: aztskywid * 0.02,
                                    width: aztskywid * 0.16,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: aztskywid * 0.1,
                                }}
                                resizeMode="stretch"
                            >
                                <TheskyazteresText style={{
                                    fontWeight: '700',
                                    color: '#FFA100',
                                    textAlign: 'center',
                                    fontSize: aztskywid * 0.04,
                                }} numberOfLines={1} adjustsFontSizeToFit>
                                    {coins}
                                </TheskyazteresText>
                            </FiunderesImgBg>
                        </UntheViewfires>
                    </UntheViewfires>
                </FiunderesImgBg>
            </UntheViewfires>

            {/* Main selectable background area: show background INSIDE the stone frame */}
            <UntheViewfires style={{ width: aztskywid, alignItems: 'center', marginTop: azundehei * 0.04 }}>
                <FiunderesImgBg
                    source={rockButtImg} // stone frame
                    style={{
                        alignItems: 'center',
                        height: azundehei * 0.62,
                        justifyContent: 'center',
                        width: aztskywid * 0.9,
                    }}
                    resizeMode="stretch"
                >
                    {/* inner background displayed inside the stone frame */}
                    <FiunderesImgBg
                        source={rockWithLeavesBgs[previewBg]}
                        style={{
                            borderRadius: aztskywid * 0.04,
                            height: azundehei * 0.4,
                            overflow: 'hidden',
                            width: aztskywid * 0.61,
                        }}
                        resizeMode="cover"
                    />

                    {/* price overlay shown when preview background is locked */}
                    {!purchased[previewBg] && (
                        <UntheViewfires style={{ position: 'absolute', bottom: azundehei * 0.04, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            {/* left: coin icon inside a small square frame */}
                            <UntheViewfires style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: aztskywid * 0.02,
                            }}>
                                <Skiresimage source={coinIcon} style={{ width: aztskywid * 0.12, height: aztskywid * 0.12, resizeMode: 'contain' }} />
                            </UntheViewfires>

                            {/* right: gemsAmountBg - only the amount text inside */}
                            <FiunderesImgBg
                                source={gemsAmountBg}
                                style={{
                                    paddingHorizontal: aztskywid * 0.02,
                                    height: aztskywid * 0.12,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: aztskywid * 0.32,
                                }}
                                resizeMode="stretch"
                            >
                                <TheskyazteresText style={{
                                    fontWeight: '700',
                                    fontSize: aztskywid * 0.07,
                                    textAlign: 'center',
                                    color: '#FFA100',
                                }} numberOfLines={1} adjustsFontSizeToFit>
                                    40
                                </TheskyazteresText>
                            </FiunderesImgBg>
                        </UntheViewfires>
                    )}
                </FiunderesImgBg>
            </UntheViewfires>

            {/* Bottom arrow controls */}
            <UntheViewfires style={{ position: 'absolute', bottom: azundehei * 0.04, width: aztskywid, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: aztskywid * 0.03 }}>
                <AzTouchable
                    onPress={() => {
                        // just change preview (wrap)
                        setPreviewBg(prev => (prev - 1 + rockWithLeavesBgs.length) % rockWithLeavesBgs.length);
                    }}
                    activeOpacity={0.8}
                    style={{ padding: aztskywid * 0.02, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Skiresimage source={arrowLeft} style={{ width: aztskywid * 0.14, height: aztskywid * 0.14, resizeMode: 'contain' }} />
                </AzTouchable>

                <UntheViewfires style={{}}>
                    {/* show Unlock only for non-zero previews that are NOT already purchased */}
                    {previewBg !== 0 && !purchased[previewBg] && (
                        <UnderFiresAztecButtn
                            onPress={handleUnlock}
                            fireswidth={aztskywid * 0.5}
                            aztecSkyheight={azundehei * 0.084}
                            underSizeOfFont={aztskywid * 0.055}
                            propaztButtLbl={'Unlock'}
                        />
                    )}
                </UntheViewfires>

                <AzTouchable
                    onPress={() => {
                        // just change preview (wrap)
                        setPreviewBg(prev => (prev + 1) % rockWithLeavesBgs.length);
                    }}
                    activeOpacity={0.8}
                    style={{ padding: aztskywid * 0.02, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Skiresimage source={arrowRight} style={{ width: aztskywid * 0.14, height: aztskywid * 0.14, resizeMode: 'contain' }} />
                </AzTouchable>
            </UntheViewfires>

            {/* Animated top alert for insufficient coins */}
            {showLowCoins && (
                <AzAnimated.View
                    pointerEvents="none"
                    style={{
                        alignSelf: 'center',
                        transform: [{ translateY: alertAnim }],
                        top: 0,
                        width: aztskywid * 0.9,
                        position: 'absolute',
                        zIndex: 999,
                    }}
                >
                    <UntheViewfires style={{
                        justifyContent: 'center',
                        borderRadius: aztskywid * 0.05,
                        alignItems: 'center',
                        paddingVertical: azundehei * 0.023,
                        backgroundColor: '#6a0000',
                    }}>
                        <TheskyazteresText style={{ color: '#FFA100', fontWeight: '600', textAlign: 'center', fontSize: aztskywid * 0.04 }}>
                            Not enough relics to unlock this blessing
                        </TheskyazteresText>
                    </UntheViewfires>
                </AzAnimated.View>
            )}
        </UntheViewfires>
    );
}