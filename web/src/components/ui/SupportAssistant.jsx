import { useState } from 'react';
import { Link } from 'react-router-dom';

const quickReplies = [
  { label: 'Find jobs', answer: 'I can take you to the latest approved driver openings.', href: '/jobs' },
  { label: 'Complete my profile', answer: 'A complete profile helps employers understand your experience faster.', href: '/candidate/profile' },
  { label: 'Track applications', answer: 'You can see your application status and recent activity here.', href: '/candidate/applications' },
];

export default function SupportAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Hi! I’m DriverHub Assist 👋 How can I help with your driver journey?' }]);

  const ask = (item) => {
    setMessages((current) => [...current, { from: 'user', text: item.label }, { from: 'bot', text: item.answer, href: item.href }]);
  };

  return (
    <div className={`support-assistant ${open ? 'is-open' : ''}`}>
      {open && (
        <div className="assistant-panel">
          <div className="assistant-header">
            <div className="assistant-title">
              <span className="assistant-avatar">✦</span>
              <div><strong>DriverHub Assist</strong><small>Instant Driver & Job Help <i /></small></div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant">×</button>
          </div>

          <div className="assistant-messages">
            {messages.map((message, index) => (
              <div key={`${message.from}-${index}`} className={`assistant-message ${message.from}`}>
                <span>{message.text}</span>
                {message.href && <Link to={message.href} onClick={() => setOpen(false)}>Open →</Link>}
              </div>
            ))}
          </div>

          <div className="assistant-quick-actions">
            {quickReplies.map((item) => <button key={item.label} type="button" onClick={() => ask(item)}>{item.label}</button>)}
          </div>
          <div className="assistant-note">DriverHub Assist uses guided help for this demo experience.</div>
        </div>
      )}
      <button className="assistant-launcher" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span className="assistant-launcher-icon">✦</span>
        <span><strong>Support Assistant</strong><small>Instant Driver & Job Help</small></span>
        <i />
      </button>
    </div>
  );
}
