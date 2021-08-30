"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuelDefinition = exports.HSLColor = exports.RGBColor = exports.Alexander82TreeFlameLength = exports.Alexander82FlameLength = exports.D2Cfb = exports.C1Cfb = exports.O1Lb = exports.C1Lb = exports.OpenAccAlpha = exports.ClosedAccAlpha = exports.O1Isf = exports.M3M4Isf = exports.M1Isf = exports.C1Isf = exports.ConstantRsi = exports.O1Rsi = exports.M4Rsi = exports.M3Rsi = exports.M1Rsi = exports.D2Rsi = exports.C6Rsi = exports.C1Rsi = exports.S1Sfc = exports.O1Sfc = exports.M1Sfc = exports.D2Sfc = exports.C7Sfc = exports.C2Sfc = exports.C1Sfc = exports.FmcNoCalc = exports.FmcCalc = exports.MixedDeadSpread = exports.MixedSpread = exports.NonSpread = exports.O1abSpread = exports.O1Spread = exports.NzSpread = exports.D1Spread = exports.C6Spread = exports.C1Spread = exports.S1Spread = void 0;
/**
 * Spread parameters for the S-1, S-2, S-3, and NZ-64 fuel types.
 */
class S1Spread {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `S1|${this.a}|${this.b}|${this.c}|${this.q}|${this.bui0}|${this.maxBe}`;
    }
}
exports.S1Spread = S1Spread;
/**
 * Spread parameters for the C-1, C-2, C-3, C-4, C-5, C-7, and NZ-70 fuel types.
 */
class C1Spread {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `C1|${this.a}|${this.b}|${this.c}|${this.q}|${this.bui0}|${this.maxBe}|${this.height}|${this.cbh}|${this.cfl}`;
    }
}
exports.C1Spread = C1Spread;
/**
 * Spread parameter for the C-6, NZ-60, NZ-61, NZ-66, NZ-67, and NZ-71 fuel types.
 */
class C6Spread {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `C6|${this.a}|${this.b}|${this.c}|${this.q}|${this.bui0}|${this.maxBe}|${this.height}|${this.cbh}|${this.cfl}`;
    }
}
exports.C6Spread = C6Spread;
/**
 * Spread parameter for the D-1, D-2, D-1/D-2, and NZ-68 fuel types.
 */
class D1Spread {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `D1|${this.a}|${this.b}|${this.c}|${this.q}|${this.bui0}|${this.maxBe}|${this.height}|${this.cbh}|${this.cfl}`;
    }
}
exports.D1Spread = D1Spread;
/**
 * Spread parameter for the NZ-45, NZ-47, NZ-51, NZ-52, NZ-55, NZ-56, NZ-57, and NZ-58 fuel types.
 */
class NzSpread {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `Nz|${this.a}|${this.b}|${this.c}|${this.q}|${this.bui0}|${this.maxBe}|${this.height}|${this.cbh}|${this.cfl}`;
    }
}
exports.NzSpread = NzSpread;
/**
 * Spread parameter for the O-1a, O-1b, NZ-2, NZ-15, NZ-30, NZ-31, NZ-32, NZ-33, NZ-40, NZ-41, NZ-43, NZ-44, NZ-46,
 * NZ-50, NZ-53, NZ-62, NZ-63, and NZ-65 fuel types.
 */
class O1Spread {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `O1|${this.a}|${this.b}|${this.c}|${this.q}|${this.bui0}|${this.maxBe}|${this.curingDegree}`;
    }
}
exports.O1Spread = O1Spread;
/**
 * Spread parameter for the O-1AB fuel type.
 */
class O1abSpread {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `O1ab|${this.a}|${this.b}|${this.c}|${this.q}|${this.bui0}|${this.maxBe}|${this.curingDegree}|${this.o1AbStandingA}|${this.o1AbStandingB}|${this.o1AbStandingC}`;
    }
}
exports.O1abSpread = O1abSpread;
/**
 * Spread parameter for non fuel types.
 */
class NonSpread {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return 'Non';
    }
}
exports.NonSpread = NonSpread;
/**
 * Spread parameter for the M-1, M-2, M-1/M-2, NZ-54, and NZ-69 fuel types.
 */
class MixedSpread {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        let s = `Mix|${this.q}|${this.bui0}|${this.maxBe}|${this.height}|${this.cbh}|${this.cfl}|${this.pc}`;
        if (this.C2 == null) {
            s += '|null';
        }
        else {
            s += `|${this.C2.toString()}`;
        }
        if (this.D1 == null) {
            s += '|null';
        }
        else {
            s += `|${this.D1.toString()}`;
        }
        return s;
    }
}
exports.MixedSpread = MixedSpread;
/**
 * Spread parameter for the M-3, M-4, and M-3/M-4 fuel types.
 */
class MixedDeadSpread {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        let s = `Dead|${this.q}|${this.bui0}|${this.maxBe}|${this.height}|${this.cbh}|${this.cfl}|${this.pdf}`;
        if (this.C2 == null) {
            s += '|null';
        }
        else {
            s += `|${this.C2.toString()}`;
        }
        if (this.D1 == null) {
            s += '|null';
        }
        else {
            s += `|${this.D1.toString()}`;
        }
        return s;
    }
}
exports.MixedDeadSpread = MixedDeadSpread;
/**
 * FMC calculation parameters for the C-1, C-2, C-3, C-4, C-5, C-6, C-7, M-1, M-2, M-1/M-2, M-3, M-4, M-3/M-4, NZ-45,
 * NZ-47, NZ-51, NZ-52, NZ-54, NZ-55, NZ-56, NZ-57, NZ-58, NZ-60, NZ-61, NZ-66, NZ-67, NZ-69, NZ-70, and NZ-71 fuel types.
 */
class FmcCalc {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `Calc|${this.day0}`;
    }
}
exports.FmcCalc = FmcCalc;
/**
 * FMC calculation parameters for the D-1, D-2, D-1/D-2, O-1a, O-1b, O-1AB, S-1, S-2, S-3, Non, NZ-2, NZ-15, NZ-30, NZ-31,
 * NZ-32, NZ-33, NZ-40, NZ-41, NZ-43, NZ-44, NZ-46, NZ-50, NZ-53, NZ-62, NZ-63, NZ-64, NZ-65, and NZ-68 fuel types.
 */
class FmcNoCalc {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return 'No';
    }
}
exports.FmcNoCalc = FmcNoCalc;
/**
 * SFC calculation parameters for the C-1 and Non fuel types.
 */
class C1Sfc {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `C1|${this.p1}|${this.p2}|${this.p3}|${this.p4}|${this.multiplier}`;
    }
}
exports.C1Sfc = C1Sfc;
/**
 * SFC calculation parameters for the C-2, C-3, C-4, C-5, C-6, D-1, D-1/D-2, M-3, M-4, M-3/M-4, NZ-54, NZ-60,
 * NZ-61, NZ-67, NZ-68, and NZ-69 fuel types.
 */
class C2Sfc {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `C2|${this.p1}|${this.p2}|${this.power}|${this.multiplier}`;
    }
}
exports.C2Sfc = C2Sfc;
/**
 * SFC calculation parameters for the C-7 fuel type.
 */
class C7Sfc {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `C7|${this.p1F}|${this.p2F}|${this.p3F}|${this.p1W}|${this.p2W}|${this.ffcMultiplier}|${this.wfcMultiplier}|${this.sfcMultiplier}`;
    }
}
exports.C7Sfc = C7Sfc;
/**
 * SFC calculation parameters for the D-2 and D-1/D-2 fuel types.
 */
class D2Sfc {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `D2|${this.p1}|${this.p2}|${this.power}|${this.multiplier}|${this.threshold}|${this.scale1}|${this.scale2}`;
    }
}
exports.D2Sfc = D2Sfc;
/**
 * SFC calculation parameters for the M-1, M-2, and M-1/M-2 fuel types.
 */
class M1Sfc {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return 'M1';
    }
}
exports.M1Sfc = M1Sfc;
/**
 * SFC calculation parameters for the O-1a, O-1b, O-1AB, NZ-2, NZ-15, NZ-30, NZ-31, NZ-32, NZ-33, NZ-40, NZ-41, NZ-43, NZ-44,
 * NZ-45, NZ-46, NZ-47, NZ-50, NZ-51, NZ-52, NZ-53, NZ-55, NZ-56, NZ-57, NZ-58, NZ-62, and NZ-70 fuel types.
 */
class O1Sfc {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `O1|${this.fuelLoad}`;
    }
}
exports.O1Sfc = O1Sfc;
/**
 * SFC calculation parameters for the S-1, S-2, S-3, NZ-63, NZ-64, NZ-65, NZ-66, and NZ-71 fuel types.
 */
class S1Sfc {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `S1|${this.p1F}|${this.p2F}|${this.p1W}|${this.p2W}|${this.ffcMultiplier}|${this.wfcMultiplier}|${this.sfcMultiplier}|${this.ffcBuiMultiplier}|${this.wfcBuiMultiplier}`;
    }
}
exports.S1Sfc = S1Sfc;
/**
 * RSI calculation parameters for the C-1, C-2, C-3, C-4, C-5, C-7, D-1, D-1/D-2, S-1, S-2, S-3, Non,
 * NZ-45, NZ-47, NZ-51, NZ-52, NZ-55, NZ-56, NZ-57, NZ-58, NZ-64, and NZ-68 fuel types.
 */
class C1Rsi {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return 'C1';
    }
}
exports.C1Rsi = C1Rsi;
/**
 * RSI calculation parameters for the C-6, NZ-60, NZ-61, NZ-66, NZ-67, and NZ-71 fuel types.
 */
class C6Rsi {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `C6|${this.fmeMultiplier}|${this.fmePowAdder}|${this.fmePowMultiplier}|${this.fmeDivAdder}|${this.fmeDivMultiplier}|${this.fmePower}|${this.rscMultiplier}|${this.rscExpMultiplier}|${this.fmeAvg}`;
    }
}
exports.C6Rsi = C6Rsi;
/**
 * RSI calculation parameters for the D-2 and D-1/D-2 fuel types.
 */
class D2Rsi {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `D2|${this.threshold}|${this.scale1}|${this.scale2}`;
    }
}
exports.D2Rsi = D2Rsi;
/**
 * RSI calculation parameters for the M-1, M-2, M-1/M-2, NZ-54, and NZ-69 fuel types.
 */
class M1Rsi {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `M1|${this.p1}`;
    }
}
exports.M1Rsi = M1Rsi;
/**
 * RSI calculation parameters for the M-3 and M-3/M-4 (non-greenup) fuel types.
 */
class M3Rsi {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `M3|${this.a}|${this.b}|${this.c}|${this.p}`;
    }
}
exports.M3Rsi = M3Rsi;
/**
 * RSI calculation parameters for the M-4 and M-3/M-4 (greenup) fuel types.
 */
class M4Rsi {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `M4|${this.a}|${this.b}|${this.c}|${this.d1A}|${this.d1B}|${this.d1C}|${this.p}`;
    }
}
exports.M4Rsi = M4Rsi;
/**
 * RSI calculation parameters for the O-1a, O-1b, O-1AB, NZ-2, NZ-15, NZ-30, NZ-31, NZ-32, NZ-33, NZ-40, NZ-41, NZ-43,
 * NZ-44, NZ-46, NZ-50, NZ-53, NZ-62, NZ-63, and NZ-65 fuel types.
 */
class O1Rsi {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `O1|${this.threshold}|${this.f1}|${this.f2}|${this.f3}|${this.f4}`;
    }
}
exports.O1Rsi = O1Rsi;
/**
 * RSI calculation parameters for the NZ-70 fuel type.
 */
class ConstantRsi {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `Const|${this.rsi}`;
    }
}
exports.ConstantRsi = ConstantRsi;
/**
 * ISF calculation parameters for the C-1, C-2, C-3, C-4, C-5, C-6, C-7, D-1, D-2, D-1/D-2, S-1, S-2, S-3,
 * Non, NZ-45, NZ-47, NZ-51, NZ-52, NZ-55, NZ-56, NZ-57, NZ-58, NZ-60, NZ-61, NZ-64, NZ-66, NZ-67, NZ-68, NZ-70, and NZ-71 fuel types.
 */
class C1Isf {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return 'C1';
    }
}
exports.C1Isf = C1Isf;
/**
 * ISF calculation parameters for the M-1, M-2, M-1/M-2, NZ-54, and NZ-69 fuel types.
 */
class M1Isf {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return 'M1';
    }
}
exports.M1Isf = M1Isf;
/**
 * ISF calculation parameters for the M-3, M-4, and M-3/M-4 fuel types.
 */
class M3M4Isf {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `M3M4|${this.a}|${this.b}|${this.c}`;
    }
}
exports.M3M4Isf = M3M4Isf;
/**
 * ISF calculation parameters for the O-1a, O-1b, O-1AB, NZ-2, NZ-15, NZ-30, NZ-31, NZ-32, NZ-33, NZ-40, NZ-41,
 * NZ-43, NZ-44, NZ-46, NZ-50, NZ-53, NZ-62, NZ-63, and NZ-65 fuel types.
 */
class O1Isf {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `O1|${this.threshold}|${this.f1}|${this.f2}|${this.f3}|${this.f4}`;
    }
}
exports.O1Isf = O1Isf;
/**
 * ISF calculation parameters for the C-2, C-3, C-4, C-5, C-6, C-7, D-1, D-2, D-1/D-2, M-1, M-2, M-1/M-2, M-3, M-4, M-3/M-4,
 * NZ-45, NZ-47, NZ-51, NZ-52, NZ-54, NZ-55, NZ-56, NZ-57, NZ-58, NZ-60, NZ-61, NZ-66, NZ-67, NZ-68, NZ-69, and NZ-71 fuel types.
 */
class ClosedAccAlpha {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `Close|${this.init}|${this.multiplier}|${this.power}|${this.expMultiplier}`;
    }
}
exports.ClosedAccAlpha = ClosedAccAlpha;
/**
 * ISF calculation parameters for the C-1, O-1a, O-1b, O-1AB, S-1, S-2, S-3, Non, NZ-2, NZ-15, NZ-30, NZ-31,
 * NZ-32, NZ-33, NZ-40, NZ-41, NZ-43, NZ-44, NZ-46, NZ-50, NZ-53, NZ-62, NZ-63, NZ-64, NZ-65, and NZ-70 fuel types.
 */
class OpenAccAlpha {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `Open|${this.init}`;
    }
}
exports.OpenAccAlpha = OpenAccAlpha;
/**
 * ISF calculation parameters for the C-1, C-2, C-3, C-4, C-5, C-6, C-7, D-1, D-2, D-1/D-2, M-1, M-2, M-1/M-2, M-3, M-4, M-3/M-4, S-1, S-2, S-3,
 * Non, NZ-45, NZ-47, NZ-51, NZ-52, NZ-54, NZ-55, NZ-56, NZ-57, NZ-58, NZ-60, NZ-61, NZ-64, NZ-66, NZ-67, NZ-68, NZ-69, NZ-70, and NZ-71 fuel types.
 */
class C1Lb {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `C1|${this.init}|${this.multiplier}|${this.expMultiplier}|${this.power}`;
    }
}
exports.C1Lb = C1Lb;
/**
 * ISF calculation parameters for the O-1a, O-1b, O-1AB, NZ-2, NZ-15, NZ-30, NZ-31,
 * NZ-32, NZ-33, NZ-40, NZ-41, NZ-43, NZ-44, NZ-46, NZ-50, NZ-53, NZ-62, NZ-63, and NZ-65 fuel types.
 */
class O1Lb {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `O1|${this.init}|${this.power}`;
    }
}
exports.O1Lb = O1Lb;
/**
 * ISF calculation parameters for the C-1, C-2, C-3, C-4, C-5, C-6, C-7, D-1, D-1/D-2 (non-greenup), M-1, M-2, M-1/M-2,
 * M-3, M-4, M-3/M-4, O-1a, O-1b, O-1AB, S-1, S-2, S-3, Non, NZ-2, NZ-15, NZ-30, NZ-31, NZ-32, NZ-33, NZ-40, NZ-41,
 * NZ-43, NZ-44, NZ-45, NZ-46, NZ-47, NZ-50, NZ-51, NZ-52, NZ-53, NZ-54, NZ-55, NZ-56, NZ-57, NZ-58, NZ-60, NZ-61,
 * NZ-62, NZ-63, NZ-64, NZ-65, NZ-66, NZ-67, NZ-68, NZ-69, NZ-70, and NZ-71 fuel types.
 */
class C1Cfb {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `C1|${this.csiMultiplier}|${this.csiCbhExponent}|${this.csiExpAdder}|${this.csiExpMultiplier}|${this.csiPower}|${this.rsoDiv}|${this.cfbExp}|${this.cfbPossible}`;
    }
}
exports.C1Cfb = C1Cfb;
/**
 * ISF calculation parameters for the D-2 and D-1/D-2 (greenup) fuel types.
 */
class D2Cfb {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return 'D2';
    }
}
exports.D2Cfb = D2Cfb;
/**
 * Flame length calculation parameters for the O-1a, O-1b, O-1AB, S-1, S-2, S-3, Non, NZ-2, NZ-15, NZ-30,
 * NZ-31, NZ-32, NZ-33, NZ-40, NZ-41, NZ-43, NZ-44, NZ-46, NZ-50, NZ-53, NZ-62, NZ-63, NZ-64, and NZ-65 fuel types.
 */
class Alexander82FlameLength {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `Alex|${this.p1}|${this.p2}`;
    }
}
exports.Alexander82FlameLength = Alexander82FlameLength;
/**
 * Flame length calculation parameters for the C-1, C-2, C-3, C-4, C-5, C-6, C-7, D-1, D-2, D-1/D-2, M-1, M-2, M-1/M-2,
 * M-3, M-4, M-3/M-4, NZ-45, NZ-47, NZ-51, NZ-52, NZ-54, NZ-55, NZ-56, NZ-57, NZ-58, NZ-60, NZ-61, NZ-66, NZ-67, NZ-68,
 * NZ-69, NZ-70, and NZ-71 fuel types.
 */
class Alexander82TreeFlameLength {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `AlexTree|${this.p1}|${this.p2}|${this.cfb}|${this.th}`;
    }
}
exports.Alexander82TreeFlameLength = Alexander82TreeFlameLength;
/**
 * A color defined by red, green, and blue.
 */
class RGBColor {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `RGB|${this.red}|${this.green}|${this.blue}`;
    }
}
exports.RGBColor = RGBColor;
/**
 * A color defined by hue, saturation, and luminance.
 */
class HSLColor {
    constructor(init) {
        Object.assign(this, init);
    }
    stream() {
        return `HSL|${this.hue}|${this.saturation}|${this.luminance}`;
    }
}
exports.HSLColor = HSLColor;
/**
 * The definition for a fuel type. Can be constructed from any combination of parameters,
 * even if potentially not valid for a real fuel type.
 */
class FuelDefinition {
    constructor(name, defaultFuel, index) {
        this.name = name;
        this.defaultFuel = defaultFuel;
        this.index = index;
        this.color = new RGBColor({ red: 0xff, green: 0xff, blue: 0xff });
    }
    toString() {
        let s = `${this.name.replace("|", "_")}|${this.defaultFuel}|${this.index}|${this.color.stream()}`;
        if (this.spreadParms != null) {
            s += `|SP|${this.spreadParms.stream()}`;
        }
        if (this.fmcAttribute != null) {
            s += `|FMC|${this.fmcAttribute.stream()}`;
        }
        if (this.sfcAttribute != null) {
            s += `|SFC|${this.sfcAttribute.stream()}`;
        }
        if (this.sfcGreenupAttribute != null) {
            s += `|SFCG|${this.sfcGreenupAttribute.stream()}`;
        }
        if (this.rsiAttribute != null) {
            s += `|RSI|${this.rsiAttribute.stream()}`;
        }
        if (this.rsiGreenupAttribute != null) {
            s += `|RSIG|${this.rsiGreenupAttribute.stream()}`;
        }
        if (this.isfAttribute != null) {
            s += `|ISF|${this.isfAttribute.stream()}`;
        }
        if (this.isfGreenupAttribute != null) {
            s += `|ISFG|${this.isfGreenupAttribute.stream()}`;
        }
        if (this.accAlphaAttribute != null) {
            s += `|AA|${this.accAlphaAttribute.stream()}`;
        }
        if (this.lbAttribute != null) {
            s += `|LB|${this.lbAttribute.stream()}`;
        }
        if (this.cfbAttribute != null) {
            s += `|CFB|${this.cfbAttribute.stream()}`;
        }
        if (this.cfbGreenupAttribute != null) {
            s += `|CFBG|${this.cfbGreenupAttribute.stream()}`;
        }
        if (this.flameLengthAttribute != null) {
            s += `|FL|${this.flameLengthAttribute.stream()}`;
        }
        return s;
    }
}
exports.FuelDefinition = FuelDefinition;
//# sourceMappingURL=fuels.js.map