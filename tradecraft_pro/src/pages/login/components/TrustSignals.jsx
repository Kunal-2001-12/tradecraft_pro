import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'Bank-Level Security',
      description: '256-bit SSL encryption'
    },
    {
      icon: 'Lock',
      title: 'Secure Authentication',
      description: 'Multi-factor protection'
    },
    {
      icon: 'CheckCircle',
      title: 'FINRA Compliant',
      description: 'Regulatory compliance'
    },
    {
      icon: 'Globe',
      title: 'Global Markets',
      description: '24/7 trading access'
    }
  ];

  const certifications = [
    'SOC 2 Type II Certified',
    'ISO 27001 Compliant',
    'PCI DSS Level 1',
    'GDPR Compliant'
  ];

  return (
    <div className="space-y-8">
      {/* Security Features */}
      <div className="grid grid-cols-2 gap-4">
        {securityFeatures.map((feature, index) => (
          <div key={index} className="flex items-center space-x-3 p-4 bg-card border border-border rounded-lg">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={feature.icon} size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Certifications */}
      <div className="bg-muted/50 rounded-lg p-6">
        <h3 className="text-sm font-medium text-foreground mb-4 text-center">
          Trusted by Professional Traders Worldwide
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {certifications.map((cert, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={14} className="text-success" />
              <span className="text-xs text-muted-foreground">{cert}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4">
          <div className="text-2xl font-bold text-primary">50K+</div>
          <div className="text-xs text-muted-foreground">Active Traders</div>
        </div>
        <div className="p-4">
          <div className="text-2xl font-bold text-primary">$2.5B+</div>
          <div className="text-xs text-muted-foreground">Volume Traded</div>
        </div>
        <div className="p-4">
          <div className="text-2xl font-bold text-primary">99.9%</div>
          <div className="text-xs text-muted-foreground">Uptime</div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;