import React, { useState } from 'react';

// FAIR Health Check - English Version with Detailed Descriptions
// Simple version without lucide-react dependency

const FairHealthCheck = () => {
  const [step, setStep] = useState('intro');
  const [factors, setFactors] = useState({
    diabetes: 0, hypertension: 0, cholesterol: 0, smoking_current: 0,
    physical_inactivity: 0, poor_diet: 0, alcohol_excess: 0, poor_sleep: 0,
    social_isolation: 0, financial_stress: 0, housing_insecurity: 0,
    work_stress: 0, long_hours: 0, job_insecurity: 0, shift_work: 0
  });
  const [results, setResults] = useState(null);

  const factorLabels = {
    diabetes: {
      label: 'Diabetes',
      emoji: '🫀',
      category: 'medical',
      options: [
        { value: 0, label: 'None', description: 'No diabetes, normal glucose' },
        { value: 0.5, label: 'Pre-diabetes', description: 'Fasting glucose 100-125 mg/dL or HbA1c 5.7-6.4%' },
        { value: 1, label: 'Controlled', description: 'Type 2 diabetes, HbA1c < 7%' },
        { value: 1.5, label: 'Uncontrolled', description: 'HbA1c > 8% or complications' }
      ]
    },
    hypertension: {
      label: 'High Blood Pressure',
      emoji: '💉',
      category: 'medical',
      options: [
        { value: 0, label: 'Normal', description: 'BP < 120/80 mmHg' },
        { value: 0.5, label: 'Elevated', description: 'BP 120-139/80-89 mmHg' },
        { value: 1, label: 'Stage 1', description: 'BP 140-159/90-99 mmHg' },
        { value: 1.5, label: 'Stage 2+', description: 'BP ≥ 160/100 mmHg' }
      ]
    },
    cholesterol: {
      label: 'High Cholesterol',
      emoji: '🩸',
      category: 'medical',
      options: [
        { value: 0, label: 'Normal', description: 'LDL < 100 mg/dL, Total < 200 mg/dL' },
        { value: 0.5, label: 'Borderline', description: 'LDL 100-159 mg/dL' },
        { value: 1, label: 'High', description: 'LDL 160-189 mg/dL' },
        { value: 1.5, label: 'Very High', description: 'LDL ≥ 190 mg/dL' }
      ]
    },
    smoking_current: {
      label: 'Current Smoking',
      emoji: '🚬',
      category: 'medical',
      options: [
        { value: 0, label: 'Never/Former', description: 'Never smoked or quit >1 year ago' },
        { value: 0.5, label: 'Light', description: '1-10 cigarettes/day' },
        { value: 1, label: 'Moderate', description: '11-20 cigarettes/day (½-1 pack)' },
        { value: 1.5, label: 'Heavy', description: '>20 cigarettes/day (>1 pack)' }
      ]
    },
    physical_inactivity: {
      label: 'Physical Inactivity',
      emoji: '🏃',
      category: 'behavioral',
      options: [
        { value: 0, label: 'Active', description: '≥150 min/week moderate activity' },
        { value: 0.5, label: 'Somewhat Active', description: '75-149 min/week' },
        { value: 1, label: 'Low Activity', description: '30-74 min/week' },
        { value: 1.5, label: 'Sedentary', description: '<30 min/week exercise' }
      ]
    },
    poor_diet: {
      label: 'Poor Diet Quality',
      emoji: '🍎',
      category: 'behavioral',
      options: [
        { value: 0, label: 'Healthy', description: '5+ servings fruits/veg, limited processed food' },
        { value: 0.5, label: 'Fair', description: '3-4 servings fruits/veg daily' },
        { value: 1, label: 'Poor', description: '1-2 servings fruits/veg, frequent fast food' },
        { value: 1.5, label: 'Very Poor', description: 'Minimal fruits/veg, mostly ultra-processed' }
      ]
    },
    alcohol_excess: {
      label: 'Excessive Alcohol',
      emoji: '🍷',
      category: 'behavioral',
      options: [
        { value: 0, label: 'Low/None', description: '≤1 drink/day (women) or ≤2 (men)' },
        { value: 0.5, label: 'Moderate', description: '2-3 drinks/day or binge 1x/month' },
        { value: 1, label: 'Heavy', description: '4+ drinks/day or binge weekly' },
        { value: 1.5, label: 'Very Heavy', description: '6+ drinks/day or daily binge' }
      ]
    },
    poor_sleep: {
      label: 'Poor Sleep Quality',
      emoji: '😴',
      category: 'behavioral',
      options: [
        { value: 0, label: 'Good', description: '7-9 hours/night, restful sleep' },
        { value: 0.5, label: 'Fair', description: '6-7 hours or occasional insomnia' },
        { value: 1, label: 'Poor', description: '<6 hours or frequent insomnia' },
        { value: 1.5, label: 'Very Poor', description: '<5 hours, chronic sleep disorder' }
      ]
    },
    social_isolation: {
      label: 'Social Isolation',
      emoji: '👥',
      category: 'social',
      options: [
        { value: 0, label: 'Connected', description: 'Regular social contact, strong support network' },
        { value: 0.5, label: 'Some Contact', description: 'Weekly social interaction, limited support' },
        { value: 1, label: 'Isolated', description: 'Monthly contact, weak support network' },
        { value: 1.5, label: 'Very Isolated', description: 'Rare/no social contact, no support' }
      ]
    },
    financial_stress: {
      label: 'Financial Stress',
      emoji: '💰',
      category: 'social',
      options: [
        { value: 0, label: 'Secure', description: 'Can meet all needs, emergency savings' },
        { value: 0.5, label: 'Managing', description: 'Meeting needs but limited savings' },
        { value: 1, label: 'Stressed', description: 'Difficulty paying bills, some debt' },
        { value: 1.5, label: 'Crisis', description: 'Cannot meet basic needs, severe debt' }
      ]
    },
    housing_insecurity: {
      label: 'Housing Insecurity',
      emoji: '🏠',
      category: 'social',
      options: [
        { value: 0, label: 'Secure', description: 'Stable, safe, affordable housing' },
        { value: 0.5, label: 'Somewhat Secure', description: 'High cost burden (>30% income)' },
        { value: 1, label: 'Insecure', description: 'Frequent moves, overcrowding, or poor conditions' },
        { value: 1.5, label: 'Very Insecure', description: 'Risk of eviction/homelessness' }
      ]
    },
    work_stress: {
      label: 'Work Stress',
      emoji: '💼',
      category: 'work',
      options: [
        { value: 0, label: 'Low', description: 'Balanced workload, good autonomy' },
        { value: 0.5, label: 'Moderate', description: 'Occasional high demands or time pressure' },
        { value: 1, label: 'High', description: 'Chronic high demands, low control' },
        { value: 1.5, label: 'Severe', description: 'Burnout symptoms, toxic environment' }
      ]
    },
    long_hours: {
      label: 'Long Work Hours',
      emoji: '⏰',
      category: 'work',
      options: [
        { value: 0, label: 'Standard', description: '≤40 hours/week' },
        { value: 0.5, label: 'Extended', description: '41-49 hours/week' },
        { value: 1, label: 'Long', description: '50-60 hours/week' },
        { value: 1.5, label: 'Excessive', description: '>60 hours/week' }
      ]
    },
    job_insecurity: {
      label: 'Job Insecurity',
      emoji: '📉',
      category: 'work',
      options: [
        { value: 0, label: 'Secure', description: 'Stable employment, low layoff risk' },
        { value: 0.5, label: 'Somewhat Secure', description: 'Occasional concerns about stability' },
        { value: 1, label: 'Insecure', description: 'Frequent concerns, contract/temp work' },
        { value: 1.5, label: 'Very Insecure', description: 'Imminent job loss or unemployment' }
      ]
    },
    shift_work: {
      label: 'Shift Work / Night Work',
      emoji: '🌙',
      category: 'work',
      options: [
        { value: 0, label: 'Day Schedule', description: 'Regular daytime hours (9-5)' },
        { value: 0.5, label: 'Early/Late', description: 'Early mornings or evenings' },
        { value: 1, label: 'Rotating Shifts', description: 'Alternating day/night shifts' },
        { value: 1.5, label: 'Permanent Night', description: 'Permanent night shift work' }
      ]
    }
  };

  const categories = {
    medical: { name: '🫀 Medical', color: '#EF4444' },
    behavioral: { name: '🏃 Behavioral', color: '#3B82F6' },
    social: { name: '👥 Social', color: '#10B981' },
    work: { name: '💼 Occupational', color: '#8B5CF6' }
  };

  const calculateShapley = (factors) => {
    const coefficients = {
      diabetes: 0.45, hypertension: 0.38, cholesterol: 0.35, smoking_current: 0.52,
      physical_inactivity: 0.40, poor_diet: 0.30, alcohol_excess: 0.25, poor_sleep: 0.20,
      social_isolation: 0.35, financial_stress: 0.28, housing_insecurity: 0.32,
      work_stress: 0.30, long_hours: 0.22, job_insecurity: 0.26, shift_work: 0.24
    };

    const activeFactors = Object.entries(factors).filter(([_, value]) => value > 0);
    if (activeFactors.length === 0) return {};
    
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
        <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center', paddingTop: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1F2937' }}>FAIR Health Check</h1>
          <p style={{ fontSize: '1.25rem', color: '#4B5563', marginBottom: '2rem' }}>
            Personal Cardiovascular Risk Assessment
          </p>
          
          <div style={{ background: '#DBEAFE', border: '1px solid #93C5FD', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
              <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>ℹ️</div>
              <div>
                <h3 style={{ fontWeight: 'bold', color: '#1E3A8A', marginBottom: '0.75rem', fontSize: '1.125rem' }}>How It Works</h3>
                <ul style={{ fontSize: '0.875rem', color: '#1E40AF', listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>✓ Answer questions about your health and lifestyle</li>
                  <li style={{ marginBottom: '0.5rem' }}>✓ Our FAIR algorithm analyzes contributing factors</li>
                  <li style={{ marginBottom: '0.5rem' }}>✓ Receive personalized recommendations</li>
                  <li>✓ Identify priority actions for prevention</li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
              <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>⚠️</div>
              <div>
                <h3 style={{ fontWeight: 'bold', color: '#78350F', marginBottom: '0.5rem', fontSize: '1.125rem' }}>Medical Disclaimer</h3>
                <p style={{ fontSize: '0.875rem', color: '#92400E', margin: 0 }}>
                  This tool is for educational and informational purposes only. It does not replace professional medical advice, diagnosis, or treatment. Results are based on statistical models and should be discussed with your healthcare provider before making any health decisions.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {Object.entries(categories).map(([key, cat]) => (
              <div key={key} style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{cat.name.split(' ')[0]}</div>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', margin: 0 }}>{cat.name.split(' ').slice(1).join(' ')}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep('assessment')}
            style={{ background: '#2563EB', color: 'white', padding: '1rem 2.5rem', borderRadius: '0.75rem', fontSize: '1.125rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3)', transition: 'all 0.2s' }}
            onMouseOver={(e) => e.target.style.background = '#1D4ED8'}
            onMouseOut={(e) => e.target.style.background = '#2563EB'}
          >
            Start Assessment
          </button>

          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '1.5rem' }}>
            🔒 Anonymous • 🆓 Free • ⚡ 5-10 minutes
          </p>
        </div>
      </div>
    );
  }

  if (step === 'assessment') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #EFF6FF, #F3E8FF)', padding: '2rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', paddingTop: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center', color: '#1F2937' }}>
            Risk Factor Assessment
          </h2>
          <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '2rem', fontSize: '0.875rem' }}>
            Select the option that best describes your current situation for each factor
          </p>
          
          {Object.entries(categories).map(([catKey, catInfo]) => {
            const factorsInCategory = Object.entries(factorLabels).filter(([, info]) => info.category === catKey);
            
            return (
              <div key={catKey} style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '2rem', marginBottom: '2rem', border: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #E5E7EB' }}>
                  <span style={{ fontSize: '2rem' }}>{catInfo.name.split(' ')[0]}</span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>{catInfo.name}</h3>
                </div>
                
                {factorsInCategory.map(([factorKey, factorData]) => (
                  <div key={factorKey} style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', marginBottom: '1rem', fontSize: '1.125rem', color: '#1F2937' }}>
                      <span style={{ fontSize: '1.5rem' }}>{factorData.emoji}</span>
                      {factorData.label}
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                      {factorData.options.map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleFactorChange(factorKey, option.value)}
                          style={{
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            border: factors[factorKey] === option.value ? '2px solid #2563EB' : '2px solid #E5E7EB',
                            background: factors[factorKey] === option.value ? '#EFF6FF' : 'white',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => {
                            if (factors[factorKey] !== option.value) {
                              e.target.style.borderColor = '#93C5FD';
                              e.target.style.background = '#F9FAFB';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (factors[factorKey] !== option.value) {
                              e.target.style.borderColor = '#E5E7EB';
                              e.target.style.background = 'white';
                            }
                          }}
                        >
                          <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#1F2937', fontSize: '0.9375rem' }}>
                            {option.label}
                          </div>
                          <div style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: '1.4' }}>
                            {option.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', paddingBottom: '2rem' }}>
            <button
              onClick={() => setStep('intro')}
              style={{ padding: '0.875rem 2rem', borderRadius: '0.75rem', border: '2px solid #D1D5DB', background: 'white', cursor: 'pointer', fontWeight: '600', color: '#374151', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.target.style.background = '#F9FAFB'; }}
              onMouseOut={(e) => { e.target.style.background = 'white'; }}
            >
              ← Back
            </button>
            <button
              onClick={calculateResults}
              style={{ background: '#2563EB', color: 'white', padding: '0.875rem 2.5rem', borderRadius: '0.75rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '1.0625rem', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3)', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.target.style.background = '#1D4ED8'; }}
              onMouseOut={(e) => { e.target.style.background = '#2563EB'; }}
            >
              View My Results →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results' && results) {
    const classificationInfo = {
      'high-risk': { color: '#FEE2E2', borderColor: '#FCA5A5', label: 'High Risk Profile', emoji: '⚠️', textColor: '#991B1B' },
      'moderate-risk': { color: '#FEF3C7', borderColor: '#FCD34D', label: 'Moderate Risk Profile', emoji: '⚡', textColor: '#78350F' },
      'low-risk': { color: '#D1FAE5', borderColor: '#6EE7B7', label: 'Lower Risk Profile', emoji: '✅', textColor: '#065F46' }
    };
    const info = classificationInfo[results.classification];

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #EFF6FF, #F3E8FF)', padding: '2rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', paddingTop: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center', color: '#1F2937' }}>
            Your FAIR Results
          </h2>
          <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '2rem', fontSize: '0.875rem' }}>
            Based on FAIR methodology (Fair Attribution of Integrated Risks)
          </p>
          
          <div style={{ background: info.color, border: `2px solid ${info.borderColor}`, borderRadius: '0.75rem', padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '3rem' }}>{info.emoji}</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: info.textColor, margin: 0 }}>{info.label}</h3>
            </div>
            <p style={{ fontSize: '0.9375rem', color: info.textColor, opacity: 0.9, margin: 0 }}>
              The factors below show the largest contributions to your cardiovascular risk profile
            </p>
          </div>

          <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '2rem', marginBottom: '2rem', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1F2937' }}>
              📊 Your Top 5 Priority Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {results.topFactors.map(([factor, contribution], idx) => {
                const info = factorLabels[factor];
                return (
                  <div key={factor} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#1E40AF', fontSize: '1.125rem', flexShrink: 0 }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>{info?.emoji}</span>
                        <span style={{ fontWeight: '600', color: '#1F2937', fontSize: '1.0625rem' }}>{info?.label || factor}</span>
                      </div>
                      <div style={{ width: '100%', height: '0.625rem', background: '#E5E7EB', borderRadius: '0.3125rem', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(contribution, 100)}%`, height: '100%', background: `linear-gradient(to right, #3B82F6, #2563EB)`, borderRadius: '0.3125rem', transition: 'width 0.5s' }} />
                      </div>
                    </div>
                    <span style={{ fontSize: '1.0625rem', fontWeight: 'bold', color: '#1F2937', minWidth: '3.5rem', textAlign: 'right' }}>
                      {contribution.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background: '#DBEAFE', border: '1px solid #93C5FD', borderRadius: '0.75rem', padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 'bold', color: '#1E3A8A', marginBottom: '1rem', fontSize: '1.25rem' }}>
              💬 Recommended Next Steps
            </h3>
            <ol style={{ fontSize: '0.9375rem', color: '#1E40AF', paddingLeft: '1.5rem', margin: 0 }}>
              <li style={{ marginBottom: '0.75rem' }}><strong>Save these results:</strong> Print or screenshot for your records</li>
              <li style={{ marginBottom: '0.75rem' }}><strong>Consult your doctor:</strong> Schedule an appointment to discuss these findings</li>
              <li style={{ marginBottom: '0.75rem' }}><strong>Focus on priorities:</strong> Start with the top-ranked factors</li>
              <li style={{ marginBottom: '0.75rem' }}><strong>Set progressive goals:</strong> Small, consistent changes are most effective</li>
              <li><strong>Track progress:</strong> Re-assess in 3-6 months to monitor improvements</li>
            </ol>
          </div>

          <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#78350F', margin: '0 0 0.5rem 0' }}>
              <strong>Important:</strong> These recommendations are general guidelines based on scientific literature.
            </p>
            <p style={{ fontSize: '0.875rem', color: '#92400E', margin: 0 }}>
              They must be adapted to your specific situation by a healthcare professional before taking action.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setStep('intro'); setResults(null); setFactors({
                diabetes: 0, hypertension: 0, cholesterol: 0, smoking_current: 0,
                physical_inactivity: 0, poor_diet: 0, alcohol_excess: 0, poor_sleep: 0,
                social_isolation: 0, financial_stress: 0, housing_insecurity: 0,
                work_stress: 0, long_hours: 0, job_insecurity: 0, shift_work: 0
              }); }}
              style={{ padding: '0.875rem 2rem', borderRadius: '0.75rem', border: '2px solid #2563EB', color: '#2563EB', background: 'white', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.target.style.background = '#EFF6FF'; }}
              onMouseOut={(e) => { e.target.style.background = 'white'; }}
            >
              New Assessment
            </button>
            <button
              onClick={() => window.print()}
              style={{ background: '#2563EB', color: 'white', padding: '0.875rem 2rem', borderRadius: '0.75rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3)', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.target.style.background = '#1D4ED8'; }}
              onMouseOut={(e) => { e.target.style.background = '#2563EB'; }}
            >
              🖨️ Print Results
            </button>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9CA3AF', padding: '1rem 0' }}>
            <p style={{ margin: '0 0 0.5rem 0' }}>FAIR Health Check | Version 1.0 | © 2024 FAIR Research Organization</p>
            <p style={{ margin: 0 }}>For questions or feedback: eytan_ellenberg@yahoo.fr</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default FairHealthCheck;
