import React from 'react';
import {
	Text as TheskyazteresText,
	Dimensions as Undimser,
	View as UntheViewfires,
	Image as Skiresimage,
	ImageBackground as FiunderesImgBg,
	TouchableOpacity as AzTouchable,
} from 'react-native';
import { ScrollView as AzScroll } from 'react-native-gesture-handler';

export default function TheRitualOfWords({ setFirztecScen }: { setFirztecScen: (value: string) => void }) {
	const { width: aztskywid, height: azundehei } = Undimser.get('window');

	// local assets (adjust paths if needed)
	const rockButtImg = require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/rockbuttimg.png');
	const gems = [
		{ id: 'red', src: require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/gem_red.png') },
		{ id: 'green', src: require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/gem_green.png') },
	];

	return (
		<UntheViewfires style={{ flex: 1, position: 'relative', alignItems: 'center' }}>
			{/* Top row: back button (left), title image centered, placeholder (right) to balance */}
			<UntheViewfires
				style={{
					alignItems: 'center',
					width: aztskywid,
					justifyContent: 'space-between',
					marginTop: azundehei * 0.04,
					flexDirection: 'row',
					paddingHorizontal: aztskywid * 0.04,
				}}
			>
				<AzTouchable
					onPress={() => setFirztecScen('Local Screen Aztec')}
					activeOpacity={0.8}
					style={{
						height: azundehei * 0.06,
						justifyContent: 'center',
						width: aztskywid * 0.12,
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
							justifyContent: 'center',
							height: azundehei * 0.085,
							alignItems: 'center',
							width: aztskywid * 0.6,
						}}
						resizeMode="stretch"
					>
						<TheskyazteresText
							style={{
								color: '#ffd96a',
								fontWeight: '700',
								fontSize: aztskywid * 0.05,
								textAlign: 'center',
							}}
						>
							The Ritual of Words
						</TheskyazteresText>
					</FiunderesImgBg>
				</UntheViewfires>

				{/* right placeholder to keep title visually centered */}
				<UntheViewfires style={{ width: aztskywid * 0.12, height: azundehei * 0.06 }} />
			</UntheViewfires>

			{/* Main content card */}
			<UntheViewfires
				style={{
					overflow: 'hidden',
					/* set fixed height so the ScrollView scrolls inside the card */
					height: azundehei * 0.7,
					borderRadius: aztskywid * 0.05,
					marginTop: azundehei * 0.035,
					backgroundColor: '#042022',
					width: aztskywid * 0.9,
					padding: 0,
				}}
			>
				{/* ScrollView fills the card (no handler) */}
				<AzScroll
					style={{ flex: 1 }}
					contentContainerStyle={{
						paddingHorizontal: aztskywid * 0.06,
						paddingTop: azundehei * 0.03,
						paddingBottom: azundehei * 0.03,
					}}
				>
					<TheskyazteresText
						style={{
							marginBottom: azundehei * 0.02,
							color: '#FFA100',
							// lineHeight: azundehei * 0.032,
							fontWeight: '600',
							fontSize: aztskywid * 0.038,
						}}
					>
						Beneath the vast Aztec sky, every trial is a question etched in sacred stone. You must speak its truth through letters of fire, forming one or two words within the glowing grid. With each new trial, another riddle awakens, calling for sharper thought and steadier focus. Every correct answer feeds the eternal blaze and strengthens the temple's light.
					</TheskyazteresText>

					<TheskyazteresText
						style={{
							fontSize: aztskywid * 0.038,
							fontWeight: '600',
							// lineHeight: azundehei * 0.032,
							color: '#FFA100',
						}}
					>
						Within the chamber of riddles lie two sacred crystals—each a gift from the gods of knowledge. The red crystal carries the spark of revelation, glowing gently as it unveils a single letter meant to guide your hand. The green crystal holds the light of full understanding, revealing an entire word to those who seek its power with humility.
					</TheskyazteresText>

					{/* Gems row rendered with .map */}
					<UntheViewfires
						style={{
							marginVertical: azundehei * 0.01,
							justifyContent: 'center',
							flexDirection: 'row',
						}}
					>
						{gems.map((g) => (
							<UntheViewfires
								key={g.id}
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									marginHorizontal: aztskywid * 0.03,
								}}
							>
								<Skiresimage
									source={g.src}
									style={{
										width: aztskywid * 0.16,
										height: aztskywid * 0.16,
										resizeMode: 'contain',
									}}
								/>
							</UntheViewfires>
						))}
					</UntheViewfires>

					<TheskyazteresText
						style={{
							// lineHeight: azundehei * 0.032,
							fontWeight: '600',
							fontSize: aztskywid * 0.038,
							color: '#FFA100',
							marginTop: azundehei * 0.01,
						}}
					>
						Use these divine relics with care, for every spark carries a price measured in Flame Points. The gods favor those who think before they burn. If your fire falters, breathe again, and the path will reopen before you. Each answer is a step toward memory, wisdom, and the dawn that never fades beneath the Aztec sky.
					</TheskyazteresText>
				</AzScroll>
			</UntheViewfires>
		</UntheViewfires>
	);
}