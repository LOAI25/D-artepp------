// dosage.js - 剂量计算模块
// 版本：v8.7

// 使用函数获取器而不是直接变量
let getCurrentWeight, getSelectedProduct, getInjectionRoute, getCurrentLanguage;

// 初始化函数，由主文件调用
export function initializeModule(globalVars) {
    if (globalVars) {
        getCurrentWeight = globalVars.currentWeight;
        getSelectedProduct = globalVars.selectedProduct;
        getInjectionRoute = globalVars.injectionRoute;
        getCurrentLanguage = globalVars.currentLanguage;
        
        console.log('Dosage module initialized');
    }
}

// 辅助函数：获取当前值
function getCurrentValues() {
    return {
        currentWeight: getCurrentWeight ? getCurrentWeight() : window.currentWeight,
        selectedProduct: getSelectedProduct ? getSelectedProduct() : window.selectedProduct,
        injectionRoute: getInjectionRoute ? getInjectionRoute() : window.injectionRoute,
        currentLanguage: getCurrentLanguage ? getCurrentLanguage() : window.currentLanguage
    };
}

// ==================== 注射途径选择功能 ====================

// 设置注射途径
export function setInjectionRoute(route) {
    // 更新全局变量
    if (window.injectionRoute !== undefined) {
        window.injectionRoute = route;
    }
    
    updateRouteButtons();
    // 更新剂量显示
    if (typeof window.updateDosageDisplay === 'function') {
        window.updateDosageDisplay();
    }
}

// 更新注射途径按钮状态
export function updateRouteButtons() {
    const ivBtn = document.getElementById('ivRouteBtn');
    const imBtn = document.getElementById('imRouteBtn');
    
    if (!ivBtn || !imBtn) return;
    
    const { injectionRoute, currentLanguage } = getCurrentValues();
    
    // 更新按钮样式
    if (injectionRoute === 'iv') {
        ivBtn.className = 'route-btn bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex-1';
        imBtn.className = 'route-btn bg-white border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex-1';
    } else {
        ivBtn.className = 'route-btn bg-white border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex-1';
        imBtn.className = 'route-btn bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex-1';
    }
    
    // 获取当前语言的翻译
    const ivText = window.translations?.[currentLanguage]?.ivRoute || 'IV';
    const imText = window.translations?.[currentLanguage]?.imRoute || 'IM';
    const ivDesc = window.translations?.[currentLanguage]?.ivRouteDesc || '10 mg/ml · Slow injection over 1-2 minutes';
    const imDesc = window.translations?.[currentLanguage]?.imRouteDesc || '20 mg/ml · Anterior thigh injection';
    
    // 更新按钮文本
    ivBtn.innerHTML = `
        <div class="font-bold">${ivText}</div>
        <div class="text-xs mt-1">${ivDesc}</div>
    `;
    imBtn.innerHTML = `
        <div class="font-bold">${imText}</div>
        <div class="text-xs mt-1">${imDesc}</div>
    `;
}

// ==================== 剂量计算核心算法 ====================

// 查找D-Artepp剂量推荐
export function findDosageRecommendation(weight) {
    const { selectedProduct } = getCurrentValues();
    
    if (!selectedProduct || selectedProduct.id !== 'dartepp') return null;
    if (weight < 5 || weight > 100) return null;
    
    const dosages = [];
    
    // 检查 D-ARTEPP Dispersible
    const dispersible = selectedProduct.types[0];
    for (const spec of dispersible.specifications) {
        for (const range of spec.weightRanges) {
            if (weight >= range.min && weight < range.max) {
                dosages.push({
                    type: dispersible.name,
                    specification: spec.dosage,
                    count: range.count
                });
                break;
            }
        }
    }
    
    // 检查 D-ARTEPP
    const regular = selectedProduct.types[1];
    for (const spec of regular.specifications) {
        for (const range of spec.weightRanges) {
            if (weight >= range.min && weight < range.max) {
                dosages.push({
                    type: regular.name,
                    specification: spec.dosage,
                    count: range.count
                });
                break;
            }
        }
    }
    
    if (dosages.length === 0) return null;
    
    return {
        weight: weight,
        dosages: dosages
    };
}

// 查找Argesun剂量推荐
export function findArgesunDosage(weight) {
    const { selectedProduct } = getCurrentValues();
    
    if (!selectedProduct || selectedProduct.id !== 'argesun') return null;
    if (weight < 0 || weight > 100) return null;
    
    // 计算总剂量 (mg)
    const dosagePerKg = weight < 20 ? selectedProduct.dosageFormula.child : selectedProduct.dosageFormula.adult;
    const totalDose = weight * dosagePerKg;
    
    // 智能选择最佳规格组合
    const bestCombination = findBestArgesunStrengthCombination(totalDose, selectedProduct);
    
    if (!bestCombination) return null;
    
    const { combination, totalMg } = bestCombination;
    
    // 计算每种规格需要多少瓶
    const strengthCounts = {};
    combination.forEach(strength => {
        strengthCounts[strength] = (strengthCounts[strength] || 0) + 1;
    });
    
    // 计算配制后的总体积 (ml) 和注射体积 (ml)
    // 配制后浓度均为 20mg/ml
    const reconstitutionVolume = combination.reduce((total, strength) => {
        const strengthInfo = selectedProduct.strengths.find(s => s.mg === strength);
        return total + (strengthInfo ? strengthInfo.solventVolume : 0);
    }, 0);
    
    const injectionVolume = totalDose / 20; // 20mg/ml
    
    return {
        weight: weight,
        totalDose: totalDose,
        dosagePerKg: dosagePerKg,
        isChild: weight < 20,
        recommendedStrengths: strengthCounts,
        combination: combination, // 保存实际的组合数组
        totalMg: totalMg, // 实际使用的总毫克数
        reconstitutionVolume: reconstitutionVolume,
        injectionVolume: injectionVolume,
        concentration: "20 mg/ml",
        route: "both" // IV和IM使用相同体积
    };
}

function findBestArgesunStrengthCombination(totalDose, product) {
    if (!product || !product.strengths) return null;
    
    const strengths = product.strengths.map(s => s.mg).sort((a, b) => b - a); // 从大到小排序
    
    // 简单的贪心算法：优先使用大规格
    let combination = [];
    let remaining = totalDose;
    
    for (const strength of strengths) {
        const count = Math.floor(remaining / strength);
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                combination.push(strength);
            }
            remaining -= count * strength;
        }
    }
    
    // 如果还有剩余，添加一个最小规格
    if (remaining > 0) {
        combination.push(strengths[strengths.length - 1]);
    }
    
    const totalMg = combination.reduce((sum, mg) => sum + mg, 0);
    
    // 优化：尝试用更少的瓶数达到相同或相近的剂量
    const optimizedCombination = optimizeArgesunCombination(combination, totalDose, product);
    
    if (optimizedCombination && optimizedCombination.length < combination.length) {
        const optimizedMg = optimizedCombination.reduce((sum, mg) => sum + mg, 0);
        if (optimizedMg >= totalDose * 0.95) {
            return {
                combination: optimizedCombination,
                totalMg: optimizedMg
            };
        }
    }
    
    return {
        combination: combination,
        totalMg: totalMg
    };
}

// 优化Argesun组合：减少瓶数
function optimizeArgesunCombination(combination, totalDose, product) {
    if (!product || !product.strengths) return null;
    
    const strengths = product.strengths.map(s => s.mg).sort((a, b) => b - a);
    const currentCombination = [...combination];
    
    // 统计各规格数量
    const counts = {};
    currentCombination.forEach(mg => {
        counts[mg] = (counts[mg] || 0) + 1;
    });
    
    // 尝试用大规格替换多个小规格
    // 4个30mg可以用1个120mg替换
    if (counts[30] >= 4) {
        const newCombination = currentCombination.filter(mg => mg !== 30);
        const thirtyCount = counts[30] || 0;
        const replacements = Math.floor(thirtyCount / 4);
        for (let i = 0; i < replacements; i++) {
            newCombination.push(120);
        }
        for (let i = 0; i < thirtyCount % 4; i++) {
            newCombination.push(30);
        }
        return newCombination.sort((a, b) => b - a);
    }
    
    // 2个30mg可以用1个60mg替换
    if (counts[30] >= 2) {
        const newCombination = currentCombination.filter(mg => mg !== 30);
        const thirtyCount = counts[30] || 0;
        const replacements = Math.floor(thirtyCount / 2);
        for (let i = 0; i < replacements; i++) {
            newCombination.push(60);
        }
        for (let i = 0; i < thirtyCount % 2; i++) {
            newCombination.push(30);
        }
        return newCombination.sort((a, b) => b - a);
    }
    
    // 2个60mg可以用1个120mg替换
    if (counts[60] >= 2) {
        const newCombination = currentCombination.filter(mg => mg !== 60);
        const sixtyCount = counts[60] || 0;
        const replacements = Math.floor(sixtyCount / 2);
        for (let i = 0; i < replacements; i++) {
            newCombination.push(120);
        }
        for (let i = 0; i < sixtyCount % 2; i++) {
            newCombination.push(60);
        }
        return newCombination.sort((a, b) => b - a);
    }
    
    return null;
}

// 查找Artesun剂量推荐
export function findArtesunDosage(weight) {
    const { selectedProduct, injectionRoute } = getCurrentValues();
    
    if (!selectedProduct || selectedProduct.id !== 'artesun') return null;
    if (weight < 0 || weight > 100) return null;
    
    // 计算总剂量 (mg)
    const dosagePerKg = weight < 20 ? selectedProduct.dosageFormula.child : selectedProduct.dosageFormula.adult;
    const totalDose = weight * dosagePerKg;
    
    // 智能选择最佳规格组合
    const bestCombination = findBestArtesunStrengthCombination(totalDose, selectedProduct);
    
    if (!bestCombination) return null;
    
    const { combination, totalMg } = bestCombination;
    
    // 计算每种规格需要多少瓶
    const strengthCounts = {};
    combination.forEach(strength => {
        strengthCounts[strength] = (strengthCounts[strength] || 0) + 1;
    });
    
    // 计算碳酸氢钠和氯化钠总体积
    let totalBicarbonateVolume = 0;
    let totalSalineVolume = 0;
    
    combination.forEach(strength => {
        const strengthInfo = selectedProduct.strengths.find(s => s.mg === strength);
        if (strengthInfo) {
            totalBicarbonateVolume += strengthInfo.bicarbonateVolume;
            // 根据注射途径决定氯化钠用量
            if (injectionRoute === 'iv') {
                totalSalineVolume += strengthInfo.salineVolume; // IV用量
            } else {
                totalSalineVolume += strengthInfo.imSalineVolume; // IM用量
            }
        }
    });
    
    // 计算最终注射体积 - 根据你的新规则
    const concentration = injectionRoute === 'iv' ? selectedProduct.concentrations.iv : selectedProduct.concentrations.im;
    const exactInjectionVolume = totalDose / concentration;
    
    // 应用新的归类规则
    let roundedInjectionVolume;
    const isChild = weight < 20;
    
    if (injectionRoute === 'iv') {
        // IV规则
        if (isChild) {
            // 儿童（<20kg）：小于等于2ml自动归类到2ml
            roundedInjectionVolume = exactInjectionVolume <= 2 ? 2 : exactInjectionVolume;
        } else {
            // 成人（≥20kg）：自动归类到7ml
            roundedInjectionVolume = exactInjectionVolume <= 7 ? 7 : exactInjectionVolume;
        }
    } else {
        // IM规则
        if (isChild) {
            // 儿童（<20kg）：小于1ml自动归类到1ml
            roundedInjectionVolume = exactInjectionVolume < 1 ? 1 : exactInjectionVolume;
        } else {
            // 成人（≥20kg）：自动归类到4ml
            roundedInjectionVolume = exactInjectionVolume <= 4 ? 4 : exactInjectionVolume;
        }
    }
    
    // 确保体积是合理的数值
    roundedInjectionVolume = parseFloat(roundedInjectionVolume.toFixed(2));
    
    return {
        weight: weight,
        totalDose: totalDose,
        dosagePerKg: dosagePerKg,
        isChild: isChild,
        recommendedStrengths: strengthCounts,
        combination: combination, // 保存实际的组合数组
        totalMg: totalMg, // 实际使用的总毫克数
        totalBicarbonateVolume: parseFloat(totalBicarbonateVolume.toFixed(1)),
        totalSalineVolume: parseFloat(totalSalineVolume.toFixed(1)),
        exactInjectionVolume: parseFloat(exactInjectionVolume.toFixed(2)),
        roundedInjectionVolume: roundedInjectionVolume,
        concentration: concentration,
        route: injectionRoute,
    };
}

function findBestArtesunStrengthCombination(totalDose, product) {
    if (!product || !product.strengths) return null;
    
    const strengths = product.strengths.map(s => s.mg).sort((a, b) => b - a); // 从大到小排序
    
    // 简单的贪心算法：优先使用大规格
    let combination = [];
    let remaining = totalDose;
    
    for (const strength of strengths) {
        const count = Math.floor(remaining / strength);
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                combination.push(strength);
            }
            remaining -= count * strength;
        }
    }
    
    // 如果还有剩余，添加一个最小规格
    if (remaining > 0) {
        combination.push(strengths[strengths.length - 1]);
    }
    
    const totalMg = combination.reduce((sum, mg) => sum + mg, 0);
    
    // 优化：尝试用更少的瓶数达到相同或相近的剂量
    const optimizedCombination = optimizeArtesunCombination(combination, totalDose, product);
    
    if (optimizedCombination && optimizedCombination.length < combination.length) {
        const optimizedMg = optimizedCombination.reduce((sum, mg) => sum + mg, 0);
        if (optimizedMg >= totalDose * 0.95) {
            return {
                combination: optimizedCombination,
                totalMg: optimizedMg
            };
        }
    }
    
    return {
        combination: combination,
        totalMg: totalMg
    };
}

// 优化Artesun组合：减少瓶数
function optimizeArtesunCombination(combination, totalDose, product) {
    if (!product || !product.strengths) return null;
    
    const strengths = product.strengths.map(s => s.mg).sort((a, b) => b - a);
    const currentCombination = [...combination];
    
    // 统计各规格数量
    const counts = {};
    currentCombination.forEach(mg => {
        counts[mg] = (counts[mg] || 0) + 1;
    });
    
    // 尝试用大规格替换多个小规格
    // 4个30mg可以用1个120mg替换
    if (counts[30] >= 4) {
        const newCombination = currentCombination.filter(mg => mg !== 30);
        const thirtyCount = counts[30] || 0;
        const replacements = Math.floor(thirtyCount / 4);
        for (let i = 0; i < replacements; i++) {
            newCombination.push(120);
        }
        for (let i = 0; i < thirtyCount % 4; i++) {
            newCombination.push(30);
        }
        return newCombination.sort((a, b) => b - a);
    }
    
    // 2个30mg可以用1个60mg替换
    if (counts[30] >= 2) {
        const newCombination = currentCombination.filter(mg => mg !== 30);
        const thirtyCount = counts[30] || 0;
        const replacements = Math.floor(thirtyCount / 2);
        for (let i = 0; i < replacements; i++) {
            newCombination.push(60);
        }
        for (let i = 0; i < thirtyCount % 2; i++) {
            newCombination.push(30);
        }
        return newCombination.sort((a, b) => b - a);
    }
    
    // 2个60mg可以用1个120mg替换
    if (counts[60] >= 2) {
        const newCombination = currentCombination.filter(mg => mg !== 60);
        const sixtyCount = counts[60] || 0;
        const replacements = Math.floor(sixtyCount / 2);
        for (let i = 0; i < replacements; i++) {
            newCombination.push(120);
        }
        for (let i = 0; i < sixtyCount % 2; i++) {
            newCombination.push(60);
        }
        return newCombination.sort((a, b) => b - a);
    }
    
    return null;
}

// 显示D-Artepp结果
export function displayDarteppResult(container) {
    const { currentWeight, currentLanguage } = getCurrentValues();
    const result = findDosageRecommendation(currentWeight);
    
    if (!result) {
        showWeightOutOfRangeError(container);
        return;
    }
    
    // 根据当前语言获取药品名称
    const medicationType = dosage => {
        if (typeof dosage.type === 'object') {
            return dosage.type[currentLanguage] || dosage.type.en;
        }
        return dosage.type;
    };
    
    // 获取药品单位的翻译
    const getTabletText = () => {
        switch(currentLanguage) {
            case 'zh': return '片';
            case 'fr': return 'comprimés';
            default: return 'tablets';
        }
    };
    
    const tabletText = getTabletText();
    
    const dosageHtml = result.dosages.map(dosage => `
        <div class="bg-white rounded-lg p-4 mb-3 border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-center mb-2">
                <div>
                    <span class="font-semibold text-gray-800">${medicationType(dosage)}</span>
                    <span class="ml-2 text-sm text-gray-600">${dosage.specification}</span>
                </div>
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold">${dosage.count} ${tabletText}</span>
            </div>
            <div class="text-sm text-gray-600">
                ${window.translations?.[currentLanguage]?.dosageInstruction || 'Recommended dosage:'} ${window.translations?.[currentLanguage]?.takeDaily || 'Take daily'} ${dosage.count} ${tabletText} ${window.translations?.[currentLanguage]?.forDays || 'for 3 days'}
            </div>
        </div>
    `).join('');
    
    // 使用辅助函数获取处理后的标题
    const dosageTitle = getDosageResultTitle(currentWeight);
    const productSubtitle = getProductSubtitle();
    
    container.innerHTML = `
        <div class="dosage-result p-6 rounded-lg">
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div class="mb-4 md:mb-0">
                    <h4 class="text-lg font-semibold text-gray-800">${dosageTitle}</h4>
                    <p class="text-sm text-gray-600 mt-1">${productSubtitle}</p>
                </div>
                <div class="text-center md:text-right">
                    <div class="text-2xl font-bold number-display text-blue-600">${currentWeight.toFixed(1)} kg</div>
                    <div class="text-sm text-gray-500">${window.translations?.[currentLanguage]?.patientWeight || 'Patient Weight'}</div>
                </div>
            </div>
            
            <div class="space-y-3 mb-6">
                <h5 class="font-medium text-gray-700">${window.translations?.[currentLanguage]?.recommendedMedication || 'Recommended Medication Plan:'}</h5>
                ${dosageHtml}
            </div>
            
            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <p class="text-sm text-blue-800">
                            <strong>${window.translations?.[currentLanguage]?.medicationInstructions || 'Medication Instructions:'}</strong> 
                            ${window.translations?.[currentLanguage]?.pleaseFollow || 'Please strictly follow medical advice. Seek medical attention immediately if adverse reactions occur.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 显示Argesun结果
export function displayArgesunResult(container) {
    const { currentWeight, selectedProduct, currentLanguage } = getCurrentValues();
    const result = findArgesunDosage(currentWeight);
    
    if (!result) {
        showWeightOutOfRangeError(container);
        return;
    }
    
    // 根据当前语言获取药品单位的翻译
    const getVialText = () => {
        switch(currentLanguage) {
            case 'zh': return '瓶';
            case 'fr': return 'flacon';
            default: return 'vial';
        }
    };
    
    const vialText = getVialText();
    const mlText = currentLanguage === 'zh' ? '毫升' : 'ml';
    
    // 构建规格显示HTML
    const strengthsHtml = Object.entries(result.recommendedStrengths).map(([strength, count]) => {
        const strengthInfo = selectedProduct.strengths.find(s => s.mg === parseInt(strength));
        
        return `
            <div class="bg-white rounded-lg p-4 mb-3 border border-gray-200 hover:shadow transition-shadow">
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <span class="font-bold text-blue-700">${strength}</span>
                        </div>
                        <div>
                            <div class="font-semibold text-gray-800">Argesun® ${strength}mg</div>
                            <div class="text-sm text-gray-600">
                                ${window.translations?.[currentLanguage]?.reconstitutionVolume || 'Reconstitution volume'}: ${strengthInfo?.solventVolume || 0}${mlText}
                            </div>
                        </div>
                    </div>
                    <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full font-bold">
                        ${count} ${vialText}${currentLanguage === 'zh' ? '' : (count > 1 ? 's' : '')}
                    </span>
                </div>
            </div>
        `;
    }).join('');
    
    // 使用辅助函数获取处理后的标题
    const dosageTitle = getDosageResultTitle(currentWeight);
    const productSubtitle = getProductSubtitle();
    
    container.innerHTML = `
        <div class="dosage-result p-6 rounded-lg">
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div class="mb-4 md:mb-0">
                    <h4 class="text-lg font-semibold text-gray-800">${dosageTitle}</h4>
                    <p class="text-sm text-gray-600 mt-1">${productSubtitle}</p>
                </div>
                <div class="text-center md:text-right">
                    <div class="text-2xl font-bold number-display text-blue-600">${currentWeight.toFixed(1)} kg</div>
                    <div class="text-sm text-gray-500">${window.translations?.[currentLanguage]?.patientWeight || 'Patient Weight'}</div>
                </div>
            </div>
            
            <!-- 规格选择 -->
            <div class="space-y-3 mb-6">
                <h5 class="font-medium text-gray-700">${window.translations?.[currentLanguage]?.selectStrength || 'Select Strength Combination'}:</h5>
                ${strengthsHtml}
            </div>
            
            <!-- 溶液体积和注射体积信息 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <!-- 碳酸氢钠和精氨酸溶液体积 -->
                <div class="bg-white p-4 rounded-lg border border-gray-200">
                    <div class="flex items-center justify-between mb-3">
                        <div>
                            <div class="text-sm text-gray-600 mb-1">${window.translations?.[currentLanguage]?.solutionVolume || 'Solution Volume'}</div>
                            <div class="text-2xl font-bold text-blue-600 number-display">${result.reconstitutionVolume} ${mlText}</div>
                        </div>
                        <div class="bg-blue-50 p-2 rounded-lg">
                            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="text-xs text-gray-500 mt-2">
                        ${window.translations?.[currentLanguage]?.bicarbonateSodiumArginine || 'bicarbonate sodium and arginine'}
                    </div>
                </div>
                
                <!-- 注射体积 -->
                <div class="bg-white p-4 rounded-lg border border-gray-200">
                    <div class="flex items-center justify-between mb-3">
                        <div>
                            <div class="text-sm text-gray-600 mb-1">${window.translations?.[currentLanguage]?.injectionVolume || 'Injection Volume'}</div>
                            <div class="text-2xl font-bold text-green-600 number-display">${result.injectionVolume.toFixed(1)} ${mlText}</div>
                        </div>
                        <div class="bg-green-50 p-2 rounded-lg">
                            <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="text-xs text-gray-500 mt-2">
                        ${window.translations?.[currentLanguage]?.finalConcentration || 'Final Concentration'}: ${result.concentration}
                    </div>
                </div>
            </div>
            
            <!-- 重要提示 -->
            <div class="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <div>
                        <p class="text-sm text-amber-800 font-medium mb-1">
                            ${window.translations?.[currentLanguage]?.ivImNote || 'Note: Same volume for IV and IM injection (20mg/ml)'}
                        </p>
                        <p class="text-sm text-amber-700">
                            <strong>${window.translations?.[currentLanguage]?.administrationMethod || 'Administration Method:'}</strong> 
                            ${window.translations?.[currentLanguage]?.immediateUse || 'Must be used within 1 hour after reconstitution'}
                        </p>
                    </div>
                </div>
            </div>
            
            <!-- 用药说明 -->
            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <p class="text-sm text-blue-800">
                            <strong>${window.translations?.[currentLanguage]?.medicationInstructions || 'Medication Instructions:'}</strong> 
                            ${window.translations?.[currentLanguage]?.pleaseFollow || 'Please strictly follow medical advice. Seek medical attention immediately if adverse reactions occur.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getArgesunAlternatives(currentCombination, product) {
    if (!product || !product.strengths) return [];
    
    const strengths = product.strengths.map(s => s.mg).sort((a, b) => b - a);
    const currentTotal = currentCombination.reduce((sum, mg) => sum + mg, 0);
    const alternatives = [];
    
    // 生成可能的替代组合
    for (let i = 0; i < strengths.length; i++) {
        const altCombination = [];
        const altStrength = strengths[i];
        
        // 尝试使用单一规格
        const count = Math.ceil(currentTotal / altStrength);
        for (let j = 0; j < count; j++) {
            altCombination.push(altStrength);
        }
        
        const altTotal = altCombination.reduce((sum, mg) => sum + mg, 0);
        
        // 只添加合理的替代方案（不超过当前总剂量的±10%）
        if (altTotal >= currentTotal * 0.95 && altTotal <= currentTotal * 1.1) {
            const strengthCounts = {};
            altCombination.forEach(mg => {
                strengthCounts[mg] = (strengthCounts[mg] || 0) + 1;
            });
            
            alternatives.push({
                combination: altCombination,
                totalMg: altTotal,
                recommendedStrengths: strengthCounts
            });
        }
    }
    
    return alternatives;
}

// 显示Artesun结果
export function displayArtesunResult(container) {
    const { currentWeight, selectedProduct, injectionRoute, currentLanguage } = getCurrentValues();
    const result = findArtesunDosage(currentWeight);
    
    if (!result) {
        showWeightOutOfRangeError(container);
        return;
    }
    
    const isIV = result.route === 'iv';
    const mlText = currentLanguage === 'zh' ? '毫升' : 'ml';
    const mgText = currentLanguage === 'zh' ? '毫克' : 'mg';
    
    // 获取替代方案
    const alternatives = getArtesunAlternatives(result.combination, selectedProduct);
    
    // 构建规格显示HTML
    const strengthsHtml = Object.entries(result.recommendedStrengths).map(([strength, count]) => {
        const strengthInfo = selectedProduct.strengths.find(s => s.mg === parseInt(strength));
        
        // 查找此规格的替代方案
        const strengthAlternatives = alternatives.filter(alt => {
            const altStrength = parseInt(Object.keys(alt.recommendedStrengths)[0]);
            return altStrength !== parseInt(strength) && 
                   alt.totalMg >= result.totalDose * 0.95 && 
                   alt.totalMg <= result.totalDose * 1.1;
        });
        
        let alternativesHtml = '';
        if (strengthAlternatives.length > 0) {
            const altText = strengthAlternatives.map(alt => {
                const altStrength = Object.keys(alt.recommendedStrengths)[0];
                const altCount = alt.recommendedStrengths[altStrength];
                return `${altCount} × ${altStrength}mg`;
            }).join(', ');
            
            alternativesHtml = `
                <div class="mt-2 text-xs text-gray-500">
                    <span class="font-medium">${window.translations?.[currentLanguage]?.alternativeOptions || 'Alternative Options:'}</span> ${altText}
                </div>
            `;
        }
        
        return `
            <div class="bg-white rounded-lg p-4 mb-3 border border-gray-200 hover:shadow transition-shadow">
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                            <span class="font-bold text-blue-700 text-lg">${strength}</span>
                        </div>
                        <div>
                            <div class="font-semibold text-gray-800">Artesun® ${strength}${mgText}</div>
                            <div class="text-sm text-gray-600 space-y-1">
                                <div>${window.translations?.[currentLanguage]?.bicarbonateVolume || 'Bicarbonate'}: ${strengthInfo?.bicarbonateVolume || 0}${mlText}</div>
                                <div>${window.translations?.[currentLanguage]?.salineVolume || 'Saline'}: ${isIV ? strengthInfo?.salineVolume || 0 : strengthInfo?.imSalineVolume || 0}${mlText}</div>
                            </div>
                            ${alternativesHtml}
                        </div>
                    </div>
                    <span class="px-3 py-2 bg-green-100 text-green-800 rounded-full font-bold">
                        ${count} ${window.translations?.[currentLanguage]?.vial || 'vial'}${currentLanguage === 'zh' ? '' : (count > 1 ? 's' : '')}
                    </span>
                </div>
            </div>
        `;
    }).join('');
    
    // 核心信息卡片 - 修改后去掉总剂量
    const coreInfoCards = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <!-- 碳酸氢钠体积 -->
            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm text-green-600 mb-1">${window.translations?.[currentLanguage]?.bicarbonateVolume || 'Bicarbonate Volume'}</div>
                        <div class="text-2xl font-bold text-green-700">${result.totalBicarbonateVolume} ${mlText}</div>
                    </div>
                    <div class="bg-green-100 p-2 rounded-lg">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                        </svg>
                    </div>
                </div>
                <div class="text-xs text-green-600 mt-2">
                    <div class="font-medium">${window.translations?.[currentLanguage]?.reconstitutionNote || 'Reconstitution Note'}:</div>
                    <div>${window.translations?.[currentLanguage]?.useAllBicarbonate || 'Use all content of bicarbonate ampoule'}</div>
                </div>
            </div>
            
            <!-- 氯化钠体积 -->
            <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm text-purple-600 mb-1">${window.translations?.[currentLanguage]?.salineVolume || 'Saline Volume'}</div>
                        <div class="text-2xl font-bold text-purple-700">${result.totalSalineVolume} ${mlText}</div>
                    </div>
                    <div class="bg-purple-100 p-2 rounded-lg">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                        </svg>
                    </div>
                </div>
                <div class="text-xs text-purple-600 mt-2">
                    <div class="font-medium">${window.translations?.[currentLanguage]?.diluteNote || 'Dilution Note'}:</div>
                    <div>${window.translations?.[currentLanguage]?.removeAir || 'Remove air from ampoule before saline injection'}</div>
                </div>
            </div>
        </div>
    `;
    
    // 患者最终用量信息
    const patientInjectionInfo = `
    <div class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
        <div class="flex items-center justify-between mb-2">
            <div>
                <h5 class="font-bold text-lg text-blue-800">${window.translations?.[currentLanguage]?.patientInjection || 'Patient Final Injection'}</h5>
                <p class="text-sm text-blue-600">${isIV ? window.translations?.[currentLanguage]?.ivRouteDesc || 'Slow IV injection' : window.translations?.[currentLanguage]?.imRouteDesc || 'IM injection'}</p>
            </div>
            <div class="text-right">
                <div class="text-3xl font-bold text-green-700">${result.roundedInjectionVolume} ${mlText}</div>
                <div class="text-sm text-gray-600">${window.translations?.[currentLanguage]?.finalInjectionVolume || 'Final volume'}</div>
            </div>
        </div>
    </div>
`;
    
    container.innerHTML = `
        <div class="dosage-result p-6 rounded-lg bg-white">
            <!-- 顶部信息栏 -->
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div class="mb-4 md:mb-0">
                    <h4 class="text-lg font-semibold text-gray-800">${getDosageResultTitle(currentWeight)}</h4>
                    <p class="text-sm text-gray-600 mt-1">${getProductSubtitle()}</p>
                </div>
                <div class="text-center md:text-right">
                    <div class="inline-flex items-center px-3 py-1 rounded-full ${isIV ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'} mb-2">
                        <span class="font-bold">${isIV ? window.translations?.[currentLanguage]?.ivRoute || 'IV' : window.translations?.[currentLanguage]?.imRoute || 'IM'}</span>
                    </div>
                    <div class="text-2xl font-bold text-blue-600">${result.weight.toFixed(1)} kg</div>
                    <div class="text-sm text-gray-500">${window.translations?.[currentLanguage]?.patientWeight || 'Patient Weight'}</div>
                </div>
            </div>
            
            ${coreInfoCards}
            
            <!-- 患者最终用量信息 -->
            ${patientInjectionInfo}
            
            <!-- 规格选择 -->
            <div class="mb-6">
                <h5 class="font-medium text-gray-700 mb-3">${window.translations?.[currentLanguage]?.selectStrength || 'Select Strength'}:</h5>
                <div class="mb-2 text-sm text-blue-600">
                    ${window.translations?.[currentLanguage]?.optimalSelection || 'Optimal Selection'}: ${result.combination.map(mg => `${mg}mg`).join(' + ')}
                </div>
                ${strengthsHtml}
            </div>
            
            <!-- 重要警告 -->
            <div class="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <div>
                        <p class="text-sm text-red-800 font-medium mb-2">
                            ${window.translations?.[currentLanguage]?.reconstitutionNote || 'Important Notes'}
                        </p>
                        <ul class="text-sm text-red-700 space-y-1">
                            <li>• ${window.translations?.[currentLanguage]?.useAllBicarbonate || 'Use all bicarbonate'}</li>
                            <li>• ${window.translations?.[currentLanguage]?.removeAir || 'Remove air before injection'}</li>
                            <li>• ${window.translations?.[currentLanguage]?.immediateUse || 'Use within 1 hour'}</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- 用药说明 -->
            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <p class="text-sm text-blue-800">
                            <strong>${window.translations?.[currentLanguage]?.medicationInstructions || 'Medication Instructions:'}</strong> 
                            ${window.translations?.[currentLanguage]?.pleaseFollow || 'Please strictly follow medical advice. Seek medical attention immediately if adverse reactions occur.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getArtesunAlternatives(currentCombination, product) {
    if (!product || !product.strengths) return [];
    
    const strengths = product.strengths.map(s => s.mg).sort((a, b) => b - a);
    const currentTotal = currentCombination.reduce((sum, mg) => sum + mg, 0);
    const alternatives = [];
    
    // 生成可能的替代组合
    for (let i = 0; i < strengths.length; i++) {
        const altCombination = [];
        const altStrength = strengths[i];
        
        // 尝试使用单一规格
        const count = Math.ceil(currentTotal / altStrength);
        for (let j = 0; j < count; j++) {
            altCombination.push(altStrength);
        }
        
        const altTotal = altCombination.reduce((sum, mg) => sum + mg, 0);
        
        // 只添加合理的替代方案（不超过当前总剂量的±10%）
        if (altTotal >= currentTotal * 0.95 && altTotal <= currentTotal * 1.1) {
            const strengthCounts = {};
            altCombination.forEach(mg => {
                strengthCounts[mg] = (strengthCounts[mg] || 0) + 1;
            });
            
            alternatives.push({
                combination: altCombination,
                totalMg: altTotal,
                recommendedStrengths: strengthCounts
            });
        }
    }
    
    return alternatives;
}

// ==================== 辅助函数 ====================

// 辅助函数：处理剂量标题中的占位符
export function getDosageResultTitle(weight) {
    const { selectedProduct, currentLanguage } = getCurrentValues();
    
    if (!selectedProduct) {
        return window.translations?.[currentLanguage]?.selectProduct || 'Please select a product';
    }
    
    let titleTemplate;
    
    if (selectedProduct.id === 'dartepp') {
        titleTemplate = window.translations?.[currentLanguage]?.darteppDosageResultTitle || 'D-Artepp® dosage based on weight';
    } else if (selectedProduct.id === 'argesun') {
        titleTemplate = window.translations?.[currentLanguage]?.argesunDosageResultTitle || 'Argesun® dosage based on weight';
    } else if (selectedProduct.id === 'artesun') {
        titleTemplate = window.translations?.[currentLanguage]?.artesunDosageResultTitle || 'Artesun® dosage based on weight {weight}kg';
    } else {
        titleTemplate = 'Recommended dosage based on weight';
    }
    
    // 检查标题模板中是否包含 {weight} 占位符
    if (titleTemplate.includes('{weight}')) {
        // 替换占位符为实际体重
        return titleTemplate.replace('{weight}', weight.toFixed(1));
    } else {
        // 没有占位符，直接返回标题
        return titleTemplate;
    }
}

// 获取产品副标题
export function getProductSubtitle() {
    const { selectedProduct, currentLanguage } = getCurrentValues();
    
    if (!selectedProduct) return '';
    
    if (selectedProduct.id === 'dartepp') {
        return window.translations?.[currentLanguage]?.darteppDosageResultSubtitle || 'D-Artepp® - Three-day treatment plan';
    } else if (selectedProduct.id === 'argesun') {
        return window.translations?.[currentLanguage]?.argesunDosageResultSubtitle || 'Argesun® - Injectable Artesunate (Single Solvent)';
    } else if (selectedProduct.id === 'artesun') {
        return window.translations?.[currentLanguage]?.artesunDosageResultSubtitle || 'Artesun® - Injectable Artesunate (Dual Solvent)';
    }
    return '';
}

// 显示选择体重提示
export function showSelectWeightPrompt(container) {
    const { currentLanguage } = getCurrentValues();
    
    container.innerHTML = `
        <div class="text-center text-gray-500 py-8">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            <p class="text-lg font-medium mb-2">${window.translations?.[currentLanguage]?.selectWeight || 'Please select weight'}</p>
            <p class="text-sm">${window.translations?.[currentLanguage]?.selectWeightDesc || 'Slide the dial on the left to set patient weight'}</p>
        </div>
    `;
}

// 显示体重超出范围错误
export function showWeightOutOfRangeError(container) {
    const { selectedProduct, currentLanguage } = getCurrentValues();
    
    // 根据产品显示不同的范围提示
    const checkWeightText = selectedProduct?.id === 'dartepp' ? 
        window.translations?.[currentLanguage]?.checkWeightDartepp || 'Please check if weight input is correct (5-100kg)' :
        window.translations?.[currentLanguage]?.checkWeight || 'Please check if weight input is correct (0-100kg)';
    
    container.innerHTML = `
        <div class="text-center text-red-500 py-8">
            <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <p class="font-medium">${window.translations?.[currentLanguage]?.weightOutOfRange || 'Weight out of range'}</p>
            <p class="text-sm">${checkWeightText}</p>
        </div>
    `;
}

// 更新剂量显示 - 这个函数需要被全局访问
export function updateDosageDisplay() {
    const dosageResult = document.getElementById('dosageResult');
    if (!dosageResult) return;
    
    const { selectedProduct, currentWeight } = getCurrentValues();
    
    // 如果没有选择产品，显示默认提示
    if (!selectedProduct) {
        showSelectWeightPrompt(dosageResult);
        return;
    }
    
    // 检查体重是否在有效范围内
    const minWeight = selectedProduct.id === 'dartepp' ? 5 : 0;
    if (currentWeight < minWeight || currentWeight > 100) {
        showWeightOutOfRangeError(dosageResult);
        return;
    }
    
    // 根据产品类型选择不同的计算和显示方式
    if (selectedProduct.id === 'dartepp') {
        displayDarteppResult(dosageResult);
    } else if (selectedProduct.id === 'argesun') {
        displayArgesunResult(dosageResult);
    } else if (selectedProduct.id === 'artesun') {
        displayArtesunResult(dosageResult);
    }
}

// 将函数导出到全局
if (typeof window !== 'undefined') {
    window.updateDosageDisplay = updateDosageDisplay;
    window.setInjectionRoute = setInjectionRoute;
    console.log('Dosage module functions exported to window');
}