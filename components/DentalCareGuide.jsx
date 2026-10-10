'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  PhoneCall, 
  MessageCircle, 
  Stethoscope, 
  Scale, 
  AlertOctagon
} from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const verifiedDentalFAQs = [
  // 1. EMERGENCY & SEVERE TOOTHACHE
  {
    id: 1,
    cat: 'emergency',
    qEn: 'Severe throbbing toothache started at night. What immediate precautions should I take before visiting a clinic?',
    qHi: 'रात में अचानक असहनीय दांत दर्द शुरू हो गया। क्लिनिक जाने से पहले क्या सावधानी रखनी चाहिए?',
    qHn: 'Raat me achanak daant me teekha dard shuru ho gaya. Clinic jaane se pehle kya savdhani rakhein?',
    aEn: 'LEGAL ADVICE: Do NOT press any painkiller tablet (like Aspirin) against the gums, as it causes severe chemical burns. Rinse gently with lukewarm salt water and keep your head elevated on pillows. Avoid extremely hot or cold fluids. Visit your nearest registered dental surgeon for mandatory clinical X-ray evaluation.',
    aHi: 'चिकित्सीय सावधानी: दर्द की कोई भी गोली मसूड़े पर दबाकर कभी न रखें, इससे मसूड़ा गंभीर रूप से जल (केमिकल बर्न) जाता है। केवल हल्के गुनगुने पानी में चुटकी भर नमक डालकर कुल्ला करें। सिर को थोड़ा ऊपर रखें। सुबह अनिवार्य रूप से अपने नजदीकी पंजीकृत दंत चिकित्सक से जांच कराएं।',
    aHn: 'Zaroori Nirdesh: Dard ki goli ko daant ya masoode par direct mat dabayein, isse masooda jal jata hai. Gungune namak-paani se halka kulla karein aur subah turant paas ke dentist se clinic par checkup karwayein.'
  },
  {
    id: 2,
    cat: 'emergency',
    qEn: 'Can applying cotton soaked in clove oil (laung ka tel) cure my dental cavity permanently?',
    qHi: 'क्या लौंग का तेल लगाने से दांत का कीड़ा या कैविटी हमेशा के लिए खत्म हो जाती है?',
    qHn: 'Kya laung ka tel lagane se daant ka keeda hamesha ke liye theek ho sakta hai?',
    aEn: 'CLINICAL FACT: No home remedy cures bacterial decay. Eugenol in clove oil only provides brief superficial numbing. Pure concentrated oil can chemically injure surrounding soft tissues. Proper cavity excavation and biocompatible dental filling by a qualified dental doctor are mandatory.',
    aHi: 'वैज्ञानिक तथ्य: कोई भी घरेलू नुस्खा दांत के कीड़े को खत्म नहीं कर सकता। लौंग का तेल सिर्फ कुछ मिनटों के लिए नस को सुन्न करता है। इसका बार-बार इस्तेमाल मसूड़े को छील सकता है। क्लिनिक पर कैविटी साफ करवाकर फिलिंग करवाना ही सुरक्षित उपाय है।',
    aHn: 'Fact: Laung ka tel sirf kuch der dard ko sunn karta hai, keede ko khatam nahi karta. Cavity ko machine se clean karwake filling karwana hi safe rasta hai.'
  },
  {
    id: 3,
    cat: 'emergency',
    qEn: 'My face is swollen near the jaw due to tooth pain. Can I take antibiotics from a local chemist without a prescription?',
    qHi: 'दांत दर्द की वजह से जबड़े और गाल पर सूजन आ गई है। क्या मेडिकल स्टोर से खुद एंटीबायोटिक ले सकते हैं?',
    qHn: 'Daant dard se gaal par sujan aa gayi hai. Kya chemist se khud dawai le sakte hain?',
    aEn: 'CRITICAL WARNING: Self-medication with antibiotics without clinical examination is hazardous and promotes severe drug resistance. Facial swelling indicates pus accumulation (abscess) tracking through the jawbone, which requires urgent clinical drainage by a nearby dental doctor.',
    aHi: 'सख्त चेतावनी: बिना डॉक्टर की जांच के खुद से एंटीबायोटिक लेना खतरनाक हो सकता है। चेहरे पर सूजन आना यह दर्शाता है कि मसूड़े या हड्डी में मवाद (Pus) बन चुकी है। इसे तुरंत नजदीकी दंत चिकित्सक से दिखाकर साफ कराना अनिवार्य है।',
    aHn: 'Strict Alert: Bina doctor ke parmarsh ke koi bhi antibiotic na lein. Sujan ka matlab hai andar mawaad (pus) ban rahi hai jiska paas ke dental clinic par turant ilaaj zaroori hai.'
  },
  {
    id: 4,
    cat: 'emergency',
    qEn: 'What to do if a permanent tooth gets knocked out completely during an injury or sports accident?',
    qHi: 'चोट लगने या एक्सीडेंट में यदि पूरा असली दांत जड़ समेत बाहर गिर जाए तो तुरंत क्या करें?',
    qHn: 'Chot lagne se agar pura asli daant bahar gir jaye toh turant kya karna chahiye?',
    aEn: 'Hold the tooth ONLY by the crown (never touch the root). Rinse gently in clean water without scrubbing. Place it immediately in a cup of fresh cold milk or clean saliva, and reach your nearest dental clinic within 30-60 minutes for a high chance of re-implantation.',
    aHi: 'दांत को केवल ऊपर की सफेद सतह से पकड़ें (जड़ को हाथ न लगाएं)। रगड़े बिना हल्के पानी से धोएं और तुरंत ठंडे दूध या मुंह की लार में रखकर 30 से 60 मिनट के अंदर नजदीकी डेंटल क्लिनिक पहुंचे। दांत वापस जुड़ सकता है।',
    aHn: 'Daant ko jad se nahi, upar se pakdein. Dudh (milk) ke andar daant ko daalkar 30 se 60 minute ke andar paas ke dental hospital pahuchein taaki wo wapas lag sake.'
  },

  // 2. ROOT CANAL TREATMENT (RCT) & CAPS
  {
    id: 5,
    cat: 'rct',
    qEn: 'Is modern Root Canal Treatment painful? Does anesthesia injection hurt in the mouth?',
    qHi: 'क्या आधुनिक रूट कैनाल ट्रीटमेंट में दर्द होता है? क्या मुंह में सुन्न करने के इंजेक्शन में तेज चुभन होती है?',
    qHn: 'Kya RCT me dard hota hai? Injection me kitna dard hota hai?',
    aEn: 'Modern dental operatory utilizes topical surface numbing sprays before applying micro-fine needles, ensuring minimal injection sensation. Advanced rotary computerized RCT cleans the infected pulp entirely pain-free under local anesthesia.',
    aHi: 'आधुनिक दंत चिकित्सा में इंजेक्शन लगाने से पहले मसूड़े पर फ्रूट-फ्लेवर नमिंग जेल या स्प्रे लगाया जाता है, जिससे सुई का अहसास भी नहीं होता। पूरी प्रक्रिया एनेस्थीसिया के प्रभाव में 100% दर्द-रहित तरीके से पूरी की जाती है।',
    aHn: 'Pehle jelly lagakar jagah ko sunn kiya jata hai jisse injection ka dard nahi hota. Modern rotary machine se RCT bilkul painless hoti hai.'
  },
  {
    id: 6,
    cat: 'rct',
    qEn: 'Why is putting a dental crown (cap) necessary after completing Root Canal Treatment?',
    qHi: 'रूट कैनाल (RCT) पूरा होने के बाद दांत पर कैप (क्राउन) लगवाना क्यों जरूरी है?',
    qHn: 'RCT ke baad daant par cap lagwana kyu zaroori hai?',
    aEn: 'An endodontically treated tooth loses vital blood circulation and becomes brittle like dry wood. Chewing hard regional foods without a protective Zirconia or Ceramic crown risks vertical root fracture, which leads to permanent tooth loss.',
    aHi: 'रूट कैनाल के बाद दांत का संक्रमण तो खत्म हो जाता है, लेकिन नस न होने से दांत थोड़ा कमजोर हो जाता है। कठोर भोजन चबाते समय वह बीच से टूट न जाए, इसके लिए मजबूत ज़िरकोनिया या सिरैमिक कैप लगाना आवश्यक सुरक्षा कवच है।',
    aHn: 'RCT ke baad daant brittle ho jata hai. Bajar ya hard khana chabate time daant toot na jaye, isliye cap lagwana zaroori hota hai.'
  },
  {
    id: 7,
    cat: 'rct',
    qEn: 'Is Single-Sitting RCT safe, or should Root Canal always be done in multiple visits?',
    qHi: 'क्या सिंगल-सिटिंग RCT सुरक्षित है या रूट कैनाल कई दिनों में ही कराना चाहिए?',
    qHn: 'Kya ek hi din me RCT karwana safe hai?',
    aEn: 'If there is no active apical abscess or continuous exudate, Single-Sitting RCT backed by modern digital apex locators is completely safe, highly effective, and saves patient travel time. Highly infected teeth may still necessitate multiple visits for dressing.',
    aHi: 'यदि दांत के नीचे बहुत ज्यादा मवाद नहीं है, तो आधुनिक डिजिटल एपेक्स लोकेटर मशीनों से सिंगल-सिटिंग RCT पूर्णतः सुरक्षित व सफल है। मरीज को बार-बार क्लिनिक के चक्कर नहीं काटने पड़ते।',
    aHn: 'Agar gehra pus na ho toh ek hi setting (30-40 minute) me modern machine se safe RCT complete ho jati hai.'
  },

  // 3. GUMS, PYORRHEA & CLEANING
  {
    id: 8,
    cat: 'gums',
    qEn: 'Does professional ultrasonic scaling make teeth weak, loose, or create permanent gaps?',
    qHi: 'क्या मशीन से दांत साफ (स्केलिंग) करवाने से दांत कमजोर होते हैं या उनके बीच गैप बन जाता है?',
    qHn: 'Kya scaling se daant kamzor hote hain ya gap ban jata hai?',
    aEn: 'MYTH DEBUNKED: Ultrasonic scaling does not grind enamel. It uses acoustic micro-vibrations with water mist to dislodge hardened bacterial calculus (tartar). The visible spaces felt afterward were actually created earlier by gum-destroying tartar, which now heals tightly.',
    aHi: 'वैज्ञानिक तथ्य: मशीन से सफाई कराने से दांतों का इनेमल बिल्कुल नहीं घिसता। मशीन केवल दांतों की जड़ों पर जमी कठोर पथरी (टार्टर) को हटाती है। पथरी हटने के बाद मसूड़े स्वस्थ होकर दांतों को वापस मजबूती से पकड़ लेते हैं।',
    aHn: 'Yeh 100% afwaah hai. Ultrasonic cleaner sirf jami hui gandagi aur pathri hatata hai, daant bilkul kamzor nahi hote.'
  },
  {
    id: 9,
    cat: 'gums',
    qEn: 'Why do my gums bleed during daily brushing, accompanied by chronic bad breath (Halitosis)?',
    qHi: 'रोजाना ब्रश करते समय मसूड़ों से खून क्यों आता है और मुंह से लगातार बदबू का क्या कारण है?',
    qHn: 'Brush karte time masoodon se khoon aur badbu aane ki wajah kya hai?',
    aEn: 'Bleeding gums and halitosis signify Gingivitis transitioning to Periodontitis (Pyorrhea). It cannot be cured by commercial mouthwashes alone. Professional subgingival scaling is required to arrest the bone loss.',
    aHi: 'यह पायरिया (मसूड़ों के संक्रमण) का प्राथमिक लक्षण है। केवल माउथवॉश या महंगे टूथपेस्ट से यह ठीक नहीं हो सकता। क्लिनिक पर अल्ट्रासोनिक सफाई करवाकर ही मसूड़ों की सूजन और बदबू को स्थायी रूप से रोका जा सकता है।',
    aHn: 'Yeh pyorrhea ka lakshan hai. Sirf paste badalne se aaram nahi hoga, clinic par professional cleaning karwani padegi.'
  },

  // 4. MEDICAL CONDITIONS & EXTRACTION SAFETY
  {
    id: 10,
    cat: 'medical',
    qEn: 'Can patients with Diabetes or High Blood Pressure safely undergo tooth extraction or dental implants?',
    qHi: 'क्या शुगर (डायबिटीज) या बीपी के मरीज दांत निकलवा सकते हैं या इंप्लांट लगवा सकते हैं?',
    qHn: 'Kya Sugar ya BP wale patient daant nikalwa ya implant lagwa sakte hain?',
    aEn: 'Yes, but strict clinical protocol is mandatory. Fasting/PP blood glucose levels and blood pressure must be evaluated prior to the procedure. Patients taking blood thinners (e.g., Ecosprin) must NEVER stop medication on their own; consult your physician and dental surgeon together.',
    aHi: 'हाँ, लेकिन सख्त चिकित्सीय नियमों के साथ। दांत निकालने या इंप्लांट से पहले शुगर व बीपी की जांच अनिवार्य है। खून पतला करने की दवा (जैसे Ecosprin) लेने वाले मरीज डॉक्टर को पहले बताएं; खुद से दवा कभी बंद न करें।',
    aHn: 'Haan, bilkul karwa sakte hain lekin pehle clinic par BP aur Sugar ki report check karwana aur doctor ko apni sabhi dawaiyo ke baare me batana zaroori hai.'
  },
  {
    id: 11,
    cat: 'medical',
    qEn: 'Does extracting an upper molar or wisdom tooth impair eye vision or brain memory?',
    qHi: 'क्या ऊपर का दांत या अकल दाढ़ निकलवाने से आंख की रोशनी या याददाश्त पर कोई असर पड़ता है?',
    qHn: 'Kya upar ka daant nikalne se aankh ki roshni kam hoti hai?',
    aEn: 'ANATOMICAL FACT: This is a completely false myth. The maxillary dental nerves (Trigeminal nerve branches) and the optic nerve supplying eye vision run through completely different anatomical paths. Tooth extraction has zero adverse effect on vision.',
    aHi: 'चिकित्सीय हकीकत: यह पूरी तरह से भ्रामक धारणा है। दांत की नसों और आंख की देखने वाली नसों का मार्ग शरीर में बिल्कुल अलग होता है। ऊपर का दांत निकालने से आंख या दिमाग पर कोई असर नहीं पड़ता।',
    aHn: 'Yeh bilkul galat baat hai. Daant ki nas aur aankh ki nas ka aapas me koi connection nahi hota. Aankh ki roshni par 0% asar padta hai.'
  },

  // 5. DENTAL IMPLANTS & FIXED TEETH
  {
    id: 12,
    cat: 'implants',
    qEn: 'What is a Dental Implant, and how does it prevent early facial aging and bone loss?',
    qHi: 'डेंटल इंप्लांट क्या है और यह चेहरे को उम्र से पहले बूढ़ा दिखने से कैसे बचाता है?',
    qHn: 'Dental Implant kya hai aur yeh gaal baithne se kaise bachata hai?',
    aEn: 'A dental implant is a biocompatible medical-grade titanium fixture placed directly into the jawbone, acting as an artificial root. It stimulates the jawbone during chewing, preventing bone resorption that typically causes hollow cheeks and wrinkles.',
    aHi: 'डेंटल इंप्लांट टाइटेनियम का एक स्थायी पेंच होता है जो प्राकृतिक जड़ की तरह जबड़े की हड्डी में स्थापित किया जाता है। यह जबड़े की हड्डी को सिकुड़ने से रोकता है, जिससे गाल अंदर नहीं धंसते और चेहरे का आकार हमेशा प्राकृतिक बना रहता है।',
    aHn: 'Dental implant asli jad ki tarah jawbone me fix hota hai. Isse jaw ki haddi kamzor nahi hoti aur chehre ka natural look bana rehta hai.'
  },
  {
    id: 13,
    cat: 'implants',
    qEn: 'Is a dental implant superior to a traditional dental bridge?',
    qHi: 'क्या डेंटल इंप्लांट पुराने ब्रिज (Bridge) सिस्टम से बेहतर क्यों माना जाता है?',
    qHn: 'Dental implant purane bridge se behtar kyu hai?',
    aEn: 'To place a traditional bridge, the dentist must grind down enamel on two adjacent completely healthy teeth. An implant stands entirely independent without sacrificing neighboring teeth.',
    aHi: 'पारंपरिक ब्रिज में खाली जगह भरने के लिए आगे और पीछे के दो स्वस्थ दांतों को घिसना पड़ता था। डेंटल इंप्लांट बिना किसी पड़ोसी दांत को छुए स्वतंत्र रूप से लगाया जाता है।',
    aHn: 'Bridge me 2 healthy daanto ko ghis kar chhota karna padta tha, jabki implant me kisi dusre daant ko nuksan nahi pahunchaya jata.'
  },

  // 6. WISDOM TEETH & ALIGNMENT
  {
    id: 14,
    cat: 'wisdom',
    qEn: 'Why do wisdom teeth (Akal Daadh) frequently get stuck and cause severe jaw pain?',
    qHi: 'अकल दाढ़ (Wisdom Tooth) अक्सर तिरछी क्यों फंसती है और जबड़े में तेज दर्द क्यों करती है?',
    qHn: 'Akal daadh hamesha tirchi kyu aati hai aur gale tak dard kyu hota hai?',
    aEn: 'Human jaws have evolved smaller over centuries, leaving insufficient arch space for the last third molars. When impacted against bone or under gums, bacteria enter the pocket causing severe swelling. Minor surgical extraction under local anesthesia gives permanent relief.',
    aHi: 'जबड़े में पूरी जगह न होने के कारण अकल दाढ़ तिरछी या मसूड़े के अंदर ही फंस जाती है। वहां खाना फंसने से मसूड़ों में भयंकर सूजन आ जाती है। डिजिटल RVG एक्स-रे देखकर इसे दर्द-रहित तरीके से हटा दिया जाता है।',
    aHn: 'Jabde me jagah kam hone se akal daadh phas jati hai. RVG X-ray se dekh kar doctor ise minor painless procedure se nikaal dete hain.'
  },
  {
    id: 15,
    cat: 'kids',
    qEn: 'Can adults in their 20s, 30s or 40s still straighten crooked teeth using Invisible Aligners?',
    qHi: 'क्या 20 से 40 वर्ष की उम्र में भी बिना तार (Invisible Aligners) के टेढ़े दांत सीधे हो सकते हैं?',
    qHn: 'Kya bina taar lagwaye (invisible aligners se) kisi bhi umar me daant seedhe ho sakte hain?',
    aEn: 'Yes. Orthodontic tooth movement depends on periodontal bone health, not patient age. Modern clear invisible aligners can straighten crooked, rotated, or spaced teeth discreetly without visible metal wires.',
    aHi: 'हाँ! दांत सीधे कराने की कोई अधिकतम उम्र नहीं होती। आधुनिक पारदर्शी इनविजिबल अलाइनर्स से बिना किसी को दिखे, बिना धातु के तारों के दांतों को पूरी सुंदरता के साथ सीधा किया जा सकता है।',
    aHn: 'Haan, kisi bhi age me invisible aligners se bina metal wire dikhe daant seedhe ho sakte hain.'
  }, // <-- YAHAN COMMA MISSING THA[cite: 7, 9]

  // 7. TEETH WHITENING, STAINS & ENAMEL CARE
  {
    id: 16,
    cat: 'gums',
    qEn: 'Does professional laser teeth whitening damage natural enamel or cause permanent sensitivity?',
    qHi: 'क्या क्लिनिक पर दांत सफेद (टीथ व्हाइटनिंग) कराने से असली इनेमल खराब होता है?',
    qHn: 'Kya teeth whitening karwane se daant kamzor ya ghise huye ho jaate hain?',
    aEn: 'No. Professional in-clinic whitening uses controlled hydrogen peroxide gel that breaks organic stain molecules without etching tooth mineral enamel. Temporary sensitivity for 24-48 hours is normal and resolves completely.',
    aHi: 'नहीं। क्लिनिक में की जाने वाली व्हाइटनिंग वैज्ञानिक रूप से सुरक्षित होती है। यह केवल दांत की सतह पर जमे पीलेपन को साफ करती है, इनेमल को नहीं घिसती। एक-दो दिन हल्की झनझनाहट सामान्य है जो अपने आप ठीक हो जाती है।',
    aHn: 'Nahi, whitening sirf peelapan hatati hai aur daant ke enamel ko safe rakhti hai. 1-2 din halki sensitivity normal hai jo apne aap theek ho jati hai.'
  },
  {
    id: 17,
    cat: 'gums',
    qEn: 'Can baking soda, charcoal powder, or lemon juice whiten teeth safely at home?',
    qHi: 'क्या बेकिंग सोडा, चारकोल पाउडर या नींबू का रस घर पर दांतों को सुरक्षित रूप से चमका सकता है?',
    qHn: 'Kya baking soda ya charcoal powder se daant ghis kar safed karna safe hai?',
    aEn: 'CRITICAL ALERT: Avoid these abrasive home hacks. Lemon juice contains citric acid that dissolves enamel calcium, while charcoal and baking soda abrade enamel permanently, eventually making teeth look more yellow as inner dentin exposes.',
    aHi: 'सख्त चेतावनी: नींबू का सिट्रिक एसिड इनेमल को पिघला देता है और चारकोल पाउडर इनेमल को खुरच देता है। जब ऊपरी सफेद परत घिस जाती है, तो अंदर की पीली परत (डेंटिन) दिखने लगती है। इन्हें कभी न घिसें।',
    aHn: 'Warning: Nimbu ya charcoal se daant ghusne par daant ki safed layer hamesha ke liye chhil jati hai aur daant aur zyada peele dikhne lagte hain.'
  },
  {
    id: 18,
    cat: 'pain',
    qEn: 'Why do teeth become yellow even after regular twice-daily brushing?',
    qHi: 'रोजाना दो बार ब्रश करने के बाद भी दांत पीले क्यों दिखाई देते हैं?',
    qHn: 'Roz do baar brush karne par bhi daant peele kyu dikhte hain?',
    aEn: 'Enamel is translucent, while the underlying dentin is naturally pale yellow. Consuming tea, coffee, turmeric spices, smoking, or natural aging causes staining that regular toothpastes cannot reach without clinical scaling.',
    aHi: 'दांतों के अंदरूनी भाग (डेंटिन) का स्वाभाविक रंग ही हल्का पीला होता है। चाय, कॉफी, हल्दी वाले मसाले और उम्र बढ़ने के साथ इनेमल पतला होने से पीलापन अधिक झलकता है। इसके लिए क्लिनिकल स्केलिंग आवश्यक है।',
    aHn: 'Daant ke andar ka natural color halka peela hota hai. Chai, coffee aur haldi ke daag regular paste se nahi nikalte, clinic cleaning se saaf hote hain.'
  },

  // 8. BAD BREATH, TONGUE HEALTH & MOUTH ULCERS
  {
    id: 19,
    cat: 'gums',
    qEn: 'Why does bad breath (Halitosis) persist despite using expensive mouthwashes and tongue cleaners?',
    qHi: 'माउथवॉश और जीभ साफ करने के बाद भी मुंह से बदबू आना क्यों बंद नहीं होता?',
    qHn: 'Mouthwash use karne ke baad bhi muh se badbu kyu nahi jati?',
    aEn: 'Over 85% of chronic bad breath originates from anaerobic sulfur-producing bacteria breeding in deep gum pockets (pyorrhea) or concealed cavities. Mouthwashes merely mask odor temporarily. Subgingival scaling is required.',
    aHi: '85% से अधिक मामलों में बदबू का कारण मसूड़ों की गहराई में छुपी पथरी (टार्टर) या सड़ी हुई कैविटी होती है। माउथवॉश केवल कुछ घंटों के लिए खुशबू देता है, जड़ से इलाज के लिए मसूड़ों की सफाई अनिवार्य है।',
    aHn: 'Mouthwash sirf thodi der khushbu deta hai. Asli wajah masoodon ke andar baithe bacteria ya sadan hoti hai jo clinic par deep scaling se hi hat-ti hai.'
  },
  {
    id: 20,
    cat: 'emergency',
    qEn: 'Recurring mouth ulcers (chhale) that do not heal for more than 2-3 weeks: what does it mean?',
    qHi: 'मुंह के छाले अगर 2-3 हफ्ते से ज्यादा समय तक ठीक न हों, तो इसका क्या कारण हो सकता है?',
    qHn: 'Muh ke chhale agar 2-3 hafte tak theek na ho toh kya karna chahiye?',
    aEn: 'MANDATORY ONCOLOGICAL SCREENING: Any non-healing ulcer, white patch (Leukoplakia), or red lesion persisting past 14 days requires immediate clinical biopsy/examination by a dental surgeon to rule out premalignant oral changes.',
    aHi: 'गंभीर चेतावनी: कोई भी छाला या सफेद/लाल धब्बा जो 14 दिनों से अधिक समय तक ठीक न हो, उसे तुरंत नजदीकी दंत चिकित्सक को दिखाना चाहिए ताकि किसी भी गंभीर बीमारी या ओरल कैंसर के शुरुआती लक्षण की जांच की जा सके।',
    aHn: 'Doctor Alert: Agar muh ka chhala 2-3 hafte se theek na ho, toh chemist se dawai lene ke bajaye turant dentist ko dikhayein taaki sahi jaanch ho sake.'
  },

  // 9. TOOTH REPLACEMENT & DENTURES
  {
    id: 21,
    cat: 'implants',
    qEn: 'Is a full-mouth dental implant restoration possible for elderly patients with complete tooth loss?',
    qHi: 'क्या बुजुर्ग मरीजों के सभी दांत गिर जाने पर भी पूरे जबड़े में फिक्स इंप्लांट लगाए जा सकते हैं?',
    qHn: 'Kya sabhi daant gir chuke buzurgo ko bhi permanent implant lag sakte hain?',
    aEn: 'Yes. Modern "All-on-4" and "All-on-6" implant protocols enable full arch fixed zirconia teeth even with reduced bone density, eliminating the discomfort of slipping removable dentures.',
    aHi: 'हाँ। आधुनिक ऑल-ऑन-4 व ऑल-ऑन-6 तकनीक से पूरी बत्तीसी हिलने की समस्या समाप्त हो जाती है और केवल 4 से 6 इंप्लांट्स के सहारे पूरे जबड़े में फिक्स दांत लग जाते हैं।',
    aHn: 'Haan, All-on-4 technology se bina loose denture ke purane sabhi daanto ki jagah permanent fixed daant lagaye ja sakte hain.'
  },
  {
    id: 22,
    cat: 'implants',
    qEn: 'Why do removable dentures become loose and cause sores after 2-3 years?',
    qHi: 'नकली बत्तीसी (डेंटर) 2-3 साल बाद ढीली क्यों हो जाती है और मसूड़ों को क्यों छीलने लगती है?',
    qHn: 'Nakli battisi (denture) kuch saalo baad loose kyu ho jati hai?',
    aEn: 'Without natural tooth roots, the alveolar jawbone gradually shrinks (resorbs) with age. Dentures do not adapt to this changing bone contour and require clinical relining or replacement with fixed implants.',
    aHi: 'जब असली दांत नहीं होते, तो उम्र के साथ जबड़े की हड्डी घिसकर छोटी होती जाती है। पुरानी बत्तीसी का आकार वही रहने से वह ढीली हो जाती है। इसे री-लाइन करवाना या इंप्लांट लगवाना सही उपाय है।',
    aHn: 'Daant na hone se jabde ki haddi baithti rehti hai jisse denture loose ho jata hai. Isko clinic par re-fit karwana ya implant lagwana behtar hai.'
  },

  // 10. BRACES, ALIGNERS & BITE CORRECTION
  {
    id: 23,
    cat: 'kids',
    qEn: 'Do metal braces damage teeth or cause permanent white spots after removal?',
    qHi: 'क्या दांतों पर तार (Braces) लगवाने से दांत खराब होते हैं या हटने के बाद सफेद धब्बे पड़ जाते हैं?',
    qHn: 'Kya daant par taar lagwane se daant kharab ho jaate hain?',
    aEn: 'Brackets do not damage teeth directly. However, poor oral hygiene around brackets traps plaque, causing enamel demineralization (white spot lesions). Using orthodontic brushes and fluoridated rinses prevents this.',
    aHi: 'तारों से दांतों को नुकसान नहीं होता। यदि तार लगे होने के दौरान सही से ब्रश न किया जाए, तो खाना फंसने से इनेमल पर सफेद निशान बन सकते हैं। ऑर्थोडॉन्टिक ब्रश से सफाई रखकर इसे आसानी से रोका जा सकता है।',
    aHn: 'Taar lagne se daant kharab nahi hote, bas bracket ke aas paas special brush se acche se safai rakhni hoti hai.'
  },
  {
    id: 24,
    cat: 'kids',
    qEn: 'What is the ideal age for a child to have their first orthodontic evaluation for jaw alignment?',
    qHi: 'बच्चों के दांत और जबड़े की सही बनावट की जांच किस उम्र में शुरू करवा लेनी चाहिए?',
    qHn: 'Bachho ke daant tedhe hone par sabse pehle kis umar me doctor ko dikhana chahiye?',
    aEn: 'The international standard recommends an orthodontic checkup by age 7. Early interceptive orthodontics can expand narrow jaws and guide adult teeth before complex issues develop.',
    aHi: '7 वर्ष की उम्र में पहली जांच सबसे उपयुक्त होती है। यदि जबड़ा संकरा हो या अंगूठा चूसने की आदत हो, तो बचपन में ही बिना दांत निकाले सही आकार दिया जा सकता है।',
    aHn: '7 saal ki age me pehla checkup karwana sabse best hai taaki baad me taar lagane ki naubat na aaye.'
  },

  // 11. HABITS, CLENCHING & JAW JOINT (TMJ)
  {
    id: 25,
    cat: 'pain',
    qEn: 'Why do I wake up with jaw stiffness, ear ache, and flattened tooth edges (Teeth Grinding/Bruxism)?',
    qHi: 'सुबह उठते ही जबड़े में दर्द, कान के पास जकड़न और दांत घिसे हुए क्यों महसूस होते हैं?',
    qHn: 'Subah uthne par jabde me dard aur daant peesne (grinding) ka kya ilaaj hai?',
    aEn: 'Involuntary night clenching/grinding (Bruxism) is often triggered by stress or bite discrepancies. It severely wears enamel and strains the TMJ joint. A custom-fabricated clinical night guard protects the teeth entirely.',
    aHi: 'रात में अनजाने में दांत पीसने (ब्रक्सिज्म) से जबड़े की मांसपेशियों और नसों पर अत्यधिक दबाव पड़ता है। इससे दांत घिस जाते हैं। क्लिनिक से कस्टम नाइट गार्ड (Night Guard) बनवाकर पहनने से इसका स्थायी समाधान हो जाता है।',
    aHn: 'Tension ya galat bite ki wajah se raat me daant pisne lagte hain. Clinic se soft night-guard cap pehan kar sone se daant ghusne se bach jaate hain.'
  },
  {
    id: 26,
    cat: 'wisdom',
    qEn: 'Why does the jaw make clicking or popping sounds while chewing or opening wide (TMJ Disorder)?',
    qHi: 'मुंह खोलते या खाना चबाते समय कान के पास जबड़े से कट-कट (क्लिकिंग) की आवाज क्यों आती है?',
    qHn: 'Muh kholte waqt jaw joint se kat-kat ki aawaz aane ka kya matlab hai?',
    aEn: 'Clicking indicates displacement of the cartilage disc inside the Temporomandibular Joint (TMJ). Avoid chewing hard foods, extreme yawning, and get a clinical bite evaluation to prevent locked jaw episodes.',
    aHi: 'यह जबड़े के जोड़ (TMJ) के अंदर की गद्दी खिसकने का संकेत है। बहुत बड़ा मुंह न खोलें, कड़क चीजें चबाने से बचें और जोड़ को स्थायी क्षति से बचाने के लिए दंत चिकित्सक से जांच कराएं।',
    aHn: 'Yeh jaw joint ke cartilage ke khisakne se hota hai. Hard khana chabana rokein aur paas ke dentist se joint check karwayein.'
  },

  // 12. ROUTINE HYGIENE, BRUSHING & FLOSSING
  {
    id: 27,
    cat: 'emergency',
    qEn: 'Which is better: Hard, Medium, or Soft bristle toothbrush?',
    qHi: 'हार्ड, मीडियम या सॉफ्ट—किस तरह का टूथब्रश दांतों के लिए सबसे सुरक्षित होता है?',
    qHn: 'Kaun sa toothbrush best hota hai: Hard, Medium ya Soft?',
    aEn: 'Always use an Ultra-Soft or Soft bristle toothbrush. Hard and medium bristles abrade enamel at the gumline (cervical abrasion) and cause gum recession with sensitivity.',
    aHi: 'हमेशा सॉफ्ट या अल्ट्रा-सॉफ्ट ब्रश का ही प्रयोग करें। हार्ड ब्रश से दांतों की जड़ें घिस जाती हैं और मसूड़े नीचे खिसक जाते हैं, जिससे गंभीर झनझनाहट होने लगती है।',
    aHn: 'Hamesha Soft toothbrush use karein. Hard brush se daant jad ke paas se ghis jaate hain aur thanda-garam lagne lagta hai.'
  },
  {
    id: 28,
    cat: 'emergency',
    qEn: 'Is dental flossing really necessary if I already brush thoroughly twice a day?',
    qHi: 'यदि दिन में दो बार ब्रश करते हैं, तो क्या धागे से दांत साफ करना (Flossing) जरूरी है?',
    qHn: 'Agar do baar brush karte hain, toh kya dental floss karna zaroori hai?',
    aEn: 'Yes. Toothbrush bristles clean only 60% of tooth surfaces. The remaining 40% between tight adjacent teeth can only be cleared with dental floss or interdental brushes, where 80% of adult cavities start.',
    aHi: 'हाँ। ब्रश केवल 60% हिस्से तक ही पहुंच पाता है। दो दांतों के बीच का 40% हिस्सा केवल फ्लॉस से ही साफ हो सकता है। अधिकांश कैविटी दोनों दांतों के इसी जोड़ से शुरू होती हैं।',
    aHn: 'Haan, brush do daanto ke beech nahi pahunchta. Floss use na karne se do daanto ke beech me keeda lag jata hai.'
  },
  {
    id: 29,
    cat: 'pain',
    qEn: 'Should I brush immediately after eating citrus fruits, curd, or drinking soda?',
    qHi: 'खट्टे फल, दही या कोल्ड ड्रिंक पीने के तुरंत बाद ब्रश करना सही है या गलत?',
    qHn: 'Khatta khane ya cold drink peene ke turant baad brush karna chahiye kya?',
    aEn: 'Never brush immediately. Acidic food softens outer enamel temporarily. Brushing immediately rubs away the softened calcium layer. Wait 30 minutes for saliva to remineralize, or simply rinse with plain water.',
    aHi: 'तुरंत ब्रश कभी न करें! खट्टी चीजों से इनेमल कुछ समय के लिए हल्का नरम हो जाता है। तुरंत ब्रश करने से वह परत घिस जाती है। सादे पानी से कुल्ला करें और कम से कम 30 मिनट बाद ही ब्रश करें।',
    aHn: 'Khatta khane ke turant baad brush na karein kyunki us waqt enamel soft hota hai. Normal paani se kulla karein aur 30 minute baad brush karein.'
  },
  {
    id: 30,
    cat: 'rct',
    qEn: 'Can an old root canal treated tooth get infected again after years (Re-RCT)?',
    qHi: 'क्या कई साल पहले हुए रूट कैनाल वाले दांत में दोबारा मवाद या दर्द हो सकता है?',
    qHn: 'Kya purane RCT wale daant me saalo baad wapas dard ho sakta hai?',
    aEn: 'Yes. If a crown breaks, micro-leakage occurs, or microscopic extra root canals were missed previously, bacteria can re-enter. Re-treatment (Re-RCT) cleans and reseals the canals to save the tooth again.',
    aHi: 'हाँ, यदि कैप ढीली हो जाए या दांत के अंदर कोई बारीक छिपी नस रह गई हो तो सालों बाद भी दोबारा संक्रमण हो सकता है। री-आरसीटी (Re-RCT) करके दांत को दोबारा बचाया जाता है।',
    aHn: 'Haan, agar cap loose ho jaye toh andar bacteria ghus kar wapas dard kar sakte hain. Re-RCT se daant wapas theek ho jata hai.'
  }, // <-- YAHAN BHI COMMA MISSING THA[cite: 9]

  // 13. TOOTH EXTRACTION CARE & AFTERMATH
  {
    id: 31,
    cat: 'emergency',
    qEn: 'What should I eat or avoid immediately after a tooth extraction?',
    qHi: 'दांत निकलवाने के तुरंत बाद क्या खाना चाहिए और किन चीजों से बचना चाहिए?',
    qHn: 'Daant nikalwane ke baad kya khayein aur kin cheezon ka parhez karein?',
    aEn: 'For the first 24 hours, consume only cold, soft foods (like ice cream, cold soup, or yogurt). Strictly avoid hot tea/coffee, spicy foods, and NEVER use a straw, as suction can dislodge the blood clot and cause a painful condition called Dry Socket.',
    aHi: 'पहले 24 घंटों तक केवल ठंडी और मुलायम चीजें खाएं (जैसे सादी आइसक्रीम, ठंडा दलिया या दही)। गर्म चाय, कॉफी और तीखे भोजन से बचें। स्ट्रॉ (पाइप) से कुछ न पिएं, क्योंकि इसके खिंचाव से खून का थक्का हट सकता है और गंभीर दर्द हो सकता है।',
    aHn: '24 ghante tak sirf thandi aur soft cheezein khayein. Garam aur teekha bilkul na khayein. Straw (pipe) ka use bilkul na karein warna blood clot nikal jayega aur severe dard hoga.'
  },
  {
    id: 32,
    cat: 'emergency',
    qEn: 'How long does it take for the gum hole to close completely after a tooth is pulled?',
    qHi: 'दांत निकालने के बाद मसूड़े का घाव (गड्ढा) पूरी तरह भरने में कितना समय लगता है?',
    qHn: 'Daant nikalne ke baad masoode ka gaddha bharne me kitne din lagte hain?',
    aEn: 'The superficial gum tissue heals and closes within 1-2 weeks. However, the underlying jawbone takes about 3 to 6 months to regenerate and fill the socket completely. Maintain proper hygiene to prevent food accumulation in the healing hole.',
    aHi: 'ऊपरी मसूड़े का घाव 1 से 2 सप्ताह में भर जाता है। लेकिन अंदर की हड्डी को पूरी तरह से ठोस होने में 3 से 6 महीने का समय लगता है। इस दौरान घाव में खाना न फंसने दें और कुल्ला करते रहें।',
    aHn: 'Upar ka masooda 1-2 hafte me theek ho jata hai, par andar ki haddi banne me 3-6 mahine lagte hain. Gaddhe me khana phasne se rokein.'
  },

  // 14. PREGNANCY, WOMEN'S HEALTH & X-RAYS
  {
    id: 33,
    cat: 'medical',
    qEn: 'Is it safe to get dental treatments and RVG X-rays done during pregnancy?',
    qHi: 'क्या गर्भावस्था (Pregnancy) के दौरान दांतों का इलाज और एक्स-रे करवाना सुरक्षित है?',
    qHn: 'Kya pregnancy me dental treatment aur X-ray karwana safe hai?',
    aEn: 'Routine dental cleanings and emergency fillings are completely safe, particularly in the second trimester. Modern digital RVG X-rays have negligible radiation, and with a lead apron, they are safe. Always inform your dentist about your pregnancy before any procedure.',
    aHi: 'गर्भावस्था की दूसरी तिमाही (Second Trimester) में सामान्य इलाज और सफाई पूरी तरह सुरक्षित है। आधुनिक डिजिटल एक्स-रे में रेडिएशन न के बराबर होता है, फिर भी सुरक्षा के लिए लेड एप्रन का उपयोग किया जाता है। डॉक्टर को अपनी प्रेग्नेंसी की जानकारी अवश्य दें।',
    aHn: 'Pregnancy ke second trimester me ilaaj safe hai. Modern X-ray me radiation bohot kam hoti hai. Treatment se pehle apni pregnancy ke baare me dentist ko zaroor batayein.'
  },
  {
    id: 34,
    cat: 'medical',
    qEn: 'Why do my gums bleed more frequently during pregnancy or menstruation?',
    qHi: 'गर्भावस्था (Pregnancy) या पीरियड्स के दौरान मसूड़ों से खून ज्यादा क्यों आता है?',
    qHn: 'Pregnancy ya periods ke time masoodon se khoon zyada kyu aata hai?',
    aEn: 'Hormonal fluctuations (increased progesterone) increase blood flow to the gums, making them highly sensitive to even small amounts of plaque, leading to "Pregnancy Gingivitis." Clinical scaling is highly recommended during this period.',
    aHi: 'हार्मोनल बदलाव (प्रोजेस्टेरोन बढ़ने) के कारण मसूड़ों में रक्त का प्रवाह बढ़ जाता है, जिससे वे प्लाक के प्रति संवेदनशील हो जाते हैं और हल्की सूजन या खून आ सकता है। इसे प्रेग्नेंसी जिंजिवाइटिस कहते हैं।',
    aHn: 'Hormones change hone ki wajah se masoodon me blood flow badh jata hai, jisse halki gandagi se bhi khoon aane lagta hai. Is time clinic cleaning zaroori hai.'
  },

  // 15. CAVITIES, FILLINGS & DECAY
  {
    id: 35,
    cat: 'rct',
    qEn: 'Is it normal to have tooth sensitivity to cold water immediately after getting a new filling?',
    qHi: 'क्या दांत में नया मसाला (फिलिंग) भरवाने के बाद कुछ दिनों तक ठंडा पानी लगना सामान्य है?',
    qHn: 'Kya nayi filling karwane ke baad thanda paani lagna normal baat hai?',
    aEn: 'Yes. Mild sensitivity to cold is completely normal for a few days up to two weeks after a deep composite filling due to dentin bonding and nerve proximity. If the pain is severe or throbbing at night, revisit your clinic.',
    aHi: 'हाँ। गहरी फिलिंग (मसाला भरने) के बाद दांत की नस कुछ दिनों तक संवेदनशील रह सकती है, इसलिए 1-2 हफ्ते तक हल्का ठंडा लग सकता है। यदि दर्द बहुत तेज हो या रात को सोने न दे, तो तुरंत जांच कराएं।',
    aHn: 'Haan, deep filling ke baad 1-2 hafte tak thanda lagna normal hai. Par agar raat me teekha dard ho, toh wapas checkup karwayein.'
  },
  {
    id: 36,
    cat: 'rct',
    qEn: 'Should I replace my old black or silver (amalgam) fillings with white composite fillings?',
    qHi: 'क्या मुझे पुराने काले/चांदी (अमलगम) वाले मसालों को हटाकर नए सफेद मसाले भरवाने चाहिए?',
    qHn: 'Kya purani kaali filling ko hatwa kar nayi white filling karwani chahiye?',
    aEn: 'You do not need to replace silver fillings if they are intact and asymptomatic. However, if they are leaking, cracked, or causing aesthetic concerns, your dentist can safely replace them with modern tooth-colored composite resins.',
    aHi: 'यदि पुरानी काली फिलिंग मजबूत है और कोई दर्द नहीं है, तो उसे बदलने की जरूरत नहीं है। लेकिन यदि उसके किनारे टूट गए हैं या आपको अपनी मुस्कान बेहतर करनी है, तो उसे सफेद लेज़र फिलिंग से बदला जा सकता है।',
    aHn: 'Agar purani filling theek hai toh mat hatwayein. Par agar wo leak kar rahi hai ya dikhne me kharab lag rahi hai, toh white laser filling karwa sakte hain.'
  },
  {
    id: 37,
    cat: 'emergency',
    qEn: 'Why did my tooth turn dark grey or black after falling or getting hit?',
    qHi: 'चोट लगने या गिरने के कुछ महीनों बाद दांत का रंग काला या सलेटी (Grey) क्यों होने लगता है?',
    qHn: 'Chot lagne ke baad daant ka color kaala kyu padne lagta hai?',
    aEn: 'A dark or grey tooth after physical trauma usually indicates that the internal nerve (pulp) has died (necrosis). Blood byproducts seep into the dentin, staining it from the inside. A Root Canal Treatment (RCT) is required to save the tooth.',
    aHi: 'दांत का काला पड़ना यह दर्शाता है कि चोट के कारण दांत के अंदर की नस (Pulp) मृत (Dead) हो चुकी है। यह एक अंदरूनी संक्रमण है। दांत को बचाने के लिए रूट कैनाल ट्रीटमेंट (RCT) कराना आवश्यक है।',
    aHn: 'Daant ka color dark hone ka matlab hai andar ki nas dead ho chuki hai. Isko theek karne ke liye Root Canal (RCT) karwana padta hai.'
  },
  {
    id: 38,
    cat: 'emergency',
    qEn: 'Can a cracked or chipped tooth heal on its own without a dentist?',
    qHi: 'क्या हल्का टूटा हुआ या दरार (Cracked) वाला दांत अपने आप जुड़कर ठीक हो सकता है?',
    qHn: 'Kya crack hua daant apne aap theek ho sakta hai?',
    aEn: 'No. Unlike bones, tooth enamel does not contain living cells, so it cannot regenerate or heal itself. A cracked tooth will slowly widen and invite bacteria. It must be sealed with composite bonding or a cap.',
    aHi: 'नहीं। हड्डियों के विपरीत, दांत के इनेमल में जीवित कोशिकाएं नहीं होतीं, इसलिए यह खुद नहीं जुड़ सकता। दरार वाले दांत में बैक्टीरिया घुसकर उसे सड़ा देते हैं। डॉक्टर से इसे तुरंत पैक करवाना जरूरी है।',
    aHn: 'Nahi, daant ki haddi apne aap nahi judti. Crack ke andar bacteria jaa kar RCT ki naubat laa sakte hain, isliye turant cap ya filling karwayein.'
  },

  // 16. ADVANCED GUM HEALTH & RECESSION
  {
    id: 39,
    cat: 'gums',
    qEn: 'Can receding gums (gums moving away from teeth) grow back naturally?',
    qHi: 'क्या नीचे खिसक चुके मसूड़े अपने आप दोबारा ऊपर आ सकते हैं?',
    qHn: 'Kya niche khisak chuke masoode apne aap theek ho sakte hain?',
    aEn: 'Gum tissue cannot grow back naturally once it has receded due to aggressive brushing, tartar, or age. Professional scaling stops further recession, and severe cases can only be corrected through minor gum grafting surgery.',
    aHi: 'एक बार मसूड़े अपनी जगह से खिसक जाएं, तो वे प्राकृतिक रूप से वापस नहीं आते। क्लिनिक पर सफाई कराने से उन्हें और अधिक खिसकने से रोका जा सकता है। बहुत गंभीर मामलों में सर्जरी (गम्स ग्राफ्टिंग) की जाती है।',
    aHn: 'Masoode apne aap wapas upar nahi aate. Sahi brush use karne aur clinic par scaling karwane se inka aur niche khisakna roka ja sakta hai.'
  },
  {
    id: 40,
    cat: 'gums',
    qEn: 'Is it harmful to use wooden toothpicks to remove food from between teeth?',
    qHi: 'क्या दांतों के बीच फंसा खाना निकालने के लिए लकड़ी की टूथपिक का उपयोग करना सुरक्षित है?',
    qHn: 'Kya daant me phasa khana nikalne ke liye toothpick (lakdi) use karna safe hai?',
    aEn: 'Yes, it is highly damaging. Wooden toothpicks traumatize the delicate gum papilla and physically wedge teeth apart, creating permanent gaps. Always use dental floss or a water flosser to remove trapped food.',
    aHi: 'यह बहुत नुकसानदायक है। लकड़ी की टूथपिक मसूड़ों को छील देती है और बार-बार उपयोग करने से दो दांतों के बीच हमेशा के लिए गैप (खाली जगह) बन जाता है। खाना निकालने के लिए केवल डेंटल फ्लॉस का उपयोग करें।',
    aHn: 'Toothpick bilkul use na karein. Ye masoodon ko kat-ti hai aur daanto ke beech gap bada kar deti hai. Hamesha dental floss (dhaga) use karein.'
  },

  // 17. MODERN TOOLS: ELECTRIC BRUSHES & WATER FLOSSERS
  {
    id: 41,
    cat: 'gums',
    qEn: 'Are electric toothbrushes significantly better than traditional manual toothbrushes?',
    qHi: 'क्या इलेक्ट्रिक टूथब्रश सामान्य हाथों वाले ब्रश से ज्यादा बेहतर और सुरक्षित होते हैं?',
    qHn: 'Kya electric toothbrush normal brush se zyada accha safai karta hai?',
    aEn: 'Clinical studies show that electric toothbrushes remove more plaque and reduce gingivitis faster. They also feature pressure sensors that stop you from brushing too hard and damaging your enamel.',
    aHi: 'हाँ। इलेक्ट्रिक ब्रश अपने कंपन (vibrations) के कारण दांतों से प्लाक और मैल अधिक प्रभावी ढंग से हटाते हैं। इनमें प्रेशर सेंसर भी होता है जो मसूड़ों को जोर से रगड़ने से बचाता है।',
    aHn: 'Haan, electric brush apne aap rotate ho kar better safai karta hai aur masoodon ko jor se ghusne (damage) se bachata hai.'
  },
  {
    id: 42,
    cat: 'gums',
    qEn: 'Should I use a mouthwash before or immediately after brushing my teeth?',
    qHi: 'माउथवॉश का उपयोग ब्रश करने से पहले करना चाहिए या तुरंत बाद में?',
    qHn: 'Mouthwash ko brush karne ke turant baad use karna chahiye kya?',
    aEn: 'Avoid using mouthwash immediately after brushing. Toothpaste contains protective fluoride, and a liquid mouthwash washes it away before it bonds to the teeth. Use mouthwash at a completely different time of the day.',
    aHi: 'ब्रश करने के तुरंत बाद माउथवॉश का उपयोग न करें। टूथपेस्ट में मौजूद फ्लोराइड दांतों को मजबूत बनाता है, और माउथवॉश उसे धो देता है। माउथवॉश का उपयोग दोपहर में या ब्रश करने के घंटों बाद करें।',
    aHn: 'Brush ke turant baad mouthwash na karein warna paste ka fayda khatam ho jayega. Ise din me kisi aur waqt (jaise dopahar me) use karein.'
  },

  // 18. KIDS SPECIFIC CARE
  {
    id: 43,
    cat: 'kids',
    qEn: 'Is fluoride toothpaste safe for young children if they accidentally swallow it?',
    qHi: 'क्या छोटे बच्चों के लिए फ्लोराइड वाला टूथपेस्ट सुरक्षित है यदि वे इसे गलती से निगल लें?',
    qHn: 'Agar bacha fluoride wala paste nigal jaye toh kya nuksan hai?',
    aEn: 'Fluoride is safe and highly effective at preventing cavities when used correctly. For kids under 3, use only a "rice-grain" sized smear. For kids 3-6, use a "pea-sized" amount. Swallowing tiny amounts is clinically safe.',
    aHi: 'सही मात्रा में यह बिल्कुल सुरक्षित है। 3 साल से छोटे बच्चों के लिए केवल चावल के दाने के बराबर, और 3 से 6 साल के बच्चों के लिए मटर के दाने के बराबर फ्लोराइड पेस्ट दें। इतनी मात्रा निगलने से कोई नुकसान नहीं होता।',
    aHn: 'Sahi matra me safe hai. Chote bacho ko sirf matar ke daane jitna paste dein taaki thoda nigal bhi lein toh koi nuksan na ho.'
  },
  {
    id: 44,
    cat: 'kids',
    qEn: 'How can I safely soothe my baby’s gums during the teething phase?',
    qHi: 'जब छोटे बच्चों के दांत निकल रहे हों (Teething), तो उनके मसूड़ों के दर्द को कैसे कम करें?',
    qHn: 'Bacho ke naye daant aate time masoodon me dard aur khujli kaise theek karein?',
    aEn: 'Give them a chilled (not frozen) teething ring or gently massage their gums with a clean finger. Avoid over-the-counter numbing gels containing benzocaine, as they can cause rare but serious oxygen-deprivation conditions in infants.',
    aHi: 'उन्हें चबाने के लिए साफ ठंडा टीथिंग रिंग (Teether) दें या अपनी साफ उंगली से मसूड़ों की हल्की मालिश करें। मेडिकल स्टोर से मिलने वाले सुन्न करने वाले जेल (Benzocaine) का उपयोग बच्चों पर बिल्कुल न करें।',
    aHn: 'Thanda teether chabane ko dein ya saaf ungli se halki massage karein. Chemist se laa kar koi sunn karne wali cream masoodon par na lagayein.'
  },

  // 19. HABITS & MEDICAL LIFESTYLE (SMOKING, MEDS)
  {
    id: 45,
    cat: 'medical',
    qEn: 'Can vaping or using e-cigarettes cause tooth decay and gum disease?',
    qHi: 'क्या ई-सिगरेट (Vaping) पीने से भी दांतों में कीड़ा लगता है और मसूड़े खराब होते हैं?',
    qHn: 'Kya Vape peene se daant aur masoode kharab hote hain?',
    aEn: 'Yes. E-cigarette vapor contains propylene glycol and sweet flavorings that cause extreme dry mouth and feed bacteria. Vaping also restricts blood flow to the gums, masking early signs of severe periodontitis.',
    aHi: 'हाँ। वेपिंग के धुएं में मौजूद केमिकल्स से मुंह सूख जाता है, जिससे लार कम बनती है और कैविटी तेजी से बढ़ती है। यह मसूड़ों के रक्त प्रवाह को भी रोक देता है, जिससे पायरिया का पता देर से चलता है।',
    aHn: 'Haan, Vape peene se muh sookh jata hai aur bacteria tezi se daant sadate hain. Isse masoode andar hi andar kamzor ho jate hain.'
  },
  {
    id: 46,
    cat: 'medical',
    qEn: 'Can taking daily medications for Blood Pressure or Depression cause cavities?',
    qHi: 'क्या ब्लड प्रेशर या डिप्रेशन की रोजमर्रा की दवाइयां खाने से दांतों में कैविटी हो सकती है?',
    qHn: 'Kya BP ya depression ki dawaiyo se daant me keeda lagne ka khatra badhta hai?',
    aEn: 'Indirectly, yes. Over 400 common medications (including BP meds and antidepressants) cause Dry Mouth (Xerostomia) as a side effect. Without saliva to wash away food and acids, tooth decay accelerates rapidly. Consult your dentist for hydration protocols.',
    aHi: 'सीधे तौर पर नहीं, लेकिन इन दवाओं से मुंह सूखने (Dry Mouth) की समस्या होती है। लार दांतों की रक्षा करती है; लार कम होने से एसिड बढ़ता है और दांत तेजी से सड़ने लगते हैं। अधिक पानी पिएं और डॉक्टर से सलाह लें।',
    aHn: 'Haan, in dawaiyo se muh sookhne lagta hai (saliva kam banta hai). Saliva na hone se daant tezi se sadne lagte hain. Aise me paani zyada peena chahiye.'
  },

  // 20. MISCELLANEOUS (TONGUE, LOOSE TEETH, VENEERS)
  {
    id: 47,
    cat: 'gums',
    qEn: 'Do I really need to brush or scrape my tongue daily?',
    qHi: 'क्या रोजाना ब्रश के साथ जीभ को साफ करना (Tongue cleaning) सच में जरूरी है?',
    qHn: 'Kya roz jeebh (tongue) saaf karna zaroori hai?',
    aEn: 'Absolutely. The rough surface of the tongue harbors nearly 50% of the bacteria in your mouth. Skipping tongue cleaning leads to bad breath, altered taste, and continuous redeposition of plaque on newly cleaned teeth.',
    aHi: 'बिल्कुल। आपके मुंह के 50% बैक्टीरिया जीभ की खुरदरी सतह पर छिपे होते हैं। जीभ साफ न करने से बदबू आती है और ये बैक्टीरिया वापस आपके साफ दांतों पर चिपक जाते हैं।',
    aHn: 'Haan, muh ke aade (50%) bacteria jeebh par hote hain. Jeebh saaf na karne se badbu aati hai aur daant wapas jaldi gande hote hain.'
  },
  {
    id: 48,
    cat: 'gums',
    qEn: 'Why do my lower front teeth feel slightly loose, and can they be tightened?',
    qHi: 'मेरे नीचे के आगे वाले दांत हल्के ढीले क्यों महसूस होते हैं, क्या इन्हें वापस कसा जा सकता है?',
    qHn: 'Niche ke aage wale daant dheele kyu ho jate hain aur kya ye wapas tight ho sakte hain?',
    aEn: 'Loose lower teeth usually indicate advanced bone loss due to untreated tartar buildup (Periodontitis). Clinical deep scaling and periodontal splinting (tying teeth together with fiber) by a dentist can stabilize them and prevent extraction.',
    aHi: 'यह दांतों की जड़ों पर भारी पथरी (टार्टर) जमने और हड्डी गलने का संकेत है। दंत चिकित्सक द्वारा डीप क्लीनिंग और स्प्लिंटिंग (तार से बांधने) की प्रक्रिया से इन्हें उखड़ने से बचाया और मजबूत किया जा सकता है।',
    aHn: 'Ye pathri (tartar) jamne se haddi galne ki nishani hai. Clinic par deep cleaning aur Splinting (fibre wire) se inko girne se bachaya ja sakta hai.'
  },
  {
    id: 49,
    cat: 'implants',
    qEn: 'What are Porcelain Veneers? Do they ruin your original natural teeth?',
    qHi: 'पोर्सिलेन वेनियर्स (Veneers) क्या हैं? क्या इन्हें लगवाने से असली दांत बर्बाद हो जाते हैं?',
    qHn: 'Veneers kya hote hain aur kya isse asli daant kharab ho jate hain?',
    aEn: 'Veneers are ultra-thin ceramic shells bonded to the front of teeth to perfect a smile (closing gaps, fixing stains). Modern conservative dentistry removes less than 0.5mm of enamel, so it does not "ruin" the tooth if done by an expert.',
    aHi: 'वेनियर्स दांतों के सामने लगाई जाने वाली बहुत पतली सिरैमिक परत होती है, जिससे गैप या पीलापन छुपाया जाता है। आधुनिक तकनीक में दांत को न के बराबर (0.5mm) घिसा जाता है, इसलिए विशेषज्ञ द्वारा किए जाने पर असली दांत सुरक्षित रहते हैं।',
    aHn: 'Veneers ek patli layer hoti hai jo daanto ki khoobsurti badhati hai. Expert dentist isme asli daant ko na ke barabar ghisate hain jisse daant safe rehte hain.'
  },
  {
    id: 50,
    cat: 'emergency',
    qEn: 'How often should I change my toothbrush or electric brush head?',
    qHi: 'मुझे अपना टूथब्रश या इलेक्ट्रिक ब्रश का हेड कितने महीनों में बदल लेना चाहिए?',
    qHn: 'Toothbrush ko kitne time me badal lena chahiye?',
    aEn: 'Dental protocols mandate replacing your toothbrush every 3 to 4 months. Frayed bristles lose their cleaning efficiency and can injure gums. Additionally, always change your brush immediately after recovering from a viral fever or throat infection.',
    aHi: 'चिकित्सीय नियम के अनुसार हर 3 से 4 महीने में ब्रश बदल लेना चाहिए। मुड़े हुए रेशे (Bristles) मसूड़ों को नुकसान पहुंचाते हैं। इसके अलावा, वायरल बुखार या गले के संक्रमण से ठीक होने के तुरंत बाद ब्रश जरूर बदलें।',
    aHn: 'Har 3-4 mahine me brush badal lein kyunki mude huye bristles safai nahi karte. Bukhar (fever) theek hone ke baad bhi purana brush fek dena chahiye.'
  }
];

export default function DentalCareGuide() {
  const [lang, setLang] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFAQ, setOpenFAQ] = useState(1);
  const [faqsList, setFaqsList] = useState(verifiedDentalFAQs);
  const [customNotice, setCustomNotice] = useState(null);

  // Firestore Sync & LocalStorage Fallback
  useEffect(() => {
    try {
      const cached = localStorage.getItem('balaji_clinic_config');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.dentalFaqs && parsed.dentalFaqs.length > 0) {
          setFaqsList([...parsed.dentalFaqs, ...verifiedDentalFAQs]);
        }
        if (parsed?.dentalAdvisory) {
          setCustomNotice(parsed.dentalAdvisory);
        }
      }
    } catch (e) {
      console.warn('Local cache read error:', e);
    }

    try {
      const docRef = doc(db, 'settings', 'clinic_config');
      const unsubscribe = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data?.dentalFaqs && data.dentalFaqs.length > 0) {
            setFaqsList([...data.dentalFaqs, ...verifiedDentalFAQs]);
          }
          if (data?.dentalAdvisory) {
            setCustomNotice(data.dentalAdvisory);
          }
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore real-time sync error:', err);
    }
  }, []);

  const filteredFAQs = useMemo(() => {
    return faqsList.filter((item) => {
      const matchCat = activeCategory === 'all' || item.cat === activeCategory;
      const qText = `${item.qEn} ${item.qHi} ${item.qHn} ${item.aEn} ${item.aHi} ${item.aHn}`.toLowerCase();
      const matchQuery = !searchQuery.trim() || qText.includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [faqsList, searchQuery, activeCategory]);

  // Notice Text (General Doctor Advice - No Personal Doctor Name in Notice)
  const noticeEn = customNotice?.noticeEn || 'This informational guide is solely for educational purposes and does NOT constitute a formal prescription or medical diagnosis. Self-medication or home remedies without physical examination and X-ray are strictly hazardous. Always consult your nearest registered dental surgeon or doctor in person before taking any step.';
  const noticeHi = customNotice?.noticeHi || 'यह मार्गदर्शिका केवल सामान्य जागरूकता हेतु है और इसे मेडिकल डायग्नोसिस या दवा का पर्चा (Prescription) न माना जाए। क्लिनिकल जांच व एक्स-रे के बिना कोई भी दवा या घरेलू उपचार अपनाना पूर्णतः वर्जित है। किसी भी समस्या के लिए कृपया अपने नजदीकी पंजीकृत दंत चिकित्सक से व्यक्तिगत सलाह लें।';
  const noticeHn = customNotice?.noticeHn || 'Yeh content sirf general jankari ke liye hai, prescription nahi hai. Bina clinic par doctor ko dikhaye koi bhi goli ya gharelu tarika na aazmayein. Koi bhi kadam uthane se pehle apne paas ke registered dental doctor se paramarsh lein.';

  return (
    <div className="w-full bg-slate-50 text-slate-900 min-h-screen overflow-x-hidden">
      
      {/* 1. COMPREHENSIVE LEGAL IMMUNITY DISCLAIMER */}
      <section className="bg-amber-500 text-slate-950 border-b-2 border-amber-600 px-3 sm:px-6 py-3.5 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-start gap-3">
          <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 shrink-0 mt-0.5" />
          <div className="text-[11px] sm:text-xs leading-relaxed font-semibold">
            <span className="font-black uppercase tracking-wider block sm:inline mr-1 text-slate-950">
              ⚖️ Mandatory Legal Advisory (वैधानिक सूचना):
            </span>
            {lang === 'en' && noticeEn}
            {lang === 'hi' && noticeHi}
            {lang === 'hn' && noticeHn}
          </div>
        </div>
      </section>

      {/* 2. HERO HEADER (MOBILE SAFE) */}
      <section className="bg-gradient-to-b from-teal-950 via-teal-900 to-slate-950 text-white py-10 sm:py-14 px-3 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-5">
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 border border-teal-400/30 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Stethoscope className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="truncate">Patient Dental Care & Clinical Guide</span>
            </div>

            <div className="inline-flex p-1 bg-slate-900/90 rounded-xl border border-slate-700 shrink-0 shadow-md">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] font-black transition-all ${
                  lang === 'en' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] font-black transition-all ${
                  lang === 'hi' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLang('hn')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] font-black transition-all ${
                  lang === 'hn' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                Hinglish
              </button>
            </div>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight leading-snug">
              {lang === 'en' && 'Frequently Asked Dental Questions & Patient Guide'}
              {lang === 'hi' && 'दंत चिकित्सा: सामान्य सवाल-जवाब एवं रोगी सुरक्षा मार्गदर्शिका'}
              {lang === 'hn' && 'Daant Dard, RCT & Implants ke Sawaal-Jawab'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {lang === 'en' && 'Verified clinical protocols for toothaches, painless root canal treatments, bleeding gums, and permanent implants.'}
              {lang === 'hi' && 'दांत दर्द, रूट कैनाल, पायरिया व फिक्स्ड दांतों से जुड़े सभी जरूरी सवालों के वैज्ञानिक उत्तर।'}
              {lang === 'hn' && 'Daant ki takleef aur sahi clinic solutions ki certified guide taaki koi galti na ho.'}
            </p>
          </div>

          <div className="relative w-full max-w-xl pt-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 mt-0.5" />
            <input
              type="text"
              placeholder={
                lang === 'en' 
                  ? 'Search questions (e.g. root canal, pain, swelling, implants)...'
                  : lang === 'hi' 
                  ? 'सर्च करें (उदा. रूट कैनाल, रात का दर्द, मसूड़ों से खून, कैप)...'
                  : 'Search karein (jaise: dard, sujan, RCT, nakli daant)...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-white text-slate-900 rounded-xl font-medium text-xs sm:text-sm outline-none shadow-xl focus:ring-2 focus:ring-teal-400"
            />
          </div>

        </div>
      </section>

      {/* 3. CATEGORY FILTER */}
      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
          {[
            { id: 'all', en: 'All Topics', hi: 'सभी विषय', hn: 'All Topics' },
            { id: 'emergency', en: 'Emergency & Pain', hi: 'आपातकालीन दर्द', hn: 'Raat ka Dard' },
            { id: 'rct', en: 'Root Canal & Caps', hi: 'रूट कैनाल व कैप', hn: 'RCT & Caps' },
            { id: 'gums', en: 'Gums & Pyorrhea', hi: 'मसूड़े व पायरिया', hn: 'Masoodo ka Ilaaj' },
            { id: 'medical', en: 'Diabetes & BP Safety', hi: 'शुगर/बीपी व दांत', hn: 'Sugar & BP Care' },
            { id: 'implants', en: 'Fixed Implants', hi: 'फिक्स्ड इंप्लांट', hn: 'Permanent Daant' },
            { id: 'wisdom', en: 'Wisdom Teeth', hi: 'अकल दाढ़', hn: 'Akal Daadh' },
            { id: 'kids', en: 'Braces & Aligners', hi: 'तार व अलाइनर', hn: 'Invisible Aligners' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat[lang]}
            </button>
          ))}
        </div>

        <p className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-2">
          {filteredFAQs.length} questions available
        </p>
      </section>

      {/* 4. ACCORDION QUESTION LIST */}
      <section className="max-w-5xl mx-auto px-3 sm:px-6 pb-12 space-y-3">
        {filteredFAQs.length === 0 ? (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 text-center space-y-2">
            <p className="font-bold text-xs sm:text-sm text-slate-800">No matching clinical queries found.</p>
            <p className="text-[11px] sm:text-xs text-slate-500">Contact a dental clinic directly for personal evaluation.</p>
          </div>
        ) : (
          filteredFAQs.map((faq) => {
            const isOpen = openFAQ === faq.id;
            const question = lang === 'en' ? faq.qEn : lang === 'hi' ? faq.qHi : faq.qHn;
            const answer = lang === 'en' ? faq.aEn : lang === 'hi' ? faq.aHi : faq.aHn;

            return (
              <div
                key={faq.id}
                className={`border rounded-xl sm:rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen 
                    ? 'bg-white border-teal-500 shadow-md ring-1 ring-teal-500/20' 
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFAQ(isOpen ? null : faq.id)}
                  className="w-full p-3.5 sm:p-5 flex items-start justify-between gap-2.5 text-left focus:outline-none"
                >
                  <div className="flex items-start gap-2 min-w-0 pr-1">
                    <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                      Q
                    </span>
                    <h2 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 leading-snug break-words">
                      {question}
                    </h2>
                  </div>

                  <span className={`p-1 rounded-lg bg-slate-100 text-slate-600 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 bg-teal-50 text-teal-700' : ''}`}>
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-4 sm:px-5 sm:pb-5 border-t border-slate-100 pt-3 space-y-3">
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        A
                      </span>
                      <p className="flex-1 break-words">{answer}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
                      <span className="text-[10px] sm:text-[11px] text-amber-800 font-bold flex items-center gap-1">
                        <AlertOctagon className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        Always consult your nearest dentist in person before taking any step.
                      </span>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <a
                          href="tel:+919414984524"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1.5 rounded-lg border border-teal-200 transition"
                        >
                          <PhoneCall className="w-3 h-3 text-teal-600" />
                          <span>Call Clinic</span>
                        </a>
                        <a
                          href={`https://wa.me/919414984524?text=Hello,%20I%20have%20a%20dental%20question%20regarding:%20${encodeURIComponent(question)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1.5 rounded-lg shadow-xs transition"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* 5. CALL-TO-ACTION EMERGENCY BOX */}
      <section className="bg-white border-t border-slate-200 py-10 px-3 sm:px-6">
        <div className="max-w-4xl mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-r from-teal-950 via-teal-900 to-cyan-950 text-white p-5 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-amber-400 text-[10px] sm:text-xs font-black uppercase tracking-wider block">
              Emergency & In-Person Consultation
            </span>
            <h3 className="text-lg sm:text-2xl font-black">
              Experiencing acute toothache or swollen gums?
            </h3>
            <p className="text-[11px] sm:text-xs text-teal-100 max-w-lg">
              Never self-medicate. Schedule an appointment or visit your nearest registered dental surgeon for clinical examination.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full sm:w-auto">
            <a
              href="tel:+919414984524"
              className="px-5 py-3 bg-white text-slate-950 font-black text-xs rounded-xl text-center shadow hover:bg-slate-100 transition active:scale-95"
            >
              📞 Call: +91 94149 84524
            </a>
            <a
              href="https://wa.me/919414984524?text=Hello,%20mujhe%20in-person%20dental%20appointment%20chahiye."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-emerald-600 text-white font-black text-xs rounded-xl text-center shadow hover:bg-emerald-700 transition active:scale-95"
            >
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}