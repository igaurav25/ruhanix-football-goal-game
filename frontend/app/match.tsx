import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    PanResponder,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

type Zone =
  | 'TL' | 'TC' | 'TR'
  | 'ML' | 'C' | 'MR'
  | 'BL' | 'BC' | 'BR';

type ShotResult = 'goal' | 'perfect' | 'power' | 'save' | 'miss';

const ZONES: Zone[] = [
  'TL', 'TC', 'TR',
  'ML', 'C', 'MR',
  'BL', 'BC', 'BR',
];

export default function MatchScreen() {
  const router = useRouter();

  // ============================================================
  // MATCH
  // ============================================================

  const [shotsLeft, setShotsLeft] = useState(5);
  const [goals, setGoals] = useState(0);
  const [combo, setCombo] = useState(0);
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);

  const [message, setMessage] =
    useState('SWIPE TO SHOOT ⚽');

  const [subMessage, setSubMessage] =
    useState('Beat the goalkeeper');

  const [power, setPower] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const [isShooting, setIsShooting] = useState(false);
  const [lastResult, setLastResult] =
    useState<ShotResult | null>(null);

  // Player stats
  const PLAYER_POWER = 76;
  const PLAYER_ACCURACY = 72;
  const PLAYER_CURVE = 68;

  // ============================================================
  // BALL ANIMATION
  // ============================================================

  const ballX = useRef(new Animated.Value(0)).current;
  const ballY = useRef(new Animated.Value(0)).current;
  const ballScale = useRef(new Animated.Value(1)).current;
  const ballRotate = useRef(new Animated.Value(0)).current;

  // Ball "depth"
  const ballDepth = useRef(new Animated.Value(1)).current;

  // ============================================================
  // KEEPER
  // ============================================================

  const keeperX = useRef(new Animated.Value(0)).current;
  const keeperY = useRef(new Animated.Value(0)).current;
  const keeperScale = useRef(new Animated.Value(1)).current;
  const keeperRotate = useRef(new Animated.Value(0)).current;

  // ============================================================
  // CAMERA / SCREEN EFFECT
  // ============================================================

  const cameraScale = useRef(new Animated.Value(1)).current;
  const cameraX = useRef(new Animated.Value(0)).current;

  // ============================================================
  // SWIPE
  // ============================================================

  const startX = useRef(0);
  const startY = useRef(0);

  const lastMoveX = useRef(0);
  const curveValue = useRef(0);

  // ============================================================
  // TARGET POSITION
  // ============================================================

  const getTarget = (zone: Zone) => {
    const goalW = width * 0.58;

    const left = -goalW * 0.42;
    const center = 0;
    const right = goalW * 0.42;

    const top = -height * 0.40;
    const middle = -height * 0.32;
    const bottom = -height * 0.24;

    switch (zone) {
      case 'TL':
        return { x: left, y: top };

      case 'TC':
        return { x: center, y: top };

      case 'TR':
        return { x: right, y: top };

      case 'ML':
        return { x: left, y: middle };

      case 'C':
        return { x: center, y: middle };

      case 'MR':
        return { x: right, y: middle };

      case 'BL':
        return { x: left, y: bottom };

      case 'BC':
        return { x: center, y: bottom };

      case 'BR':
        return { x: right, y: bottom };
    }
  };

  // ============================================================
  // DETECT TARGET ZONE
  // ============================================================

  const detectZone = (
    dx: number,
    dy: number
  ): Zone => {
    let column: 'L' | 'C' | 'R';

    if (dx < -70) column = 'L';
    else if (dx > 70) column = 'R';
    else column = 'C';

    let row: 'T' | 'M' | 'B';

    if (dy < -120) row = 'T';
    else if (dy < -40) row = 'M';
    else row = 'B';

    return `${row}${column}` as Zone;
  };

  // ============================================================
  // KEEPER AI
  // ============================================================

  const moveKeeper = (
    shotZone: Zone,
    shotPower: number
  ) => {
    /*
      Keeper difficulty gradually increases.
    */

    const difficulty =
      0.25 +
      (5 - shotsLeft) * 0.07;

    /*
      Keeper doesn't always guess correctly.
    */

    const guessCorrect =
      Math.random() <
      0.45 + difficulty;

    let keeperZone: Zone;

    if (guessCorrect) {
      keeperZone = shotZone;
    } else {
      keeperZone =
        ZONES[
          Math.floor(
            Math.random() * ZONES.length
          )
        ];
    }

    const target =
      getTarget(keeperZone);

    const dive =
      Math.random() <
      0.55 + difficulty * 0.2;

    if (!dive) {
      Animated.parallel([
        Animated.timing(keeperX, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),

        Animated.timing(keeperY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),

        Animated.timing(keeperRotate, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      return false;
    }

    let x =
      target.x * 0.62;

    let y =
      target.y * 0.15;

    /*
      High power shots force bigger keeper dive.
    */

    if (shotPower > 85) {
      x *= 1.15;
    }

    const rotation =
      x < -20
        ? -30
        : x > 20
        ? 30
        : 0;

    Animated.parallel([
      Animated.timing(keeperX, {
        toValue: x,
        duration: 420,
        useNativeDriver: true,
      }),

      Animated.timing(keeperY, {
        toValue: y,
        duration: 420,
        useNativeDriver: true,
      }),

      Animated.timing(keeperRotate, {
        toValue: rotation,
        duration: 420,
        useNativeDriver: true,
      }),

      Animated.sequence([
        Animated.timing(keeperScale, {
          toValue: 1.18,
          duration: 180,
          useNativeDriver: true,
        }),

        Animated.timing(keeperScale, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    return keeperZone === shotZone;
  };

  // ============================================================
  // SHOT CALCULATION
  // ============================================================

  const calculateResult = (
    zone: Zone,
    shotPower: number,
    shotAccuracy: number,
    curve: number
  ): ShotResult => {
    let chance =
      0.57 +
      PLAYER_ACCURACY / 1000;

    /*
      Power
    */

    if (shotPower >= 75) {
      chance += 0.08;
    }

    if (shotPower < 35) {
      chance -= 0.20;
    }

    /*
      Corner bonus
    */

    const corner =
      zone === 'TL' ||
      zone === 'TR' ||
      zone === 'BL' ||
      zone === 'BR';

    if (corner) {
      chance += 0.10;
    }

    /*
      Center is easier for keeper.
    */

    if (zone === 'C') {
      chance -= 0.12;
    }

    /*
      Curve
    */

    if (curve > 35) {
      chance += PLAYER_CURVE / 1800;
    }

    /*
      Difficulty
    */

    chance -=
      (5 - shotsLeft) * 0.045;

    /*
      Accuracy
    */

    chance +=
      (shotAccuracy - 50) / 1000;

    /*
      Perfect corner
    */

    if (
      corner &&
      shotPower >= 80 &&
      shotAccuracy >= 75 &&
      Math.random() > 0.18
    ) {
      return 'perfect';
    }

    /*
      Power shot
    */

    if (
      shotPower >= 90 &&
      Math.random() < chance
    ) {
      return 'power';
    }

    /*
      Normal goal
    */

    if (Math.random() < chance) {
      return 'goal';
    }

    return 'miss';
  };

  // ============================================================
  // SHOOT
  // ============================================================

  const shoot = (
    dx: number,
    dy: number
  ) => {
    if (
      isShooting ||
      shotsLeft <= 0
    ) {
      return;
    }

    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      );

    if (distance < 55) {
      setMessage('👆 SWIPE HARDER');
      setSubMessage(
        'Swipe towards the goal'
      );
      return;
    }

    setIsShooting(true);

    const shotPower =
      Math.min(
        100,
        Math.max(
          20,
          Math.round(
            distance / 2
          )
        )
      );

    /*
      Accuracy
    */

    const shotAccuracy =
      Math.min(
        100,
        Math.max(
          40,
          PLAYER_ACCURACY +
            Math.round(
              Math.random() * 16 - 8
            )
        )
      );

    /*
      Curve
    */

    const curve =
      Math.min(
        100,
        Math.abs(
          curveValue.current
        )
      );

    setPower(shotPower);
    setAccuracy(shotAccuracy);

    /*
      Target
    */

    const zone =
      detectZone(dx, dy);

    const target =
      getTarget(zone);

    /*
      Keeper
    */

    const keeperGuessed =
      moveKeeper(
        zone,
        shotPower
      );

    /*
      Shot result
    */

    let result =
      calculateResult(
        zone,
        shotPower,
        shotAccuracy,
        curve
      );

    /*
      Keeper save chance
    */

    if (
      keeperGuessed &&
      Math.random() <
        0.60 -
          shotPower / 500
    ) {
      result = 'save';
    }

    setLastResult(result);

    /*
      Curve target
    */

    let finalX =
      target.x;

    if (curve > 25) {
      finalX +=
        curveValue.current > 0
          ? width * 0.11
          : -width * 0.11;
    }

    /*
      Accuracy error
    */

    finalX +=
      (Math.random() - 0.5) *
      ((100 - shotAccuracy) /
        100) *
      60;

    /*
      3D depth effect
    */

    Animated.parallel([
      Animated.timing(ballX, {
        toValue: finalX,
        duration: 520,
        useNativeDriver: true,
      }),

      Animated.timing(ballY, {
        toValue: target.y,
        duration: 520,
        useNativeDriver: true,
      }),

      Animated.timing(ballScale, {
        toValue: 0.35,
        duration: 520,
        useNativeDriver: true,
      }),

      Animated.timing(ballDepth, {
        toValue: 0.45,
        duration: 520,
        useNativeDriver: true,
      }),

      Animated.timing(ballRotate, {
        toValue: dx * 2,
        duration: 520,
        useNativeDriver: true,
      }),

      Animated.sequence([
        Animated.timing(cameraScale, {
          toValue: 1.04,
          duration: 220,
          useNativeDriver: true,
        }),

        Animated.timing(cameraScale, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      processResult(
        result,
        zone,
        shotPower
      );
    });
  };

  // ============================================================
  // PROCESS RESULT
  // ============================================================

  const processResult = (
    result: ShotResult,
    zone: Zone,
    shotPower: number
  ) => {
    let earnedXP = 0;
    let earnedCoins = 0;

    if (
      result === 'perfect'
    ) {
      setGoals(g => g + 1);
      setCombo(c => c + 1);

      earnedXP = 50;
      earnedCoins = 20;

      setMessage(
        '🔥 PERFECT GOAL!'
      );

      setSubMessage(
        'TOP CORNER • WORLD CLASS'
      );
    }

    else if (
      result === 'power'
    ) {
      setGoals(g => g + 1);
      setCombo(c => c + 1);

      earnedXP = 40;
      earnedCoins = 15;

      setMessage(
        '💥 POWER SHOT!'
      );

      setSubMessage(
        'THE KEEPER HAD NO CHANCE'
      );
    }

    else if (
      result === 'goal'
    ) {
      setGoals(g => g + 1);
      setCombo(c => c + 1);

      earnedXP = 20;
      earnedCoins = 8;

      setMessage(
        '⚽ GOOOOOOAL!'
      );

      setSubMessage(
        `${zoneName(zone)} • ${shotPower}% POWER`
      );
    }

    else if (
      result === 'save'
    ) {
      setCombo(0);

      setMessage(
        '🧤 WHAT A SAVE!'
      );

      setSubMessage(
        'The goalkeeper read your shot'
      );
    }

    else {
      setCombo(0);

      setMessage(
        '❌ MISS!'
      );

      setSubMessage(
        'Try aiming for the corners'
      );
    }

    if (earnedXP > 0) {
      setXp(
        value =>
          value + earnedXP
      );
    }

    if (earnedCoins > 0) {
      setCoins(
        value =>
          value + earnedCoins
      );
    }

    /*
      Next shot / match finish.
    */

    const remaining =
      shotsLeft - 1;

    setTimeout(() => {
      resetShot();

      if (remaining <= 0) {
        /*
          State updates are asynchronous,
          therefore calculate final goals
          from current result.
        */

        setTimeout(() => {
          finishMatch();
        }, 100);
      }
    }, 850);
  };

  // ============================================================
  // RESET SHOT
  // ============================================================

  const resetShot = () => {
    ballX.setValue(0);
    ballY.setValue(0);
    ballScale.setValue(1);
    ballDepth.setValue(1);
    ballRotate.setValue(0);

    keeperX.setValue(0);
    keeperY.setValue(0);
    keeperScale.setValue(1);
    keeperRotate.setValue(0);

    curveValue.current = 0;

    setShotsLeft(
      value => value - 1
    );

    setIsShooting(false);

    setPower(0);
    setAccuracy(0);
  };

  // ============================================================
  // MATCH FINISH
  // ============================================================

  const finishMatch = () => {
    /*
      Determine final goals from the
      last shot result.
    */

    let finalGoals = goals;

    if (
      lastResult === 'goal' ||
      lastResult === 'perfect' ||
      lastResult === 'power'
    ) {
      finalGoals += 1;
    }

    const won =
      finalGoals >= 3;

    setTimeout(() => {
      Alert.alert(
        won
          ? '🏆 MATCH WON!'
          : '❌ MATCH LOST',
        won
          ? `You scored ${finalGoals}/5 goals!\n\n⭐ XP: ${xp}\n🪙 Coins: ${coins}\n\nAmazing finishing!`
          : `You scored ${finalGoals}/5 goals.\n\nYou need 3 goals to win.`,
        [
          {
            text: '🔄 PLAY AGAIN',
            onPress: resetMatch,
          },
          {
            text: '🚪 LOBBY',
            onPress: () =>
              router.back(),
          },
        ]
      );
    }, 300);
  };

  // ============================================================
  // RESET MATCH
  // ============================================================

  const resetMatch = () => {
    setShotsLeft(5);
    setGoals(0);
    setCombo(0);
    setXp(0);
    setCoins(0);
    setPower(0);
    setAccuracy(0);
    setLastResult(null);
    setIsShooting(false);

    setMessage(
      'SWIPE TO SHOOT ⚽'
    );

    setSubMessage(
      'Beat the goalkeeper'
    );

    ballX.setValue(0);
    ballY.setValue(0);
    ballScale.setValue(1);
    ballDepth.setValue(1);
    ballRotate.setValue(0);

    keeperX.setValue(0);
    keeperY.setValue(0);
    keeperScale.setValue(1);
    keeperRotate.setValue(0);
  };

  // ============================================================
  // ZONE NAME
  // ============================================================

  const zoneName = (
    zone: Zone
  ) => {
    const names: Record<
      Zone,
      string
    > = {
      TL: 'TOP LEFT',
      TC: 'TOP CENTER',
      TR: 'TOP RIGHT',
      ML: 'LEFT',
      C: 'CENTER',
      MR: 'RIGHT',
      BL: 'LOW LEFT',
      BC: 'LOW CENTER',
      BR: 'LOW RIGHT',
    };

    return names[zone];
  };

  // ============================================================
  // PAN RESPONDER
  // ============================================================

  const panResponder =
    useRef(
      PanResponder.create({
        onStartShouldSetPanResponder:
          () => true,

        onMoveShouldSetPanResponder:
          () => true,

        onPanResponderGrant:
          event => {
            startX.current =
              event.nativeEvent.pageX;

            startY.current =
              event.nativeEvent.pageY;

            lastMoveX.current =
              startX.current;

            curveValue.current = 0;
          },

        onPanResponderMove:
          event => {
            const currentX =
              event.nativeEvent.pageX;

            /*
              Side movement while
              swiping creates curve.
            */

            curveValue.current +=
              currentX -
              lastMoveX.current;

            lastMoveX.current =
              currentX;
          },

        onPanResponderRelease:
          event => {
            const dx =
              event.nativeEvent.pageX -
              startX.current;

            const dy =
              event.nativeEvent.pageY -
              startY.current;

            shoot(dx, dy);
          },
      })
    ).current;

  // ============================================================
  // UI
  // ============================================================

  return (
    <SafeAreaView
      style={styles.container}
    >

      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.lobbyButton}
          disabled={isShooting}
          onPress={() =>
            router.back()
          }
        >
          <Text style={styles.backArrow}>
            ‹
          </Text>

          <Text style={styles.lobbyText}>
            LOBBY
          </Text>
        </TouchableOpacity>

        <View
          style={styles.titleBox}
        >
          <Text
            style={styles.title}
          >
            PENALTY SHOOTOUT
          </Text>

          <Text
            style={styles.subtitle}
          >
            5 SHOTS • 3 TO WIN
          </Text>
        </View>

        <View
          style={styles.currencyBox}
        >
          <Text style={styles.currency}>
            🪙 {coins}
          </Text>

          <Text style={styles.xp}>
            ⭐ {xp}
          </Text>
        </View>

      </View>

      {/* SCORE */}

      <View
        style={styles.scoreboard}
      >

        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            GOALS
          </Text>

          <Text style={styles.cardValue}>
            {goals}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            COMBO
          </Text>

          <Text style={styles.cardValue}>
            x{combo}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            SHOTS
          </Text>

          <Text style={styles.cardValue}>
            {shotsLeft}
          </Text>
        </View>

      </View>

      {/* PLAYER STATS */}

      <View
        style={styles.statsRow}
      >
        <Stat
          label="POWER"
          value={PLAYER_POWER}
        />

        <Stat
          label="ACCURACY"
          value={PLAYER_ACCURACY}
        />

        <Stat
          label="CURVE"
          value={PLAYER_CURVE}
        />
      </View>

      {/* CAMERA */}

      <Animated.View
        style={[
          styles.camera,
          {
            transform: [
              {
                scale: cameraScale,
              },
              {
                translateX: cameraX,
              },
            ],
          },
        ]}
      >

        {/* FIELD */}

        <View
          style={styles.field}
          {...panResponder.panHandlers}
        >

          {/* FIELD PERSPECTIVE */}

          <View
            style={styles.fieldGlow}
          />

          <View
            style={styles.centerLine}
          />

          <View
            style={styles.penaltyArea}
          />

          {/* STADIUM */}

          <View
            style={styles.stadiumTop}
          >
            <Text
              style={styles.stadiumText}
            >
              ⚡ CHAMPIONS ARENA ⚡
            </Text>
          </View>

          {/* GOAL */}

          <View
            style={styles.goal}
          >
            <Text
              style={styles.goalEmoji}
            >
              🥅
            </Text>

            {/* 9 TARGET ZONES */}

            <View
              style={styles.targetGrid}
            >
              {ZONES.map(
                zone => (
                  <View
                    key={zone}
                    style={
                      styles.targetZone
                    }
                  />
                )
              )}
            </View>

            {/* KEEPER */}

            <Animated.Text
              style={[
                styles.keeper,
                {
                  transform: [
                    {
                      translateX:
                        keeperX,
                    },
                    {
                      translateY:
                        keeperY,
                    },
                    {
                      scale:
                        keeperScale,
                    },
                    {
                      rotate:
                        keeperRotate.interpolate(
                          {
                            inputRange: [
                              -30,
                              30,
                            ],
                            outputRange: [
                              '-30deg',
                              '30deg',
                            ],
                          }
                        ),
                    },
                  ],
                },
              ]}
            >
              🧤
            </Animated.Text>
          </View>

          {/* MESSAGE */}

          <View
            style={styles.messageBox}
          >
            <Text
              style={[
                styles.message,
                lastResult ===
                  'perfect' &&
                  styles.perfect,
                lastResult ===
                  'save' &&
                  styles.save,
              ]}
            >
              {message}
            </Text>

            <Text
              style={styles.subMessage}
            >
              {subMessage}
            </Text>
          </View>

          {/* AIM */}

          {!isShooting && (
            <View
              style={styles.aim}
            >
              <Text
                style={styles.arrows}
              >
                ↖　↑　↗
              </Text>

              <Text
                style={styles.aimText}
              >
                SWIPE TO AIM
              </Text>

              <Text
                style={styles.arrows}
              >
                ←　⚽　→
              </Text>
            </View>
          )}

          {/* BALL */}

          <Animated.View
            style={[
              styles.ball,
              {
                transform: [
                  {
                    translateX:
                      ballX,
                  },
                  {
                    translateY:
                      ballY,
                  },
                  {
                    scale:
                      Animated.multiply(
                        ballScale,
                        ballDepth
                      ),
                  },
                  {
                    rotate:
                      ballRotate.interpolate(
                        {
                          inputRange: [
                            -360,
                            360,
                          ],
                          outputRange: [
                            '-360deg',
                            '360deg',
                          ],
                        }
                      ),
                  },
                ],
              },
            ]}
          >
            <Text
              style={styles.ballEmoji}
            >
              ⚽
            </Text>
          </Animated.View>

          {/* PLAYER */}

          <Text
            style={styles.player}
          >
            🧍‍♂️
          </Text>

        </View>

      </Animated.View>

      {/* POWER */}

      <View
        style={styles.powerContainer}
      >
        <View
          style={styles.powerHeader}
        >
          <Text
            style={styles.powerLabel}
          >
            SHOT POWER
          </Text>

          <Text
            style={styles.powerValue}
          >
            {power}%
          </Text>
        </View>

        <View
          style={styles.powerBar}
        >
          <View
            style={[
              styles.powerFill,
              {
                width:
                  `${power}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* HELP */}

      <View
        style={styles.help}
      >
        <Text
          style={styles.helpMain}
        >
          👆 SWIPE TOWARDS THE GOAL
        </Text>

        <Text
          style={styles.helpSub}
        >
          LONG SWIPE = POWER • SIDE MOVEMENT = CURVE
        </Text>
      </View>

    </SafeAreaView>
  );
}

// ============================================================
// STAT COMPONENT
// ============================================================

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <View
      style={styles.stat}
    >
      <Text
        style={styles.statLabel}
      >
        {label}
      </Text>

      <View
        style={styles.statBar}
      >
        <View
          style={[
            styles.statFill,
            {
              width:
                `${value}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#061008',
  },

  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  lobbyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 70,
  },

  backArrow: {
    color: '#fff',
    fontSize: 34,
  },

  lobbyText: {
    color: '#a5b3a8',
    fontSize: 9,
    fontWeight: '900',
  },

  titleBox: {
    alignItems: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
  },

  subtitle: {
    color: '#657769',
    fontSize: 8,
    marginTop: 3,
    fontWeight: 'bold',
  },

  currencyBox: {
    alignItems: 'flex-end',
  },

  currency: {
    color: '#f4c542',
    fontSize: 11,
    fontWeight: '900',
  },

  xp: {
    color: '#74b9ff',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 2,
  },

  scoreboard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },

  card: {
    width: '30%',
    backgroundColor: '#101b12',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a4930',
    alignItems: 'center',
    paddingVertical: 8,
  },

  cardLabel: {
    color: '#809181',
    fontSize: 8,
    fontWeight: 'bold',
  },

  cardValue: {
    color: '#fff',
    fontSize: 23,
    fontWeight: '900',
    marginTop: 2,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    marginTop: 8,
  },

  stat: {
    flex: 1,
  },

  statLabel: {
    color: '#728273',
    fontSize: 7,
    fontWeight: 'bold',
    marginBottom: 3,
  },

  statBar: {
    height: 4,
    backgroundColor: '#1b2a1e',
    borderRadius: 5,
    overflow: 'hidden',
  },

  statFill: {
    height: '100%',
    backgroundColor: '#48bd68',
  },

  camera: {
    flex: 1,
    marginHorizontal: 13,
    marginTop: 8,
    marginBottom: 6,
  },

  field: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#126329',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  fieldGlow: {
    position: 'absolute',
    width: '160%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.025)',
    transform: [
      {
        rotate: '10deg',
      },
    ],
  },

  centerLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    top: '52%',
    backgroundColor:
      'rgba(255,255,255,0.15)',
  },

  penaltyArea: {
    position: 'absolute',
    top: -1,
    width: '72%',
    height: 180,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor:
      'rgba(255,255,255,0.65)',
  },

  stadiumTop: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(0,0,0,0.25)',
  },

  stadiumText: {
    color: '#e9f2e9',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  goal: {
    position: 'absolute',
    top: 22,
    width: '72%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },

  goalEmoji: {
    fontSize: 75,
    opacity: 0.95,
  },

  targetGrid: {
    position: 'absolute',
    top: 23,
    width: '92%',
    height: 100,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  targetZone: {
    width: '33.33%',
    height: '33.33%',
    borderWidth: 0.5,
    borderColor:
      'rgba(255,255,255,0.12)',
  },

  keeper: {
    position: 'absolute',
    top: 57,
    fontSize: 53,
    zIndex: 10,
  },

  messageBox: {
    position: 'absolute',
    top: 185,
    alignItems: 'center',
    paddingHorizontal: 17,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor:
      'rgba(0,0,0,0.68)',
  },

  message: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },

  perfect: {
    color: '#ffd43b',
  },

  save: {
    color: '#72b7ff',
  },

  subMessage: {
    color: '#9cab9e',
    fontSize: 9,
    marginTop: 3,
  },

  aim: {
    position: 'absolute',
    top: '43%',
    alignItems: 'center',
    opacity: 0.55,
  },

  arrows: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '900',
  },

  aimText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
    marginVertical: 4,
    letterSpacing: 1,
  },

  ball: {
    position: 'absolute',
    bottom: 96,
    zIndex: 30,
  },

  ballEmoji: {
    fontSize: 43,
  },

  player: {
    position: 'absolute',
    bottom: 14,
    fontSize: 58,
  },

  powerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 4,
  },

  powerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  powerLabel: {
    color: '#778879',
    fontSize: 8,
    fontWeight: 'bold',
  },

  powerValue: {
    color: '#f4c542',
    fontSize: 10,
    fontWeight: '900',
  },

  powerBar: {
    height: 7,
    backgroundColor: '#1b291e',
    borderRadius: 10,
    overflow: 'hidden',
  },

  powerFill: {
    height: '100%',
    backgroundColor: '#f4c542',
  },

  help: {
    alignItems: 'center',
    paddingVertical: 8,
  },

  helpMain: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
  },

  helpSub: {
    color: '#657668',
    fontSize: 7,
    marginTop: 3,
    fontWeight: 'bold',
  },
});