import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">WHEN I DIE</span>
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-medium">
              <a href="#problem" className="hover:text-blue-600 transition">Problem</a>
              <a href="#solution" className="hover:text-blue-600 transition">Solution</a>
              <a href="#innovation" className="hover:text-blue-600 transition">Innovation</a>
              <a href="#financials" className="hover:text-blue-600 transition">Financials</a>
              <a href="#team" className="hover:text-blue-600 transition">Team</a>
            </div>
            <div className="flex space-x-4">
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-2">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
            Secure Your <span className="text-blue-600">Digital Legacy</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            A secure, automated vault for your most important digital assets and final wishes. Ensure your loved ones are taken care of, even when you're no longer here.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition shadow-lg">Start Planning Now</Link>
            <a href="#problem" className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-200 transition">Learn More</a>
          </div>
          <div className="mt-16 bg-blue-50 border border-blue-100 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-blue-700 font-medium">
              🚀 <span className="font-bold">Latest Milestone:</span> Application accepted for initial screening by higher officials for Idea Grant 2025-26.
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">The Digital Afterlife Problem</h2>
              <p className="text-lg text-gray-600 mb-6">
                Most people leave behind thousands of dollars in digital assets—cryptocurrencies, social accounts, family photos, and legal documents—with no way for their families to access them.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-red-100 text-red-600 p-1 rounded-full mr-3">✕</span>
                  <span>Billions in digital assets are lost annually due to inaccessible credentials.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-100 text-red-600 p-1 rounded-full mr-3">✕</span>
                  <span>Social media accounts remain active or are hacked post-mortem.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-100 text-red-600 p-1 rounded-full mr-3">✕</span>
                  <span>Legal documents are buried in encrypted hard drives or email accounts.</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <div className="h-64 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
                [Infographic: The Chaos of Unmanaged Digital Legacy]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">The WHEN I DIE Solution</h2>
            <p className="text-xl text-gray-600">A failsafe mechanism for your digital life.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg mb-6 text-xl">🛡️</div>
              <h3 className="text-xl font-bold mb-4">Secure Vault</h3>
              <p className="text-gray-600">Encrypted storage for passwords, keys, and documents that only your beneficiaries can access.</p>
            </div>
            <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-lg mb-6 text-xl">⏳</div>
              <h3 className="text-xl font-bold mb-4">Dead Man's Switch</h3>
              <p className="text-gray-600">Automated inactivity timers that trigger the release of information to designated contacts.</p>
            </div>
            <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 flex items-center justify-center rounded-lg mb-6 text-xl">📜</div>
              <h3 className="text-xl font-bold mb-4">Inheritance Rules</h3>
              <p className="text-gray-600">Custom rules to define exactly who gets what and when, with automated distribution.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation & Scalability */}
      <section id="innovation" className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-8">Product Innovation</h2>
              <div className="space-y-8">
                <div>
                  <h4 className="text-xl font-semibold mb-2">Zero-Knowledge Architecture</h4>
                  <p className="text-blue-100 text-lg">We don't know what's in your vault. Only you and your chosen beneficiaries hold the keys to the kingdom.</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Multi-Factor Verification</h4>
                  <p className="text-blue-100 text-lg">Sophisticated verification logic ensures information is only released upon verified absence, preventing accidental triggers.</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-8">Scalability & Market</h2>
              <div className="space-y-8">
                <div>
                  <h4 className="text-xl font-semibold mb-2">Global TAM</h4>
                  <p className="text-blue-100 text-lg">Over 5 billion people have a digital footprint. The digital legacy market is projected to reach $1.5B by 2030.</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">SaaS Model</h4>
                  <p className="text-blue-100 text-lg">Built on a scalable cloud infrastructure, supporting millions of users with a tiered subscription model for secure storage.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Section */}
      <section id="financials" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Proposed Utilization of Idea Grant</h2>
            <p className="text-xl text-gray-600">How we will use the ₹3 Lakhs to reach MVP.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-white border rounded-2xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">₹1.2L</div>
              <div className="font-semibold mb-2">Development</div>
              <p className="text-sm text-gray-500">Core platform development and infrastructure scaling.</p>
            </div>
            <div className="p-6 bg-white border rounded-2xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">₹0.8L</div>
              <div className="font-semibold mb-2">Security Audits</div>
              <p className="text-sm text-gray-500">Third-party security audits and penetration testing.</p>
            </div>
            <div className="p-6 bg-white border rounded-2xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">₹0.6L</div>
              <div className="font-semibold mb-2">Marketing</div>
              <p className="text-sm text-gray-500">Initial user acquisition and brand awareness campaigns.</p>
            </div>
            <div className="p-6 bg-white border rounded-2xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">₹0.4L</div>
              <div className="font-semibold mb-2">Legal</div>
              <p className="text-sm text-gray-500">Compliance with data protection laws (GDPR, DPDP).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet the Team</h2>
            <p className="text-xl text-gray-600">The founders behind the vision.</p>
          </div>
          <div className="flex justify-center">
            <div className="max-w-sm bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6"></div>
              <h3 className="text-2xl font-bold mb-2">The Lead Architect</h3>
              <p className="text-blue-600 font-medium mb-4">Founder & Lead Engineer</p>
              <p className="text-gray-600">Expert in Full-Stack Development and Secure Systems, leading the vision for decentralized legacy management.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grant Status Timeline */}
      <section id="status" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Project Journey & Status</h2>
            <p className="text-xl text-gray-600">Tracking our progress through the KSUM Idea Grant 2025-26.</p>
          </div>
          <div className="relative border-l-2 border-blue-100 ml-4 md:ml-0 md:left-1/2">
            {[
              { date: '2026-04-06', title: 'Application Screening', desc: 'The application has been sent to the higher officials for the evaluation.', status: 'current' },
              { date: '2026-03-06', title: 'Application Re-submitted', desc: 'Edit completed with final refinements.' },
              { date: '2026-01-20', title: 'Application Deferred', desc: 'Application deferred for 45 days for further evaluation.' },
              { date: '2025-11-15', title: 'Application Screening', desc: 'Application accepted for initial screening.' },
              { date: '2025-11-11', title: 'Application Re-submitted', desc: 'Pitch deck updated with founder details and financial breakdown.' },
              { date: '2025-11-11', title: 'Application Incomplete', desc: 'Feedback received: Pitch deck required financial utilization details.' },
              { date: '2025-10-20', title: 'Application Submitted', desc: 'Initial project proposal submitted for Idea Grant.' },
            ].map((item, index) => (
              <div key={index} className="mb-10 ml-6 md:ml-0">
                <div className={`absolute -left-2 md:-left-2 w-4 h-4 rounded-full border-2 bg-white ${item.status === 'current' ? 'border-blue-600 animate-pulse' : 'border-blue-200'}`}></div>
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right md:-left-[50%]' : 'md:pl-12 md:left-[50%]'} relative`}>
                  <time className="block mb-1 text-sm font-semibold leading-none text-blue-600">{item.date}</time>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-base font-normal text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 bg-blue-600 rounded-[3rem] py-16 text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-6">Ready to secure your legacy?</h2>
          <p className="text-xl text-blue-100 mb-10">Join our screening-stage platform and be the first to protect your digital future.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition">Create Free Account</Link>
            <Link to="/app" className="bg-blue-700 text-white border border-blue-500 px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-800 transition">Enter Dashboard</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 text-center text-gray-500">
        <p>© 2026 WHEN I DIE. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;