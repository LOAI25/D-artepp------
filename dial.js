// dial.js - 刻度盘功能模块
// 版本：v8.7

// 使用函数获取器而不是直接变量
let getCurrentWeight, getSelectedProduct, getCurrentLanguage, getInjectionRoute;
let isDragging = false;
let startAngle = 0;
let currentRotation = 0;

// 初始化函数，由主文件调用
export function initializeModule(globalVars) {
    if (globalVars) {
        getCurrentWeight = globalVars.currentWeight;
        getSelectedProduct = globalVars.selectedProduct;
        getCurrentLanguage = globalVars.currentLanguage;
        getInjectionRoute = globalVars.injectionRoute;
        
        // 如果有其他函数依赖，也保存起来
        if (globalVars.updateDosageDisplay) {
            window.updateDosageDisplay = globalVars.updateDosageDisplay;
        }
        
        if (globalVars.updateWeightRangeHint) {
            window.updateWeightRangeHint = updateWeightRangeHint;
        }
        
        console.log('Dial module initialized:', {
            hasCurrentWeight: !!getCurrentWeight,
            hasSelectedProduct: !!getSelectedProduct
        });
    }
}

// 辅助函数：获取当前值
function getCurrentValues() {
    return {
        currentWeight: getCurrentWeight ? getCurrentWeight() : window.currentWeight,
        selectedProduct: getSelectedProduct ? getSelectedProduct() : window.selectedProduct,
        currentLanguage: getCurrentLanguage ? getCurrentLanguage() : window.currentLanguage,
        injectionRoute: getInjectionRoute ? getInjectionRoute() : window.injectionRoute
    };
}

// ==================== 通用刻度盘函数 ====================

// 通用刻度盘初始化
export function initializeGeneralScale() {
    const scaleContainer = document.getElementById('scaleContainer');
    if (!scaleContainer) return;
    
    scaleContainer.innerHTML = '';
    
    // 通用刻度范围: 0-100kg
    const minWeight = 0;
    const maxWeight = 100;
    const step = 1;
    const majorStep = 10;
    
    // 创建刻度线和数字
    for (let kg = minWeight; kg <= maxWeight; kg += step) {
        const angle = mapGeneralWeightToAngle(kg);
        
        // 创建刻度线
        const line = document.createElement('div');
        line.className = kg % majorStep === 0 ? 'scale-line major' : 'scale-line minor';
        line.style.transform = `translateX(-50%) rotate(${angle}deg)`;
        scaleContainer.appendChild(line);
        
        // 创建数字标签
        if (kg % majorStep === 0) {
            const number = document.createElement('div');
            number.className = 'scale-number';
            number.textContent = kg;
            number.style.transform = `translateX(-50%) rotate(${angle}deg)`;
            scaleContainer.appendChild(number);
        }
    }
}

// 通用体重→角度映射
function mapGeneralWeightToAngle(weight) {
    return 0 + weight * (180 / 100);
}

// 通用角度→体重映射
function mapAngleToGeneralWeight(angle) {
    let weight = angle * (100 / 180);
    weight = Math.max(0, Math.min(100, weight));
    
    if (weight <= 0.05) {
        weight = 0.1;
    }
    
    return weight;
}

// 通用体重设置
export function setGeneralWeight(weight) {
    weight = parseFloat(weight);
    if (isNaN(weight)) return;
    
    if (weight < 0.1) {
        weight = 0.1;
    } else if (weight > 100) {
        weight = 100;
    }
    
    // 更新全局变量
    if (window.currentWeight !== undefined) {
        window.currentWeight = weight;
    }
    
    const originalAngle = mapGeneralWeightToAngle(weight);
    currentRotation = 0 - originalAngle;
    currentRotation = Math.max(-180, Math.min(0, currentRotation));
    
    updateDialRotation();
}

// ==================== D-ARTEPP专用刻度盘函数 ====================

// D-Artepp专用刻度盘初始化
export function initializeDarteppScale() {
    const scaleContainer = document.getElementById('scaleContainer');
    if (!scaleContainer) return;
    
    scaleContainer.innerHTML = '';
    
    // D-Artepp刻度范围: 5-100kg
    const minWeight = 5;
    const maxWeight = 100;
    const step = 1;
    const majorStep = 5;
    
    // 创建刻度线和数字
    for (let kg = minWeight; kg <= maxWeight; kg += step) {
        const angle = mapDarteppWeightToAngle(kg);
        
        // 创建刻度线
        const line = document.createElement('div');
        line.className = kg % majorStep === 0 ? 'scale-line major' : 'scale-line minor';
        line.style.transform = `translateX(-50%) rotate(${angle}deg)`;
        scaleContainer.appendChild(line);
        
        // 创建数字标签（每10kg一个数字，加上5kg）
        if (kg % 10 === 0 || kg === 5) {
            const number = document.createElement('div');
            number.className = 'scale-number';
            number.textContent = kg;
            number.style.transform = `translateX(-50%) rotate(${angle}deg)`;
            scaleContainer.appendChild(number);
        }
    }
}

// D-Artepp专用体重→角度映射
function mapDarteppWeightToAngle(weight) {
    // D-Artepp: 5kg=135°，100kg=45°
    return 0 + (weight) * (171 / 95);
}

// D-Artepp专用角度→体重映射
function mapAngleToDarteppWeight(angle) {
    let weight = angle * (95 / 171);
    weight = Math.max(5, Math.min(100, weight));
    
    return weight;
}

// D-Artepp专用体重设置
export function setDarteppWeight(weight) {
    weight = parseFloat(weight);
    if (isNaN(weight)) return;
    
    if (weight < 5) {
        weight = 5;
    } else if (weight > 100) {
        weight = 100;
    }
    
    // 更新全局变量
    if (window.currentWeight !== undefined) {
        window.currentWeight = weight;
    }
    
    const originalAngle = mapDarteppWeightToAngle(weight);
    currentRotation = 0 - originalAngle;
    currentRotation = Math.max(-180, Math.min(-9, currentRotation));
    
    updateDialRotation();
}

// ==================== 主刻度盘初始化函数 ====================

// 主刻度盘初始化函数
export function initializeScale() {
    const { selectedProduct } = getCurrentValues();
    
    console.log('Initializing scale for product:', selectedProduct?.id);
    
    if (selectedProduct && selectedProduct.id === 'dartepp') {
        initializeDarteppScale();
    } else {
        initializeGeneralScale();
    }
}

// D-Artepp专用快速选择按钮设置
export function setupDarteppQuickSelectButtons() {
    // 隐藏小于5kg的按钮
    document.querySelectorAll('.quick-select-button').forEach(button => {
        const weightText = button.textContent.replace('kg', '').trim();
        const weight = parseInt(weightText);
        if (weight < 5) {
            button.style.display = 'none';
        } else {
            button.style.display = 'inline-flex';
        }
    });
}

// 恢复通用快速选择按钮
export function setupGeneralQuickSelectButtons() {
    document.querySelectorAll('.quick-select-button').forEach(button => {
        button.style.display = 'inline-flex';
    });
}

// ==================== 工具函数 ====================

// 更新刻度盘旋转
function updateDialRotation() {
    const semicircleDial = document.getElementById('semicircleDial');
    if (!semicircleDial) return;
    
    semicircleDial.style.transform = `rotate(${currentRotation}deg)`;
    
    // 旋转后，指针指向的刻度原始角度 = 90° - currentRotation
    const originalAngle = 0 - currentRotation;
    
    const { selectedProduct } = getCurrentValues();
    let newWeight;
    
    // 根据产品选择对应的映射函数
    if (selectedProduct && selectedProduct.id === 'dartepp') {
        newWeight = mapAngleToDarteppWeight(originalAngle);
    } else {
        newWeight = mapAngleToGeneralWeight(originalAngle);
    }
    
    // 更新全局变量
    if (window.currentWeight !== undefined) {
        window.currentWeight = newWeight;
    }
    
    // 更新显示
    updateWeightDisplay();
}

// 更新体重显示
export function updateWeightDisplay() {
    const { currentWeight, selectedProduct } = getCurrentValues();
    
    const currentWeightDisplay = document.getElementById('currentWeight');
    const manualWeightInput = document.getElementById('manualWeight');
    
    // 检查体重是否在有效范围内
    if (selectedProduct && selectedProduct.id === 'dartepp') {
        if (currentWeight < 5) {
            setDarteppWeight(5);
            return;
        }
    } else {
        if (currentWeight < 0.1) {
            setGeneralWeight(0.1);
            return;
        }
    }
    
    if (currentWeightDisplay) {
        currentWeightDisplay.textContent = currentWeight.toFixed(1);
    }
    
    if (manualWeightInput) {
        manualWeightInput.value = currentWeight.toFixed(1);
        // 设置最小输入值
        manualWeightInput.min = selectedProduct?.id === 'dartepp' ? '5' : '0.1';
    }
    
    // 更新体重范围提示
    updateWeightRangeHint();
    
    // 如果已选择产品，自动更新剂量显示
    if (selectedProduct) {
        // 调用剂量显示更新函数
        if (typeof window.updateDosageDisplay === 'function') {
            window.updateDosageDisplay();
        }
    }
}

// 更新体重范围提示
export function updateWeightRangeHint() {
    const weightRangeHint = document.getElementById('weightRangeHint');
    if (!weightRangeHint) return;
    
    const { selectedProduct, currentLanguage } = getCurrentValues();
    
    // 根据产品和语言更新范围提示
    if (selectedProduct && selectedProduct.id === 'dartepp') {
        // D-Artepp: 5-100kg
        weightRangeHint.textContent = window.translations?.[currentLanguage]?.weightRangeDartepp || 'Range: 5-100kg';
        weightRangeHint.style.color = '#ef4444';
        weightRangeHint.style.fontWeight = '500';
    } else {
        // 其他产品: 0-100kg
        weightRangeHint.textContent = window.translations?.[currentLanguage]?.weightRange || 'Range: 0-100kg';
        weightRangeHint.style.color = '#6b7280';
        weightRangeHint.style.fontWeight = 'normal';
    }
}

// 设置体重 - 这个函数会被HTML中的onclick调用
export function setWeight(weight) {
    weight = parseFloat(weight);
    if (isNaN(weight)) return;
    
    const { selectedProduct } = getCurrentValues();
    
    console.log('setWeight called:', { weight, selectedProduct: selectedProduct?.id });
    
    // 根据产品选择对应的设置函数
    if (selectedProduct && selectedProduct.id === 'dartepp') {
        setDarteppWeight(weight);
    } else {
        setGeneralWeight(weight);
    }
}

// ==================== 拖拽处理函数 ====================

// D-Artepp专用拖拽处理
function handleDarteppDialDrag(e, isTouch = false) {
    if (!isDragging) return;
    
    const semicircleDial = document.getElementById('semicircleDial');
    const rect = semicircleDial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let clientX, clientY;
    if (isTouch) {
        const touch = e.touches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    const currentAngle = Math.atan2(clientY - centerY, clientX - centerX) * 180 / Math.PI;
    const deltaAngle = currentAngle - startAngle;
    
    currentRotation += deltaAngle * 0.5;
    currentRotation = Math.max(-180, Math.min(-9, currentRotation));
    
    semicircleDial.style.transform = `rotate(${currentRotation}deg)`;
    
    const originalAngle = 0 - currentRotation;
    let calculatedWeight = mapAngleToDarteppWeight(originalAngle);
    
    // 更新全局变量
    if (window.currentWeight !== undefined) {
        window.currentWeight = calculatedWeight;
    }
    
    startAngle = currentAngle;
    updateWeightDisplay();
}

// 通用拖拽处理
function handleGeneralDialDrag(e, isTouch = false) {
    if (!isDragging) return;
    
    const semicircleDial = document.getElementById('semicircleDial');
    const rect = semicircleDial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let clientX, clientY;
    if (isTouch) {
        const touch = e.touches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    const currentAngle = Math.atan2(clientY - centerY, clientX - centerX) * 180 / Math.PI;
    const deltaAngle = currentAngle - startAngle;
    
    currentRotation += deltaAngle * 0.5;
    currentRotation = Math.max(-180, Math.min(0, currentRotation));
    
    semicircleDial.style.transform = `rotate(${currentRotation}deg)`;
    
    const originalAngle = 0 - currentRotation;
    let calculatedWeight = mapAngleToGeneralWeight(originalAngle);
    
    if (calculatedWeight <= 0.05) {
        calculatedWeight = 0.1;
    }
    
    // 更新全局变量
    if (window.currentWeight !== undefined) {
        window.currentWeight = calculatedWeight;
    }
    
    startAngle = currentAngle;
    updateWeightDisplay();
}

// ==================== 事件处理 ====================

// 设置刻度盘拖拽事件
export function setupDialEvents() {
    const semicircleDial = document.getElementById('semicircleDial');
    if (!semicircleDial) return;
    
    console.log('Setting up dial events');
    
    // 鼠标事件
    semicircleDial.addEventListener('mousedown', function(e) {
        isDragging = true;
        const rect = this.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
        document.body.style.cursor = 'grabbing';
        this.style.transition = 'none';
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const { selectedProduct } = getCurrentValues();
        
        if (selectedProduct && selectedProduct.id === 'dartepp') {
            handleDarteppDialDrag(e, false);
        } else {
            handleGeneralDialDrag(e, false);
        }
    });
    
    document.addEventListener('mouseup', function() {
        if (!isDragging) return;
        
        isDragging = false;
        document.body.style.cursor = 'default';
        
        const semicircleDial = document.getElementById('semicircleDial');
        if (semicircleDial) {
            semicircleDial.style.transition = 'transform 0.2s ease';
        }
        
        const { selectedProduct, currentWeight } = getCurrentValues();
        
        // 检查体重最小值
        if (selectedProduct && selectedProduct.id === 'dartepp') {
            if (currentWeight <= 5) {
                setWeight(5);
            }
        } else {
            if (currentWeight <= 0.05) {
                setWeight(0.1);
            }
        }
    });

    // 触摸事件
    semicircleDial.addEventListener('touchstart', function(e) {
        isDragging = true;
        const touch = e.touches[0];
        const rect = this.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        startAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * 180 / Math.PI;
        this.style.transition = 'none';
    });

    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const { selectedProduct } = getCurrentValues();
        
        if (selectedProduct && selectedProduct.id === 'dartepp') {
            handleDarteppDialDrag(e, true);
        } else {
            handleGeneralDialDrag(e, true);
        }
    });

    document.addEventListener('touchend', function() {
        if (!isDragging) return;
        
        isDragging = false;
        const semicircleDial = document.getElementById('semicircleDial');
        if (semicircleDial) {
            semicircleDial.style.transition = 'transform 0.2s ease';
        }
        
        const { selectedProduct, currentWeight } = getCurrentValues();
        
        // 检查体重最小值
        if (selectedProduct && selectedProduct.id === 'dartepp') {
            if (currentWeight <= 5) {
                setWeight(5);
            }
        } else {
            if (currentWeight <= 0.05) {
                setWeight(0.1);
            }
        }
    });
}

// 导出到window对象供其他模块使用
window.setWeight = setWeight;
window.updateWeightDisplay = updateWeightDisplay;
window.updateWeightRangeHint = updateWeightRangeHint;

console.log('Dial module loaded');