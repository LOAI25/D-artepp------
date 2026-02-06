// language.js - 语言模块
// 版本：v8.10 (统一使用data-i18n属性管理所有文本)
// 日期：2024-01-20

// 模块变量
let currentLanguage;

// 初始化函数
export function initializeModule(globalVars) {
    if (globalVars && globalVars.currentLanguage) {
        currentLanguage = globalVars.currentLanguage();
        console.log('Language module initialized with language:', currentLanguage);
    }
}

// 获取当前语言
export function getCurrentLanguage() {
    return currentLanguage;
}

// 更新页面文本 - 统一使用data-i18n属性管理
export function updatePageText() {
    console.log('Updating page text for language:', currentLanguage);
    
    if (!window.translations || !window.translations[currentLanguage]) {
        console.error('Translations not available for language:', currentLanguage);
        return;
    }
    
    // 获取当前语言的翻译
    const t = window.translations[currentLanguage];
    
    // 更新所有带有data-i18n属性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) {
            // 保留原始类名，只更新文本内容
            const originalClass = element.className;
            element.textContent = t[key];
            element.className = originalClass; // 确保类名不变
            
            // 调试日志
            if (key.includes('calculator')) {
                console.log(`Updated ${key}:`, t[key]);
            }
        } else {
            console.warn('Translation key not found:', key, 'for language:', currentLanguage);
        }
    });
    
    // 更新"即将推出"的伪元素内容
    updateComingSoonLabels();
    
    // 更新剂量显示（如果已选择）
    if (window.selectedProduct) {
        console.log('Selected product found, updating dosage display');
        if (typeof window.updateDosageDisplay === 'function') {
            window.updateDosageDisplay();
        }
    }
    
    // 更新体重范围提示
    if (typeof window.updateWeightRangeHint === 'function') {
        window.updateWeightRangeHint();
    }
    
    // 更新计算器标题和描述（如果当前在计算器界面）
    updateCalculatorTitleForCurrentLanguage();
    
    // 更新语言切换器UI
    updateLanguageSwitcherUI();
    
    // 强制更新注射途径按钮
    if (typeof window.updateRouteButtons === 'function') {
        window.updateRouteButtons();
    }
}

// 更新"即将推出"标签
function updateComingSoonLabels() {
    const comingSoonDivs = document.querySelectorAll('.coming-soon .text-sm.text-gray-500.font-medium');
    comingSoonDivs.forEach(div => {
        if (div.hasAttribute('data-i18n')) {
            const key = div.getAttribute('data-i18n');
            if (window.translations[currentLanguage] && window.translations[currentLanguage][key]) {
                div.textContent = window.translations[currentLanguage][key];
            }
        }
    });
}

// 切换语言
export function changeLanguage(lang) {
    console.log('Changing language to:', lang);
    
    if (window.translations && window.translations[lang]) {
        currentLanguage = lang;
        
        // 更新全局变量
        if (window.currentLanguage !== undefined) {
            window.currentLanguage = lang;
        }
        
        // 保存语言选择到本地存储
        localStorage.setItem('preferredLanguage', lang);
        
        // 更新页面文本
        updatePageText();
        
        console.log(`Language changed to: ${lang}`);
    } else {
        console.error('Invalid language or translations not loaded:', lang);
    }
}

// 更新计算器标题和描述
function updateCalculatorTitleForCurrentLanguage() {
    const calculatorInterface = document.getElementById('calculatorInterface');
    if (!calculatorInterface || calculatorInterface.classList.contains('hidden') || !window.selectedProduct) {
        console.log('Calculator not visible or no product selected, skipping title update');
        return;
    }
    
    console.log('Updating calculator title for language change:', currentLanguage);
    
    // 获取计算器标题和描述元素
    const calculatorTitle = document.querySelector('#calculatorInterface .text-3xl');
    const calculatorDesc = document.getElementById('calculatorDesc');
    
    if (!calculatorTitle || !calculatorDesc || !window.selectedProduct || !window.translations[currentLanguage]) {
        console.error('Cannot update calculator title:', {
            calculatorTitle: !!calculatorTitle,
            calculatorDesc: !!calculatorDesc,
            selectedProduct: !!window.selectedProduct,
            translations: !!window.translations[currentLanguage]
        });
        return;
    }
    
    const t = window.translations[currentLanguage];
    
    // 根据当前选择的产品设置正确的翻译键
    let titleKey = 'calculatorTitle';
    let descKey = 'calculatorDesc';
    
    if (window.selectedProduct.id === 'dartepp') {
        titleKey = 'darteppCalculatorTitle';
        descKey = 'darteppCalculatorDesc';
    } else if (window.selectedProduct.id === 'argesun') {
        titleKey = 'argesunCalculatorTitle';
        descKey = 'argesunCalculatorDesc';
    } else if (window.selectedProduct.id === 'artesun') {
        titleKey = 'artesunCalculatorTitle';
        descKey = 'artesunCalculatorDesc';
    }
    
    // 确保标题元素有正确的data-i18n属性
    if (!calculatorTitle.hasAttribute('data-i18n') || calculatorTitle.getAttribute('data-i18n') !== titleKey) {
        calculatorTitle.setAttribute('data-i18n', titleKey);
    }
    
    // 确保描述元素有正确的data-i18n属性
    if (calculatorDesc.getAttribute('data-i18n') !== descKey) {
        calculatorDesc.setAttribute('data-i18n', descKey);
    }
    
    // 更新文本内容
    if (t[titleKey]) {
        calculatorTitle.textContent = t[titleKey];
    }
    if (t[descKey]) {
        calculatorDesc.textContent = t[descKey];
    }
    
    console.log('Updated calculator title:', calculatorTitle.textContent);
    console.log('Updated calculator description:', calculatorDesc.textContent);
}

// 更新语言切换器UI
export function updateLanguageSwitcherUI() {
    const currentLangDisplay = document.getElementById('currentLangDisplay');
    const languageOptions = document.querySelectorAll('.language-option');
    
    if (currentLangDisplay) {
        // 更新按钮文本
        const langText = {
            en: 'EN',
            zh: '中文',
            fr: 'FR'
        };
        currentLangDisplay.textContent = langText[currentLanguage] || 'EN';
    }
    
    // 更新选项激活状态
    languageOptions.forEach(option => {
        const lang = option.getAttribute('data-lang');
        if (lang === currentLanguage) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// 初始化语言 - 检查是否是第一次访问
export function initializeLanguage() {
    console.log('Initializing language...');
    
    // 检查是否是第一次访问
    const isFirstVisit = !localStorage.getItem('hasVisitedBefore');
    
    if (isFirstVisit) {
        // 第一次访问，总是显示英文
        currentLanguage = 'en';
        console.log('First visit - showing English');
        
        // 标记已经访问过
        localStorage.setItem('hasVisitedBefore', 'true');
    } else {
        // 不是第一次访问，使用用户保存的语言
        const savedLanguage = localStorage.getItem('preferredLanguage');
        
        if (savedLanguage && window.translations && window.translations[savedLanguage]) {
            currentLanguage = savedLanguage;
            console.log('Returning visitor - using saved language:', currentLanguage);
        } else {
            // 没有保存的语言，但也不是第一次访问，使用浏览器语言检测
            const browserLanguage = navigator.language.split('-')[0];
            
            if (browserLanguage === 'zh' && window.translations && window.translations['zh']) {
                currentLanguage = 'zh';
            } else if (browserLanguage === 'fr' && window.translations && window.translations['fr']) {
                currentLanguage = 'fr';
            } else {
                currentLanguage = 'en';
            }
            console.log('Returning visitor - using browser language:', currentLanguage);
        }
    }
    
    // 更新全局变量
    if (window.currentLanguage !== undefined) {
        window.currentLanguage = currentLanguage;
    }
    
    // 更新页面
    updatePageText();
    
    console.log('Language initialized to:', currentLanguage);
}

// 设置语言切换器事件
export function setupLanguageSwitcher() {
    const languageToggle = document.getElementById('languageToggle');
    const languageDropdown = document.getElementById('languageDropdown');
    const languageOptions = document.querySelectorAll('.language-option');
    
    if (languageToggle && languageDropdown) {
        console.log('Setting up language switcher events');
        
        // 切换下拉菜单显示
        languageToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
            console.log('Language dropdown toggled');
        });
        
        // 点击选项切换语言
        languageOptions.forEach(option => {
            option.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                console.log('Language option clicked:', lang);
                changeLanguage(lang);
                languageDropdown.classList.remove('show');
            });
        });
        
        // 点击页面其他地方关闭下拉菜单
        document.addEventListener('click', function() {
            languageDropdown.classList.remove('show');
        });
        
        // 阻止下拉菜单内的点击事件冒泡
        languageDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    } else {
        console.error('Language switcher elements not found');
    }
}

// 辅助函数：为元素设置data-i18n属性
export function setElementTranslation(element, translationKey) {
    if (element) {
        element.setAttribute('data-i18n', translationKey);
        
        // 如果已经有当前语言的翻译，立即更新
        if (window.translations && window.translations[currentLanguage] && 
            window.translations[currentLanguage][translationKey]) {
            const originalClass = element.className;
            element.textContent = window.translations[currentLanguage][translationKey];
            element.className = originalClass;
        }
    }
}

// 辅助函数：批量设置data-i18n属性
export function setMultipleTranslations(translationsMap) {
    Object.keys(translationsMap).forEach(selector => {
        const element = document.querySelector(selector);
        const translationKey = translationsMap[selector];
        
        if (element) {
            setElementTranslation(element, translationKey);
        } else {
            console.warn('Element not found for selector:', selector);
        }
    });
}

// 导出用于动态更新计算器标题的函数
export function updateCalculatorTitle(productId) {
    if (!productId || !window.selectedProduct) return;
    
    const calculatorTitle = document.querySelector('#calculatorInterface .text-3xl');
    const calculatorDesc = document.getElementById('calculatorDesc');
    
    if (!calculatorTitle || !calculatorDesc) return;
    
    // 设置正确的翻译键
    let titleKey = 'calculatorTitle';
    let descKey = 'calculatorDesc';
    
    if (productId === 'dartepp') {
        titleKey = 'darteppCalculatorTitle';
        descKey = 'darteppCalculatorDesc';
    } else if (productId === 'argesun') {
        titleKey = 'argesunCalculatorTitle';
        descKey = 'argesunCalculatorDesc';
    } else if (productId === 'artesun') {
        titleKey = 'artesunCalculatorTitle';
        descKey = 'artesunCalculatorDesc';
    }
    
    // 更新data-i18n属性
    calculatorTitle.setAttribute('data-i18n', titleKey);
    calculatorDesc.setAttribute('data-i18n', descKey);
    
    // 立即更新文本
    if (window.translations && window.translations[currentLanguage]) {
        const t = window.translations[currentLanguage];
        if (t[titleKey]) calculatorTitle.textContent = t[titleKey];
        if (t[descKey]) calculatorDesc.textContent = t[descKey];
    }
}