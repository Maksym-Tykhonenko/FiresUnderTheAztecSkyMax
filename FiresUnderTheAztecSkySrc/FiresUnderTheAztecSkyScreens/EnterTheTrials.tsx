// replace ScrollView import with gesture-handler ScrollView
import { ScrollView as AzScroll } from 'react-native-gesture-handler';
import aztundLevels from '../UnderDataAzteksfiund/aztundLevels';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef,  } from 'react';
import {
    TextInput as AzTextInput,
    Dimensions as Undimser,
    ImageBackground as FiunderesImgBg,
    View as UntheViewfires,
    Text as TheskyazteresText,
    TouchableOpacity as AzTouchable,
    Image as Skiresimage,
} from 'react-native';

export default function EnterTheTrials({ setFirztecScen }: { setFirztecScen: (value: string) => void }) {
    const { width: aztskywid, height: azundehei } = Undimser.get('window');

    // local assets (adjust paths if needed)
    const rockButtImg = require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/rockbuttimg.png');
    const pauseImg = require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/azfipause.png');
    const lockedImg = require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/lockedLevel.png');

    const [coins, setCoins] = useState<number>(0);
    const [redGems, setRedGems] = useState<number>(0);
    const [greenGems, setGreenGems] = useState<number>(0);

    const currencies = [
        { key: 'coins', img: require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/goldCoin.png'), value: coins },
        { key: 'redGems', img: require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/gem_red.png'), value: redGems },
        { key: 'greenGems', img: require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/gem_green.png'), value: greenGems },
    ];

    // screen: 'levels' | 'play' | 'result'
    const [screen, setScreen] = useState<'levels' | 'play' | 'result'>('levels');

    // level/puzzle state
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
    const [puzzleIndex, setPuzzleIndex] = useState<number>(0);

    // helper: normalize single character (remove diacritics, to uppercase)
    function normalizeChar(ch: string) {
        if (!ch && ch !== '') return '';
        // decompose accents, remove combining marks, uppercase
        try {
            return ch
                .normalize('NFD')
                .replace(/\p{M}/gu, '') // remove diacritic marks
                .toUpperCase();
        } catch (e) {
            // fallback if normalization not supported
            return ch.toUpperCase();
        }
    }

    // cells: array of words, each word = array of { char, expected, locked }
    // add expectedNorm for reliable comparisons
    type Cell = { char: string; expected: string; expectedNorm?: string; locked: boolean; isSpace?: boolean };

    // cells: array of words, each word = array of { char, expected, locked }
    const [cells, setCells] = useState<Cell[][]>([]);
    const [currentPos, setCurrentPos] = useState<{ w: number; i: number } | null>(null);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [unlockedMaxLevel, setUnlockedMaxLevel] = useState<number>(0);

    const inputRef = useRef<AzTextInput | null>(null);
    const [hiddenText, setHiddenText] = useState<string>('');

    // load gems
    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const [c, r, g] = await Promise.all([
                    AsyncStorage.getItem('coins'),
                    AsyncStorage.getItem('redGems'),
                    AsyncStorage.getItem('greenGems')
                ]);
                if (!mounted) return;
                setCoins(Number(c) || 0);
                setRedGems(Number(r) || 0);
                setGreenGems(Number(g) || 0);
            } catch (e) { /* ignore */ }
        }
        load();
        return () => { mounted = false; };
    }, []);

    // load unlockedMaxLevel from storage
    useEffect(() => {
        let mounted = true;
        async function loadUnlocked() {
            try {
                const v = await AsyncStorage.getItem('unlockedMaxLevel');
                if (!mounted) return;
                setUnlockedMaxLevel(v != null ? Number(v) : 0);
            } catch (e) { /* ignore */ }
        }
        loadUnlocked();
        return () => { mounted = false; };
    }, []);

    // award rewards for completing a level and persist totals
    async function awardRewards(levelIdx: number | null) {
        if (levelIdx == null) return;
        // base coins always
        const coinsEarned = 20;
        // simple tier logic for gems (example)
        let redEarned = 0;
        let greenEarned = 0;
        if (levelIdx >= 0 && levelIdx <= 2) { // levels 1-3 (idx 0-2)
            redEarned = 1;
            greenEarned = 0;
        } else if (levelIdx >= 3 && levelIdx <= 5) { // 4-6
            redEarned = 2;
            greenEarned = 1;
        } else { // 7+
            redEarned = 3;
            greenEarned = 2;
        }

        const newCoins = (coins || 0) + coinsEarned;
        const newRed = (redGems || 0) + redEarned;
        const newGreen = (greenGems || 0) + greenEarned;

        // update state
        setCoins(newCoins);
        setRedGems(newRed);
        setGreenGems(newGreen);

        // persist
        try {
            await AsyncStorage.setItem('coins', String(newCoins));
            await AsyncStorage.setItem('redGems', String(newRed));
            await AsyncStorage.setItem('greenGems', String(newGreen));
        } catch (e) { /* ignore */ }
    }

    // helper: initialize cells from answer string (split into words)
    function initCellsFromAnswer(answer: string) {
        const trimmed = (answer || '').toString().trim();
        if (!trimmed) {
            setCells([]);
            setCurrentPos(null);
            return;
        }
        const words = trimmed.split(' ').filter(w => w.length > 0);
        const wcells: Cell[][] = words.map(w =>
            w.split('').map(ch => {
                const expected = ch.toUpperCase();
                return {
                    char: '',
                    expected,
                    expectedNorm: normalizeChar(expected),
                    locked: false
                };
            })
        );
        setCells(wcells);
        // set first editable pos (first non-locked)
        let found: { w: number; i: number } | null = null;
        for (let wi = 0; wi < wcells.length; wi++) {
            for (let ci = 0; ci < wcells[wi].length; ci++) {
                if (!wcells[wi][ci].locked) {
                    found = { w: wi, i: ci };
                    break;
                }
            }
            if (found) break;
        }
        setCurrentPos(found);
    }

    // helper: normalize access to puzzles array for different data shapes
    function getPuzzlesForLevel(level: any) {
        if (!level) return [];
        // include 'prompts' (used in your aztundLevels.js) first
        return level.prompts || level.puzzles || level.questions || level.items || [];
    }

    // helper: try several possible field names and return first non-empty
    function getPuzzleField(puzzle: any, keys: string[]) {
        if (!puzzle) return '';
        for (const k of keys) {
            const v = (puzzle as any)[k];
            if (v !== undefined && v !== null && String(v).trim() !== '') return String(v);
        }
        return '';
    }

    // get current answer raw string from data (robust to different field names)
    function getCurrentAnswerRaw() {
        if (selectedLevel == null) return '';
        const level = (aztundLevels && aztundLevels[selectedLevel]) ? aztundLevels[selectedLevel] : null;
        const puzzles = getPuzzlesForLevel(level);
        const p = puzzles[puzzleIndex] || {};
        return getPuzzleField(p, ['answer', 'solution', 'word', 'text', 'value', 'answerText']) || '';
    }

    // start playing a level -> initialize first puzzle (robust to different data shapes)
    function startLevel(levelIdx: number) {
        setSelectedLevel(levelIdx);
        setPuzzleIndex(0);
        const level = (aztundLevels && aztundLevels[levelIdx]) ? aztundLevels[levelIdx] : null;
        const puzzles = getPuzzlesForLevel(level);
        const firstPuzzle = puzzles[0] || {};
        // try common property names for the answer
        const answer = getPuzzleField(firstPuzzle, ['answer', 'solution', 'word', 'text', 'value', 'answerText']);
        initCellsFromAnswer((answer || '').toString().trim());
        setScreen('play');
        // clear hiddenText and focus input
        setHiddenText('');
        setTimeout(() => inputRef.current?.focus(), 300);
    }

    // find next editable position starting from given pos (inclusive/exclusive)
    function findNextEditable(from: { w: number; i: number } | null, inclusive = true): { w: number; i: number } | null {
        if (!from) return null;
        let w = from.w;
        let i = inclusive ? from.i : from.i + 1;
        for (; w < cells.length; w++) {
            for (; i < (cells[w] ? cells[w].length : 0); i++) {
                if (!cells[w][i].locked) return { w, i };
            }
            i = 0;
        }
        return null;
    }

    // find previous editable (for backspace)
    function findPrevEditable(from: { w: number; i: number } | null): { w: number; i: number } | null {
        if (!from) return null;
        let w = from.w;
        let i = from.i - 1;
        for (; w >= 0; w--) {
            for (; i >= 0; i--) {
                if (!cells[w][i].locked) return { w, i };
            }
            if (w - 1 >= 0) i = (cells[w - 1] || []).length - 1;
        }
        return null;
    }

    // check completion: all expected letters locked
    function isCurrentPuzzleComplete() {
        for (const word of cells) {
            for (const c of word) {
                if (!c.locked) return false;
            }
        }
        return true;
    }

    // when puzzle completed
    function handlePuzzleComplete() {
        // prevent re-entrance
        if (isTransitioning) return;
        setIsTransitioning(true);
        // temporarily disable input and clear focus/hiddenText
        setHiddenText('');
        setCurrentPos(null);

        const level = (aztundLevels && selectedLevel != null) ? aztundLevels[selectedLevel] : null;
        const puzzles = getPuzzlesForLevel(level);

        // small delay so user sees filled cells before transition
        setTimeout(() => {
            if (puzzleIndex + 1 < puzzles.length) {
                // next puzzle in same level
                const nextIdx = puzzleIndex + 1;
                setPuzzleIndex(nextIdx);
                const nextPuzzle = puzzles[nextIdx] || {};
                const nextAnswer = getPuzzleField(nextPuzzle, ['answer', 'solution', 'word', 'text', 'value', 'answerText']);
                initCellsFromAnswer((nextAnswer || '').toString().trim());
                setTimeout(() => {
                    inputRef.current?.focus();
                    setIsTransitioning(false);
                }, 200);
            } else {
                // Last puzzle of the level completed -> award rewards and unlock/start next level if exists
                (async () => {
                    await awardRewards(selectedLevel);
                    // unlock next level index (selectedLevel + 1)
                    const nextLevelIdx = (selectedLevel != null) ? selectedLevel + 1 : null;
                    if (nextLevelIdx != null) {
                        const newUnlocked = Math.max(unlockedMaxLevel, nextLevelIdx);
                        setUnlockedMaxLevel(newUnlocked);
                        try { await AsyncStorage.setItem('unlockedMaxLevel', String(newUnlocked)); } catch (e) { /* ignore */ }
                    }
                    // if there's a next level in data -> auto-start it, else show result
                    if (nextLevelIdx != null && aztundLevels[nextLevelIdx]) {
                        // start next level automatically
                        startLevel(nextLevelIdx);
                        setIsTransitioning(false);
                    } else {
                        setScreen('result');
                        setIsTransitioning(false);
                    }
                })();
            }
        }, 350);
    }

    // process a single character input
    function processCharInput(chRaw: string) {
        if (isTransitioning) return;
        const ch = chRaw || '';
        if (!currentPos) return;
        const w = currentPos.w, i = currentPos.i;
        const newCells = cells.map(word => word.map(c => ({ ...c })));
        // if this cell is already locked, skip to next editable
        if (newCells[w][i].locked) {
            const nextIfLocked = findNextEditable({ w, i }, false);
            setCurrentPos(nextIfLocked);
            return;
        }
        // place char (display uppercase)
        const displayChar = ch.toUpperCase();
        newCells[w][i].char = displayChar;

        // compare normalized forms (trim and ensure both sides are normalized)
        const inputNorm = normalizeChar(ch.trim());
        const expectedNorm = (newCells[w][i].expectedNorm || normalizeChar(newCells[w][i].expected || '')).trim();

        // lock if normalized input matches expected normalized
        if (inputNorm === expectedNorm && inputNorm.length > 0) {
            newCells[w][i].locked = true;
        } else {
            // keep editable (allow correction)
            newCells[w][i].locked = false;
        }

        // update cells
        setCells(newCells);

        // move to next editable (skip locked)
        const next = findNextEditable({ w, i }, false);
        setCurrentPos(next);

        // IMPORTANT: determine completion from newCells (not from state) because setState is async
        const completeNow = newCells.every(word => word.every(c => c.locked));
        if (completeNow) {
            // short delay to allow UI update, then handle completion
            setTimeout(() => handlePuzzleComplete(), 250);
        }
    }

    // handle backspace
    function handleBackspace() {
        // If there is a current position and it's editable (not locked) and has a char -> clear it
        if (currentPos) {
            const { w, i } = currentPos;
            // safety checks
            if (cells[w] && cells[w][i] && !cells[w][i].locked && cells[w][i].char) {
                const newCells = cells.map(word => word.map(c => ({ ...c })));
                newCells[w][i].char = '';
                // keep it editable (do not change locked)
                newCells[w][i].locked = false;
                setCells(newCells);
                setCurrentPos({ w, i });
                // keep focus
                setTimeout(() => inputRef.current?.focus(), 10);
                return;
            }
            // if current pos either locked or empty, try find previous editable
            const prev = findPrevEditable(currentPos);
            if (prev) {
                const newCells = cells.map(word => word.map(c => ({ ...c })));
                newCells[prev.w][prev.i].char = '';
                newCells[prev.w][prev.i].locked = false;
                setCells(newCells);
                setCurrentPos(prev);
                setTimeout(() => inputRef.current?.focus(), 10);
                return;
            }
        }
        // fallback: if no currentPos, search from end for last editable
        let target: { w: number; i: number } | null = null;
        for (let w = cells.length - 1; w >= 0; w--) {
            for (let i = (cells[w] || []).length - 1; i >= 0; i--) {
                if (!cells[w][i].locked && cells[w][i].char) {
                    target = { w, i };
                    break;
                }
            }
            if (target) break;
        }
        if (!target) return;
        const newCells = cells.map(word => word.map(c => ({ ...c })));
        newCells[target.w][target.i].char = '';
        newCells[target.w][target.i].locked = false;
        setCells(newCells);
        setCurrentPos(target);
        setTimeout(() => inputRef.current?.focus(), 10);
    }

    // Hidden TextInput handlers
    function onHiddenChange(text: string) {
        if (isTransitioning) return;
        if (!text || text.length === 0) {
            setHiddenText('');
            return;
        }
        // take last entered char
        const last = text[text.length - 1];
        setHiddenText('');
        // handle space: jump to next word start (don't insert space into cells)
        if (last === ' ') {
            if (!currentPos) return;
            const nextWordIndex = currentPos.w + 1;
            if (nextWordIndex < cells.length && cells[nextWordIndex].length > 0) {
                setCurrentPos({ w: nextWordIndex, i: 0 });
            }
            // keep focus
            setTimeout(() => inputRef.current?.focus(), 10);
            return;
        }
        processCharInput(last);
        // keep focus
        setTimeout(() => inputRef.current?.focus(), 10);
    }
    function onHiddenKeyPress(ev: any) {
        if (ev.nativeEvent.key === 'Backspace') {
            handleBackspace();
        }
    }

    // render words cells
    function renderCells() {
        // compute totals to adapt spacing
        const baseCellWidth = aztskywid * 0.078;
        const baseMarginH = aztskywid * 0.01;
        const baseWordGap = aztskywid * 0.06;
        const containerPaddingH = aztskywid * 0.04 * 2; // left + right padding used in parent

        // helper to compute total needed width for a given words array
        function computeScaleForWords(wordsArr: string[]) {
            const totalCells = wordsArr.reduce((s, w) => s + w.length, 0);
            const totalCellWidth = totalCells * baseCellWidth;
            // total margins between cells: each cell has left+right margin => approx 2*baseMarginH per cell
            const totalMargins = totalCells * (2 * baseMarginH);
            // gaps between words (word count -1)
            const totalWordGaps = Math.max(0, wordsArr.length - 1) * baseWordGap;
            const required = totalCellWidth + totalMargins + totalWordGaps + containerPaddingH;
            const avail = aztskywid; // full screen width
            // scale <= 1
            return Math.min(1, avail / (required || 1));
        }

        // if cells ready, derive words lengths from cells, else from raw answer
        let wordsList: string[] = [];
        if (cells && cells.length > 0) {
            wordsList = cells.map(w => w.map(c => c.expected).join(''));
        } else {
            const raw = getCurrentAnswerRaw() || '';
            wordsList = raw.toString().trim().split(' ').filter(w => w.length > 0);
        }

        const scale = computeScaleForWords(wordsList);

        // scaled sizes
        const cellWidth = baseCellWidth * scale;
        const marginH = baseMarginH * scale;
        const wordGap = baseWordGap * scale * 0.1;

        // if cells are populated -> render them
        if (cells && cells.length > 0) {
            return (
                <UntheViewfires style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', paddingHorizontal: aztskywid * 0.04 }}>
                    {cells.map((word, wi) => (
                        <UntheViewfires key={`w-${wi}`} style={{ flexDirection: 'row', marginRight: wi === cells.length - 1 ? 0 : wordGap }}>
                            {word.map((c, ci) => {
                                const isCurrent = currentPos && currentPos.w === wi && currentPos.i === ci;
                                const bg = c.locked ? '#39AD00' : '#616A82';
                                return (
                                    <AzTouchable
                                        key={`c-${wi}-${ci}`}
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            if (c.locked) return;
                                            setCurrentPos({ w: wi, i: ci });
                                            setTimeout(() => inputRef.current?.focus(), 50);
                                        }}
                                        style={{ borderRadius: azundehei * 0.06 }}
                                    >
                                        <UntheViewfires
                                            style={{
                                                borderWidth: isCurrent ? aztskywid * 0.006 : 0,
                                                height: azundehei * 0.08,
                                                backgroundColor: bg,
                                                borderRadius: azundehei * 0.06,
                                                marginHorizontal: marginH * 0.8,
                                                width: cellWidth * 1.07,
                                                alignItems: 'center',
                                                opacity: c.locked ? 1 : 0.98,
                                                borderColor: isCurrent ? '#FFD96A' : 'transparent',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <TheskyazteresText style={{ color: '#FFD96A', fontSize: Math.max(12, aztskywid * 0.052 * scale), fontWeight: '700' }}>
                                                {c.char}
                                            </TheskyazteresText>
                                        </UntheViewfires>
                                    </AzTouchable>
                                );
                            })}
                        </UntheViewfires>
                    ))}
                </UntheViewfires>
            );
        }

        // fallback: render placeholder pills based on answer length (also scaled)
        const raw = getCurrentAnswerRaw() || '';
        const words = raw.toString().trim().split(' ').filter(w => w.length > 0);
        if (!words || words.length === 0) {
            return null;
        }
        return (
            <UntheViewfires style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', paddingHorizontal: aztskywid * 0.04 }}>
                {words.map((w, wi) => (
                    <UntheViewfires key={`pw-${wi}`} style={{ flexDirection: 'row', marginRight: wi === words.length - 1 ? 0 : wordGap }}>
                        {Array.from({ length: w.length }).map((_, ci) => (
                            <UntheViewfires
                                key={`ph-${wi}-${ci}`}
                                style={{
                                    borderRadius: azundehei * 0.06,
                                    width: cellWidth,
                                    backgroundColor: '#616A82',
                                    alignItems: 'center',
                                    marginHorizontal: marginH,
                                    justifyContent: 'center',
                                    height: azundehei * 0.11,
                                }}
                            />
                        ))}
                    </UntheViewfires>
                ))}
            </UntheViewfires>
        );
    }

    // get current clue text and total puzzles count (robust)
    function currentClue() {
        const level = (aztundLevels && selectedLevel != null) ? aztundLevels[selectedLevel] : null;
        const puzzles = getPuzzlesForLevel(level);
        const p = puzzles[puzzleIndex] || {};
        const clue = getPuzzleField(p, ['clue', 'hint', 'question', 'text', 'description']);
        return clue || '';
    }
    function puzzlesCount() {
        const level = (aztundLevels && selectedLevel != null) ? aztundLevels[selectedLevel] : null;
        return getPuzzlesForLevel(level).length;
    }

    // when enter play screen focus input
    useEffect(() => {
        if (screen === 'play') {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [screen]);

    // render level list item
    function renderLevelItem(level: any, idx: number) {
        const unlocked = idx <= (unlockedMaxLevel || 0); // unlocked up to unlockedMaxLevel
         return (
             <AzTouchable
                 key={`level-${idx}`}
                 activeOpacity={0.8}
                 onPress={() => { if (unlocked) startLevel(idx); }}
                 style={{ width: aztskywid * 0.88, height: azundehei * 0.08, marginBottom: azundehei * 0.025 }}
             >
                 <FiunderesImgBg
                     source={rockButtImg}
                     style={{ width: aztskywid * 0.88, height: azundehei * 0.08, justifyContent: 'center', paddingHorizontal: aztskywid * 0.079, flexDirection: 'row', alignItems: 'center' }}
                     resizeMode="stretch"
                 >
                     <UntheViewfires style={{ flex: 1, justifyContent: 'center' }}>
                         <TheskyazteresText style={{ color: '#FFA100', fontWeight: '700', fontSize: aztskywid * 0.05 }}>
                             {`Level ${idx + 1}`}
                         </TheskyazteresText>
                     </UntheViewfires>

                     {!unlocked ? (
                         <Skiresimage source={lockedImg} style={{ width: azundehei * 0.048, height: azundehei * 0.048, resizeMode: 'contain' }} />
                     ) : (
                         <UntheViewfires style={{ width: azundehei * 0.048, height: azundehei * 0.048 }} />
                     )}
                 </FiunderesImgBg>
             </AzTouchable>
         );
     }

    // main render
    return (
        <UntheViewfires style={{ flex: 1, position: 'relative', alignItems: 'center' }}>
            {/* Top header row */}
            <UntheViewfires style={{ width: aztskywid, paddingHorizontal: aztskywid * 0.04, marginTop: azundehei * 0.04, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <AzTouchable onPress={() => setFirztecScen('Local Screen Aztec')} activeOpacity={0.8} style={{ width: aztskywid * 0.12, height: azundehei * 0.06, justifyContent: 'center' }}>
                    <Skiresimage source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/firback.png')} style={{ width: aztskywid * 0.16, height: aztskywid * 0.16, resizeMode: 'contain' }} />
                </AzTouchable>

                {/* center: either title or gems + pause when playing */}
                <UntheViewfires style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {screen === 'levels' ? (
                        <FiunderesImgBg source={rockButtImg} style={{ width: aztskywid * 0.6, height: azundehei * 0.085, justifyContent: 'center', alignItems: 'center' }} resizeMode="stretch">
                            <TheskyazteresText style={{ color: '#ffd96a', fontWeight: '700', fontSize: aztskywid * 0.05, textAlign: 'center' }}>
                                Choose Your Trial
                            </TheskyazteresText>
                        </FiunderesImgBg>
                    ) : screen === 'play' ? (
                        <UntheViewfires style={{ width: aztskywid * 0.8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                            <UntheViewfires style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                {/* left: coin icon inside a small square frame */}
                                <UntheViewfires style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: aztskywid * 0.02,
                                }}>
                                    <Skiresimage source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/gem_red.png')} style={{ width: aztskywid * 0.091, height: aztskywid * 0.091, resizeMode: 'contain' }} />
                                </UntheViewfires>

                                {/* right: gemsAmountBg - only the amount text inside */}
                                <FiunderesImgBg
                                    source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/gemsAmountBg.png')}
                                    style={{
                                        width: aztskywid * 0.16,
                                        height: aztskywid * 0.1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingHorizontal: aztskywid * 0.02,
                                    }}
                                    resizeMode="stretch"
                                >
                                    <TheskyazteresText style={{
                                        color: '#FFA100',
                                        fontSize: aztskywid * 0.04,
                                        fontWeight: '700',
                                        textAlign: 'center',
                                    }} numberOfLines={1} adjustsFontSizeToFit>
                                        {redGems}
                                    </TheskyazteresText>
                                </FiunderesImgBg>
                            </UntheViewfires>

                            <UntheViewfires style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                {/* left: coin icon inside a small square frame */}
                                <UntheViewfires style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginHorizontal: aztskywid * 0.02,
                                }}>
                                    <Skiresimage source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/gem_green.png')} style={{ width: aztskywid * 0.091, height: aztskywid * 0.091, resizeMode: 'contain' }} />
                                </UntheViewfires>

                                {/* right: gemsAmountBg - only the amount text inside */}
                                <FiunderesImgBg
                                    source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/gemsAmountBg.png')}
                                    style={{
                                        alignItems: 'center',
                                        height: aztskywid * 0.1,
                                        justifyContent: 'center',
                                        paddingHorizontal: aztskywid * 0.02,
                                        width: aztskywid * 0.16,
                                    }}
                                    resizeMode="stretch"
                                >
                                    <TheskyazteresText style={{
                                        color: '#FFA100',
                                        fontSize: aztskywid * 0.04,
                                        fontWeight: '700',
                                        textAlign: 'center',
                                    }} numberOfLines={1} adjustsFontSizeToFit>
                                        {greenGems}
                                    </TheskyazteresText>
                                </FiunderesImgBg>
                            </UntheViewfires>

                        </UntheViewfires>
                    ) : (
                        <FiunderesImgBg source={rockButtImg} style={{ width: aztskywid * 0.6, height: azundehei * 0.085, justifyContent: 'center', alignItems: 'center' }} resizeMode="stretch">
                            <TheskyazteresText style={{ color: '#ffd96a', fontWeight: '700', fontSize: aztskywid * 0.05, textAlign: 'center' }}>
                                Result
                            </TheskyazteresText>
                        </FiunderesImgBg>
                    )}
                </UntheViewfires>

                {/* right: pause button when playing, else placeholder to balance */}
                {screen === 'play' ? (
                    <AzTouchable activeOpacity={0.8} onPress={() => { /* pause placeholder */ }} style={{ width: aztskywid * 0.12, height: azundehei * 0.06, justifyContent: 'center', alignItems: 'center' }}>
                        <Skiresimage source={pauseImg} style={{ width: aztskywid * 0.12, height: aztskywid * 0.12, resizeMode: 'contain' }} />
                    </AzTouchable>
                ) : (
                    <UntheViewfires style={{ width: aztskywid * 0.12, height: azundehei * 0.06 }} />
                )}
            </UntheViewfires>

            {screen === 'levels' && (
                <AzScroll style={{ width: aztskywid, marginTop: azundehei * 0.02 }}>
                    <UntheViewfires style={{ alignItems: 'center' }}>
                        {(aztundLevels || []).map((lvl: any, idx: number) => renderLevelItem(lvl, idx))}
                    </UntheViewfires>
                </AzScroll>
            )}

            {screen === 'play' && (
                <UntheViewfires style={{ width: aztskywid, alignItems: 'center', marginTop: azundehei * 0.03 }}>
                    {/* clue box (now contains paginator + clue text) */}
                    <UntheViewfires
                        style={{
                            paddingHorizontal: aztskywid * 0.04,
                            minHeight: azundehei * 0.14,
                            backgroundColor: '#062326',
                            borderRadius: aztskywid * 0.04,
                            width: aztskywid * 0.9,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            paddingVertical: azundehei * 0.015,
                        }}
                    >
                        {/* paginator inside same view */}
                        <UntheViewfires style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: azundehei * 0.01 }}>
                            {Array.from({ length: Math.max(1, puzzlesCount()) }).map((_, i) => (
                                <UntheViewfires
                                    key={`dot-inside-${i}`}
                                    style={{
                                        width: aztskywid * 0.02,
                                        marginHorizontal: aztskywid * 0.01,
                                        borderRadius: aztskywid * 0.01,
                                        height: aztskywid * 0.02,
                                        backgroundColor: i === puzzleIndex ? '#FFA100' : '#ffa2005d',
                                    }}
                                />
                            ))}
                        </UntheViewfires>

                        <TheskyazteresText style={{ color: '#FFA100', fontWeight: '700', fontSize: aztskywid * 0.044, textAlign: 'center' }}>
                            {currentClue()}
                        </TheskyazteresText>
                    </UntheViewfires>

                    {/* answer cells */}
                    <UntheViewfires style={{ marginTop: azundehei * 0.03 }}>
                        {renderCells()}
                    </UntheViewfires>

                    {/* hidden TextInput (small but focusable so keyboard opens reliably) */}
                    <AzTextInput
                        onKeyPress={onHiddenKeyPress}
                        ref={r => inputRef.current = r}
                        caretHidden={false}
                        value={hiddenText}
                        autoFocus
                        onChangeText={onHiddenChange}
                        onFocus={() => {
                            if (!currentPos && cells && cells.length > 0) {
                                // ensure some current pos exists
                                const first = findNextEditable({ w: 0, i: -1 }, false) || findNextEditable({ w: 0, i: 0 }, true);
                                if (first) setCurrentPos(first);
                            }
                        }}
                        style={{
                            height: azundehei * 0.06,
                            position: 'absolute',
                            opacity: 0,
                            left: aztskywid * 0.02,
                            width: aztskywid * 0.28,
                            bottom: azundehei * 0.02,
                        }}
                        blurOnSubmit={false}
                        autoCapitalize="characters"
                        importantForAutofill="no"
                        spellCheck={false}
                        autoCorrect={false}
                        editable={true}
                    />
                </UntheViewfires>
            )}

            {screen === 'result' && (
                <UntheViewfires style={{ width: aztskywid, alignItems: 'center', marginTop: azundehei * 0.03 }}>

                    <FiunderesImgBg source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/blessingOfTheSun.png')}
                        style={{ width: aztskywid * 0.91, height: azundehei * 0.59, justifyContent: 'center', alignItems: 'center' }} resizeMode="stretch"
                    >
                        <UntheViewfires style={{
                            alignItems: 'center',
                            width: '100%',
                            height: azundehei * 0.16,
                            bottom: azundehei * 0.07,
                            alignSelf: 'center',
                            position: 'absolute',
                            
                        }}>
                            <TheskyazteresText style={{ color: '#FFA100', fontSize: aztskywid * 0.05, fontWeight: '700' }}>Blessing of the Sun</TheskyazteresText>
                            <TheskyazteresText style={{ color: '#FFA100', fontSize: aztskywid * 0.04, fontWeight: '500', paddingHorizontal: aztskywid * 0.05, textAlign: 'center' }}>The gods have marked your path with fire and honor</TheskyazteresText>


                            <UntheViewfires style={{
                                paddingHorizontal: aztskywid * 0.03,
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: azundehei * 0.019,
                                flexDirection: 'column',
                            }}>
                                {/* top row: left and right (red + green) */}
                                <UntheViewfires style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: aztskywid * 0.06 }}>
                                    {/* left: red gem */}
                                    <UntheViewfires style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Skiresimage source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/gem_red.png')} style={{ width: aztskywid * 0.09, height: aztskywid * 0.09, resizeMode: 'contain' }} />
                                        <FiunderesImgBg source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/gemsAmountBg.png')} style={{ width: aztskywid * 0.14, height: aztskywid * 0.08, marginLeft: aztskywid * 0.02, justifyContent: 'center', alignItems: 'center' }} resizeMode='stretch'>
                                            <TheskyazteresText style={{ color: '#ffd24d', fontSize: aztskywid * 0.04, fontWeight: '700' }} numberOfLines={1} adjustsFontSizeToFit>{redGems}</TheskyazteresText>
                                        </FiunderesImgBg>
                                    </UntheViewfires>

                                    {/* right: green gem */}
                                    <UntheViewfires style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <FiunderesImgBg source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/gemsAmountBg.png')} style={{ width: aztskywid * 0.14, height: aztskywid * 0.08, marginRight: aztskywid * 0.02, justifyContent: 'center', alignItems: 'center' }} resizeMode='stretch'>
                                            <TheskyazteresText style={{ color: '#ffd24d', fontSize: aztskywid * 0.04, fontWeight: '700' }} numberOfLines={1} adjustsFontSizeToFit>{greenGems}</TheskyazteresText>
                                        </FiunderesImgBg>
                                        <Skiresimage source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/gem_green.png')} style={{ width: aztskywid * 0.09, height: aztskywid * 0.09, resizeMode: 'contain' }} />
                                    </UntheViewfires>
                                </UntheViewfires>

                                {/* second row: centered coin */}
                                <UntheViewfires style={{ width: '100%', flexDirection: 'row', marginTop: azundehei * 0.015, alignItems: 'center', justifyContent: 'center', }}>
                                    <Skiresimage source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/goldCoin.png')} style={{ width: aztskywid * 0.09, height: aztskywid * 0.09, resizeMode: 'contain' }} />
                                    <FiunderesImgBg source={require('../FiresUnderTheAztecSkyAssets/FiresUnderTheAztecSkyImages/gemsAmountBg.png')} style={{ width: aztskywid * 0.14, height: aztskywid * 0.08, marginRight: aztskywid * 0.02, justifyContent: 'center', alignItems: 'center' }} resizeMode='stretch'>
                                        <TheskyazteresText style={{ color: '#ffd24d', fontSize: aztskywid * 0.04, fontWeight: '700' }}  numberOfLines={1} adjustsFontSizeToFit>{coins}</TheskyazteresText>
                                    </FiunderesImgBg>
                                </UntheViewfires>
                            </UntheViewfires>
                        </UntheViewfires>
                    </FiunderesImgBg>

                    <AzTouchable onPress={() => { setScreen('levels'); setSelectedLevel(null); }} activeOpacity={0.8} style={{ marginTop: azundehei * 0.03 }}>
                        <FiunderesImgBg source={rockButtImg} style={{ width: aztskywid * 0.6, height: azundehei * 0.08, justifyContent: 'center', alignItems: 'center' }} resizeMode="stretch">
                            <TheskyazteresText style={{ color: '#ffd96a', fontWeight: '700', fontSize: aztskywid * 0.045 }}>Back to Trials</TheskyazteresText>
                        </FiunderesImgBg>
                    </AzTouchable>
                </UntheViewfires>
            )}
        </UntheViewfires>
    );
}