import React, { useState } from 'react';

// Version simplifiée SANS lucide-react - utilise des émojis à la place
// Cette version fonctionne immédiatement sans dépendances externes

const FairHealthCheckSimple = () => {
  const [step, setStep] = useState('intro');
  const [factors, setFactors] = useState({
    diabetes: 0, hypertension: 0, cholesterol: 0, smoking_current: 0,
    physical_inactivity: 0, poor_diet: 0, alcohol_excess: 0, poor_sleep: 0,
    social_isolation: 0, financial_stress: 0, housing_insecurity: 0,
    work_stress: 0, long_hours: 0, job_insecurity: 0, shift_work: 0
  });
  const [results, setResults] = useState(null);

  const factorLabels = {
    diabetes: { label: 'Diabète', emoji: '🫀', category: 'medical' },
    hypertension: { label: 'Hypertension', emoji: '🫀', category: 'medical' },
    cholesterol: { label: 'Cholestérol', emoji: '🫀', category: 'medical' },
    smoking_current: { label: 'Tabagisme', emoji: '🚬', category: 'medical' },
    physical_inactivity: { label: 'Activité physique', emoji: '🏃', category: 'behavioral' },
    poor_diet: { label: 'Alimentation', emoji: '🍎', category: 'behavioral' },
    alcohol_excess: { label: 'Alcool', emoji: '🍷', category: 'behavioral' },
    poor_sleep: { label: 'Sommeil', emoji: '😴', category: 'behavioral' },
    social_isolation: { label: 'Isolement social', emoji: '👥', category: 'social' },
    financial_stress: { label: 'Stress financier', emoji: '💰', category: 'social' },
    housing_insecurity: { label: 'Logement', emoji: '🏠', category: 'social' },
    work_stress: { label: 'Stress professionnel', emoji: '💼', category: 'work' },
    long_hours: { label: 'Heures de travail', emoji: '⏰', category: 'work' },
    job_insecurity: { label: 'Sécurité emploi', emoji: '💼', category: 'work' },
    shift_work: { label: 'Travail posté', emoji: '🌙', category: 'work' }
  };

  const categories = {
    medical: { name: '🫀 Santé', color: '#EF4444' },
    behavioral: { name: '🏃 Comportement', color: '#3B82F6' },
    social: { name: '👥 Social', color: '#10B981' },
    work: { name: '💼 Travail', color: '#8B5CF6' }
  };

  const calculateShapley = (factors) => {
    const coefficients = {
      diabetes: 0.45, hypertension: 0.38, cholesterol: 0.35, smoking_current: 0.52,
      physical_inactivity: 0.40, poor_diet: 0.30, alcohol_excess: 0.25, poor_sleep: 0.20,
      social_isolation: 0.35, financial_stress: 0.28, housing_insecurity: 0.32,
      work_stress: 0.30, long_hours: 0.22, job_insecurity: 0.26, shift_work: 0.24
    };

    const activeFactors = Object.entries(factors).filter(([_, value]) => value > 0);
    const shapleyValues = {};
    
    activeFactors.forEach(([key, value]) => {
      const baseContribution = (coefficients[key] || 0) * value;
      shapleyValues[key] = baseContribution * (1 + (activeFactors.length - 1) * 0.05);
    });

    const total = Object.values(shapleyValues).reduce((a, b) => a + b, 0);
    Object.keys(shapleyValues).forEach(key => {
      shapleyValues[key] = (shapleyValues[key] / total) * 100;
    });

    return shapleyValues;
  };

  const handleFactorChange = (factor, value) => {
    setFactors(prev => ({ ...prev, [factor]: value }));
  };

  const calculateResults = () => {
    const shapleyValues = calculateShapley(factors);
    const sorted = Object.entries(shapleyValues).sort(([, a], [, b]) => b - a).slice(0, 5);
    const topFactor = sorted[0];
    const classification = topFactor && topFactor[1] > 30 ? 'high-risk' : 
                          topFactor && topFactor[1] > 20 ? 'moderate-risk' : 'low-risk';
    
    setResults({ shapleyValues, topFactors: sorted, classification });
    setStep('results');
  };

  if (step === 'intro') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #EFF6FF, #F3E8FF)', padding: '2rem' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center', paddingTop: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>FAIR Health Check</h1>
          <p style={{ fontSize: '1.25rem', color: '#4B5563', marginBottom: '2rem' }}>
            Évaluateur Personnel de Facteurs de Risque
          </p>
          
          <div style={{ background: '#DBEAFE', border: '1px solid #93C5FD', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ fontSize: '1.5rem' }}>ℹ️</div>
              <div>
                <h3 style={{ fontWeight: 'bold', color: '#1E3A8A', marginBottom: '0.5rem' }}>Comment ça marche ?</h3>
                <ul style={{ fontSize: '0.875rem', color: '#1E40AF', listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>✓ Répondez aux questions sur vos facteurs de risque</li>
                  <li style={{ marginBottom: '0.5rem' }}>✓ Notre algorithme FAIR analyse les contributions</li>
                  <li style={{ marginBottom: '0.5rem' }}>✓ Recevez des recommandations personnalisées</li>
                  <li>✓ Identifiez les actions prioritaires</li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ fontSize: '1.5rem' }}>⚠️</div>
              <div>
                <h3 style={{ fontWeight: 'bold', color: '#78350F', marginBottom: '0.5rem' }}>Important</h3>
                <p style={{ fontSize: '0.875rem', color: '#92400E' }}>
                  Cet outil est informatif et éducatif. Il ne remplace pas un avis médical professionnel.
                  Les résultats sont basés sur des modèles statistiques et doivent être discutés avec votre médecin.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {Object.entries(categories).map(([key, cat]) => (
              <div key={key} style={{ background: 'white', borderRadius: '0.5rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{cat.name.split(' ')[0]}</div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>{cat.name.split(' ')[1]}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep('assessment')}
            style={{ background: '#2563EB', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
          >
            Commencer l'évaluation
          </button>

          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '1.5rem' }}>
            🔒 Anonyme • 🆓 Gratuit • ⚡ 5-10 minutes
          </p>
        </div>
      </div>
    );
  }

  if (step === 'assessment') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #EFF6FF, #F3E8FF)', padding: '2rem' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', paddingTop: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
            Évaluation de vos facteurs de risque
          </h2>
          
          {Object.entries(categories).map(([catKey, catInfo]) => {
            const factorsInCategory = Object.entries(factorLabels).filter(([, info]) => info.category === catKey);
            
            return (
              <div key={catKey} style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2rem' }}>{catInfo.name.split(' ')[0]}</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{catInfo.name}</h3>
                </div>
                
                {factorsInCategory.map(([factorKey, factorData]) => (
                  <div key={factorKey} style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
                      {factorData.emoji} {factorData.label}
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem' }}>
                      {[0, 0.5, 1, 1.5].map(value => (
                        <button
                          key={value}
                          onClick={() => handleFactorChange(factorKey, value)}
                          style={{
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: factors[factorKey] === value ? '2px solid #2563EB' : '2px solid #E5E7EB',
                            background: factors[factorKey] === value ? '#EFF6FF' : 'white',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '0.875rem'
                          }}
                        >
                          {value === 0 ? 'Non/Faible' : value === 0.5 ? 'Modéré' : value === 1 ? 'Élevé' : 'Très élevé'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button
              onClick={() => setStep('intro')}
              style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '2px solid #D1D5DB', background: 'white', cursor: 'pointer' }}
            >
              Retour
            </button>
            <button
              onClick={calculateResults}
              style={{ background: '#2563EB', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
            >
              Voir mes résultats
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results' && results) {
    const classificationInfo = {
      'high-risk': { color: '#FEE2E2', borderColor: '#FCA5A5', label: 'Risque élevé', emoji: '⚠️' },
      'moderate-risk': { color: '#FEF3C7', borderColor: '#FCD34D', label: 'Risque modéré', emoji: '⚡' },
      'low-risk': { color: '#D1FAE5', borderColor: '#6EE7B7', label: 'Risque maîtrisé', emoji: '✅' }
    };
    const info = classificationInfo[results.classification];

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #EFF6FF, #F3E8FF)', padding: '2rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', paddingTop: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
            Vos résultats FAIR
          </h2>
          
          <div style={{ background: info.color, border: `2px solid ${info.borderColor}`, borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '2rem' }}>{info.emoji}</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{info.label}</h3>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              📊 Vos 5 priorités d'action
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {results.topFactors.map(([factor, contribution], idx) => {
                const info = factorLabels[factor];
                return (
                  <div key={factor} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#1E40AF' }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span>{info?.emoji}</span>
                        <span style={{ fontWeight: '500' }}>{info?.label || factor}</span>
                      </div>
                      <div style={{ width: '100%', height: '0.5rem', background: '#E5E7EB', borderRadius: '0.25rem', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(contribution, 100)}%`, height: '100%', background: '#2563EB', borderRadius: '0.25rem' }} />
                      </div>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#4B5563', minWidth: '3rem', textAlign: 'right' }}>
                      {contribution.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background: '#DBEAFE', border: '1px solid #93C5FD', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 'bold', color: '#1E3A8A', marginBottom: '0.75rem' }}>
              💬 Prochaines étapes recommandées
            </h3>
            <ol style={{ fontSize: '0.875rem', color: '#1E40AF', paddingLeft: '1.25rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Imprimez ou photographiez ces résultats</li>
              <li style={{ marginBottom: '0.5rem' }}>Prenez rendez-vous avec votre médecin traitant</li>
              <li style={{ marginBottom: '0.5rem' }}>Discutez des priorités identifiées</li>
              <li style={{ marginBottom: '0.5rem' }}>Fixez-vous des objectifs progressifs</li>
              <li>Réévaluez dans 3-6 mois pour suivre vos progrès</li>
            </ol>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
            <p>Ces recommandations sont générales et basées sur la littérature scientifique.</p>
            <p>Elles doivent être adaptées à votre situation par un professionnel de santé.</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={() => { setStep('intro'); setResults(null); }}
              style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '2px solid #2563EB', color: '#2563EB', background: 'white', cursor: 'pointer' }}
            >
              Nouvelle évaluation
            </button>
            <button
              onClick={() => window.print()}
              style={{ background: '#2563EB', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
            >
              Imprimer les résultats
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default FairHealthCheckSimple;
