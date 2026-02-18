import React from 'react';
import { Container } from '@/components/shared/Container';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-white border-t border-slate-200 py-6 mt-auto">
            <Container>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
                    <p>© {new Date().getFullYear()} ArcInterview. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-[#F96331] transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-[#F96331] transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-[#F96331] transition-colors">Support</a>
                    </div>
                </div>
            </Container>
        </footer>
    );
};
