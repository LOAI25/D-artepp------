// index.js - 主入口文件
// 版本：v8.9
// 日期：2024-01-20

// 全局变量声明
window.currentWeight = 35.0;
window.selectedProduct = null;
window.isDragging = false;
window.startAngle = 0;
window.currentRotation = 0;
window.currentLanguage = 'en';
window.injectionRoute = 'iv';

// 导入模块
import * as translationsModule from './translations.js';
import * as productsModule from './products.js';
import * as dialModule from './dial.js';
import * as dosageModule from './dosage.js';
import * as languageModule from './language.js';

// 初始化所有模块的全局变量依赖
function initializeGlobalDependencies() {
    console.log('Initializing global dependencies...');
    
    // 确保全局数据可用
    window.translations = translationsModule.translations || {};
    window.darteppData = productsModule.darteppData || {};
    window.argesunData = productsModule.argesunData || {};
    window.artesunData = productsModule.artesunData || {};
    
    // 传递全局变量引用给各个模块
    if (dialModule.initializeModule) {
        dialModule.initializeModule({
            currentWeight: () => window.currentWeight,
            selectedProduct: () => window.selectedProduct,
            currentLanguage: () => window.currentLanguage,
            injectionRoute: () => window.injectionRoute
        });
    }
    
    if (dosageModule.initializeModule) {
        dosageModule.initializeModule({
            selectedProduct: () => window.selectedProduct,
            currentWeight: () => window.currentWeight,
            currentLanguage: () => window.currentLanguage,
            injectionRoute: () => window.injectionRoute
        });
    }
    
    if (languageModule.initializeModule) {
        languageModule.initializeModule({
            currentLanguage: () => window.currentLanguage
        });
    }
    
    // 导出关键函数到window对象，供模块间调用
    window.updateDosageDisplay = dosageModule.updateDosageDisplay;
    window.updateRouteButtons = dosageModule.updateRouteButtons;
    window.updateWeightRangeHint = dialModule.updateWeightRangeHint;
    
    console.log('Global dependencies initialized');
}

// ==================== 核心初始化 ====================

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('Medical Dosage Calculator loaded');
    
    // 确保全局翻译数据可用（先于模块初始化）
    window.translations = translationsModule.translations || {};
    window.darteppData = productsModule.darteppData || {};
    window.argesunData = productsModule.argesunData || {};
    window.artesunData = productsModule.artesunData || {};
    
    console.log('Global data loaded:', {
        translations: !!window.translations,
        darteppData: !!window.darteppData,
        argesunData: !!window.argesunData,
        artesunData: !!window.artesunData
    });
    
    // 初始化全局依赖
    initializeGlobalDependencies();
    
    // 初始化语言
    if (languageModule.initializeLanguage) {
        languageModule.initializeLanguage();
    }
    
    // 初始化刻度盘（只在计算器界面显示时）
    const calculatorInterface = document.getElementById('calculatorInterface');
    if (calculatorInterface && !calculatorInterface.classList.contains('hidden')) {
        if (dialModule.initializeScale) {
            dialModule.initializeScale();
        }
        if (dialModule.updateWeightDisplay) {
            dialModule.updateWeightDisplay();
        }
    }
    
    // 设置事件监听器
    setupEventListeners();
    
    // 绑定产品选择按钮（确保DOM已加载）
    setTimeout(() => {
        bindProductSelectionButtons();
    }, 100);
});

// ==================== 事件处理 ====================

// 设置事件监听器
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // 手动体重输入
    const manualWeightInput = document.getElementById('manualWeight');
    if (manualWeightInput) {
        manualWeightInput.addEventListener('blur', handleManualWeightInput);
        manualWeightInput.addEventListener('keydown', handleManualWeightKeyDown);
    }
    
    // 返回产品选择按钮
    const backButton = document.getElementById('backToProduct');
    if (backButton) {
        backButton.addEventListener('click', showProductSelection);
    }
    
    // 快速选择按钮事件 - 改为动态绑定
    setTimeout(() => {
        bindQuickSelectButtons();
    }, 200);
    
    // 语言切换器事件
    if (languageModule.setupLanguageSwitcher) {
        languageModule.setupLanguageSwitcher();
    }
    
    // 设置刻度盘拖拽事件
    if (dialModule.setupDialEvents) {
        dialModule.setupDialEvents();
    }
}

// 绑定产品选择按钮
function bindProductSelectionButtons() {
    const productCards = document.querySelectorAll('.product-card');
    console.log(`Found ${productCards.length} product cards`);
    
    productCards.forEach(card => {
        const productId = card.getAttribute('data-product');
        const onclickAttr = card.getAttribute('onclick');
        
        console.log(`Card: ${productId}, onclick: ${onclickAttr}`);
        
        // 移除现有的click事件监听器（避免重复绑定）
        card.removeEventListener('click', handleProductCardClick);
        
        // 添加新的click事件监听器
        card.addEventListener('click', handleProductCardClick);
        
        // 确保HTML的onclick属性也正常工作
        if (onclickAttr && onclickAttr.includes('selectProduct')) {
            // 保留原有的onclick
        } else {
            // 如果没有onclick属性，添加一个
            card.setAttribute('onclick', `window.selectProduct('${productId}')`);
        }
    });
}

// 处理产品卡片点击
function handleProductCardClick(event) {
    const card = event.currentTarget;
    const productId = card.getAttribute('data-product');
    console.log('Product card clicked:', productId);
    
    if (productId) {
        // 防止事件冒泡和默认行为
        event.preventDefault();
        event.stopPropagation();
        
        // 调用全局选择产品函数
        window.selectProduct(productId);
    }
}

// 绑定快速选择按钮
function bindQuickSelectButtons() {
    const quickSelectButtons = document.querySelectorAll('button[onclick^="setWeight"]');
    console.log(`Found ${quickSelectButtons.length} quick select buttons`);
    
    quickSelectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const weightText = this.textContent.replace('kg', '').trim();
            const weight = parseInt(weightText);
            console.log('Quick select button clicked:', weight);
            
            if (!isNaN(weight)) {
                if (dialModule.setWeight) {
                    dialModule.setWeight(weight);
                }
            }
        });
    });
}

// 处理手动体重输入
function handleManualWeightInput(event) {
    const input = event.target;
    const weight = parseFloat(input.value);
    
    console.log('Manual weight input:', weight);
    
    if (!isNaN(weight)) {
        // 根据产品设置最小值
        const minWeight = window.selectedProduct?.id === 'dartepp' ? 5 : 0.1;
        
        if (weight < minWeight) {
            console.log(`Weight ${weight} < min ${minWeight}, setting to ${minWeight}`);
            if (dialModule.setWeight) {
                dialModule.setWeight(minWeight);
            }
        } else if (weight >= minWeight && weight <= 100) {
            if (dialModule.setWeight) {
                dialModule.setWeight(weight);
            }
        } else {
            input.value = window.currentWeight.toFixed(1);
        }
    } else {
        input.value = window.currentWeight.toFixed(1);
    }
}

function handleManualWeightKeyDown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const input = event.target;
        const weight = parseFloat(input.value);
        
        console.log('Manual weight Enter key:', weight);
        
        if (!isNaN(weight)) {
            const minWeight = window.selectedProduct?.id === 'dartepp' ? 5 : 0.1;
            
            if (weight < minWeight) {
                if (dialModule.setWeight) {
                    dialModule.setWeight(minWeight);
                }
            } else if (weight >= minWeight && weight <= 100) {
                if (dialModule.setWeight) {
                    dialModule.setWeight(weight);
                }
            } else {
                input.value = window.currentWeight.toFixed(1);
            }
        } else {
            input.value = window.currentWeight.toFixed(1);
        }
        
        input.blur();
    }
}

// ==================== 产品选择功能 ====================

// 产品选择功能 - 这个函数会被HTML中的onclick调用
window.selectProduct = function(product) {
    console.log('selectProduct called with:', product);
    
    // 调试：检查全局数据
    console.log('Global data check:', {
        darteppData: window.darteppData,
        argesunData: window.argesunData,
        artesunData: window.artesunData
    });
    
    if (product === 'dartepp' && window.darteppData) {
        window.selectedProduct = window.darteppData;
        console.log('Selected D-Artepp:', window.selectedProduct);
        showCalculatorInterface();
    } else if (product === 'argesun' && window.argesunData) {
        window.selectedProduct = window.argesunData;
        console.log('Selected Argesun:', window.selectedProduct);
        showCalculatorInterface();
    } else if (product === 'artesun' && window.artesunData) {
        window.selectedProduct = window.artesunData;
        console.log('Selected Artesun:', window.selectedProduct);
        showCalculatorInterface();
    } else {
        console.error('Invalid product or product data not loaded:', product);
    }
}

// 显示计算器界面
function showCalculatorInterface() {
    const productSelection = document.getElementById('productSelection');
    const calculatorInterface = document.getElementById('calculatorInterface');
    
    console.log('showCalculatorInterface called, selectedProduct:', window.selectedProduct);
    
    if (productSelection && calculatorInterface && window.selectedProduct) {
        productSelection.classList.add('hidden');
        calculatorInterface.classList.remove('hidden');
        
        console.log('Showing calculator for:', window.selectedProduct.name);
        
        // 更新计算器标题和描述（先做这个，确保界面显示正确）
        window.updateCalculatorTitleAndDesc();
        
        // 初始化对应的刻度盘
        if (dialModule.initializeScale) {
            console.log('Initializing scale...');
            dialModule.initializeScale();
        }
        
        // 设置初始体重
        if (window.selectedProduct.id === 'dartepp') {
            console.log('Setting D-Artepp weight...');
            if (dialModule.setWeight) {
                dialModule.setWeight(35); // D-Artepp最小5kg，35kg是安全的初始值
            }
            if (dialModule.setupDarteppQuickSelectButtons) {
                dialModule.setupDarteppQuickSelectButtons();
            }
        } else {
            console.log('Setting general weight...');
            if (dialModule.setWeight) {
                dialModule.setWeight(35); // 其他产品从0开始
            }
            if (dialModule.setupGeneralQuickSelectButtons) {
                dialModule.setupGeneralQuickSelectButtons();
            }
        }
        
        // 更新体重范围提示
        if (window.updateWeightRangeHint) {
            window.updateWeightRangeHint();
        }
        
        // 如果是Artesun，显示注射途径选择
        const routeSelector = document.getElementById('injectionRouteSelector');
        if (window.selectedProduct.id === 'artesun' && routeSelector) {
            routeSelector.classList.remove('hidden');
            if (window.updateRouteButtons) {
                window.updateRouteButtons();
            }
        } else if (routeSelector) {
            routeSelector.classList.add('hidden');
        }
        
        // 更新剂量显示
        if (window.updateDosageDisplay) {
            window.updateDosageDisplay();
        }
    } else {
        console.error('Cannot show calculator interface:', {
            productSelection: !!productSelection,
            calculatorInterface: !!calculatorInterface,
            selectedProduct: window.selectedProduct
        });
    }
}

// 显示产品选择界面
function showProductSelection() {
    const productSelection = document.getElementById('productSelection');
    const calculatorInterface = document.getElementById('calculatorInterface');
    
    if (productSelection && calculatorInterface) {
        productSelection.classList.remove('hidden');
        calculatorInterface.classList.add('hidden');
        window.selectedProduct = null;
        
        // 重新绑定产品卡片（防止事件监听器丢失）
        setTimeout(() => {
            bindProductSelectionButtons();
        }, 50);
    }
}

// ==================== 更新计算器标题和描述 ====================

// 更新计算器标题和描述 - 导出到全局
window.updateCalculatorTitleAndDesc = function() {
    if (!window.selectedProduct || !window.translations) {
        console.warn('Cannot update calculator title: missing product or translations');
        return;
    }
    
    const calculatorTitle = document.querySelector('#calculatorInterface .text-3xl');
    const calculatorDesc = document.querySelector('#calculatorInterface .text-gray-600');
    
    if (!calculatorTitle || !calculatorDesc) {
        console.error('Calculator title or description elements not found');
        return;
    }
    
    const lang = window.currentLanguage || 'en';
    const translations = window.translations[lang] || window.translations.en;
    
    console.log('Updating calculator title for:', window.selectedProduct.id, 'in language:', lang);
    
    if (window.selectedProduct.id === 'dartepp') {
        calculatorTitle.textContent = translations.darteppCalculatorTitle || 'D-Artepp® Dosage Calculation';
        calculatorDesc.textContent = translations.darteppCalculatorDesc || 'Select patient weight by sliding the dial, system will calculate recommended D-Artepp® dosage';
    } else if (window.selectedProduct.id === 'argesun') {
        calculatorTitle.textContent = translations.argesunCalculatorTitle || 'Argesun® Dosage Calculation';
        calculatorDesc.textContent = translations.argesunCalculatorDesc || 'Select patient weight, system will calculate recommended Argesun® dosage';
    } else if (window.selectedProduct.id === 'artesun') {
        calculatorTitle.textContent = translations.artesunCalculatorTitle || 'Artesun® Dosage Calculation';
        calculatorDesc.textContent = translations.artesunCalculatorDesc || 'Select patient weight and injection route, system will calculate recommended Artesun® dosage';
    }
    
    console.log('Updated title:', calculatorTitle.textContent);
    console.log('Updated description:', calculatorDesc.textContent);
};

// ==================== 全局函数导出 ====================

// 导出到window对象，供HTML调用
window.changeLanguage = function(lang) {
    console.log('changeLanguage called:', lang);
    if (languageModule.changeLanguage) {
        languageModule.changeLanguage(lang);
    }
    
    // 更新全局语言变量
    window.currentLanguage = lang;
    
    // 如果当前在计算器界面，更新标题和描述
    const calculatorInterface = document.getElementById('calculatorInterface');
    if (calculatorInterface && !calculatorInterface.classList.contains('hidden') && window.selectedProduct) {
        console.log('Updating calculator title after language change');
        window.updateCalculatorTitleAndDesc();
    }
};

window.setInjectionRoute = function(route) {
    console.log('setInjectionRoute called:', route);
    window.injectionRoute = route;
    if (dosageModule.setInjectionRoute) {
        dosageModule.setInjectionRoute(route);
    }
    if (window.updateDosageDisplay) {
        window.updateDosageDisplay();
    }
};

// 添加调试函数
window.debugState = function() {
    console.log('=== DEBUG STATE ===');
    console.log('Global variables:', {
        currentWeight: window.currentWeight,
        selectedProduct: window.selectedProduct?.id || 'none',
        currentLanguage: window.currentLanguage,
        injectionRoute: window.injectionRoute,
        translations: window.translations ? 'loaded' : 'missing',
        darteppData: window.darteppData ? 'loaded' : 'missing',
        argesunData: window.argesunData ? 'loaded' : 'missing',
        artesunData: window.artesunData ? 'loaded' : 'missing'
    });
    console.log('Available functions:', {
        selectProduct: typeof window.selectProduct,
        changeLanguage: typeof window.changeLanguage,
        setInjectionRoute: typeof window.setInjectionRoute,
        updateDosageDisplay: typeof window.updateDosageDisplay,
        updateCalculatorTitleAndDesc: typeof window.updateCalculatorTitleAndDesc
    });
    
    // 测试计算器标题元素
    const calculatorTitle = document.querySelector('#calculatorInterface .text-3xl');
    const calculatorDesc = document.querySelector('#calculatorInterface .text-gray-600');
    console.log('Calculator elements:', {
        calculatorTitle: calculatorTitle ? 'found' : 'not found',
        calculatorDesc: calculatorDesc ? 'found' : 'not found',
        calculatorVisible: document.getElementById('calculatorInterface') && 
                         !document.getElementById('calculatorInterface').classList.contains('hidden')
    });
    
    console.log('=== END DEBUG ===');
};

console.log('Medical Dosage Calculator主脚本已加载');