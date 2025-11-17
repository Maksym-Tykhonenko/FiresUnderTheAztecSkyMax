import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState as usetheskazkyState, useEffect as usefireffec, } from 'react';
import {
    Dimensions as Undimser,
    View as UntheViewfires,
    Image as Skiresimage,
    ImageBackground as FiunderesImgBg,
    Text as TheskyazteresText,
} from 'react-native';
import UnderFiresAztecButtn from '../FiresUnderTheAztecSkyComponents/UnderFiresAztecButtn';

export default function PageWhichHelpsUserToNav({ setFirztecScen }: { setFirztecScen: (value: string) => void }) {
    const { width: underWidth, height: underHeight } = Undimser.get('window');

    // counts for three currencies (local state names changed)
    const [emberCoins, setEmberCoins] = usetheskazkyState<number>(0);
    const [scarletGems, setScarletGems] = usetheskazkyState<number>(0);
    const [viridianGems, setViridianGems] = usetheskazkyState<number>(0);

    usefireffec(() => {
        let isMounted = true;
        async function restoreWallet() {
            try {
                const [c, r, g] = await Promise.all([
                    AsyncStorage.getItem('coins'),
                    AsyncStorage.getItem('redGems'),
                    AsyncStorage.getItem('greenGems')
                ]);
                if (!isMounted) return;
                setEmberCoins(Number(c) || 0);
                setScarletGems(Number(r) || 0);
                setViridianGems(Number(g) || 0);
            } catch (e) {
                // ignore errors silently
            }
        }
        restoreWallet();
        return () => { isMounted = false; };
    }, []);

    // bottom buttons config (local name changed)
    const bottomNavItems = [
        { label: 'Enter the Trials', target: 'Enter the Trials' },
        { label: 'Temple of Trade', target: 'Temple of Trade' },
        { label: 'Chants & Settings', target: 'Chants & Settings' },
        { label: 'The Ritual of Words', target: 'The Ritual of Words' },
    ];

    // currencies array for mapping (counts shown on gemsAmountBg) — keep storage keys intact
    const walletItems = [
        { key: 'coins', img: require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/goldCoin.png'), value: emberCoins },
        { key: 'redGems', img: require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/gem_red.png'), value: scarletGems },
        { key: 'greenGems', img: require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/gem_green.png'), value: viridianGems },
    ];

    return (
        <UntheViewfires style={{ flex: 1, position: 'relative' }}>
            {/* top currencies row (mapped) */}
            <UntheViewfires style={{
                position: 'absolute',
                top: underHeight * 0.03,
                left: 0,
                right: 0,
                width: underWidth,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                paddingHorizontal: underWidth * 0.03,
            }}>
                {walletItems.map(cur => (
                    <UntheViewfires key={cur.key} style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        {/* icon in circle */}
                        <UntheViewfires style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Skiresimage
                                source={cur.img}
                                style={{
                                    width: underWidth * 0.1,
                                    height: underWidth * 0.1,
                                    resizeMode: 'contain',
                                }}
                            />
                        </UntheViewfires>

                        {/* background panel image with amount (gemsAmountBg) */}
                        <FiunderesImgBg
                            source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/gemsAmountBg.png')}
                            style={{
                                width: underWidth * 0.16,
                                height: underWidth * 0.1,
                                marginLeft: underWidth * 0.02,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            resizeMode='stretch'
                        >
                            <TheskyazteresText style={{
                                color: '#ffd24d',
                                fontSize: underWidth * 0.05,
                                fontWeight: '700',
                                textAlign: 'center',
                                maxWidth: underWidth * 0.14,
                            }} numberOfLines={1} adjustsFontSizeToFit>{cur.value}</TheskyazteresText>
                        </FiunderesImgBg>
                    </UntheViewfires>
                ))}
            </UntheViewfires>

            {/* center title image */}
            <Skiresimage
                source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/firesUnderText.png')}
                style={{
                    width: underWidth * 0.5,
                    height: underWidth * 0.5,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                    marginTop: underHeight * 0.18,
                }}
            />

            {/* bottom buttons (mapped) */}
            <UntheViewfires style={{
                position: 'absolute',
                bottom: underHeight * 0.06,
                left: 0,
                right: 0,
                alignItems: 'center',
            }}>
                {bottomNavItems.map((b, i) => (
                    <UntheViewfires key={b.label} style={{ marginVertical: underHeight * 0.01 }}>
                        <UnderFiresAztecButtn
                            propaztButtLbl={b.label}
                            fireswidth={underWidth * 0.64}
                            aztecSkyheight={underHeight * 0.084}
                            underSizeOfFont={underWidth * 0.055}
                            onPress={() => setFirztecScen(b.target)}
                        />
                    </UntheViewfires>
                ))}
            </UntheViewfires>
        </UntheViewfires>
    );
}