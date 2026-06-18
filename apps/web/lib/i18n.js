import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      about: {
        ourStory: 'Our Story',
        whyWeBuilt: 'Why We Built StartupsIndia',
        description: 'We believe talent is everywhere, but opportunities are not. StartupsIndia was built to help students, innovators, and early-stage founders turn ideas into real startups through mentorship, ecosystem support, networking, funding access, and practical guidance. Our mission is to make entrepreneurship accessible for every ambitious founder — regardless of background, city, or college.',
        highlight: 'Our mission is to make entrepreneurship accessible for every ambitious founder — regardless of background, city, or college.',
        ourValues: 'Our Values',
        whatWeStandFor: 'What We Stand For',
        valuesDescription: 'At Startups India, we stand for innovation, entrepreneurship, and impact.',
        encouraged: 'Ideas are Encouraged',
        nurtured: 'Innovation is Nurtured',
        supported: 'Founders are Supported',
        builtWithClarity: 'Startups are Built with Clarity',
        ecosystemStatement: 'We are not just a service provider—we are an ',
        ecosystemEnabler: 'ecosystem enabler',
        ourServices: 'Our Services',
        whatWeDo: 'What We Do as a Startup Ecosystem Platform',
        servicesDescription: 'We help founders and aspiring entrepreneurs at every stage by providing structured support and real-world exposure.',
        ideasInnovation: 'For Startup Ideas & Innovation',
        ideasBullet1: 'Help individuals identify real-world problems',
        ideasBullet2: 'Support idea validation and innovation thinking',
        ideasBullet3: 'Guide founders to convert ideas into viable startup concepts',
        foundersEntrepreneurs: 'For Founders & Entrepreneurs',
        foundersBullet1: 'Provide mentorship from experienced professionals',
        foundersBullet2: 'Offer structured programs like pre-incubation and incubation',
        foundersBullet3: 'Help founders understand business models, markets, and execution',
        earlyStageStartups: 'For Early-Stage Startups',
        earlyBullet1: 'Support product-market fit and go-to-market strategy',
        earlyBullet2: 'Prepare startups for pitching and fundraising',
        earlyBullet3: 'Enable connections with investors and ecosystem partners',
        studentsInstitutions: 'For Students & Institutions',
        studentsBullet1: 'Create startup awareness and entrepreneurial mindset',
        studentsBullet2: 'Conduct workshops, bootcamps, and ecosystem programs',
        studentsBullet3: 'Bridge the gap between academics and real startup exposure',
        ourMission: 'Our Mission',
        missionDescription: 'To empower founders and innovators with the right mindset, skills, mentorship, and ecosystem access so they can build sustainable and impactful startups.',
        ourVision: 'Our Vision',
        visionDescription: 'To build a strong, inclusive, and future-ready startup ecosystem that supports innovation, job creation, and economic growth—especially among students and first-time founders.',
        ourMethodology: 'Our Methodology',
        ourApproach: 'Our Approach',
        approachDescription: 'Our approach is simple and practical',
        learnByDoing: 'Learn by Doing',
        notJustTheory: 'Not just theory',
        founderFirstMindset: 'Founder-First Mindset',
        successPriority: 'Your success is our priority',
        executionOverIdeas: 'Execution Over Ideas',
        actionDrivesResults: 'Action drives results',
        communityGrowth: 'Community-Driven Growth',
        growTogether: 'We grow together',
        realOutcomes: 'Every program, event, and initiative is designed to deliver real outcomes, not just certificates.',
        whyUs: 'Why Us',
        whyStartupsIndia: 'Why Startups India',
        whyBullet1: 'Clear focus on founders, innovation, and startup ideas',
        whyBullet2: 'Practical ecosystem-driven programs',
        whyBullet3: 'Strong mentor and partner network',
        whyBullet4: 'Long-term support beyond one-time events',
        whyBullet5: 'Community that grows together',
        ourCommitment: 'Our Commitment',
        commitmentP1: 'At Startups India, we are committed to helping people believe in their ideas, build with confidence, and grow with the ecosystem.',
        commitmentP2: 'Whether you are a student exploring entrepreneurship, a founder validating an idea, or a startup ready to scale—we are here to support your journey.',
        ctaTitle: 'Have an Idea? A Vision? A Startup Dream?',
        ctaSub: 'Join our ecosystem and take your first step toward building something meaningful.',
        ctaBtn: 'Start Your Journey'
      },
      hero: {
        aboutUs: 'ABOUT US',
        buildingFuture: 'Building the Future of',
        phrases: {
          journey: 'innovation journey',
          ecosystem: 'startup ecosystem',
          dream: 'entrepreneurial dream',
          transformation: 'business transformation',
          roadmap: 'founder roadmap'
        },
        desc1: 'We are a startup ecosystem platform connecting founders, innovators, mentors, and partners to transform ideas into successful ventures.',
        desc2: "From the first spark of innovation to scaling real businesses, we're here to support your complete entrepreneurial journey.",
        stats: {
          startups: 'Startups',
          mentors: 'Mentors',
          successRate: 'Success Rate'
        },
        viewPrograms: 'View Programs'
      }
    }
  },
  hi: {
    translation: {
      about: {
        ourStory: 'हमारी कहानी',
        whyWeBuilt: 'हमने StartupsIndia क्यों बनाया',
        description: 'हमारा मानना है कि प्रतिभा हर जगह है, लेकिन अवसर नहीं। StartupsIndia का निर्माण छात्रों, नवप्रवर्तकों और शुरुआती चरण के संस्थापकों को मार्गदर्शन, पारिस्थितिकी तंत्र समर्थन, नेटवर्किंग, फंडिंग पहुंच और व्यावहारिक मार्गदर्शन के माध्यम से विचारों को वास्तविक स्टार्टअप में बदलने में मदद करने के लिए किया गया था। हमारा मिशन हर महत्वाकांक्षी संस्थापक के लिए उद्यमिता को सुलभ बनाना है - चाहे उनकी पृष्ठभूमि, शहर या कॉलेज कुछ भी हो।',
        highlight: 'हमारा मिशन हर महत्वाकांक्षी संस्थापक के लिए उद्यमिता को सुलभ बनाना है - चाहे उनकी पृष्ठभूमि, शहर या कॉलेज कुछ भी हो।',
        ourValues: 'हमारे मूल्य',
        whatWeStandFor: 'हम किसके लिए खड़े हैं',
        valuesDescription: 'स्टार्टअप्स इंडिया में, हम नवाचार, उद्यमिता और प्रभाव के लिए खड़े हैं।',
        encouraged: 'विचारों को प्रोत्साहित किया जाता है',
        nurtured: 'नवाचार को पोषित किया जाता है',
        supported: 'संस्थापकों का समर्थन किया जाता है',
        builtWithClarity: 'स्टार्टअप स्पष्टता के साथ बनाए जाते हैं',
        ecosystemStatement: 'हम केवल एक सेवा प्रदाता नहीं हैं - हम एक ',
        ecosystemEnabler: 'पारिस्थितिकी तंत्र प्रवर्तक',
        ourServices: 'हमारी सेवाएँ',
        whatWeDo: 'स्टार्टअप इकोसिस्टम प्लेटफॉर्म के रूप में हम क्या करते हैं',
        servicesDescription: 'हम संस्थापकों और महत्वाकांक्षी उद्यमियों को हर चरण में संरचित सहायता और वास्तविक दुनिया का अनुभव प्रदान करके मदद करते हैं।',
        ideasInnovation: 'स्टार्टअप विचारों और नवाचार के लिए',
        ideasBullet1: 'व्यक्तियों को वास्तविक दुनिया की समस्याओं की पहचान करने में मदद करना',
        ideasBullet2: 'विचार सत्यापन और नवाचार सोच का समर्थन करना',
        ideasBullet3: 'विचारों को व्यवहार्य स्टार्टअप अवधारणाओं में बदलने के लिए संस्थापकों का मार्गदर्शन करना',
        foundersEntrepreneurs: 'संस्थापकों और उद्यमियों के लिए',
        foundersBullet1: 'अनुभवी पेशेवरों से मार्गदर्शन प्रदान करना',
        foundersBullet2: 'पूर्व-ऊष्मायन और ऊष्मायन जैसे संरचित कार्यक्रमों की पेशकश करना',
        foundersBullet3: 'संस्थापकों को व्यावसायिक मॉडल, बाजार और निष्पादन को समझने में मदद करना',
        earlyStageStartups: 'शुरुआती चरण के स्टार्टअप के लिए',
        earlyBullet1: 'उत्पाद-बाजार फिट और गो-टू-मार्केट रणनीति का समर्थन करना',
        earlyBullet2: 'पिचिंग और धन उगाहने के लिए स्टार्टअप तैयार करना',
        earlyBullet3: 'निवेशकों और पारिस्थितिकी तंत्र भागीदारों के साथ कनेक्शन सक्षम करना',
        studentsInstitutions: 'छात्रों और संस्थानों के लिए',
        studentsBullet1: 'स्टार्टअप जागरूकता और उद्यमशीलता की मानसिकता बनाना',
        studentsBullet2: 'कार्यशालाएं, बूटकैंप और पारिस्थितिकी तंत्र कार्यक्रम आयोजित करना',
        studentsBullet3: 'अकादमिक और वास्तविक स्टार्टअप एक्सपोजर के बीच की खाई को पाटना',
        ourMission: 'हमारा मिशन',
        missionDescription: 'संस्थापकों और नवप्रवर्तकों को सही मानसिकता, कौशल, मार्गदर्शन और पारिस्थितिकी तंत्र की पहुंच के साथ सशक्त बनाना ताकि वे टिकाऊ और प्रभावशाली स्टार्टअप बना सकें।',
        ourVision: 'हमारा दृष्टिकोण',
        visionDescription: 'एक मजबूत, समावेशी और भविष्य के लिए तैयार स्टार्टअप पारिस्थितिकी तंत्र का निर्माण करना जो नवाचार, रोजगार सृजन और आर्थिक विकास का समर्थन करता है - विशेष रूप से छात्रों और पहली बार संस्थापकों के बीच।',
        ourMethodology: 'हमारी पद्धति',
        ourApproach: 'हमारा दृष्टिकोण',
        approachDescription: 'हमारा दृष्टिकोण सरल और व्यावहारिक है',
        learnByDoing: 'करके सीखें',
        notJustTheory: 'केवल सिद्धांत नहीं',
        founderFirstMindset: 'संस्थापक-प्रथम मानसिकता',
        successPriority: 'आपकी सफलता हमारी प्राथमिकता है',
        executionOverIdeas: 'विचारों से ऊपर निष्पादन',
        actionDrivesResults: 'कार्रवाई से परिणाम मिलते हैं',
        communityGrowth: 'समुदाय संचालित विकास',
        growTogether: 'हम एक साथ बढ़ते हैं',
        realOutcomes: 'हर कार्यक्रम, कार्यक्रम और पहल को वास्तविक परिणाम देने के लिए डिज़ाइन किया गया है, न कि केवल प्रमाण पत्र।',
        whyUs: 'हम ही क्यों',
        whyStartupsIndia: 'स्टार्टअप्स इंडिया क्यों',
        whyBullet1: 'संस्थापकों, नवाचार और स्टार्टअप विचारों पर स्पष्ट ध्यान',
        whyBullet2: 'व्यावहारिक पारिस्थितिकी तंत्र संचालित कार्यक्रम',
        whyBullet3: 'मजबूत संरक्षक और भागीदार नेटवर्क',
        whyBullet4: 'एकमुश्त कार्यक्रमों से परे दीर्घकालिक सहायता',
        whyBullet5: 'समुदाय जो एक साथ बढ़ता है',
        ourCommitment: 'हमारी प्रतिबद्धता',
        commitmentP1: 'स्टार्टअप्स इंडिया में, हम लोगों को उनके विचारों में विश्वास करने, आत्मविश्वास के साथ निर्माण करने और पारिस्थितिकी तंत्र के साथ बढ़ने में मदद करने के लिए प्रतिबद्ध हैं।',
        commitmentP2: 'चाहे आप उद्यमिता की खोज करने वाले छात्र हों, किसी विचार को मान्य करने वाले संस्थापक हों, या स्केल करने के लिए तैयार स्टार्टअप हों - हम आपकी यात्रा का समर्थन करने के लिए यहां हैं।',
        ctaTitle: 'कोई विचार है? एक दृष्टिकोण? एक स्टार्टअप सपना?',
        ctaSub: 'हमारे पारिस्थितिकी तंत्र में शामिल हों और कुछ सार्थक बनाने की दिशा में अपना पहला कदम उठाएं।',
        ctaBtn: 'अपनी यात्रा शुरू करें'
      },
      hero: {
        aboutUs: 'हमारे बारे में',
        buildingFuture: 'भविष्य का निर्माण',
        phrases: {
          journey: 'नवाचार यात्रा',
          ecosystem: 'स्टार्टअप पारिस्थितिकी तंत्र',
          dream: 'उद्यमशीलता का सपना',
          transformation: 'व्यावसायिक परिवर्तन',
          roadmap: 'संस्थापक रोडमैप'
        },
        desc1: 'हम एक स्टार्टअप इकोसिस्टम प्लेटफॉर्म हैं जो विचारों को सफल उद्यमों में बदलने के लिए संस्थापकों, नवप्रवर्तकों, सलाहकारों और भागीदारों को जोड़ता है।',
        desc2: 'नवाचार की पहली चिंगारी से लेकर वास्तविक व्यवसायों को बढ़ाने तक, हम आपकी संपूर्ण उद्यमशीलता यात्रा का समर्थन करने के लिए यहां हैं।',
        stats: {
          startups: 'स्टार्टअप्स',
          mentors: 'सलाहकार',
          successRate: 'सफलता दर'
        },
        viewPrograms: 'कार्यक्रम देखें'
      }
    }
  }
};

// Initialize i18n for both SSR and client
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });
}

export default i18n;
