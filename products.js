// products.js - 产品数据
// 版本：v8.8 - 根据官方剂量表完善D-Artepp数据

// D-Artepp 产品数据
export const darteppData = {
    id: 'dartepp',
    name: 'D-Artepp®',
    description: {
        en: 'Antimalarial Dosage Calculator',
        zh: '抗疟疾药物剂量计算器',
        fr: 'Calculateur de Dosage Antipaludique'
    },
    types: [
        {
            name: {
                en: 'D-ARTEPP Dispersible',
                zh: 'D-ARTEPP 分散片',
                fr: 'D-ARTEPP Dispersible'
            },
            specifications: [
                { 
                    dosage: '20mg/120mg', 
                    weightRanges: [
                        { min: 5, max: 8, count: 1 },
                        { min: 11, max: 17, count: 2 },
                        { min: 17, max: 25, count: 3 },
                        { min: 25, max: 36, count: 4 },
                        { min: 36, max: 60, count: 6 },
                        { min: 60, max: 80, count: 8 },
                        { min: 80, max: 100, count: 10 }
                    ]
                },
                { 
                    dosage: '30mg/180mg', 
                    weightRanges: [
                        { min: 8, max: 11, count: 1 },
                        { min: 17, max: 25, count: 2 },
                        { min: 36, max: 60, count: 4 }
                    ]
                },
                { 
                    dosage: '40mg/240mg', 
                    weightRanges: [
                        { min: 11, max: 17, count: 1 },
                        { min: 25, max: 36, count: 2 },
                        { min: 36, max: 60, count: 3 },
                        { min: 60, max: 80, count: 4 },
                        { min: 80, max: 100, count: 5 }
                    ]
                }
            ]
        },
        {
            name: {
                en: 'D-ARTEPP',
                zh: 'D-ARTEPP',
                fr: 'D-ARTEPP'
            },
            specifications: [
                { 
                    dosage: '40mg/240mg', 
                    weightRanges: [
                        { min: 17, max: 25, count: 1.5 },
                        { min: 25, max: 36, count: 2 },
                        { min: 36, max: 60, count: 3 },
                        { min: 60, max: 80, count: 4 },
                        { min: 80, max: 100, count: 5 }
                    ]
                },
                { 
                    dosage: '60mg/360mg', 
                    weightRanges: [
                        { min: 17, max: 25, count: 1 },
                        { min: 36, max: 60, count: 2 }
                    ]
                },
                { 
                    dosage: '80mg/480mg', 
                    weightRanges: [
                        { min: 25, max: 36, count: 1 },
                        { min: 36, max: 60, count: 1.5 },
                        { min: 60, max: 80, count: 2 },
                        { min: 80, max: 100, count: 2.5 }
                    ]
                }
            ]
        }
    ]
};

// Argesun 产品数据
export const argesunData = {
    id: 'argesun',
    name: 'Argesun®',
    description: {
        en: 'Artesunate Injection Dosage Calculator',
        zh: '注射用青蒿琥酯剂量计算器',
        fr: 'Calculateur de Dosage Artesunate Injectible'
    },
    // 剂量计算公式
    dosageFormula: {
        adult: 2.4, // mg/kg for ≥20kg
        child: 3.0  // mg/kg for <20kg
    },
    // 可用规格
    strengths: [
        { 
            mg: 30, 
            solventVolume: 1.5, // ml
            vialSize: "5ml",
            ampouleSize: "3ml"
        },
        { 
            mg: 60, 
            solventVolume: 3.0,
            vialSize: "5ml",
            ampouleSize: "3ml"
        },
        { 
            mg: 120, 
            solventVolume: 6.0,
            vialSize: "7ml",
            ampouleSize: "6ml"
        },
        { 
            mg: 180, 
            solventVolume: 9.0,
            vialSize: "10ml",
            ampouleSize: "10ml"
        }
    ]
};

// Artesun 产品数据
export const artesunData = {
    id: 'artesun',
    name: 'Artesun®',
    description: {
        en: 'Artesunate for Injection',
        zh: '注射用青蒿琥酯',
        fr: 'Artesunate pour Injection'
    },
    // 剂量计算公式
    dosageFormula: {
        adult: 2.4, // mg/kg for ≥20kg
        child: 3.0  // mg/kg for <20kg
    },
    // 可用规格（双溶剂系统）
    strengths: [
        { 
            mg: 30, 
            bicarbonateVolume: 0.5, // ml (碳酸氢钠)
            salineVolume: 2.5,       // ml (氯化钠) - IV用量
            imSalineVolume: 1.0,     // ml (氯化钠) - IM估算用量
            afterReconstitution: 0.5, // 配制后体积
            afterDilutionIV: 6.0,     // 静脉稀释后总体积
            afterDilutionIM: 3.0      // 肌肉稀释后总体积
        },
        { 
            mg: 60, 
            bicarbonateVolume: 1.0,
            salineVolume: 5.0,
            imSalineVolume: 2.0,
            afterReconstitution: 1.0,
            afterDilutionIV: 6.0,
            afterDilutionIM: 3.0
        },
        { 
            mg: 120, 
            bicarbonateVolume: 2.0,
            salineVolume: 10.0,
            imSalineVolume: 4.0,
            afterReconstitution: 2.0,
            afterDilutionIV: 6.0,
            afterDilutionIM: 3.0
        }
    ],
    // 浓度
    concentrations: {
        iv: 10, // mg/ml 静脉注射
        im: 20  // mg/ml 肌肉注射
    }
};

// 将所有产品数据组合成一个对象以便于访问
export const allProducts = {
    dartepp: darteppData,
    argesun: argesunData,
    artesun: artesunData
};

// 辅助函数：根据ID获取产品数据
export function getProductById(id) {
    return allProducts[id];
}

// 导出到全局（如果需要）
if (typeof window !== 'undefined') {
    window.darteppData = darteppData;
    window.argesunData = argesunData;
    window.artesunData = artesunData;
    window.allProducts = allProducts;
    console.log('Products data loaded to window object');
}