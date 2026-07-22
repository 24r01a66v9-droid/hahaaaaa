
import React from 'react';

interface InfoPagesProps {
  type: 'safety' | 'privacy' | 'support';
}

const InfoPages: React.FC<InfoPagesProps> = ({ type }) => {
  const content = {
    safety: {
      title: 'Safety Protocols',
      icon: '🛡️',
      sections: [
        { h: 'Immediate Crisis', p: 'If you are in immediate danger, please stop using this app and call 988 or your local emergency number. Our AI is not a crisis response unit.' },
        { h: 'Encrypted Conversations', p: 'All chats with Mindset Buddy are encrypted and private. We do not sell your personal data to third parties.' },
        { h: 'Moderation', p: 'Our community stories and reviews are monitored to ensure a supportive environment free of harassment.' }
      ]
    },
    privacy: {
      title: 'Privacy Policy',
      icon: '🔒',
      sections: [
        { h: 'Anonymity First', p: 'We encourage the use of nicknames and avatars. Your real identity is only used for authentication purposes and is never shared.' },
        { h: 'Data Usage', p: 'We use conversation logs anonymously to improve our AI responses and understand student wellness trends.' },
        { h: 'Your Rights', p: 'You can request to delete your account and all associated chat history at any time through your profile settings.' }
      ]
    },
    support: {
      title: 'Support Center',
      icon: '🎟️',
      sections: [
        { h: 'Technical Issues', p: 'Having trouble with video playback or chat? Email us at support@healthymindset.edu for 24/7 technical assistance.' },
        { h: 'Platform Feedback', p: 'We are in a development phase. If you find a bug or have a feature request, please let us know via the reviews section.' },
        { h: 'Contacting Professionals', p: 'Our "Care" section provides direct links to verified professionals. We recommend verifying their credentials before booking.' }
      ]
    }
  }[type];

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-black/50 rounded-[3rem] p-12 border border-zinc-800 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-12 space-y-4">
          <div className="text-6xl mb-4">{content.icon}</div>
          <h2 className="text-4xl font-black text-purple-400 tracking-tight uppercase">{content.title}</h2>
          <div className="h-1 w-20 bg-purple-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="space-y-10">
          {content.sections.map((s, i) => (
            <div key={i} className="space-y-3">
              <h3 className="text-xl font-black text-purple-400">{s.h}</h3>
              <p className="text-slate-400 leading-relaxed text-lg font-medium">{s.p}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-800 text-center">
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Last Updated: October 2024</p>
        </div>
      </div>
    </div>
  );
};

export default InfoPages;
