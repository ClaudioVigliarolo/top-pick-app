interface FontSizes {
  fontSmaller: number;
  fontSmall: number;
  fontSmallMed: number;
  fontMed: number;
  fontBigMed: number;
  fontBig: number;
}

export const staticFontSizes: FontSizes = {
  fontSmaller: 13,
  fontSmall: 15,
  fontSmallMed: 17,
  fontMed: 20,
  fontBigMed: 25,
  fontBig: 30,
};

export enum FontDimension {
  BIGGER = 'bigger',
  BIG = 'big',
  MEDIUM = 'medium',
  SMALL = 'small',
  SMALLER = 'smaller',
}

export const getFontSize = <K extends keyof FontSizes>(
  type: string,
  key: K,
): number => {
  switch (type) {
    case FontDimension.BIGGER:
      return staticFontSizes[key] * 1.3;
    case FontDimension.BIG:
      return staticFontSizes[key] * 1.1;
    case FontDimension.MEDIUM:
      return staticFontSizes[key];
    case FontDimension.SMALL:
      return staticFontSizes[key] * 0.9;
    case FontDimension.SMALLER:
      return staticFontSizes[key] * 0.8;
    default:
      return staticFontSizes[key];
  }
};
