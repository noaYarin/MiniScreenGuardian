import { StyleSheet } from 'react-native';
import { APP_COLORS, COLORS, SIZES } from '../../../../constants/theme';

const SPACING_XS = 8;
const SPACING_SM = 12;
const SPACING_MD = 16;
const BUTTON_RADIUS = 8;
const BUTTON_PADDING_VERTICAL = 10;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    gap: SPACING_XS,
    backgroundColor: APP_COLORS.beige,
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: 'bold',
    marginBottom: SPACING_XS,
  },
  subtitle: {
    fontSize: SIZES.description,
    marginBottom: SPACING_MD,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING_SM,
    marginTop: SPACING_XS,
    alignItems: 'center',
  },
  homeImg: {
    width: SIZES.width,
    height: SIZES.width,
    resizeMode: 'contain',
    marginBottom: SIZES.padding,
  },
  nextButton: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: BUTTON_PADDING_VERTICAL,
    borderRadius: BUTTON_RADIUS,
    backgroundColor: COLORS.light.tint,
  },
  buttonText: {
    fontSize: SIZES.description,
    fontWeight: '600',
    color: COLORS.light.text,
  },
});
