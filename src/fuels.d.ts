export declare type FuelTypes = "C-1" | "C-2" | "C-3" | "C-4" | "C-5" | "C-6" | "C-7" | "D-1" | "D-2" | "D-1/D-2" | "M-1" | "M-2" | "M-1/M-2" | "M-3" | "M-4" | "M-3/M-4" | "O-1a" | "O-1b" | "O-1AB" | "S-1" | "S-2" | "S-3" | "Non" | "Non-Fuel" | "NZ-2" | "NZ-15" | "NZ-30" | "NZ-31" | "NZ-32" | "NZ-33" | "NZ-40" | "NZ-41" | "NZ-43" | "NZ-44" | "NZ-45" | "NZ-46" | "NZ-47" | "NZ-50" | "NZ-51" | "NZ-52" | "NZ-53" | "NZ-54" | "NZ-55" | "NZ-56" | "NZ-57" | "NZ-58" | "NZ-60" | "NZ-61" | "NZ-62" | "NZ-63" | "NZ-64" | "NZ-65" | "NZ-66" | "NZ-67" | "NZ-68" | "NZ-69" | "NZ-70" | "NZ-71";
export interface SpreadAttribute {
    stream(): string;
}
export interface FmcAttribute {
    stream(): string;
}
export interface SfcAttribute {
    stream(): string;
}
export interface RsiAttribute {
    stream(): string;
}
export interface IsfAttribute {
    stream(): string;
}
export interface AccAlphaAttribute {
    stream(): string;
}
export interface LbAttribute {
    stream(): string;
}
export interface CfbAttribute {
    stream(): string;
}
export interface FlameLengthAttribute {
    stream(): string;
}
/**
 * Spread parameters for the S-1, S-2, S-3, and NZ-64 fuel types.
 */
export declare class S1Spread implements SpreadAttribute {
    a: number;
    b: number;
    c: number;
    q: number;
    bui0: number;
    maxBe: number;
    constructor(init?: Partial<S1Spread>);
    stream(): string;
}
/**
 * Spread parameters for the C-1, C-2, C-3, C-4, C-5, C-7, and NZ-70 fuel types.
 */
export declare class C1Spread implements SpreadAttribute {
    a: number;
    b: number;
    c: number;
    q: number;
    bui0: number;
    maxBe: number;
    height: number;
    cbh: number;
    cfl: number;
    constructor(init?: Partial<C1Spread>);
    stream(): string;
}
/**
 * Spread parameter for the C-6, NZ-60, NZ-61, NZ-66, NZ-67, and NZ-71 fuel types.
 */
export declare class C6Spread implements SpreadAttribute {
    a: number;
    b: number;
    c: number;
    q: number;
    bui0: number;
    maxBe: number;
    height: number;
    cbh: number;
    cfl: number;
    constructor(init?: Partial<C6Spread>);
    stream(): string;
}
/**
 * Spread parameter for the D-1, D-2, D-1/D-2, and NZ-68 fuel types.
 */
export declare class D1Spread implements SpreadAttribute {
    a: number;
    b: number;
    c: number;
    q: number;
    bui0: number;
    maxBe: number;
    height: number;
    cbh: number;
    cfl: number;
    constructor(init?: Partial<D1Spread>);
    stream(): string;
}
/**
 * Spread parameter for the NZ-45, NZ-47, NZ-51, NZ-52, NZ-55, NZ-56, NZ-57, and NZ-58 fuel types.
 */
export declare class NzSpread implements SpreadAttribute {
    a: number;
    b: number;
    c: number;
    q: number;
    bui0: number;
    maxBe: number;
    height: number;
    cbh: number;
    cfl: number;
    constructor(init?: Partial<NzSpread>);
    stream(): string;
}
/**
 * Spread parameter for the O-1a, O-1b, NZ-2, NZ-15, NZ-30, NZ-31, NZ-32, NZ-33, NZ-40, NZ-41, NZ-43, NZ-44, NZ-46,
 * NZ-50, NZ-53, NZ-62, NZ-63, and NZ-65 fuel types.
 */
export declare class O1Spread implements SpreadAttribute {
    a: number;
    b: number;
    c: number;
    q: number;
    bui0: number;
    maxBe: number;
    curingDegree: number;
    constructor(init?: Partial<O1Spread>);
    stream(): string;
}
/**
 * Spread parameter for the O-1AB fuel type.
 */
export declare class O1abSpread implements SpreadAttribute {
    a: number;
    b: number;
    c: number;
    q: number;
    bui0: number;
    maxBe: number;
    curingDegree: number;
    o1AbStandingA: number;
    o1AbStandingB: number;
    o1AbStandingC: number;
    constructor(init?: Partial<O1abSpread>);
    stream(): string;
}
/**
 * Spread parameter for non fuel types.
 */
export declare class NonSpread implements SpreadAttribute {
    constructor(init?: Partial<NonSpread>);
    stream(): string;
}
/**
 * Spread parameter for the M-1, M-2, M-1/M-2, NZ-54, and NZ-69 fuel types.
 */
export declare class MixedSpread implements SpreadAttribute {
    q: number;
    bui0: number;
    maxBe: number;
    height: number;
    cbh: number;
    cfl: number;
    pc: number;
    C2: FuelDefinition;
    D1: FuelDefinition;
    constructor(init?: Partial<MixedSpread>);
    stream(): string;
}
/**
 * Spread parameter for the M-3, M-4, and M-3/M-4 fuel types.
 */
export declare class MixedDeadSpread implements SpreadAttribute {
    q: number;
    bui0: number;
    maxBe: number;
    height: number;
    cbh: number;
    cfl: number;
    pdf: number;
    C2: FuelDefinition;
    D1: FuelDefinition;
    constructor(init?: Partial<MixedDeadSpread>);
    stream(): string;
}
/**
 * FMC calculation parameters for the C-1, C-2, C-3, C-4, C-5, C-6, C-7, M-1, M-2, M-1/M-2, M-3, M-4, M-3/M-4, NZ-45,
 * NZ-47, NZ-51, NZ-52, NZ-54, NZ-55, NZ-56, NZ-57, NZ-58, NZ-60, NZ-61, NZ-66, NZ-67, NZ-69, NZ-70, and NZ-71 fuel types.
 */
export declare class FmcCalc implements FmcAttribute {
    day0: number;
    constructor(init?: Partial<FmcCalc>);
    stream(): string;
}
/**
 * FMC calculation parameters for the D-1, D-2, D-1/D-2, O-1a, O-1b, O-1AB, S-1, S-2, S-3, Non, NZ-2, NZ-15, NZ-30, NZ-31,
 * NZ-32, NZ-33, NZ-40, NZ-41, NZ-43, NZ-44, NZ-46, NZ-50, NZ-53, NZ-62, NZ-63, NZ-64, NZ-65, and NZ-68 fuel types.
 */
export declare class FmcNoCalc implements FmcAttribute {
    constructor(init?: Partial<FmcNoCalc>);
    stream(): string;
}
/**
 * SFC calculation parameters for the C-1 and Non fuel types.
 */
export declare class C1Sfc implements SfcAttribute {
    p1: number;
    p2: number;
    p3: number;
    p4: number;
    multiplier: number;
    constructor(init?: Partial<C1Sfc>);
    stream(): string;
}
/**
 * SFC calculation parameters for the C-2, C-3, C-4, C-5, C-6, D-1, D-1/D-2, M-3, M-4, M-3/M-4, NZ-54, NZ-60,
 * NZ-61, NZ-67, NZ-68, and NZ-69 fuel types.
 */
export declare class C2Sfc implements SfcAttribute {
    p1: number;
    p2: number;
    power: number;
    multiplier: number;
    constructor(init?: Partial<C2Sfc>);
    stream(): string;
}
/**
 * SFC calculation parameters for the C-7 fuel type.
 */
export declare class C7Sfc implements SfcAttribute {
    p1F: number;
    p2F: number;
    p3F: number;
    p1W: number;
    p2W: number;
    ffcMultiplier: number;
    wfcMultiplier: number;
    sfcMultiplier: number;
    constructor(init?: Partial<C7Sfc>);
    stream(): string;
}
/**
 * SFC calculation parameters for the D-2 and D-1/D-2 fuel types.
 */
export declare class D2Sfc implements SfcAttribute {
    p1: number;
    p2: number;
    power: number;
    multiplier: number;
    threshold: number;
    scale1: number;
    scale2: number;
    constructor(init?: Partial<D2Sfc>);
    stream(): string;
}
/**
 * SFC calculation parameters for the M-1, M-2, and M-1/M-2 fuel types.
 */
export declare class M1Sfc implements SfcAttribute {
    constructor(init?: Partial<M1Sfc>);
    stream(): string;
}
/**
 * SFC calculation parameters for the O-1a, O-1b, O-1AB, NZ-2, NZ-15, NZ-30, NZ-31, NZ-32, NZ-33, NZ-40, NZ-41, NZ-43, NZ-44,
 * NZ-45, NZ-46, NZ-47, NZ-50, NZ-51, NZ-52, NZ-53, NZ-55, NZ-56, NZ-57, NZ-58, NZ-62, and NZ-70 fuel types.
 */
export declare class O1Sfc implements SfcAttribute {
    fuelLoad: number;
    constructor(init?: Partial<O1Sfc>);
    stream(): string;
}
/**
 * SFC calculation parameters for the S-1, S-2, S-3, NZ-63, NZ-64, NZ-65, NZ-66, and NZ-71 fuel types.
 */
export declare class S1Sfc implements SfcAttribute {
    p1F: number;
    p2F: number;
    p1W: number;
    p2W: number;
    ffcMultiplier: number;
    wfcMultiplier: number;
    sfcMultiplier: number;
    ffcBuiMultiplier: number;
    wfcBuiMultiplier: number;
    constructor(init?: Partial<S1Sfc>);
    stream(): string;
}
/**
 * RSI calculation parameters for the C-1, C-2, C-3, C-4, C-5, C-7, D-1, D-1/D-2, S-1, S-2, S-3, Non,
 * NZ-45, NZ-47, NZ-51, NZ-52, NZ-55, NZ-56, NZ-57, NZ-58, NZ-64, and NZ-68 fuel types.
 */
export declare class C1Rsi implements RsiAttribute {
    constructor(init?: Partial<C1Rsi>);
    stream(): string;
}
/**
 * RSI calculation parameters for the C-6, NZ-60, NZ-61, NZ-66, NZ-67, and NZ-71 fuel types.
 */
export declare class C6Rsi implements RsiAttribute {
    fmeMultiplier: number;
    fmePowAdder: number;
    fmePowMultiplier: number;
    fmeDivAdder: number;
    fmeDivMultiplier: number;
    fmePower: number;
    rscMultiplier: number;
    rscExpMultiplier: number;
    fmeAvg: number;
    constructor(init?: Partial<C6Rsi>);
    stream(): string;
}
/**
 * RSI calculation parameters for the D-2 and D-1/D-2 fuel types.
 */
export declare class D2Rsi implements RsiAttribute {
    threshold: number;
    scale1: number;
    scale2: number;
    constructor(init?: Partial<D2Rsi>);
    stream(): string;
}
/**
 * RSI calculation parameters for the M-1, M-2, M-1/M-2, NZ-54, and NZ-69 fuel types.
 */
export declare class M1Rsi implements RsiAttribute {
    p1: number;
    constructor(init?: Partial<M1Rsi>);
    stream(): string;
}
/**
 * RSI calculation parameters for the M-3 and M-3/M-4 (non-greenup) fuel types.
 */
export declare class M3Rsi implements RsiAttribute {
    a: number;
    b: number;
    c: number;
    p: number;
    constructor(init?: Partial<M3Rsi>);
    stream(): string;
}
/**
 * RSI calculation parameters for the M-4 and M-3/M-4 (greenup) fuel types.
 */
export declare class M4Rsi implements RsiAttribute {
    a: number;
    b: number;
    c: number;
    d1A: number;
    d1B: number;
    d1C: number;
    p: number;
    constructor(init?: Partial<M4Rsi>);
    stream(): string;
}
/**
 * RSI calculation parameters for the O-1a, O-1b, O-1AB, NZ-2, NZ-15, NZ-30, NZ-31, NZ-32, NZ-33, NZ-40, NZ-41, NZ-43,
 * NZ-44, NZ-46, NZ-50, NZ-53, NZ-62, NZ-63, and NZ-65 fuel types.
 */
export declare class O1Rsi implements RsiAttribute {
    threshold: number;
    f1: number;
    f2: number;
    f3: number;
    f4: number;
    constructor(init?: Partial<O1Rsi>);
    stream(): string;
}
/**
 * RSI calculation parameters for the NZ-70 fuel type.
 */
export declare class ConstantRsi implements RsiAttribute {
    rsi: number;
    constructor(init?: Partial<ConstantRsi>);
    stream(): string;
}
/**
 * ISF calculation parameters for the C-1, C-2, C-3, C-4, C-5, C-6, C-7, D-1, D-2, D-1/D-2, S-1, S-2, S-3,
 * Non, NZ-45, NZ-47, NZ-51, NZ-52, NZ-55, NZ-56, NZ-57, NZ-58, NZ-60, NZ-61, NZ-64, NZ-66, NZ-67, NZ-68, NZ-70, and NZ-71 fuel types.
 */
export declare class C1Isf implements IsfAttribute {
    constructor(init?: Partial<C1Isf>);
    stream(): string;
}
/**
 * ISF calculation parameters for the M-1, M-2, M-1/M-2, NZ-54, and NZ-69 fuel types.
 */
export declare class M1Isf implements IsfAttribute {
    constructor(init?: Partial<M1Isf>);
    stream(): string;
}
/**
 * ISF calculation parameters for the M-3, M-4, and M-3/M-4 fuel types.
 */
export declare class M3M4Isf implements IsfAttribute {
    a: number;
    b: number;
    c: number;
    constructor(init?: Partial<M3M4Isf>);
    stream(): string;
}
/**
 * ISF calculation parameters for the O-1a, O-1b, O-1AB, NZ-2, NZ-15, NZ-30, NZ-31, NZ-32, NZ-33, NZ-40, NZ-41,
 * NZ-43, NZ-44, NZ-46, NZ-50, NZ-53, NZ-62, NZ-63, and NZ-65 fuel types.
 */
export declare class O1Isf implements IsfAttribute {
    threshold: number;
    f1: number;
    f2: number;
    f3: number;
    f4: number;
    constructor(init?: Partial<O1Isf>);
    stream(): string;
}
/**
 * ISF calculation parameters for the C-2, C-3, C-4, C-5, C-6, C-7, D-1, D-2, D-1/D-2, M-1, M-2, M-1/M-2, M-3, M-4, M-3/M-4,
 * NZ-45, NZ-47, NZ-51, NZ-52, NZ-54, NZ-55, NZ-56, NZ-57, NZ-58, NZ-60, NZ-61, NZ-66, NZ-67, NZ-68, NZ-69, and NZ-71 fuel types.
 */
export declare class ClosedAccAlpha implements AccAlphaAttribute {
    init: number;
    multiplier: number;
    power: number;
    expMultiplier: number;
    constructor(init?: Partial<ClosedAccAlpha>);
    stream(): string;
}
/**
 * ISF calculation parameters for the C-1, O-1a, O-1b, O-1AB, S-1, S-2, S-3, Non, NZ-2, NZ-15, NZ-30, NZ-31,
 * NZ-32, NZ-33, NZ-40, NZ-41, NZ-43, NZ-44, NZ-46, NZ-50, NZ-53, NZ-62, NZ-63, NZ-64, NZ-65, and NZ-70 fuel types.
 */
export declare class OpenAccAlpha implements AccAlphaAttribute {
    init: number;
    constructor(init?: Partial<OpenAccAlpha>);
    stream(): string;
}
/**
 * ISF calculation parameters for the C-1, C-2, C-3, C-4, C-5, C-6, C-7, D-1, D-2, D-1/D-2, M-1, M-2, M-1/M-2, M-3, M-4, M-3/M-4, S-1, S-2, S-3,
 * Non, NZ-45, NZ-47, NZ-51, NZ-52, NZ-54, NZ-55, NZ-56, NZ-57, NZ-58, NZ-60, NZ-61, NZ-64, NZ-66, NZ-67, NZ-68, NZ-69, NZ-70, and NZ-71 fuel types.
 */
export declare class C1Lb implements LbAttribute {
    init: number;
    multiplier: number;
    expMultiplier: number;
    power: number;
    constructor(init?: Partial<C1Lb>);
    stream(): string;
}
/**
 * ISF calculation parameters for the O-1a, O-1b, O-1AB, NZ-2, NZ-15, NZ-30, NZ-31,
 * NZ-32, NZ-33, NZ-40, NZ-41, NZ-43, NZ-44, NZ-46, NZ-50, NZ-53, NZ-62, NZ-63, and NZ-65 fuel types.
 */
export declare class O1Lb implements LbAttribute {
    init: number;
    power: number;
    constructor(init?: Partial<O1Lb>);
    stream(): string;
}
/**
 * ISF calculation parameters for the C-1, C-2, C-3, C-4, C-5, C-6, C-7, D-1, D-1/D-2 (non-greenup), M-1, M-2, M-1/M-2,
 * M-3, M-4, M-3/M-4, O-1a, O-1b, O-1AB, S-1, S-2, S-3, Non, NZ-2, NZ-15, NZ-30, NZ-31, NZ-32, NZ-33, NZ-40, NZ-41,
 * NZ-43, NZ-44, NZ-45, NZ-46, NZ-47, NZ-50, NZ-51, NZ-52, NZ-53, NZ-54, NZ-55, NZ-56, NZ-57, NZ-58, NZ-60, NZ-61,
 * NZ-62, NZ-63, NZ-64, NZ-65, NZ-66, NZ-67, NZ-68, NZ-69, NZ-70, and NZ-71 fuel types.
 */
export declare class C1Cfb implements CfbAttribute {
    csiMultiplier: number;
    csiCbhExponent: number;
    csiExpAdder: number;
    csiExpMultiplier: number;
    csiPower: number;
    rsoDiv: number;
    cfbExp: number;
    cfbPossible: boolean;
    constructor(init?: Partial<C1Cfb>);
    stream(): string;
}
/**
 * ISF calculation parameters for the D-2 and D-1/D-2 (greenup) fuel types.
 */
export declare class D2Cfb implements CfbAttribute {
    constructor(init?: Partial<D2Cfb>);
    stream(): string;
}
/**
 * Flame length calculation parameters for the O-1a, O-1b, O-1AB, S-1, S-2, S-3, Non, NZ-2, NZ-15, NZ-30,
 * NZ-31, NZ-32, NZ-33, NZ-40, NZ-41, NZ-43, NZ-44, NZ-46, NZ-50, NZ-53, NZ-62, NZ-63, NZ-64, and NZ-65 fuel types.
 */
export declare class Alexander82FlameLength implements FlameLengthAttribute {
    p1: number;
    p2: number;
    constructor(init?: Partial<Alexander82FlameLength>);
    stream(): string;
}
/**
 * Flame length calculation parameters for the C-1, C-2, C-3, C-4, C-5, C-6, C-7, D-1, D-2, D-1/D-2, M-1, M-2, M-1/M-2,
 * M-3, M-4, M-3/M-4, NZ-45, NZ-47, NZ-51, NZ-52, NZ-54, NZ-55, NZ-56, NZ-57, NZ-58, NZ-60, NZ-61, NZ-66, NZ-67, NZ-68,
 * NZ-69, NZ-70, and NZ-71 fuel types.
 */
export declare class Alexander82TreeFlameLength implements FlameLengthAttribute {
    p1: number;
    p2: number;
    cfb: number;
    th: number;
    constructor(init?: Partial<Alexander82TreeFlameLength>);
    stream(): string;
}
export interface Color {
    stream(): string;
}
/**
 * A color defined by red, green, and blue.
 */
export declare class RGBColor implements Color {
    /**
     * The red component of the color as an integer in [0, 255].
     */
    red: number;
    /**
     * The green component of the color as an integer in [0, 255].
     */
    green: number;
    /**
     * The blue component of the color as an integer in [0, 255].
     */
    blue: number;
    constructor(init?: Partial<RGBColor>);
    stream(): string;
}
/**
 * A color defined by hue, saturation, and luminance.
 */
export declare class HSLColor implements Color {
    /**
     * The hue of the color as an integer in [0, 255].
     */
    hue: number;
    /**
     * The saturation of the color as an integer in [0, 255].
     */
    saturation: number;
    /**
     * The luminance of the color as an integer in [0, 255].
     */
    luminance: number;
    constructor(init?: Partial<HSLColor>);
    stream(): string;
}
/**
 * The definition for a fuel type. Can be constructed from any combination of parameters,
 * even if potentially not valid for a real fuel type.
 */
export declare class FuelDefinition {
    /**
     * The name of the of the default fuel type that will be used to fill in
     * any unspecified parameters.
     */
    defaultFuel: FuelTypes;
    /**
     * The user specified name for the fuel. If not present the value in {@link defaultName}
     * will be used.
     */
    name: string;
    /**
     * A grid index code that will link this fuel type to a value in the fuel map.
     */
    index: number;
    /**
     * A color to use to display the fuel if the created FGM were to be opened in Prometheus.
     * Can be either an {@link RGBColor} or an {@link HSLColor}.
     */
    color: Color;
    /**
     * The spread parameters for the fuel being defined. Can be one of {@link C1Spread},
     * {@link C6Spread}, {@link S1Spread}, {@link D1Spread}, {@link NzSpread},
     * {@link O1Spread}, {@link O1abSpread}, {@link NonSpread}, {@link MixedSpread},
     * or {@link MixedDead}.
     */
    spreadParms: SpreadAttribute;
    /**
     * The FMC calculation parameters for the fuel being defined. Can be one of {@link FmcCalc}
     * or {@link FmcNoCalc}.
     */
    fmcAttribute: FmcAttribute;
    /**
     * The SFC calculation parameters for the fuel being defined. Can be one of {@link C1Sfc},
     * {@link C2Sfc}, {@link C7Sfc}, {@link D2Sfc}, {@link M1Sfc}, {@link O1Sfc}, or {@link S1Sfc}.
     */
    sfcAttribute: SfcAttribute;
    /**
     * The SFC calculation parameters during greenup for the fuel being defined. Can be one of {@link C1Sfc},
     * {@link C2Sfc}, {@link C7Sfc}, {@link D2Sfc}, {@link M1Sfc}, {@link O1Sfc}, or {@link S1Sfc}.
     */
    sfcGreenupAttribute: SfcAttribute;
    /**
     * The RSI calculation parameters for the fuel being defined. Can be one of {@link C1Rsi},
     * {@link C6Rsi}, {@link D2Rsi}, {@link M1Rsi}, {@link M3Rsi}, {@link M4Rsi}, {@link O1Rsi}, or {@link ConstantRsi}.
     */
    rsiAttribute: RsiAttribute;
    /**
     * The RSI calculation parameters during greenup for the fuel being defined. Can be one of {@link C1Rsi},
     * {@link C6Rsi}, {@link D2Rsi}, {@link M1Rsi}, {@link M3Rsi}, {@link M4Rsi}, {@link O1Rsi}, or {@link ConstantRsi}.
     */
    rsiGreenupAttribute: RsiAttribute;
    /**
     * The ISF calculation parameters for the fuel being defined. Can be one of {@link C1Isf},
     * {@link M1Isf}, {@link M3M4Isf}, or {@link O1Isf}.
     */
    isfAttribute: IsfAttribute;
    /**
     * The ISF calculation parameters during greenup for the fuel being defined. Can be one of {@link C1Isf},
     * {@link M1Isf}, {@link M3M4Isf}, or {@link O1Isf}.
     */
    isfGreenupAttribute: IsfAttribute;
    /**
     * The Acc Alpha calculation parameters for the fuel being defined. Can be one of {@link OpenAccAlpha} or {@link ClosedAccAlpha}.
     */
    accAlphaAttribute: AccAlphaAttribute;
    /**
     * The LB calculation parameters for the fuel being defined. Can be one of {@link C1Lb} or {@link O1Lb}.
     */
    lbAttribute: LbAttribute;
    /**
     * The CFB calculation parameters for the fuel being defined. Can be one of {@link C1Cfb} or {@link D2Cfb}.
     */
    cfbAttribute: CfbAttribute;
    /**
     * The CFB calculation parameters during greenup for the fuel being defined. Can be one of {@link C1Cfb} or {@link D2Cfb}.
     */
    cfbGreenupAttribute: CfbAttribute;
    /**
     * The flame length calculation parameters for the fuel being defined. Can be one of {@link Alexander82FlameLength}
     * or {@link OtherFlameLength}.
     */
    flameLengthAttribute: FlameLengthAttribute;
    constructor(name: string, defaultFuel: FuelTypes, index: number);
    toString(): string;
}
