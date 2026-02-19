import React from 'react';
import { Card } from '@/components/shared/Card';

import { StatCard } from './components/StatCard';
import { ActivityItem } from './components/ActivityItem';

export const DashboardContainer: React.FC = () => {
    const stats = [
        {
            label: 'Total Applicants', value: '3,452', change: '+18%', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        {
            label: 'Active Papers', value: '42', change: '+3', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            label: 'Today\'s Results', value: '156', change: '+24%', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
    ];

    const activities = [
        { user: 'Manish Joshi', action: 'updated the', target: 'Mathematics Paper', time: '2 hours ago', avatar: 'MJ' },
        { user: 'Anjali Sharma', action: 'reviewed', target: 'Chemistry Results', time: '5 hours ago', avatar: 'AS' },
        { user: 'Rahul Kumar', action: 'added a new', target: 'Physics Exam', time: '1 day ago', avatar: 'RK' },
    ];

    return (
        <div className="space-y-10 py-2">
            <header>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Overview</h1>
                <p className="text-slate-500 mt-1">Manage applicants, papers and monitor candidate performance.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <StatCard
                        key={stat.label}
                        label={stat.label}
                        value={stat.value}
                        change={stat.change}
                        icon={stat.icon}
                    />
                ))}
            </div>

            {/* Secondary Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Recent Activity" className="lg:col-span-2">
                    <div className="space-y-2">
                        {activities.map((activity, i) => (
                            <ActivityItem
                                key={`${activity.user}-${activity.time}-${i}`}
                                user={activity.user}
                                action={activity.action}
                                target={activity.target}
                                time={activity.time}
                                avatar={activity.avatar}
                            />
                        ))}
                    </div>
                </Card>

                <Card title="Quick Support">
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">Need help with the new admin system? Our documentation is here to help.</p>
                        <button className="w-full py-2.5 bg-[#F96331] text-white font-bold rounded-xl text-sm shadow-lg hover:bg-orange-600 active:translate-y-[1px] transition-all">
                            Open Documentation
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};
