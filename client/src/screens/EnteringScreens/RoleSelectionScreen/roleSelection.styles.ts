import { StyleSheet } from 'react-native';

import { COLORS, Fonts, SIZES } from '../../../../constants/theme';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: SIZES.padding,
    paddingTop: SIZES.padding * 2,
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: '700',
    color: COLORS.light.text,
    fontFamily: Fonts.rounded,
    textAlign: 'center',
  },
  cardsContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: 25,
  },
});