// language.js - 语言模块
// 版本：v8.9

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

// 更新页面文本
export function updatePageText() {
    console.log('Updating page text for language:', currentLanguage);
    
    if (!window.translations || !window.translations[currentLanguage]) {
        console.error('Translations not available for language:', currentLanguage);
        return;
    }
    
    // 更新所有带有data-i18n属性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (window.translations[currentLanguage][key]) {
            element.textContent = window.translations[currentLanguage][key];
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
        
        // 更新语言切换器UI
        updateLanguageSwitcherUI();
        
        // 强制更新注射途径按钮
        if (typeof window.updateRouteButtons === 'function') {
            window.updateRouteButtons();
        }
        
        // 特别更新计算器标题和描述（如果当前在计算器界面）
        updateCalculatorTitleForCurrentLanguage();
        
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
    
    // 首先尝试调用主文件中的更新函数
    if (typeof window.updateCalculatorTitleAndDesc === 'function') {
        window.updateCalculatorTitleAndDesc();
    } else {
        // 如果函数不可用，直接更新
        updateCalculatorTitleDirectly();
    }
}

// 直接更新计算器标题和描述
function updateCalculatorTitleDirectly() {
    const calculatorTitle = document.querySelector('#calculatorInterface .text-3xl');
    const calculatorDesc = document.querySelector('#calculatorInterface .text-gray-600');
    
    if (!calculatorTitle || !calculatorDesc || !window.selectedProduct || !window.translations[currentLanguage]) {
        console.error('Cannot update calculator title directly:', {
            calculatorTitle: !!calculatorTitle,
            calculatorDesc: !!calculatorDesc,
            selectedProduct: !!window.selectedProduct,
            translations: !!window.translations[currentLanguage]
        });
        return;
    }
    
    const translations = window.translations[currentLanguage];
    
    console.log('Directly updating calculator title for product:', window.selectedProduct.id);
    
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
    updateLanguageSwitcherUI();
    
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