import React from 'react';
import { Dimensions as TheSkydims, TouchableOpacity as UndtecTopablacity, ImageBackground as ButtnMaterial, GestureResponderEvent as GestureRespEvnt, Text as Label, } from 'react-native';

const { width } = TheSkydims.get('window');

interface UnderFiresAztecButtnProps {
    moreStls?: object;
    underSizeOfFont?: number;
    propaztButtLbl: string;
    fireswidth?: number;
    aztecSkyheight?: number;
    onPress: (event: GestureRespEvnt) => void;
    setFirztecScen?: (value: string) => void;
}

const UnderFiresAztecButtn: React.FC<UnderFiresAztecButtnProps> = ({
    moreStls,
    propaztButtLbl,
    underSizeOfFont = width * 0.053,
    onPress,
    aztecSkyheight = width * 0.275,
    fireswidth = width * 0.8,
}) => {
    return (
        <UndtecTopablacity onPress={onPress} activeOpacity={0.8} style={[moreStls]}>
            <ButtnMaterial
                resizeMode="stretch"
                style={[{
                    justifyContent: 'center',
                    alignItems: 'center',
                }, { width: fireswidth, height: aztecSkyheight }]}
                source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/rockbuttimg.png')}
            >
                <Label style={[{
                    letterSpacing: 1,
                    color: '#FFA100',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    paddingHorizontal: fireswidth * 0.07
                }, { fontSize: underSizeOfFont ? underSizeOfFont : fireswidth * 0.075, }]} numberOfLines={1} adjustsFontSizeToFit>
                    {propaztButtLbl}
                </Label>
            </ButtnMaterial>
        </UndtecTopablacity>
    );
};

export default UnderFiresAztecButtn;