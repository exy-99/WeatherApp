import { Animated as RNAnimated, Image as RNImage, Text as RNText, View as RNView } from 'react-native';

const Easing = {
  ease: t => t,
  out: fn => fn,
};

export const useSharedValue = init => ({ value: init });

export const useAnimatedStyle = factory => factory();

export const useReducedMotion = () => false;

export const withSpring = toValue => toValue;

export const withTiming = (toValue, _config, callback) => {
  if (typeof callback === 'function') {
    callback(true);
  }
  return toValue;
};

export const withDelay = (_delay, animation) => animation;

export const runOnJS = fn => fn;

export const runOnUI = fn => fn;

export { Easing };

const Animated = {
  View: RNView,
  Text: RNText,
  Image: RNImage,
  ScrollView: RNAnimated.ScrollView,
  FlatList: RNAnimated.FlatList,
  createAnimatedComponent: Component => Component,
};

export default Animated;