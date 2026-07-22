
import React, { useState } from 'react';
import { ZenActivity } from '../types';

const yogaPoses: ZenActivity[] = [
  {
    id: 'y1',
    title: 'Balasana (Child\'s Pose)',
    type: 'Yoga',
    problemTarget: 'Anxiety & Overwhelm',
    description: 'A gentle resting pose that helps calm the nervous system and quiet the mind.',
    steps: ['Kneel on the floor with toes touching.', 'Sit on your heels, then fold forward.', 'Rest your forehead on the floor.', 'Extend arms or rest them beside your body.'],
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'y2',
    title: 'Viparita Leg Extension',
    type: 'Yoga',
    problemTarget: 'Burnout & Fatigue',
    description: 'An excellent restorative pose to reduce swelling and ease a tired mind.',
    steps: ['Sit close to a wall.', 'Lie back and swing legs up onto the wall.', 'Keep back flat on floor.', 'Hold for 5-10 minutes with deep breaths.'],
    imageUrl: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'y3',
    title: 'Vriksasana (Tree Pose)',
    type: 'Yoga',
    problemTarget: 'Low Focus & Stability',
    description: 'A balancing pose that requires steady concentration, perfect for pre-study grounding.',
    steps: ['Stand tall and find a focal point.', 'Place one foot on the inner thigh of the opposite leg.', 'Bring hands to heart center or reach for the sky.', 'Breathe steadily for 30-60 seconds.'],
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'y4',
    title: 'Savasana (Corpse Pose)',
    type: 'Yoga',
    problemTarget: 'Sleep Issues & Stress',
    description: 'The ultimate restorative pose. It allows the body to fully integrate the benefits of practice.',
    steps: ['Lie flat on your back.', 'Let your arms and legs fall out naturally.', 'Close your eyes and scan your body for tension.', 'Stay for 10 minutes, letting thoughts pass like clouds.'],
    imageUrl: 'https://images.unsplash.com/photo-1599447292180-45fd84092ef0?auto=format&fit=crop&q=80&w=1000'
  }
];

const extracurriculars: ZenActivity[] = [
  {
    id: 'e1',
    title: 'Nature Photography',
    type: 'Hobby',
    problemTarget: 'Low Focus & Stress',
    description: 'Capturing moments in nature. Slow, tactile, and extremely rewarding.',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'e2',
    title: 'Ultimate Frisbee',
    type: 'Extracurricular',
    problemTarget: 'Social Isolation',
    description: 'A low-pressure, high-energy way to meet peers outside the classroom.',
    imageUrl: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'e3',
    title: 'Campus Gardening',
    type: 'Extracurricular',
    problemTarget: 'Seasonal Blues',
    description: 'Connecting with soil and growing something green in gray campus corners.',
    imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'e4',
    title: 'Bullet Journaling',
    type: 'Hobby',
    problemTarget: 'Academic Overwhelm',
    description: 'A creative and organized way to track goals, tasks, and mental health status.',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'e5',
    title: 'Clay Sculpting',
    type: 'Hobby',
    problemTarget: 'Sensory Disconnection',
    description: 'Using your hands to mold clay. An incredibly grounding tactile experience.',
    imageUrl: 'https://images.unsplash.com/photo-1565191999001-551c187427bb?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'e6',
    title: 'Chess Club',
    type: 'Extracurricular',
    problemTarget: 'Logical Burnout',
    description: 'Channeling competition into a structured, silent, and respectful game.',
    imageUrl: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?auto=format&fit=crop&q=80&w=1000'
  }
];

const Activities: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Yoga' | 'Activities'>('Yoga');

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-4xl font-black text-purple-400 tracking-tight">The Zen Zone</h2>
        <p className="text-slate-400 text-lg">Curated movements and hobbies tailored to your current needs.</p>
        
        <div className="inline-flex p-1 bg-slate-900 rounded-2xl mt-6 border border-slate-800">
          <button 
            onClick={() => setActiveTab('Yoga')}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'Yoga' ? 'bg-purple-600 text-purple-400 shadow-lg' : 'text-slate-500 hover:text-slate-400'}`}
          >
            Yoga Poses
          </button>
          <button 
            onClick={() => setActiveTab('Activities')}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'Activities' ? 'bg-purple-600 text-purple-400 shadow-lg' : 'text-slate-500 hover:text-slate-400'}`}
          >
            Activities
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {(activeTab === 'Yoga' ? yogaPoses : extracurriculars).map((item) => (
          <div key={item.id} className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm border border-slate-800 group hover:border-purple-500/30 transition-all duration-500 flex flex-col h-full">
            <div className="h-64 overflow-hidden relative flex-shrink-0">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4">
                 <span className="bg-purple-600/90 backdrop-blur-sm text-purple-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                   {item.problemTarget}
                 </span>
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <h3 className="text-2xl font-black text-purple-400 mb-3">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed mb-6 font-medium">{item.description}</p>
              
              {item.steps && (
                <div className="mt-auto space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">How to practice</h4>
                  <ul className="space-y-3">
                    {item.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-400 font-medium">
                        <span className="text-purple-400 font-black">0{i + 1}</span> {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activities;
