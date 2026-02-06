// translations.js - 翻译数据
// 版本：v8.10 (适配data-i18n系统)
// 日期：2024-01-20

export const translations = {
    en: {
        // 应用标题和导航
        appTitle: "Medical Dosage Calculator",
        navCalculator: "Calculator",
        navMedications: "Medications",
        
        // 产品选择界面
        selectProduct: "Select Product",
        selectProductDesc: "Please select the product for dosage calculation",
        darteppDesc: "Antimalarial Dosage Calculator",
        artesunDesc: "Artesunate for Injection",
        argesunDesc: "Artesunate Injection Dosage Calculator",
        recommended: "Recommended",
        comingSoon: "Coming Soon",
        
        // 通用计算器文本
        calculatorTitle: "Dosage Calculation",
        calculatorDesc: "Enter patient weight, system will automatically calculate recommended dosage",
        
        // 产品专用计算器标题和描述
        darteppCalculatorTitle: "D-Artepp® Dosage Calculation",
        darteppCalculatorDesc: "Select patient weight, system will automatically calculate recommended D-Artepp® dosage",
        argesunCalculatorTitle: "Argesun® Dosage Calculation",
        argesunCalculatorDesc: "Select patient weight, system will calculate recommended Argesun® dosage",
        artesunCalculatorTitle: "Artesun® Dosage Calculation",
        artesunCalculatorDesc: "Select patient weight and injection route, system will calculate recommended Artesun® dosage",
        
        // 注射途径选择
        injectionRoute: "Injection Route",
        selectRoute: "Select Injection Route",
        ivRoute: "Intravenous (IV)",
        imRoute: "Intramuscular (IM)",
        ivRouteDesc: "10 mg/ml · Slow injection over 1-2 minutes",
        imRouteDesc: "20 mg/ml · Anterior thigh injection",
        routeSelectionInstruction: "Select IV for slow intravenous injection or IM for intramuscular injection",
        
        // 体重输入相关
        weightSelector: "Weight Selector",
        manualInput: "Key in patient weight",
        weightRange: "Range: 0-100kg",
        weightRangeDartepp: "Range: 5-100kg",
        weightWarning: "Weight must be at least {minWeight}kg for {productName}",
        
        // 剂量计划相关
        dosagePlan: "Recommended Dosage Plan",
        darteppDosagePlanTitle: "Recommended Dosage",
        argesunDosagePlanTitle: "Recommended Dose",
        artesunDosagePlanTitle: "Recommended Dose",
        
        // 剂量卡片标题和描述
        firstDoseTitle: "First Dose (0h)",
        firstDoseNote: "Administer immediately",
        secondDoseTitle: "Second Dose (12h)",
        secondDoseNote: "12 hours after first dose",
        thirdDoseTitle: "Third Dose (24h)",
        thirdDoseNote: "24 hours after first dose",
        fourthDoseTitle: "Fourth Dose (48h)",
        fourthDoseNote: "48 hours after first dose",
        
        // 初始提示信息
        selectWeight: "Please select weight",
        selectWeightDesc: "Enter weight to calculate recommended dosage",
        
        // 操作按钮
        backToProducts: "Back to Products",
        
        // 页脚信息
        footerCopyright: "© 2025 Medical Dosage Calculator. Professional medical tool for safe medication.",
        footerDisclaimer: "This tool is for reference only, please follow medical advice for actual medication.",
        
        // 剂量结果相关
        darteppDosageResultTitle: "D-Artepp® dosage based on weight",
        darteppDosageResultSubtitle: "D-Artepp® - Three-day treatment plan",
        argesunDosageResultTitle: "Argesun® dosage based on weight",
        argesunDosageResultSubtitle: "Argesun® - Injectable Artesunate (Single Solvent)",
        artesunDosageResultTitle: "Artesun® dosage based on weight {weight}kg",
        artesunDosageResultSubtitle: "Artesun® - Injectable Artesunate (Dual Solvent)",
        
        // 通用结果信息
        patientWeight: "Patient Weight",
        recommendedMedication: "Recommended Medication Plan",
        dosageInstruction: "Recommended dosage:",
        recommendedDosage: "Recommended Dosage:",
        medicationInstructions: "Medication Instructions:",
        takeDaily: "Take daily",
        forDays: "for 3 days",
        pleaseFollow: "Please strictly follow medical advice. Seek medical attention immediately if adverse reactions occur.",
        
        // 错误和警告信息
        weightOutOfRange: "Weight out of range",
        checkWeight: "Please check if weight input is correct (0-100kg)",
        checkWeightDartepp: "Please check if weight input is correct (5-100kg)",
        selectProductAlert: "Please select a product first",
        
        // 注射相关
        finalInjectionVolume: "Final Injection Volume",
        reconstitutionGuide: "Reconstitution Guide",
        vial: "vial",
        concentration: "Concentration",
        
        // Argesun 特有
        dosageFormula: "Dosage formula:",
        dosagePerKg: "Dosage per kg:",
        forAdults: "for patients ≥20kg",
        forChildren: "for children <20kg",
        reconstitutionSteps: "Reconstitution Steps:",
        administrationMethod: "Administration Method:",
        singleSolvent: "Single-solvent system",
        dualSolvent: "Dual-solvent system",
        immediateUse: "Must be used within 1 hour after reconstitution",
        availableStrengths: "Available Strengths:",
        reconstitutionVolume: "Reconstitution Volume:",
        injectionVolume: "Injection Volume:",
        selectStrength: "Select Strength Combination",
        ivImNote: "Note: Same volume for IV and IM injection (20mg/ml)",
        totalDose: "Total dose:",
        
        // Artesun 特有
        bicarbonateVolume: "Bicarbonate Volume:",
        salineVolume: "Saline Volume:",
        ivConcentration: "IV Concentration: 10 mg/ml",
        imConcentration: "IM Concentration: 20 mg/ml",
        ivCalculation: "IV Calculation:",
        imCalculation: "IM Calculation:",
        roundUp: "Round up to nearest ml",
        example: "Example:",
        reconstitutionNote: "Reconstitution Note:",
        useAllBicarbonate: "Use all content of bicarbonate ampoule",
        diluteNote: "Dilution Note:",
        removeAir: "Remove air from ampoule before saline injection",
        patientInjection: "Patient Final Injection Volume",
        finalConcentration: "Final Concentration",
        
        // 备选方案相关
        alternativeOptions: "Alternative Options",
        alternativeNote: "Alternative options provide flexibility based on available inventory.",
        optimalSelection: "Optimal Selection",
        
        // 溶液名称
        solutionVolume: "Solution Volume",
        bicarbonateSodiumArginine: "bicarbonate sodium and arginine"
    },
    zh: {
        // 应用标题和导航
        appTitle: "医疗剂量计算器",
        navCalculator: "计算器",
        navMedications: "药品信息",
        
        // 产品选择界面
        selectProduct: "选择产品",
        selectProductDesc: "请选择您需要计算剂量的产品",
        darteppDesc: "抗疟疾药物剂量计算器",
        artesunDesc: "注射用青蒿琥酯",
        argesunDesc: "注射用青蒿琥酯剂量计算器",
        recommended: "推荐产品",
        comingSoon: "即将推出",
        
        // 通用计算器文本
        calculatorTitle: "剂量计算",
        calculatorDesc: "输入患者体重，系统将自动计算推荐剂量",
        
        // 产品专用计算器标题和描述
        darteppCalculatorTitle: "D-Artepp® 剂量计算",
        darteppCalculatorDesc: "选择患者体重，系统将自动计算推荐的D-Artepp®剂量",
        argesunCalculatorTitle: "Argesun® 剂量计算",
        argesunCalculatorDesc: "选择患者体重，系统将计算推荐的Argesun®剂量",
        artesunCalculatorTitle: "Artesun® 剂量计算",
        artesunCalculatorDesc: "选择患者体重和注射途径，系统将计算推荐的Artesun®剂量",
        
        // 注射途径选择
        injectionRoute: "注射途径",
        selectRoute: "选择注射途径",
        ivRoute: "静脉注射 (IV)",
        imRoute: "肌肉注射 (IM)",
        ivRouteDesc: "10 mg/ml · 缓慢注射1-2分钟",
        imRouteDesc: "20 mg/ml · 大腿前部注射",
        routeSelectionInstruction: "选择IV进行缓慢静脉注射或选择IM进行肌肉注射",
        
        // 体重输入相关
        weightSelector: "体重选择器",
        manualInput: "输入患者体重",
        weightRange: "范围: 0-100kg",
        weightRangeDartepp: "范围: 5-100kg",
        weightWarning: "{productName}的体重必须至少为{minWeight}kg",
        
        // 剂量计划相关
        dosagePlan: "推荐剂量方案",
        darteppDosagePlanTitle: "推荐剂量",
        argesunDosagePlanTitle: "推荐用量",
        artesunDosagePlanTitle: "推荐用量",
        
        // 剂量卡片标题和描述
        firstDoseTitle: "首剂 (0小时)",
        firstDoseNote: "立即给药",
        secondDoseTitle: "第二剂 (12小时)",
        secondDoseNote: "首剂后12小时",
        thirdDoseTitle: "第三剂 (24小时)",
        thirdDoseNote: "首剂后24小时",
        fourthDoseTitle: "第四剂 (48小时)",
        fourthDoseNote: "首剂后48小时",
        
        // 初始提示信息
        selectWeight: "请选择体重",
        selectWeightDesc: "输入体重以计算推荐剂量",
        
        // 操作按钮
        backToProducts: "返回产品选择",
        
        // 页脚信息
        footerCopyright: "© 2025 医疗剂量计算器. 专业医疗工具，确保用药安全.",
        footerDisclaimer: "本工具仅供参考，实际用药请遵循医嘱",
        
        // 剂量结果相关
        darteppDosageResultTitle: "基于体重 {weight}kg 的D-Artepp®剂量",
        darteppDosageResultSubtitle: "D-Artepp® - 三日疗程方案",
        argesunDosageResultTitle: "基于体重 {weight}kg 的Argesun®剂量",
        argesunDosageResultSubtitle: "Argesun® - 注射用青蒿琥酯 (单一溶剂)",
        artesunDosageResultTitle: "基于体重 {weight}kg 的Artesun®剂量",
        artesunDosageResultSubtitle: "Artesun® - 注射用青蒿琥酯 (双溶剂)",
        
        // 通用结果信息
        patientWeight: "患者体重",
        recommendedMedication: "推荐用药方案",
        dosageInstruction: "推荐用量：",
        recommendedDosage: "推荐剂量",
        medicationInstructions: "用药说明：",
        takeDaily: "每日",
        forDays: "连续3日",
        pleaseFollow: "请严格遵医嘱使用，如出现不良反应请及时就医。",
        
        // 错误和警告信息
        weightOutOfRange: "体重超出范围",
        checkWeight: "请检查体重输入是否正确 (0-100kg)",
        checkWeightDartepp: "请检查体重输入是否正确 (5-100kg)",
        selectProductAlert: "请先选择产品",
        
        // 注射相关
        finalInjectionVolume: "最终注射体积",
        reconstitutionGuide: "配制指南",
        vial: "瓶",
        concentration: "浓度",
        
        // Argesun 特有
        dosageFormula: "剂量公式：",
        dosagePerKg: "每公斤剂量：",
        forAdults: "适用于≥20kg患者",
        forChildren: "适用于<20kg儿童",
        reconstitutionSteps: "配制步骤：",
        administrationMethod: "给药方法：",
        singleSolvent: "单一溶剂系统",
        dualSolvent: "双溶剂系统",
        immediateUse: "配制后1小时内必须使用",
        availableStrengths: "可用规格：",
        reconstitutionVolume: "配制体积：",
        injectionVolume: "注射体积：",
        selectStrength: "选择规格组合",
        ivImNote: "注意：静脉和肌肉注射使用相同体积（20mg/ml）",
        totalDose: "总剂量：",
        
        // Artesun 特有
        bicarbonateVolume: "碳酸氢钠体积：",
        salineVolume: "氯化钠体积：",
        ivConcentration: "静脉浓度：10 mg/ml",
        imConcentration: "肌肉浓度：20 mg/ml",
        ivCalculation: "静脉计算：",
        imCalculation: "肌肉计算：",
        roundUp: "向上取整到最近的毫升",
        example: "示例：",
        reconstitutionNote: "配制说明：",
        useAllBicarbonate: "使用全部碳酸氢钠安瓿内容物",
        diluteNote: "稀释说明：",
        removeAir: "注射氯化钠前排出安瓿中的空气",
        patientInjection: "患者最终注射体积",
        finalConcentration: "最终浓度",
        
        // 备选方案相关
        alternativeOptions: "备选方案",
        alternativeNote: "备选方案可根据库存情况提供灵活性。",
        optimalSelection: "最优选择",
        
        // 溶液名称
        solutionVolume: "溶液体积",
        bicarbonateSodiumArginine: "碳酸氢钠和精氨酸"
    },
    fr: {
        // 应用标题和导航
        appTitle: "Calculateur de Dosage Médical",
        navCalculator: "Calculateur",
        navMedications: "Médicaments",
        
        // 产品选择界面
        selectProduct: "Sélectionner le Produit",
        selectProductDesc: "Veuillez sélectionner le produit pour le calcul de dosage",
        darteppDesc: "Calculateur de Dosage Antipaludique",
        artesunDesc: "Artesunate pour Injection",
        argesunDesc: "Calculateur de Dosage Artesunate Injectible",
        recommended: "Recommandé",
        comingSoon: "Prochainement",
        
        // 通用计算器文本
        calculatorTitle: "Calcul de Dosage",
        calculatorDesc: "Entrez le poids du patient, le système calculera automatiquement la dose recommandée",
        
        // 产品专用计算器标题和描述
        darteppCalculatorTitle: "Calcul de Dosage D-Artepp®",
        darteppCalculatorDesc: "Sélectionnez le poids du patient, le système calculera automatiquement la dose recommandée de D-Artepp®",
        argesunCalculatorTitle: "Calcul de Dosage Argesun®",
        argesunCalculatorDesc: "Sélectionnez le poids du patient, le système calculera la dose recommandée d'Argesun®",
        artesunCalculatorTitle: "Calcul de Dosage Artesun®",
        artesunCalculatorDesc: "Sélectionnez le poids du patient et la voie d'injection, le système calculera la dose recommandée d'Artesun®",
        
        // 注射途径选择
        injectionRoute: "Voie d'Injection",
        selectRoute: "Sélectionner la Voie d'Injection",
        ivRoute: "Intraveineuse (IV)",
        imRoute: "Intramusculaire (IM)",
        ivRouteDesc: "10 mg/ml · Injection lente sur 1-2 minutes",
        imRouteDesc: "20 mg/ml · Injection dans la cuisse antérieure",
        routeSelectionInstruction: "Sélectionnez IV pour injection intraveineuse lente ou IM pour injection intramusculaire",
        
        // 体重输入相关
        weightSelector: "Sélecteur de Poids",
        manualInput: "Saisir le poids du patient",
        weightRange: "Plage: 0-100kg",
        weightRangeDartepp: "Plage: 5-100kg",
        weightWarning: "Le poids doit être d'au moins {minWeight}kg pour {productName}",
        
        // 剂量计划相关
        dosagePlan: "Plan de Dosage Recommandé",
        darteppDosagePlanTitle: "Dosage recommandé",
        argesunDosagePlanTitle: "Dose recommandée",
        artesunDosagePlanTitle: "Dose recommandée",
        
        // 剂量卡片标题和描述
        firstDoseTitle: "Première Dose (0h)",
        firstDoseNote: "Administrer immédiatement",
        secondDoseTitle: "Deuxième Dose (12h)",
        secondDoseNote: "12 heures après la première dose",
        thirdDoseTitle: "Troisième Dose (24h)",
        thirdDoseNote: "24 heures après la première dose",
        fourthDoseTitle: "Quatrième Dose (48h)",
        fourthDoseNote: "48 heures après la première dose",
        
        // 初始提示信息
        selectWeight: "Veuillez sélectionner le poids",
        selectWeightDesc: "Entrez le poids pour calculer la dose recommandée",
        
        // 操作按钮
        backToProducts: "Retour aux Produits",
        
        // 页脚信息
        footerCopyright: "© 2025 Calculateur de Dosage Médical. Outil médical professionnel pour une médication sûre.",
        footerDisclaimer: "Cet outil est à titre indicatif seulement, suivez les conseils médicaux pour la médication réelle.",
        
        // 剂量结果相关
        darteppDosageResultTitle: "Dosage D-Artepp® basé sur le poids",
        darteppDosageResultSubtitle: "D-Artepp® - Plan de traitement de trois jours",
        argesunDosageResultTitle: "Dosage Argesun® basé sur le poids",
        argesunDosageResultSubtitle: "Argesun® - Artesunate Injectible (Solvant Unique)",
        artesunDosageResultTitle: "Dosage Artesun® basé sur le poids {weight}kg",
        artesunDosageResultSubtitle: "Artesun® - Artesunate Injectible (Double Solvant)",
        
        // 通用结果信息
        patientWeight: "Poids du Patient",
        recommendedMedication: "Plan de Médication Recommandé",
        dosageInstruction: "Dosage recommandé:",
        recommendedDosage: "Dosage recommandé",
        medicationInstructions: "Instructions de Médication:",
        takeDaily: "Prendre quotidiennement",
        forDays: "pendant 3 jours",
        pleaseFollow: "Veuillez suivre strictement les conseils médicaux. Consultez immédiatement un médecin en cas de réactions indésirables.",
        
        // 错误和警告信息
        weightOutOfRange: "Poids hors limites",
        checkWeight: "Veuillez vérifier si la saisie du poids est correcte (0-100kg)",
        checkWeightDartepp: "Veuillez vérifier si la saisie du poids est correcte (5-100kg)",
        selectProductAlert: "Veuillez d'abord sélectionner un produit",
        
        // 注射相关
        finalInjectionVolume: "Volume d'Injection Final",
        reconstitutionGuide: "Guide de Reconstitution",
        vial: "flacon",
        concentration: "Concentration",
        
        // Argesun 特有
        dosageFormula: "Formule de dosage:",
        dosagePerKg: "Dosage par kg:",
        forAdults: "pour patients ≥20kg",
        forChildren: "pour enfants <20kg",
        reconstitutionSteps: "Étapes de reconstitution:",
        administrationMethod: "Méthode d'administration:",
        singleSolvent: "Système à solvant unique",
        dualSolvent: "Système à double solvant",
        immediateUse: "Doit être utilisé dans l'heure suivant la reconstitution",
        availableStrengths: "Forces disponibles:",
        reconstitutionVolume: "Volume de reconstitution:",
        injectionVolume: "Volume d'injection:",
        selectStrength: "Sélectionner la combinaison de forces",
        ivImNote: "Note: Même volume pour injection IV et IM (20mg/ml)",
        totalDose: "Dose totale:",
        
        // Artesun 特有
        bicarbonateVolume: "Volume Bicarbonate:",
        salineVolume: "Volume Saline:",
        ivConcentration: "Concentration IV: 10 mg/ml",
        imConcentration: "Concentration IM: 20 mg/ml",
        ivCalculation: "Calcul IV:",
        imCalculation: "Calcul IM:",
        roundUp: "Arrondir au ml supérieur",
        example: "Exemple:",
        reconstitutionNote: "Note de reconstitution:",
        useAllBicarbonate: "Utiliser tout le contenu de l'ampoule de bicarbonate",
        diluteNote: "Note de dilution:",
        removeAir: "Retirer l'air de l'ampoule avant l'injection de saline",
        patientInjection: "Volume d'injection final pour le patient",
        finalConcentration: "Concentration finale",
        
        // 备选方案相关
        alternativeOptions: "Options Alternatives",
        alternativeNote: "Les options alternatives offrent une flexibilité selon les stocks disponibles.",
        optimalSelection: "Sélection Optimale",
        
        // 溶液名称
        solutionVolume: "Volume de Solution",
        bicarbonateSodiumArginine: "bicarbonate de sodium et arginine"
    }
};

// 导出到全局（正确的方式）
if (typeof window !== 'undefined') {
    window.translations = translations;
    console.log('Translations loaded to window.translations');
}