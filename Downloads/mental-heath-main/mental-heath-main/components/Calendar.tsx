
import React, { useState } from 'react';
import { TimelineEvent } from '../types';
import { IKSHANA_EVENTS } from '../services/eventData';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1)); 
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const eventsInMonth = IKSHANA_EVENTS.filter(e => 
    e.year === currentDate.getFullYear() && e.month === currentDate.getMonth()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="bg-slate-900 rounded-[4rem] p-8 md:p-14 shadow-2xl border border-emerald-500/10 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/50">Ikshana Archive</span>
                <h2 className="text-4xl font-black text-emerald-400">
                  {months[currentDate.getMonth()]} <span className="text-emerald-500">{currentDate.getFullYear()}</span>
                </h2>
              </div>
              <div className="flex gap-4">
                <button onClick={prevMonth} className="p-4 bg-slate-950 rounded-2xl hover:bg-emerald-600 hover:text-emerald-400 transition-all border border-slate-800">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button onClick={nextMonth} className="p-4 bg-slate-950 rounded-2xl hover:bg-emerald-600 hover:text-emerald-400 transition-all border border-slate-800">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-4 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center font-black text-[10px] uppercase tracking-widest text-slate-600">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="aspect-square" />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dailyEvents = eventsInMonth.filter(e => e.day === day);
                const hasEvent = dailyEvents.length > 0;
                
                return (
                  <div 
                    key={day} 
                    onClick={() => hasEvent && setSelectedEvent(dailyEvents[0])}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all border group ${
                      hasEvent 
                        ? 'bg-emerald-600 text-emerald-400 cursor-pointer hover:scale-105 shadow-xl shadow-emerald-950/20 border-transparent' 
                        : 'bg-slate-950 text-slate-700 border-slate-800'
                    }`}
                  >
                    <span className={`font-black text-xl ${hasEvent ? 'animate-pulse' : ''}`}>{day}</span>
                    <div className="absolute bottom-2 flex gap-1 justify-center w-full px-1">
                      {dailyEvents.map((_, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 rounded-full ${hasEvent ? 'bg-emerald-400/60' : 'bg-emerald-500'}`} />
                      ))}
                    </div>
                    {hasEvent && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-emerald-400 text-[8px] font-black uppercase tracking-widest px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-xl border border-emerald-500/20">
                        {dailyEvents.length > 1 ? `${dailyEvents.length} Events Scheduled` : dailyEvents[0].title}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 rounded-[3rem] p-10 border border-emerald-500/10 shadow-xl h-full flex flex-col">
              <h3 className="text-[10px] font-black text-slate-500 mb-10 tracking-[0.4em] uppercase">Monthly Highlights</h3>
              <div className="space-y-8 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                {eventsInMonth.length > 0 ? (
                  eventsInMonth.sort((a,b) => a.day - b.day).map(event => (
                    <div 
                      key={event.id} 
                      className="group cursor-pointer flex gap-5 items-start p-4 rounded-3xl hover:bg-slate-800 transition-all border border-transparent hover:border-emerald-500/10"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-800 bg-slate-950">
                        <img 
                          src={event.images?.[0]} 
                          alt={event.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                           <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase">{event.date}</span>
                           <span className="w-1 h-1 rounded-full bg-slate-800" />
                           <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{event.category}</span>
                        </div>
                        <h4 className="text-base font-black text-emerald-400 mb-1 group-hover:text-emerald-400 transition-colors leading-tight">{event.title}</h4>
                        <p className="text-[10px] font-medium text-slate-500 line-clamp-2 leading-relaxed italic">"{event.description}"</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 opacity-40">
                    <p className="font-black text-xs uppercase tracking-[0.3em] text-slate-600">No Historical Records</p>
                  </div>
                )}
              </div>
              
              <div className="mt-10 p-8 bg-emerald-500/5 rounded-[2.5rem] border border-emerald-500/10 relative overflow-hidden group">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-3">Ikshana Vision</p>
                <p className="text-xs font-bold text-slate-400 leading-relaxed italic">
                  "your little help + our passion to help = someone's hope"
                </p>
              </div>
           </div>
        </div>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-slate-900 max-w-4xl w-full rounded-[3rem] overflow-hidden shadow-2xl border border-emerald-500/20 relative">
              <button onClick={() => setSelectedEvent(null)} className="absolute top-6 right-6 z-10 bg-slate-800 text-emerald-400 p-2 rounded-xl hover:bg-emerald-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              <div className="flex flex-col lg:flex-row h-[70vh]">
                 <div className="lg:w-1/2 bg-slate-950 relative overflow-hidden">
                    <img src={selectedEvent.images[0]} className="w-full h-full object-cover" alt={selectedEvent.title} />
                 </div>
                 <div className="lg:w-1/2 p-12 overflow-y-auto space-y-6">
                    <span className="bg-emerald-600 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedEvent.category}</span>
                    <h3 className="text-3xl font-black text-emerald-400">{selectedEvent.title}</h3>
                    <p className="text-[10px] font-black text-emerald-400 tracking-[0.3em] uppercase">{selectedEvent.date}, {selectedEvent.year}</p>
                    <p className="text-slate-400 text-lg leading-relaxed font-medium">{selectedEvent.fullNarrative}</p>
                    <div className="grid grid-cols-2 gap-4 pt-6">
                       {selectedEvent.images.slice(1).map((img, i) => (
                         <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-slate-800">
                            <img src={img} className="w-full h-full object-cover" alt="Event detail" />
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
