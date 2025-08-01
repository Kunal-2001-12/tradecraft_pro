import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Security', href: '#security' },
    { label: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    { icon: 'Twitter', href: '#twitter', label: 'Twitter' },
    { icon: 'Linkedin', href: '#linkedin', label: 'LinkedIn' },
    { icon: 'Github', href: '#github', label: 'GitHub' }
  ];

  return (
    <footer className="w-full bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Icon name="TrendingUp" size={14} color="white" />
              </div>
              <span className="font-semibold text-foreground">TradeCraft Pro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional trading strategy development platform for systematic traders and quantitative analysts.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-150"
                  aria-label={social.label}
                >
                  <Icon name={social.icon} size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Security Badges */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Security & Compliance</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded">
                <Icon name="Shield" size={16} className="text-success" />
                <span className="text-xs text-muted-foreground">SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded">
                <Icon name="Lock" size={16} className="text-success" />
                <span className="text-xs text-muted-foreground">FINRA Compliant</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-xs text-muted-foreground">SOC 2 Certified</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded">
                <Icon name="Globe" size={16} className="text-success" />
                <span className="text-xs text-muted-foreground">ISO 27001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} TradeCraft Pro. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Made with</span>
              <Icon name="Heart" size={14} className="text-error" />
              <span>for professional traders</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LoginFooter;