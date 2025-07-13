import tinycolor from "tinycolor2";

export type HarmonyType =
    | "analogous"
    | "triadic"
    | "complementary"
    | "monochromatic"
    | "splitComplement";

/**
 * Generates a random 5-color palette
 */
export function generateRandomPalette(): string[] {
    const colors: string[] = [];

    for (let i = 0; i < 5; i++) {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 50) + 50; // 50-100%
        const lightness = Math.floor(Math.random() * 40) + 30; // 30-70%

        const color = tinycolor({ h: hue, s: saturation, l: lightness });
        colors.push(color.toHexString());
    }

    return colors;
}

/**
 * Generates a 5-color palette based on a seed color and harmony type
 */
export function generateHarmonyPalette(
    seedColor: string,
    harmony: HarmonyType
): string[] {
    const baseColor = tinycolor(seedColor);

    if (!baseColor.isValid()) {
        throw new Error("Invalid seed color provided");
    }

    // Remove unused variable declaration

    switch (harmony) {
        case "analogous":
            return generateAnalogousPalette(baseColor);

        case "triadic":
            return generateTriadicPalette(baseColor);

        case "complementary":
            return generateComplementaryPalette(baseColor);

        case "monochromatic":
            return generateMonochromaticPalette(baseColor);

        case "splitComplement":
            return generateSplitComplementPalette(baseColor);

        default:
            return generateAnalogousPalette(baseColor);
    }
}

/**
 * Generates an analogous color palette (colors next to each other on the color wheel)
 */
function generateAnalogousPalette(baseColor: tinycolor.Instance): string[] {
    const hsl = baseColor.toHsl();
    const colors: string[] = [];

    // Generate 5 colors with hue variations of ±30 degrees
    const hueOffsets = [-30, -15, 0, 15, 30];

    hueOffsets.forEach((offset) => {
        const newHue = (hsl.h + offset + 360) % 360;
        const color = tinycolor({
            h: newHue,
            s: hsl.s,
            l: Math.max(
                0.2,
                Math.min(0.8, hsl.l + (Math.random() - 0.5) * 0.2)
            ),
        });
        colors.push(color.toHexString());
    });

    return colors;
}

/**
 * Generates a triadic color palette (3 colors equally spaced on the color wheel)
 */
function generateTriadicPalette(baseColor: tinycolor.Instance): string[] {
    const hsl = baseColor.toHsl();
    const colors: string[] = [];

    // Base color
    colors.push(baseColor.toHexString());

    // Two triadic colors (120 degrees apart)
    const triadic1 = tinycolor({
        h: (hsl.h + 120) % 360,
        s: hsl.s,
        l: hsl.l,
    });
    colors.push(triadic1.toHexString());

    const triadic2 = tinycolor({
        h: (hsl.h + 240) % 360,
        s: hsl.s,
        l: hsl.l,
    });
    colors.push(triadic2.toHexString());

    // Add two more variations
    const variation1 = tinycolor({
        h: hsl.h,
        s: Math.max(0.3, hsl.s - 0.2),
        l: Math.max(0.2, hsl.l - 0.2),
    });
    colors.push(variation1.toHexString());

    const variation2 = tinycolor({
        h: (hsl.h + 120) % 360,
        s: Math.min(1, hsl.s + 0.2),
        l: Math.min(0.8, hsl.l + 0.2),
    });
    colors.push(variation2.toHexString());

    return colors;
}

/**
 * Generates a complementary color palette
 */
function generateComplementaryPalette(baseColor: tinycolor.Instance): string[] {
    const hsl = baseColor.toHsl();
    const colors: string[] = [];

    // Base color
    colors.push(baseColor.toHexString());

    // Complementary color (180 degrees opposite)
    const complement = tinycolor({
        h: (hsl.h + 180) % 360,
        s: hsl.s,
        l: hsl.l,
    });
    colors.push(complement.toHexString());

    // Add variations of both colors
    const baseVariation1 = tinycolor({
        h: hsl.h,
        s: Math.max(0.3, hsl.s - 0.3),
        l: Math.max(0.2, hsl.l - 0.2),
    });
    colors.push(baseVariation1.toHexString());

    const baseVariation2 = tinycolor({
        h: hsl.h,
        s: Math.min(1, hsl.s + 0.2),
        l: Math.min(0.8, hsl.l + 0.3),
    });
    colors.push(baseVariation2.toHexString());

    const complementVariation = tinycolor({
        h: (hsl.h + 180) % 360,
        s: Math.max(0.4, hsl.s - 0.2),
        l: Math.max(0.3, hsl.l - 0.1),
    });
    colors.push(complementVariation.toHexString());

    return colors;
}

/**
 * Generates a monochromatic color palette (variations of the same hue)
 */
function generateMonochromaticPalette(baseColor: tinycolor.Instance): string[] {
    const hsl = baseColor.toHsl();
    const colors: string[] = [];

    // Generate 5 variations with different saturation and lightness
    const variations = [
        { s: Math.max(0.2, hsl.s - 0.4), l: Math.max(0.1, hsl.l - 0.3) },
        { s: Math.max(0.3, hsl.s - 0.2), l: Math.max(0.2, hsl.l - 0.1) },
        { s: hsl.s, l: hsl.l }, // Original
        { s: Math.min(1, hsl.s + 0.1), l: Math.min(0.8, hsl.l + 0.2) },
        { s: Math.min(1, hsl.s + 0.2), l: Math.min(0.9, hsl.l + 0.3) },
    ];

    variations.forEach((variation) => {
        const color = tinycolor({
            h: hsl.h,
            s: variation.s,
            l: variation.l,
        });
        colors.push(color.toHexString());
    });

    return colors;
}

/**
 * Generates a split-complementary color palette
 */
function generateSplitComplementPalette(
    baseColor: tinycolor.Instance
): string[] {
    const hsl = baseColor.toHsl();
    const colors: string[] = [];

    // Base color
    colors.push(baseColor.toHexString());

    // Split-complementary colors (150 and 210 degrees from base)
    const splitComp1 = tinycolor({
        h: (hsl.h + 150) % 360,
        s: hsl.s,
        l: hsl.l,
    });
    colors.push(splitComp1.toHexString());

    const splitComp2 = tinycolor({
        h: (hsl.h + 210) % 360,
        s: hsl.s,
        l: hsl.l,
    });
    colors.push(splitComp2.toHexString());

    // Add two more variations
    const variation1 = tinycolor({
        h: hsl.h,
        s: Math.max(0.3, hsl.s - 0.2),
        l: Math.min(0.8, hsl.l + 0.2),
    });
    colors.push(variation1.toHexString());

    const variation2 = tinycolor({
        h: (hsl.h + 150) % 360,
        s: Math.max(0.4, hsl.s - 0.1),
        l: Math.max(0.3, hsl.l - 0.2),
    });
    colors.push(variation2.toHexString());

    return colors;
}

/**
 * Validates if a string is a valid hex color
 */
export function isValidHexColor(color: string): boolean {
    return tinycolor(color).isValid();
}

/**
 * Converts any color format to hex
 */
export function toHexColor(color: string): string {
    const tc = tinycolor(color);
    return tc.isValid() ? tc.toHexString() : "#000000";
}
