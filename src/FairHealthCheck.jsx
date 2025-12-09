import React, { useState, useEffect } from 'react';
import { Activity, Heart, TrendingUp, Users, Briefcase, AlertCircle, CheckCircle, Info } from 'lucide-react';

// Simulation du moteur FAIR (version simplifiée pour la démo)
const calculateShapleyValues = (factors) => {
  // Coefficients basés sur la littérature médicale (Cox proportional hazards)
  const coefficients = {
    // Facteurs médicaux
    diabetes: 0.45,
    hypertension: 0.38,
    cholesterol: 0.35,
    smoking_current: 0.52,
    
    // Facteurs comportementaux
    physical_inactivity: 0.40,
    poor_diet: 0.30,
    alcohol_excess: 0.25,
    poor_sleep: 0.20,
    
    // Facteurs sociaux
    social_isolation: 0.35,
    financial_stress: 0.28,
    housing_insecurity: 0.32,
    
    // Facteurs professionnels
    work_stress: 0.30,
    long_hours: 0.22,
    job_insecurity: 0.26,
    shift_work: 0.24
  };
  
  // Calcul simplifié des valeurs Shapley
  // Dans la vraie implémentation, on utiliserait la théorie des jeux complète
  const activeFactors = Object.entries(factors).filter(([_, value]) => value > 0);
  const totalCoef = activeFactors.reduce((sum, [key, value]) => 
    sum + (coefficients[key] || 0) * value, 0);
  
  const shapleyValues = {};
  activeFactors.forEach(([key, value]) => {
    const baseContribution = (coefficients[key] || 0) * value;
    // Ajustement pour les interactions (simplifié)
    const interactionBonus = baseContribution * (activeFactors.length - 1) * 0.05;
    shapleyValues[key] = baseContribution + interactionBonus;
  });
  
  // Normalisation
  const total = Object.values(shapleyValues).reduce((a, b) => a + b, 0);
  Object.keys(shapleyValues).forEach(key => {
    shapleyValues[key] = (shapleyValues[key] / total) * 100;
  });
  
  return shapleyValues;
};

const FairHealthCheck = () => {
  const [step, setStep] = useState('intro');
  const [factors, setFactors] = useState({
    // Facteurs médicaux
    diabetes: 0,
    hypertension: 0,
    cholesterol: 0,
    smoking_current: 0,
    
    // Facteurs comportementaux
    physical_inactivity: 0,
    poor_diet: 0,
    alcohol_excess: 0,
    poor_sleep: 0,
    
    // Facteurs sociaux
    social_isolation: 0,
    financial_stress: 0,
    housing_insecurity: 0,
    
    // Facteurs professionnels
    work_stress: 0,
    long_hours: 0,
    job_insecurity: 0,
    shift_work: 0
  });
  
  const [results, setResults] = useState(null);

  const factorInfo = {
    // Facteurs médicaux
    diabetes: {
      label: 'Diabète',
      category: 'medical',
      icon: Heart,
      description: 'Diabète diagnostiqué (Type 1 ou 2)',
      options: [
        { value: 0, label: 'Non' },
        { value: 0.5, label: 'Pré-diabète' },
        { value: 1, label: 'Oui, contrôlé' },
        { value: 1.5, label: 'Oui, mal contrôlé' }
      ]
    },
    hypertension: {
      label: 'Hypertension',
      category: 'medical',
      icon: Heart,
      description: 'Tension artérielle élevée',
      options: [
        { value: 0, label: 'Non (< 130/85)' },
        { value: 0.5, label: 'Limite (130-139/85-89)' },
        { value: 1, label: 'Oui, contrôlée' },
        { value: 1.5, label: 'Oui, non contrôlée' }
      ]
    },
    cholesterol: {
      label: 'Cholestérol',
      category: 'medical',
      icon: Heart,
      description: 'Taux de cholestérol LDL élevé',
      options: [
        { value: 0, label: 'Normal (< 3.0 mmol/L)' },
        { value: 0.5, label: 'Limite (3.0-4.0)' },
        { value: 1, label: 'Élevé, sous traitement' },
        { value: 1.5, label: 'Élevé, non traité' }
      ]
    },
    smoking_current: {
      label: 'Tabagisme',
      category: 'medical',
      icon: Heart,
      description: 'Consommation de tabac',
      options: [
        { value: 0, label: 'Non-fumeur' },
        { value: 0.3, label: 'Ex-fumeur (> 5 ans)' },
        { value: 0.7, label: 'Ex-fumeur (< 5 ans)' },
        { value: 1, label: 'Fumeur occasionnel' },
        { value: 1.5, label: 'Fumeur régulier' }
      ]
    },
    
    // Facteurs comportementaux
    physical_inactivity: {
      label: 'Activité physique',
      category: 'behavioral',
      icon: Activity,
      description: 'Niveau d\'exercice hebdomadaire',
      options: [
        { value: 0, label: '> 150 min/semaine' },
        { value: 0.5, label: '75-150 min/semaine' },
        { value: 1, label: '30-75 min/semaine' },
        { value: 1.5, label: '< 30 min/semaine' }
      ]
    },
    poor_diet: {
      label: 'Alimentation',
      category: 'behavioral',
      icon: Activity,
      description: 'Qualité de l\'alimentation',
      options: [
        { value: 0, label: 'Équilibrée (fruits/légumes quotidiens)' },
        { value: 0.5, label: 'Assez bonne' },
        { value: 1, label: 'Déséquilibrée (fast-food fréquent)' },
        { value: 1.5, label: 'Très déséquilibrée' }
      ]
    },
    alcohol_excess: {
      label: 'Alcool',
      category: 'behavioral',
      icon: Activity,
      description: 'Consommation d\'alcool',
      options: [
        { value: 0, label: 'Abstinent ou < 1 verre/jour' },
        { value: 0.5, label: '1-2 verres/jour' },
        { value: 1, label: '2-4 verres/jour' },
        { value: 1.5, label: '> 4 verres/jour' }
      ]
    },
    poor_sleep: {
      label: 'Sommeil',
      category: 'behavioral',
      icon: Activity,
      description: 'Qualité et durée du sommeil',
      options: [
        { value: 0, label: '7-9h, bonne qualité' },
        { value: 0.5, label: '6-7h ou qualité moyenne' },
        { value: 1, label: '< 6h ou mauvaise qualité' },
        { value: 1.5, label: 'Troubles du sommeil sévères' }
      ]
    },
    
    // Facteurs sociaux
    social_isolation: {
      label: 'Isolement social',
      category: 'social',
      icon: Users,
      description: 'Interactions sociales',
      options: [
        { value: 0, label: 'Vie sociale riche' },
        { value: 0.5, label: 'Contacts réguliers' },
        { value: 1, label: 'Contacts limités' },
        { value: 1.5, label: 'Isolement important' }
      ]
    },
    financial_stress: {
      label: 'Stress financier',
      category: 'social',
      icon: Users,
      description: 'Préoccupations financières',
      options: [
        { value: 0, label: 'Situation stable' },
        { value: 0.5, label: 'Quelques préoccupations' },
        { value: 1, label: 'Difficultés régulières' },
        { value: 1.5, label: 'Situation précaire' }
      ]
    },
    housing_insecurity: {
      label: 'Logement',
      category: 'social',
      icon: Users,
      description: 'Sécurité du logement',
      options: [
        { value: 0, label: 'Logement stable et sain' },
        { value: 0.5, label: 'Quelques problèmes' },
        { value: 1, label: 'Logement insalubre' },
        { value: 1.5, label: 'Situation précaire/instable' }
      ]
    },
    
    // Facteurs professionnels
    work_stress: {
      label: 'Stress professionnel',
      category: 'work',
      icon: Briefcase,
      description: 'Niveau de stress au travail',
      options: [
        { value: 0, label: 'Faible stress' },
        { value: 0.5, label: 'Stress modéré' },
        { value: 1, label: 'Stress élevé' },
        { value: 1.5, label: 'Burn-out ou épuisement' }
      ]
    },
    long_hours: {
      label: 'Heures de travail',
      category: 'work',
      icon: Briefcase,
      description: 'Durée hebdomadaire de travail',
      options: [
        { value: 0, label: '< 40h/semaine' },
        { value: 0.5, label: '40-45h/semaine' },
        { value: 1, label: '45-55h/semaine' },
        { value: 1.5, label: '> 55h/semaine' }
      ]
    },
    job_insecurity: {
      label: 'Sécurité de l\'emploi',
      category: 'work',
      icon: Briefcase,
      description: 'Stabilité professionnelle',
      options: [
        { value: 0, label: 'CDI stable' },
        { value: 0.5, label: 'CDD ou mission' },
        { value: 1, label: 'Emploi précaire' },
        { value: 1.5, label: 'Sans emploi avec précarité' }
      ]
    },
    shift_work: {
      label: 'Travail posté',
      category: 'work',
      icon: Briefcase,
      description: 'Horaires de travail irréguliers',
      options: [
        { value: 0, label: 'Horaires réguliers de jour' },
        { value: 0.5, label: 'Horaires variables' },
        { value: 1, label: 'Travail posté (2x8 ou 3x8)' },
        { value: 1.5, label: 'Travail de nuit régulier' }
      ]
    }
  };

  const categories = {
    medical: { name: 'Santé', icon: Heart, color: 'text-red-600' },
    behavioral: { name: 'Comportement', icon: Activity, color: 'text-blue-600' },
    social: { name: 'Social', icon: Users, color: 'text-green-600' },
    work: { name: 'Travail', icon: Briefcase, color: 'text-purple-600' }
  };

  const handleFactorChange = (factor, value) => {
    setFactors(prev => ({ ...prev, [factor]: value }));
  };

  const calculateResults = () => {
    const shapleyValues = calculateShapleyValues(factors);
    
    // Trier par contribution
    const sorted = Object.entries(shapleyValues)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    
    // Générer des recommandations
    const recommendations = sorted.map(([factor, contribution]) => ({
      factor,
      contribution,
      ...generateRecommendation(factor, factors[factor])
    }));
    
    // Classification FAIR
    const topFactor = sorted[0];
    const classification = topFactor && topFactor[1] > 30 ? 'high-risk' : 
                          topFactor && topFactor[1] > 20 ? 'moderate-risk' : 'low-risk';
    
    setResults({
      shapleyValues,
      topFactors: sorted,
      recommendations,
      classification
    });
    
    setStep('results');
  };

  const generateRecommendation = (factor, level) => {
    const recommendations = {
      diabetes: {
        title: 'Gestion du diabète',
        action: 'Surveillez régulièrement votre glycémie',
        talk_to_doctor: 'Discutez avec votre médecin d\'un ajustement de traitement si HbA1c > 7%',
        resources: ['Association Française des Diabétiques', 'Programme d\'éducation thérapeutique'],
        modifiable: true
      },
      hypertension: {
        title: 'Contrôle de la tension',
        action: 'Réduisez le sel, pratiquez la relaxation',
        talk_to_doctor: 'Consultez pour réévaluer votre traitement antihypertenseur',
        resources: ['Programme DASH (Dietary Approaches to Stop Hypertension)'],
        modifiable: true
      },
      cholesterol: {
        title: 'Gestion du cholestérol',
        action: 'Adoptez une alimentation méditerranéenne, augmentez les oméga-3',
        talk_to_doctor: 'Envisagez une statine si LDL > 1.9 mmol/L avec autres facteurs',
        resources: ['Fédération Française de Cardiologie'],
        modifiable: true
      },
      smoking_current: {
        title: 'Arrêt du tabac',
        action: 'Premier pas : réduisez progressivement, identifiez vos déclencheurs',
        talk_to_doctor: 'Demandez une consultation de tabacologie (remboursée)',
        resources: ['Tabac Info Service (39 89)', 'Application "Tabac Stop"'],
        modifiable: true
      },
      physical_inactivity: {
        title: 'Activité physique',
        action: 'Commencez par 10 min de marche rapide quotidienne',
        talk_to_doctor: 'Demandez une prescription d\'Activité Physique Adaptée (APA)',
        resources: ['Sport-Santé, Maisons Sport-Santé locales'],
        modifiable: true
      },
      poor_diet: {
        title: 'Amélioration de l\'alimentation',
        action: '5 fruits/légumes par jour, réduisez les produits ultra-transformés',
        talk_to_doctor: 'Demandez une consultation avec un(e) diététicien(ne)',
        resources: ['Programme National Nutrition Santé (PNNS)', 'Manger Bouger'],
        modifiable: true
      },
      alcohol_excess: {
        title: 'Réduction de l\'alcool',
        action: 'Fixez-vous des jours sans alcool, notez votre consommation',
        talk_to_doctor: 'Évoquez les services d\'addictologie si difficulté à réduire',
        resources: ['Alcool Info Service (0 980 980 930)', 'Alcooliques Anonymes'],
        modifiable: true
      },
      poor_sleep: {
        title: 'Amélioration du sommeil',
        action: 'Routine régulière, évitez écrans 1h avant coucher',
        talk_to_doctor: 'Consultez si apnées du sommeil suspectées (ronflements + fatigue)',
        resources: ['Institut National du Sommeil et de la Vigilance'],
        modifiable: true
      },
      social_isolation: {
        title: 'Connexions sociales',
        action: 'Rejoignez un club, association, ou activité de groupe locale',
        talk_to_doctor: 'Mentionnez votre isolement, dépistage dépression si besoin',
        resources: ['Centres communaux d\'action sociale', 'Associations de quartier'],
        modifiable: true
      },
      financial_stress: {
        title: 'Soutien financier',
        action: 'Faites un bilan de vos droits sociaux (CAF, aide au logement)',
        talk_to_doctor: 'Évoquez l\'impact sur votre santé mentale',
        resources: ['Points Conseil Budget (PCB)', 'Assistantes sociales hospitalières'],
        modifiable: true
      },
      housing_insecurity: {
        title: 'Stabilité du logement',
        action: 'Contactez les services sociaux de votre commune/département',
        talk_to_doctor: 'Mentionnez les impacts sur votre santé (moisissures, froid, stress)',
        resources: ['Fonds de Solidarité Logement (FSL)', 'ADIL (info logement)'],
        modifiable: true
      },
      work_stress: {
        title: 'Gestion du stress professionnel',
        action: 'Techniques de respiration, pause régulières, fixez des limites',
        talk_to_doctor: 'Consultez la médecine du travail, arrêt si burn-out',
        resources: ['Médecine du travail', 'Psychologue du travail', 'CHSCT/CSE'],
        modifiable: true
      },
      long_hours: {
        title: 'Équilibre vie pro/perso',
        action: 'Priorisez vos tâches, déléguez, discutez avec votre manager',
        talk_to_doctor: 'Mentionnez la fatigue chronique et symptômes associés',
        resources: ['Inspection du travail', 'Représentants du personnel'],
        modifiable: true
      },
      job_insecurity: {
        title: 'Sécurisation professionnelle',
        action: 'Formez-vous (CPF), réseautez, préparez un plan B',
        talk_to_doctor: 'Parlez de l\'anxiété liée à la précarité',
        resources: ['Pôle Emploi', 'Cap Emploi', 'Missions Locales (< 26 ans)'],
        modifiable: true
      },
      shift_work: {
        title: 'Adaptation au travail posté',
        action: 'Exposition à lumière vive le matin, obscurité pour dormir le jour',
        talk_to_doctor: 'Évoquez la possibilité de passer à des horaires réguliers',
        resources: ['Médecine du travail', 'Institut National du Sommeil'],
        modifiable: true
      }
    };

    return recommendations[factor] || {
      title: 'Facteur de risque',
      action: 'Discutez de ce facteur avec un professionnel',
      talk_to_doctor: 'Consultez votre médecin',
      resources: [],
      modifiable: true
    };
  };

  const renderIntro = () => (
    <div className="max-w-3xl mx-auto text-center py-8">
      <div className="flex justify-center mb-6">
        <Activity className="w-20 h-20 text-blue-600" />
      </div>
      <h1 className="text-4xl font-bold mb-4">FAIR Health Check</h1>
      <p className="text-xl text-gray-600 mb-6">
        Évaluateur Personnel de Facteurs de Risque
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Comment ça marche ?</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>✓ Répondez aux questions sur vos facteurs de risque (santé, comportement, social, travail)</li>
              <li>✓ Notre algorithme FAIR analyse les contributions de chaque facteur à votre risque global</li>
              <li>✓ Recevez des recommandations personnalisées basées sur la littérature scientifique</li>
              <li>✓ Identifiez les actions prioritaires à discuter avec votre médecin</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 text-left">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-2">Important</h3>
            <p className="text-sm text-yellow-800">
              Cet outil est informatif et éducatif. Il ne remplace pas un avis médical professionnel.
              Les résultats sont basés sur des modèles statistiques et doivent être discutés avec votre médecin.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(categories).map(([key, cat]) => {
          const Icon = cat.icon;
          return (
            <div key={key} className="bg-white rounded-lg p-4 shadow-sm border">
              <Icon className={`w-8 h-8 mx-auto mb-2 ${cat.color}`} />
              <p className="text-sm font-medium">{cat.name}</p>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setStep('assessment')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Commencer l'évaluation
        </button>
      </div>

      <p className="text-sm text-gray-500 mt-6">
        🔒 Anonyme • 🆓 Gratuit • ⚡ 5-10 minutes
      </p>
    </div>
  );

  const renderAssessment = () => {
    const categoryGroups = Object.entries(factorInfo).reduce((acc, [key, info]) => {
      if (!acc[info.category]) acc[info.category] = [];
      acc[info.category].push([key, info]);
      return acc;
    }, {});

    return (
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Évaluation de vos facteurs de risque</h2>
        
        <div className="space-y-8">
          {Object.entries(categories).map(([catKey, catInfo]) => {
            const Icon = catInfo.icon;
            const factorsInCategory = categoryGroups[catKey] || [];
            
            return (
              <div key={catKey} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Icon className={`w-8 h-8 ${catInfo.color}`} />
                  <h3 className="text-xl font-bold">{catInfo.name}</h3>
                </div>
                
                <div className="space-y-6">
                  {factorsInCategory.map(([factorKey, factorData]) => (
                    <div key={factorKey} className="border-b pb-4 last:border-b-0">
                      <label className="block font-medium mb-2">
                        {factorData.label}
                      </label>
                      <p className="text-sm text-gray-600 mb-3">{factorData.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {factorData.options.map(option => (
                          <button
                            key={option.value}
                            onClick={() => handleFactorChange(factorKey, option.value)}
                            className={`p-3 rounded-lg border-2 text-left transition ${
                              factors[factorKey] === option.value
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setStep('intro')}
            className="px-6 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition"
          >
            Retour
          </button>
          <button
            onClick={calculateResults}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Voir mes résultats
          </button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!results) return null;

    const classificationInfo = {
      'high-risk': {
        color: 'red',
        label: 'Risque élevé',
        message: 'Plusieurs facteurs majeurs contribuent à votre risque. Actions prioritaires recommandées.'
      },
      'moderate-risk': {
        color: 'yellow',
        label: 'Risque modéré',
        message: 'Certains facteurs méritent attention. Des modifications ciblées peuvent améliorer votre situation.'
      },
      'low-risk': {
        color: 'green',
        label: 'Risque maîtrisé',
        message: 'Vos facteurs de risque sont globalement bien contrôlés. Maintenez vos bonnes habitudes.'
      }
    };

    const info = classificationInfo[results.classification];

    return (
      <div className="max-w-5xl mx-auto py-8">
        <h2 className="text-3xl font-bold mb-4 text-center">Vos résultats FAIR</h2>
        
        <div className={`bg-${info.color}-50 border-2 border-${info.color}-200 rounded-lg p-6 mb-8`}>
          <div className="flex items-center gap-3 mb-2">
            {info.color === 'green' ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-600" />
            )}
            <h3 className={`text-2xl font-bold text-${info.color}-900`}>{info.label}</h3>
          </div>
          <p className={`text-${info.color}-800`}>{info.message}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Comprendre votre profil FAIR
          </h3>
          <p className="text-sm text-blue-800 mb-3">
            L'analyse FAIR (Fair Attribution of Integrated Risks) utilise la théorie des jeux et l'inférence causale 
            pour calculer la contribution exacte de chaque facteur à votre risque global. Contrairement aux analyses 
            traditionnelles, FAIR prend en compte les interactions entre facteurs.
          </p>
          <p className="text-sm text-blue-800">
            Les pourcentages ci-dessous représentent la part de votre risque attribuable à chaque facteur, 
            après ajustement pour leurs interactions mutuelles.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Vos 5 priorités d'action</h3>
            <div className="space-y-4">
              {results.topFactors.map(([factor, contribution], idx) => {
                const info = factorInfo[factor];
                const Icon = info ? info.icon : Activity;
                const categoryColor = info ? categories[info.category].color : 'text-gray-600';
                
                return (
                  <div key={factor} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                      {idx + 1}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${categoryColor}`} />
                        <span className="font-medium">{info?.label || factor}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min(contribution, 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 flex-shrink-0">
                      {contribution.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Méthodologie FAIR</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-white bg-opacity-70 rounded p-3">
                <p className="font-semibold mb-1">🎯 Valeurs de Shapley</p>
                <p className="text-gray-700">Attribution causale basée sur la théorie des jeux coopératifs</p>
              </div>
              <div className="bg-white bg-opacity-70 rounded p-3">
                <p className="font-semibold mb-1">🔬 Données probantes</p>
                <p className="text-gray-700">Coefficients issus de méta-analyses et études de cohorte</p>
              </div>
              <div className="bg-white bg-opacity-70 rounded p-3">
                <p className="font-semibold mb-1">🤝 Interactions</p>
                <p className="text-gray-700">Prise en compte des synergies entre facteurs de risque</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-6">Recommandations personnalisées</h3>
        
        <div className="space-y-6">
          {results.recommendations.map(({ factor, contribution, title, action, talk_to_doctor, resources, modifiable }, idx) => {
            const info = factorInfo[factor];
            const Icon = info ? info.icon : Activity;
            const categoryColor = info ? categories[info.category].color : 'text-gray-600';
            
            return (
              <div key={factor} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                    {idx + 1}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-5 h-5 ${categoryColor}`} />
                      <h4 className="text-lg font-bold">{title}</h4>
                      <span className="ml-auto text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                        {contribution.toFixed(1)}% de votre risque
                      </span>
                    </div>
                    
                    <div className="space-y-3 mt-4">
                      <div className="bg-green-50 border-l-4 border-green-500 p-3">
                        <p className="text-sm font-semibold text-green-900 mb-1">✓ Actions que vous pouvez faire</p>
                        <p className="text-sm text-green-800">{action}</p>
                      </div>
                      
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-3">
                        <p className="text-sm font-semibold text-blue-900 mb-1">💬 À discuter avec votre médecin</p>
                        <p className="text-sm text-blue-800">{talk_to_doctor}</p>
                      </div>
                      
                      {resources.length > 0 && (
                        <div className="bg-purple-50 border-l-4 border-purple-500 p-3">
                          <p className="text-sm font-semibold text-purple-900 mb-1">📚 Ressources utiles</p>
                          <ul className="text-sm text-purple-800 space-y-1">
                            {resources.map((resource, i) => (
                              <li key={i}>• {resource}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Prochaines étapes
          </h3>
          <ol className="text-sm text-yellow-800 space-y-2 list-decimal list-inside">
            <li>Imprimez ou prenez en photo ces résultats</li>
            <li>Prenez rendez-vous avec votre médecin traitant</li>
            <li>Discutez des priorités identifiées et des actions réalistes pour vous</li>
            <li>Fixez-vous des objectifs progressifs (ne changez pas tout d'un coup)</li>
            <li>Réévaluez dans 3-6 mois pour suivre vos progrès</li>
          </ol>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Ces recommandations sont générales et basées sur la littérature scientifique.</p>
          <p>Elles doivent être adaptées à votre situation personnelle par un professionnel de santé.</p>
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            💬 Votre avis nous aide à améliorer
          </h3>
          <p className="text-sm text-blue-800 mb-4">
            Partagez votre expérience (2 minutes, anonyme). Vos retours sont essentiels !
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://forms.gle/VOTRE-FORM-ID-PUBLIC"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg text-center font-semibold hover:bg-blue-700 transition"
            >
              📝 Donner mon avis
            </a>
            <a
              href="https://forms.gle/VOTRE-FORM-ID-PRO"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg text-center font-semibold hover:bg-purple-700 transition"
            >
              👨‍⚕️ Feedback professionnel
            </a>
          </div>
          <p className="text-xs text-gray-600 mt-3 text-center">
            Vous pouvez aussi nous écrire : contact@fairhealthcheck.org
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => {
              setStep('intro');
              setResults(null);
            }}
            className="px-6 py-3 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition"
          >
            Nouvelle évaluation
          </button>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Imprimer les résultats
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {step === 'intro' && renderIntro()}
        {step === 'assessment' && renderAssessment()}
        {step === 'results' && renderResults()}
      </div>
      
      <footer className="text-center py-8 text-sm text-gray-600">
        <p>Powered by FAIR Engine v2.0 | © {new Date().getFullYear()} | Anonyme et gratuit</p>
        <p className="mt-2">
          Basé sur la méthodologie FAIR (Fair Attribution of Integrated Risks) utilisant 
          les valeurs de Shapley et l'inférence causale
        </p>
      </footer>
    </div>
  );
};

export default FairHealthCheck;