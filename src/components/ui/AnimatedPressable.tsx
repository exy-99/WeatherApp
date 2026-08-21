import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable) as React.ComponentType<PressableProps> & { displayName: string };

AnimatedPressable.displayName = 'AnimatedPressable';

export default AnimatedPressable;