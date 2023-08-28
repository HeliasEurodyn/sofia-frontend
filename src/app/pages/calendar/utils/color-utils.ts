export type UsedColorFuntion = (color: string) => boolean;
export class ColorUtils {

  static getRandomUniqueDarkColor(hasFn: (color: string) => boolean, attempt: number = 0) {
    let color = ColorUtils.getRandomDarkColor();

    if (!hasFn(color) || attempt > 5) {
      return color;
    }

    return ColorUtils.getRandomUniqueDarkColor(hasFn, ++attempt);
  }

  static getRandomDarkColor() {
    let color = '#';
    for (var i = 0; i < 6; i++) {
      color += Math.floor(Math.random() * 10);
    }
    return color;
  }
}
