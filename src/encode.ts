import { relativeJump } from "./binaryMapping.ts";


export const encode = (
    pc: number,
    mnemonic: string,
    operands: Array<number>
): GeneratedCode => {

    switch (mnemonic) {
        case "SBI":
            return template("1001_1010_AAAA_Abbb", {
                "A": operands[0],
                "b": operands[1]
            });
        case "SBIC":
            return template("1001_1001_AAAA_Abbb", {
                "A": operands[0],
                "b": operands[1]
            });
        case "SBIS":
            return template("1001_1011_AAAA_Abbb", {
                "A": operands[0],
                "b": operands[1]
            });
        case "CBI":
            return template("1001_1000_AAAA_Abbb", {
                "A": operands[0],
                "b":operands[1]
            });


        case "RCALL":
            // All jumps need to consider flash size!
            return template("1101_kkkk_kkkk_kkkk", {
                "k": relativeJump(operands[0]!, 12, pc)
            });
        case "RJMP":
            return template("1100_kkkk_kkkk_kkkk", {
                "k": relativeJump(operands[0]!, 12, pc)
            });



        case "ADIW":
            return template("1001_0110_KKdd_KKKK", {
                "d": (operands[0]! - 24) / 2,
                "K": operands[1]
            });
        case "SBIW":
            return template("1001_0111_KKdd_KKKK", {
                "d": (operands[0]! - 24) / 2,
                "K": operands[1]
            });


        case "FMUL":
            return template("0000_0011_0ddd_1rrr", {
                "d": operands[0]! - 16,
                "r": operands[1]! - 16
            });
        case "FMULS":
            return template("0000_0011_1ddd_0rrr", {
                "d": operands[0]! - 16,
                "r": operands[1]! - 16
            });
        case "FMULSU":
            return template("0000_0011_1ddd_1rrr", {
                "d": operands[0]! - 16,
                "r": operands[1]! - 16
            });
        case "MULSU":
            return template("0000_0011_0ddd_0rrr", {
                "d": operands[0]! - 16,
                "r": operands[1]! - 16
            });


        case "MULS":
            return template("0000_0010_dddd_rrrr", {
                "d": operands[0]! - 16,
                "r": operands[1]! - 16
            });
        case "MOVW":
            return template("0000_0001_dddd_rrrr", {
                "d": operands[0]! / 2,
                "r": operands[1]! / 2
            });



        case "DES":
            return template("1001_0100_KKKK_1011", {
                "K": operands[0]
            });



        case "IN":
            return template("1011_0AAd_dddd_AAAA", {
                "d": operands[0],
                "A": operands[1]
            });
        case "OUT":
            return template("1011_1AAr_rrrr_AAAA", {
                "A": operands[0],
                "r": operands[1]
            });


        case "CALL":
            return template("1001_010k_kkkk_111k_kkkk_kkkk_kkkk_kkkk", {
                "k": operands[0]
            });
        case "JMP":
            return template("1001_010k_kkkk_110k_kkkk_kkkk_kkkk_kkkk", {
                "k":operands[0]
            });


        case "LDS":
            return template("1001_000d_dddd_0000_kkkk_kkkk_kkkk_kkkk", {
                "d": operands[0],
                "k": operands[1]
            });
        case "STS":
            return template("1001_001d_dddd_0000_kkkk_kkkk_kkkk_kkkk", {
                "k": operands[0],
                "d": operands[1]
            });

        case "LDS.RC":
            return template("1010_0kkk_dddd_kkkk", {
                "d": operands[0]! - 16,
                "k":operands[1]
            });
        case "STS.RC":
            return template("1010_1kkk_dddd_kkkk", {
                "k": operands[0],
                "d": operands[1]! - 16
            });
    }
    throw `unknown instruction ${mnemonic}`;
}

