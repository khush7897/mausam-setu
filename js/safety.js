/**
 * MAUSAM SETU — Safety Advisory Engine
 * Provides hazard-specific safety recommendations
 */

const SafetyEngine = {

  ADVISORIES: {
    FLOOD: {
      icon: '🌊',
      title: 'Flood Safety',
      titleHi: 'बाढ़ सुरक्षा',
      tips: [
        'Avoid flooded roads — even 15 cm of water can knock you down.',
        'Never attempt to cross moving floodwater on foot or by vehicle.',
        'Move to higher ground immediately if authorities advise evacuation.',
        'Keep emergency kit ready: documents, medicines, water, torch.',
        'Follow official instructions from local disaster management.',
      ],
      tipsHi: [
        'बाढ़ग्रस्त सड़कों से बचें — 15 सेमी पानी भी आपको गिरा सकता है।',
        'बहते पानी को पैदल या वाहन से पार करने की कोशिश न करें।',
        'अधिकारियों की सलाह पर तुरंत ऊंचाई पर जाएं।',
        'आपातकालीन किट तैयार रखें: दस्तावेज, दवाएं, पानी, टॉर्च।',
        'स्थानीय आपदा प्रबंधन के आधिकारिक निर्देशों का पालन करें।',
      ],
      emergency: '1078 (NDMA) | 1070 (Flood Control)',
    },
    LIGHTNING: {
      icon: '⚡',
      title: 'Lightning Safety',
      titleHi: 'बिजली सुरक्षा',
      tips: [
        'Move indoors immediately when you hear thunder.',
        'Avoid open areas, hilltops, and tall isolated trees.',
        'Stay away from water bodies, metal fences, and pipes.',
        'Do not use corded phones or electrical equipment.',
        'If caught outdoors: crouch low, feet together, do not lie flat.',
      ],
      tipsHi: [
        'बिजली कड़कते सुनते ही तुरंत घर के अंदर जाएं।',
        'खुले मैदानों, पहाड़ियों और अकेले ऊंचे पेड़ों से बचें।',
        'पानी के स्रोतों, धातु की बाड़ और पाइप से दूर रहें।',
        'तार वाले फोन या बिजली के उपकरण का उपयोग न करें।',
        'बाहर फंस जाएं तो: झुककर बैठें, पैर एक साथ रखें।',
      ],
      emergency: '112',
    },
    HEATWAVE: {
      icon: '🌡️',
      title: 'Heatwave Safety',
      titleHi: 'लू से सुरक्षा',
      tips: [
        'Stay indoors between 12 PM and 4 PM (peak heat hours).',
        'Drink water every 20–30 minutes even if not thirsty.',
        'Wear light, loose, breathable cotton clothing.',
        'Use ORS (Oral Rehydration Solution) if sweating heavily.',
        'Check on elderly neighbours, children, and outdoor workers.',
        'Seek immediate medical help for heat stroke: confusion, dry skin, high fever.',
      ],
      tipsHi: [
        'दोपहर 12 बजे से 4 बजे के बीच घर के अंदर रहें।',
        'प्यास न लगे तब भी हर 20-30 मिनट में पानी पिएं।',
        'हल्के, ढीले, सांस लेने योग्य सूती कपड़े पहनें।',
        'अधिक पसीना आने पर ORS (ओरल रिहाइड्रेशन सॉल्यूशन) लें।',
        'बुजुर्गों, बच्चों और बाहर काम करने वालों का ख्याल रखें।',
        'लू लगने के लक्षण: भ्रम, सूखी त्वचा, तेज बुखार — तुरंत डॉक्टर के पास जाएं।',
      ],
      emergency: '108 (Ambulance)',
    },
    CYCLONE: {
      icon: '🌀',
      title: 'Cyclone Safety',
      titleHi: 'चक्रवात सुरक्षा',
      tips: [
        'Follow evacuation orders from local authorities without delay.',
        'Secure or remove loose objects that could become flying debris.',
        'Stay away from coastal areas, rivers, and flood-prone zones.',
        'Stock 3-day emergency supplies: water, food, medicines, torch, radio.',
        'Stay indoors during the cyclone; do not go out in the eye of the storm.',
        'After the cyclone: watch for fallen power lines and contaminated water.',
      ],
      tipsHi: [
        'बिना देर किए स्थानीय अधिकारियों के निकासी आदेशों का पालन करें।',
        'ढीली वस्तुओं को सुरक्षित करें या हटा दें।',
        'तटीय क्षेत्रों, नदियों और बाढ़-प्रवण इलाकों से दूर रहें।',
        '3 दिन की आपातकालीन आपूर्ति रखें: पानी, भोजन, दवाएं, टॉर्च, रेडियो।',
        'चक्रवात के दौरान घर के अंदर रहें।',
        'चक्रवात के बाद: गिरी बिजली लाइनों और दूषित पानी से सावधान रहें।',
      ],
      emergency: '1078 (NDMA) | Coast Guard: 1554',
    },
    HEAVY_RAIN: {
      icon: '🌧️',
      title: 'Heavy Rain Safety',
      titleHi: 'भारी वर्षा में सुरक्षा',
      tips: [
        'Avoid unnecessary travel during heavy rainfall.',
        'Stay away from low-lying areas and areas prone to waterlogging.',
        'Do not attempt to cross flooded underpasses or roads.',
        'Keep drains and gutters clear to prevent waterlogging.',
        'Unplug electrical equipment as a precaution.',
        'Monitor official weather updates regularly.',
      ],
      tipsHi: [
        'भारी वर्षा के दौरान अनावश्यक यात्रा से बचें।',
        'निचले इलाकों और जलभराव वाले क्षेत्रों से दूर रहें।',
        'बाढ़ग्रस्त सुरंगों या सड़कों को पार करने की कोशिश न करें।',
        'जलभराव रोकने के लिए नालों और गटर साफ रखें।',
        'सावधानी के तौर पर बिजली के उपकरण अनप्लग करें।',
        'आधिकारिक मौसम अपडेट नियमित रूप से देखते रहें।',
      ],
      emergency: '1078 | 100 (Police)',
    },
    STRONG_WIND: {
      icon: '💨',
      title: 'Strong Wind Safety',
      titleHi: 'तेज हवा में सुरक्षा',
      tips: [
        'Secure loose objects outdoors (furniture, signs, equipment).',
        'Avoid outdoor activities during high wind alerts.',
        'Stay away from trees, hoardings, and tall structures.',
        'Drive cautiously — high-sided vehicles are especially at risk.',
        'Stay away from coastal areas during storm surges.',
      ],
      tipsHi: [
        'बाहरी ढीली वस्तुओं (फर्नीचर, साइनबोर्ड) को सुरक्षित करें।',
        'तेज हवा अलर्ट के दौरान बाहरी गतिविधियों से बचें।',
        'पेड़ों, होर्डिंग और ऊंची इमारतों से दूर रहें।',
        'सावधानी से गाड़ी चलाएं।',
        'तूफान के दौरान तटीय क्षेत्रों से दूर रहें।',
      ],
      emergency: '112',
    },
    VERY_HEAVY_RAIN: {
      icon: '⛈️',
      title: 'Extreme Rainfall Safety',
      titleHi: 'अत्यधिक वर्षा में सुरक्षा',
      tips: [
        'Do NOT travel unless absolutely necessary.',
        'Move to upper floors if in a flood-prone building.',
        'Prepare emergency kit immediately.',
        'Keep mobile phones charged.',
        'Follow NDMA and state government advisories.',
      ],
      tipsHi: [
        'जब तक बिल्कुल जरूरी न हो यात्रा न करें।',
        'बाढ़-प्रवण भवन में हैं तो ऊपरी मंजिलों पर जाएं।',
        'तुरंत आपातकालीन किट तैयार करें।',
        'मोबाइल फोन चार्ज रखें।',
        'NDMA और राज्य सरकार की सलाह का पालन करें।',
      ],
      emergency: '1078 | 1070',
    },
    THUNDERSTORM: {
      icon: '⛈️',
      title: 'Thunderstorm Safety',
      titleHi: 'तूफान में सुरक्षा',
      tips: [
        'Move indoors and stay away from windows.',
        'Avoid using electrical equipment and plumbing.',
        'Do not shelter under trees.',
        'Stay low if caught outdoors.',
        'Wait 30 minutes after last thunder before going outside.',
      ],
      tipsHi: [
        'घर के अंदर जाएं और खिड़कियों से दूर रहें।',
        'बिजली के उपकरण और नलसाजी का उपयोग न करें।',
        'पेड़ों के नीचे आश्रय न लें।',
        'बाहर हों तो नीचे झुककर बैठें।',
        'अंतिम बिजली कड़कने के 30 मिनट बाद बाहर जाएं।',
      ],
      emergency: '112',
    },
    COLD_WAVE: {
      icon: '🌨️',
      title: 'Cold Wave Safety',
      titleHi: 'शीतलहर सुरक्षा',
      tips: [
        'Layer up with warm clothing, cover extremities.',
        'Check on elderly neighbours and vulnerable persons.',
        'Avoid prolonged exposure to cold outdoors.',
        'Keep pipes from freezing in hill areas.',
        'Watch for signs of hypothermia: shivering, confusion.',
      ],
      tipsHi: [
        'गर्म कपड़ों की परतें पहनें, हाथ-पैर ढकें।',
        'बुजुर्ग पड़ोसियों और कमजोर व्यक्तियों का ख्याल रखें।',
        'बाहर ठंड में लंबे समय तक न रहें।',
        'पहाड़ी इलाकों में पाइप जमने से बचाएं।',
        'हाइपोथर्मिया के लक्षण देखें: कंपन, भ्रम।',
      ],
      emergency: '108',
    },
    FOG: {
      icon: '🌫️',
      title: 'Dense Fog Safety',
      titleHi: 'घने कोहरे में सुरक्षा',
      tips: [
        'Drive slowly with low-beam headlights on.',
        'Maintain increased safe following distance.',
        'Use hazard warning lights when visibility is very low.',
        'Avoid overtaking in foggy conditions.',
        'Check road/rail/flight status before travel.',
      ],
      tipsHi: [
        'धीरे चलाएं, लो-बीम हेडलाइट्स जलाएं।',
        'अधिक सुरक्षित दूरी बनाए रखें।',
        'बहुत कम दृश्यता होने पर हैजर्ड लाइट्स जलाएं।',
        'कोहरे में ओवरटेक करने से बचें।',
        'यात्रा से पहले सड़क/रेल/हवाई स्थिति जांचें।',
      ],
      emergency: '100 (Police Traffic)',
    },
    GENERAL: {
      icon: '☀️',
      title: 'General Safety',
      titleHi: 'सामान्य सुरक्षा',
      tips: [
        'Stay informed with official weather updates.',
        'Keep emergency contacts saved on your phone.',
        'Prepare a basic emergency kit at home.',
        'Know your nearest evacuation route.',
        'Follow Mausam Setu for real-time alerts.',
      ],
      tipsHi: [
        'आधिकारिक मौसम अपडेट से अपडेट रहें।',
        'आपातकालीन संपर्क अपने फोन में सेव रखें।',
        'घर पर एक बुनियादी आपातकालीन किट तैयार रखें।',
        'अपना नजदीकी निकासी मार्ग जानें।',
        'रीयल-टाइम अलर्ट के लिए मौसम सेतु देखते रहें।',
      ],
      emergency: '112',
    },
  },

  // ── Get advisory for a hazard ─────────────────────────────
  getAdvisory(hazard, lang = 'en') {
    const key = hazard || 'GENERAL';
    const adv = this.ADVISORIES[key] || this.ADVISORIES['GENERAL'];
    const tips = lang === 'hi' && adv.tipsHi ? adv.tipsHi : adv.tips;
    const title = lang === 'hi' && adv.titleHi ? adv.titleHi : adv.title;
    return { ...adv, title, tips };
  },

  // ── Get advisory based on weather data ────────────────────
  getWeatherAdvisory(weather, alerts, lang = 'en') {
    if (alerts?.length > 0) {
      const top = AlertService.getHighestSeverity(alerts);
      if (top) return this.getAdvisory(top.hazard, lang);
    }
    if (weather) {
      const c = (weather.condition || '').toLowerCase();
      if (c.includes('flood'))       return this.getAdvisory('FLOOD', lang);
      if (c.includes('cyclone'))     return this.getAdvisory('CYCLONE', lang);
      if (c.includes('thunder'))     return this.getAdvisory('THUNDERSTORM', lang);
      if (c.includes('heavy rain'))  return this.getAdvisory('HEAVY_RAIN', lang);
      if (c.includes('rain'))        return this.getAdvisory('HEAVY_RAIN', lang);
      if (c.includes('lightning'))   return this.getAdvisory('LIGHTNING', lang);
      if (weather.temp > 42)         return this.getAdvisory('HEATWAVE', lang);
      if (weather.wind_speed > 60)   return this.getAdvisory('STRONG_WIND', lang);
      if (c.includes('fog') || c.includes('mist')) return this.getAdvisory('FOG', lang);
    }
    return this.getAdvisory('GENERAL', lang);
  },

  // ── Render safety card ────────────────────────────────────
  renderSafetyCard(hazard, lang = 'en', isDanger = false) {
    const adv = this.getAdvisory(hazard, lang);
    const tipsHTML = adv.tips.map(t => `<li>• ${t}</li>`).join('');
    return `
    <div class="safety-card ${isDanger ? 'warning-mode' : ''}">
      <span class="safety-icon">${adv.icon}</span>
      <div class="safety-content">
        <div class="safety-title">${adv.title}</div>
        <ul class="safety-text" style="list-style:none;padding:0;display:flex;flex-direction:column;gap:6px">${tipsHTML}</ul>
        ${adv.emergency ? `<div style="margin-top:12px;font-size:var(--text-xs);font-weight:600;color:var(--warning-text)">📞 Emergency: ${adv.emergency}</div>` : ''}
      </div>
    </div>
    `;
  },
};

window.SafetyEngine = SafetyEngine;
